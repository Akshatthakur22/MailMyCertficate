import os
import json
import importlib.util
import base64
import secrets
import csv
import io
import re
import hmac
import hashlib
import urllib.request
import urllib.error
from datetime import timedelta
import google.auth.transport.requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# ─── Load .env.local ───────────────────────────────────────────────────────────
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ.setdefault(key.strip(), value.strip())

load_env()

from flask import Flask, request, jsonify, redirect, session
from flask_cors import CORS
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# ─── Site config ───────────────────────────────────────────────────────────────
def _load_site_config():
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site_config.py")
    spec = importlib.util.spec_from_file_location("site_config", path)
    if spec is None or spec.loader is None:
        raise ImportError(f"site_config.py not found at {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

_site_config = _load_site_config()
get_app_url = _site_config.get_app_url
get_allowed_origins = _site_config.get_allowed_origins
get_oauth_redirect_uri = _site_config.get_oauth_redirect_uri
is_production = _site_config.is_production

# ─── Analytics DB (graceful — never crashes the app) ───────────────────────────
try:
    from analytics_db import (
        init_db, record_event, record_unique_visitor, upsert_session,
        get_overview, get_daily_trend, get_recent_events,
        get_user_list, get_user_journey, get_health,
    )
    _analytics_ready = init_db()
except Exception as _ae:
    import logging
    logging.getLogger(__name__).error("Analytics module load failed: %s", _ae)
    _analytics_ready = False

    # Stub out all analytics calls so the app never crashes
    def record_event(*a, **kw): return False          # noqa: E302
    def record_unique_visitor(*a, **kw): return False  # noqa: E302
    def upsert_session(*a, **kw): return False         # noqa: E302
    def get_overview(*a, **kw): return {"db_available": False}  # noqa: E302
    def get_daily_trend(*a, **kw): return []           # noqa: E302
    def get_recent_events(*a, **kw): return []         # noqa: E302
    def get_user_list(*a, **kw): return []             # noqa: E302
    def get_user_journey(*a, **kw): return []          # noqa: E302
    def get_health(*a, **kw): return {"db_available": False}  # noqa: E302

# ─── Flask app ─────────────────────────────────────────────────────────────────
app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', secrets.token_hex(32))

CORS(app, origins=get_allowed_origins(), supports_credentials=True)

# ─── Google OAuth config ───────────────────────────────────────────────────────
GOOGLE_CREDENTIALS_JSON = os.environ.get('GOOGLE_CREDENTIALS_JSON')
if not GOOGLE_CREDENTIALS_JSON:
    raise ValueError("GOOGLE_CREDENTIALS_JSON environment variable is required")

CLIENT_SECRETS = json.loads(GOOGLE_CREDENTIALS_JSON)
CLIENT_ID = CLIENT_SECRETS['web']['client_id']
CLIENT_SECRET = CLIENT_SECRETS['web']['client_secret']

app.config['SESSION_COOKIE_SECURE'] = is_production()
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)
app.config['SESSION_COOKIE_DOMAIN'] = None
app.config['SESSION_COOKIE_PATH'] = '/'

# ─── Admin password verification ───────────────────────────────────────────────
# Set ADMIN_PASSWORD_HASH in your env vars.
# Generate with:  python3 -c "import hashlib,hmac; print(hmac.new(b'mmc_admin_v2', b'YOUR_PASSWORD', hashlib.sha256).hexdigest())"
# Default (insecure placeholder) — dashboard will warn if this is still set.
_ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH', '')
_ADMIN_HMAC_KEY = b'mmc_admin_v2'
_ADMIN_SESSION_DURATION = timedelta(hours=8)
_ADMIN_MAX_ATTEMPTS = 5
_ADMIN_LOCKOUT_SECONDS = 900  # 15 min

# In-memory rate limiter (resets on cold start — acceptable for admin-only use)
_admin_attempt_tracker: dict = {}  # ip -> {count, locked_until}

# ─────────────────────────────────────────────
# Shared helpers
# ─────────────────────────────────────────────

def get_frontend_url():
    return get_app_url()


def reconstruct_credentials(session_data):
    if not session_data:
        return None
    token_uri = CLIENT_SECRETS['web'].get('token_uri', 'https://oauth2.googleapis.com/token')
    return Credentials(
        token=session_data.get('token'),
        refresh_token=session_data.get('refresh_token'),
        token_uri=token_uri,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        scopes=session_data.get('scopes')
    )


def store_credentials_in_session(credentials):
    session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'scopes': credentials.scopes,
    }
    session.permanent = True


def refresh_credentials_if_needed(credentials):
    if credentials.expired and credentials.refresh_token:
        try:
            credentials.refresh(google.auth.transport.requests.Request())
            store_credentials_in_session(credentials)
            return True
        except Exception as e:
            print(f"Token refresh failed: {e}")
            session.clear()
            return False
    return True


def sanitize_error_response(error_msg, include_details=False):
    if is_production():
        return jsonify({"error": "Internal server error"}), 500
    return jsonify({"error": str(error_msg)}), 500


def validate_csrf_token():
    csrf_token = request.headers.get('X-CSRF-Token') or request.form.get('csrf_token')
    session_token = session.get('csrf_token')
    if not is_production():
        return True
    return bool(csrf_token and session_token and csrf_token == session_token)


def get_flow():
    flow = Flow.from_client_config(
        CLIENT_SECRETS,
        scopes=[
            'https://www.googleapis.com/auth/gmail.send',
            'openid',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        autogenerate_code_verifier=False
    )
    flow.redirect_uri = get_oauth_redirect_uri()
    return flow


def get_client_ip():
    """Best-effort client IP for rate limiting only — not stored."""
    return (
        request.headers.get('X-Forwarded-For', '').split(',')[0].strip()
        or request.headers.get('X-Real-IP', '')
        or request.remote_addr
        or 'unknown'
    )


EMAIL_ADDRESS_RE = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')


def normalize_recipient_email(value):
    if value is None:
        return ''
    return str(value).strip()


def is_valid_recipient_email(value):
    normalized = normalize_recipient_email(value)
    return bool(normalized) and EMAIL_ADDRESS_RE.match(normalized)


# ─────────────────────────────────────────────
# Admin auth helpers
# ─────────────────────────────────────────────

def _check_admin_rate_limit(ip: str) -> tuple:
    """Returns (is_limited: bool, remaining_ms: int)."""
    import time
    now = time.time()
    entry = _admin_attempt_tracker.get(ip, {})
    locked_until = entry.get('locked_until', 0)
    if locked_until and now < locked_until:
        return True, int((locked_until - now) * 1000)
    if locked_until and now >= locked_until:
        _admin_attempt_tracker.pop(ip, None)
    return False, 0


def _record_admin_failure(ip: str):
    import time
    entry = _admin_attempt_tracker.setdefault(ip, {'count': 0})
    entry['count'] = entry.get('count', 0) + 1
    if entry['count'] >= _ADMIN_MAX_ATTEMPTS:
        entry['locked_until'] = time.time() + _ADMIN_LOCKOUT_SECONDS


def _clear_admin_rate_limit(ip: str):
    _admin_attempt_tracker.pop(ip, None)


def _verify_admin_password(password: str) -> bool:
    """
    Constant-time HMAC comparison against ADMIN_PASSWORD_HASH env var.
    Falls back to a compiled-in dev hash if env var is not set
    (only works in local dev — production MUST set ADMIN_PASSWORD_HASH).
    """
    if not _ADMIN_PASSWORD_HASH:
        # No env var set — deny in production, allow dev default in local
        if is_production():
            return False
        # Local dev fallback — same password as before: "akshat2024mmc!"
        dev_hash = hmac.new(_ADMIN_HMAC_KEY, b'akshat2024mmc!', hashlib.sha256).hexdigest()
        candidate = hmac.new(_ADMIN_HMAC_KEY, password.encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(candidate, dev_hash)

    candidate = hmac.new(_ADMIN_HMAC_KEY, password.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(candidate, _ADMIN_PASSWORD_HASH)


def require_admin(f):
    """Decorator — returns 401 if admin session is not active."""
    from functools import wraps

    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('admin_authenticated'):
            return jsonify({"error": "Not authenticated", "code": "ADMIN_AUTH_REQUIRED"}), 401
        return f(*args, **kwargs)
    return decorated

# ═══════════════════════════════════════════════════════════════════════════════
# ADMIN AUTHENTICATION ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

@app.route('/api/admin/auth/login', methods=['POST'])
def admin_login():
    """Server-side admin login. Returns session cookie on success."""
    import time
    ip = get_client_ip()
    limited, remaining_ms = _check_admin_rate_limit(ip)
    if limited:
        return jsonify({
            "error": "Too many failed attempts",
            "remaining_ms": remaining_ms,
            "locked": True,
        }), 429

    try:
        data = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"error": "Invalid request body"}), 400

    password = data.get('password', '')
    if not password:
        return jsonify({"error": "Password required"}), 400

    # Intentional 300ms delay against brute-force
    time.sleep(0.3)

    if not _verify_admin_password(password):
        _record_admin_failure(ip)
        entry = _admin_attempt_tracker.get(ip, {})
        remaining = max(0, _ADMIN_MAX_ATTEMPTS - entry.get('count', 0))
        return jsonify({
            "error": f"Incorrect password. {remaining} attempt(s) remaining.",
            "remaining_attempts": remaining,
        }), 401

    _clear_admin_rate_limit(ip)
    session['admin_authenticated'] = True
    session['admin_authenticated_at'] = int(time.time())
    session.permanent = True
    app.permanent_session_lifetime = _ADMIN_SESSION_DURATION

    return jsonify({"success": True, "message": "Authenticated"})


@app.route('/api/admin/auth/status', methods=['GET'])
def admin_auth_status():
    """Check if the current session has admin access."""
    import time
    authed = session.get('admin_authenticated', False)
    authed_at = session.get('admin_authenticated_at', 0)

    # Enforce 8-hour server-side session expiry
    if authed and authed_at:
        age_hours = (time.time() - authed_at) / 3600
        if age_hours > 8:
            session.pop('admin_authenticated', None)
            session.pop('admin_authenticated_at', None)
            authed = False

    return jsonify({
        "authenticated": authed,
        "has_password_configured": bool(_ADMIN_PASSWORD_HASH),
    })


@app.route('/api/admin/auth/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_authenticated', None)
    session.pop('admin_authenticated_at', None)
    return jsonify({"success": True})


# ═══════════════════════════════════════════════════════════════════════════════
# ADMIN ANALYTICS API ROUTES  (all require admin session)
# ═══════════════════════════════════════════════════════════════════════════════

@app.route('/api/admin/overview', methods=['GET'])
@require_admin
def admin_overview():
    """
    Returns aggregated product KPIs.
    Query param: range = today | 7d | 30d | all (default: all)
    """
    range_type = request.args.get('range', 'all')
    if range_type not in ('today', '7d', '30d', 'all'):
        range_type = 'all'

    today_stats = get_overview('today')
    range_stats = get_overview(range_type)

    return jsonify({
        "range": range_type,
        "today": today_stats,
        "period": range_stats,
        "db_available": range_stats.get('db_available', False),
    })


@app.route('/api/admin/trends', methods=['GET'])
@require_admin
def admin_trends():
    """Daily trend data for charts. Query param: days = 7 | 30 | 90"""
    try:
        days = int(request.args.get('days', 30))
    except (ValueError, TypeError):
        days = 30
    days = min(max(days, 7), 90)
    return jsonify({"days": days, "data": get_daily_trend(days)})


@app.route('/api/admin/events', methods=['GET'])
@require_admin
def admin_events():
    """Recent events feed. Query param: limit (max 200)"""
    try:
        limit = int(request.args.get('limit', 50))
    except (ValueError, TypeError):
        limit = 50
    limit = min(max(limit, 1), 200)
    events = get_recent_events(limit)
    return jsonify({"events": events, "count": len(events)})


@app.route('/api/admin/users', methods=['GET'])
@require_admin
def admin_users():
    """User activity list (authenticated users only). Supports pagination."""
    try:
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
    except (ValueError, TypeError):
        limit, offset = 50, 0
    limit = min(max(limit, 1), 200)
    users = get_user_list(limit, offset)
    return jsonify({"users": users, "count": len(users), "offset": offset})


@app.route('/api/admin/users/<user_id>/journey', methods=['GET'])
@require_admin
def admin_user_journey(user_id: str):
    """Timeline of events for a specific user."""
    journey = get_user_journey(user_id)
    return jsonify({"user_id": user_id, "events": journey})


@app.route('/api/admin/health', methods=['GET'])
@require_admin
def admin_health():
    """Analytics system health check."""
    health = get_health()
    health['analytics_module_ready'] = _analytics_ready
    health['password_configured'] = bool(_ADMIN_PASSWORD_HASH)
    return jsonify(health)


# ═══════════════════════════════════════════════════════════════════════════════
# FRONTEND → BACKEND ANALYTICS INGESTION  (public, CORS-gated)
# ═══════════════════════════════════════════════════════════════════════════════

# Allowlist of events the frontend is permitted to record server-side.
# Backend-verified events (OAuth, email) are recorded inside their own routes.
_FRONTEND_ALLOWED_EVENTS = {
    "page_viewed", "tool_opened", "template_selected",
    "csv_uploaded", "csv_import_failed", "field_editor_opened", "certificate_generation_started",
    "certificate_generated", "certificate_generation_failed", "certificate_downloaded",
    "email_batch_started", "email_send_completed",
    "returning_user",
}

@app.route('/api/analytics/event', methods=['POST'])
def ingest_frontend_event():
    """
    Receives client-side analytics events and records them server-side.
    This is the bridge between the browser and the central analytics store.
    Only allowlisted events are accepted.
    """
    try:
        data = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"ok": False}), 200  # always 200 — never break the frontend

    event_name = data.get('event_name', '')
    if event_name not in _FRONTEND_ALLOWED_EVENTS:
        return jsonify({"ok": False, "reason": "event_not_allowed"}), 200

    visitor_id = data.get('visitor_id') or None
    analytics_session_id = data.get('session_id') or None
    meta = data.get('meta') or {}

    # Special handling for page views (tracks unique visitors)
    if event_name == 'page_viewed' and visitor_id:
        record_unique_visitor(visitor_id)
    else:
        record_event(
            event_name=event_name,
            visitor_id=visitor_id,
            session_id=analytics_session_id,
            source='frontend',
            meta=meta,
        )

    # Update analytics session row
    session_updates = {}
    if event_name == 'tool_opened':
        session_updates['tool_opened'] = 1
    elif event_name == 'template_selected':
        session_updates['template_used'] = 1
    elif event_name == 'csv_uploaded':
        session_updates['csv_imported'] = 1
    elif event_name == 'certificate_generated':
        session_updates['certs_generated'] = meta.get('certificates_count', 1)

    if analytics_session_id and (visitor_id or session_updates):
        upsert_session(
            session_id=analytics_session_id,
            visitor_id=visitor_id,
            updates=session_updates,
        )

    return jsonify({"ok": True})

# ═══════════════════════════════════════════════════════════════════════════════
# STATUS + DEBUG
# ═══════════════════════════════════════════════════════════════════════════════

@app.route('/')
def index():
    return jsonify({"status": "Gmail API Backend is running"})


@app.route('/api/debug/env')
def debug_env():
    if os.environ.get('FLASK_DEBUG') != '1':
        return jsonify({"error": "Not available in production"}), 403
    return jsonify({
        "NODE_ENV": os.environ.get('NODE_ENV'),
        "FLASK_DEBUG": os.environ.get('FLASK_DEBUG'),
        "APP_URL": os.environ.get('APP_URL'),
        "get_app_url()": get_app_url(),
        "get_oauth_redirect_uri()": get_oauth_redirect_uri(),
        "is_production()": is_production(),
        "analytics_db_available": _analytics_ready,
        "has_database_url": bool(os.environ.get('DATABASE_URL')),
        "admin_password_configured": bool(_ADMIN_PASSWORD_HASH),
    })


@app.route('/api/debug/session')
def debug_session():
    if os.environ.get('FLASK_DEBUG') != '1':
        return jsonify({"error": "Not available in production"}), 403
    return jsonify({
        "has_state": 'state' in session,
        "has_credentials": 'credentials' in session,
        "email": session.get('email', 'NOT SET'),
        "admin_authenticated": session.get('admin_authenticated', False),
    })


# ═══════════════════════════════════════════════════════════════════════════════
# GOOGLE OAUTH ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

@app.route('/api/auth/login')
@app.route('/auth/login')
def auth_login():
    """Initiate Google OAuth flow and record oauth_started event."""
    try:
        if not GOOGLE_CREDENTIALS_JSON:
            return sanitize_error_response("GOOGLE_CREDENTIALS_JSON not set", include_details=True)

        flow = get_flow()
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )

        session['state'] = state
        session['csrf_token'] = secrets.token_urlsafe(16)
        session['oauth_visitor_id'] = request.args.get('visitor_id') or None
        session['oauth_analytics_session_id'] = request.args.get('analytics_session_id') or None
        session.permanent = True

        # Record the oauth attempt server-side
        record_event(
            event_name='google_oauth_started',
            visitor_id=session.get('oauth_visitor_id'),
            session_id=session.get('oauth_analytics_session_id'),
            source='backend',
        )

        return jsonify({
            "authorization_url": authorization_url,
            "state": state,
            "csrf_token": session['csrf_token']
        })

    except Exception as e:
        import traceback
        print(f"Login error: {traceback.format_exc()}")
        return sanitize_error_response(e, include_details=True)


@app.route('/api/auth/callback')
@app.route('/auth/callback')
def auth_callback():
    """Handle OAuth callback and record oauth_success/failed server-side."""
    try:
        error = request.args.get('error')
        if error:
            record_event(
                event_name='google_oauth_failed',
                visitor_id=session.get('oauth_visitor_id'),
                session_id=session.get('oauth_analytics_session_id'),
                source='backend',
                success=False,
                error_code=error,
            )
            return redirect(f'{get_frontend_url()}?error={error}')

        state = request.args.get('state')
        code = request.args.get('code')
        stored_state = session.get('state')

        if not state or not code or stored_state != state:
            record_event(
                event_name='google_oauth_failed',
                source='backend',
                success=False,
                error_code='state_mismatch',
            )
            return redirect(f'{get_frontend_url()}?error=invalid_state')

        flow = get_flow()
        flow.fetch_token(code=code)
        credentials = flow.credentials
        store_credentials_in_session(credentials)

        # Fetch user info
        user_email = None
        try:
            oauth2_service = build('oauth2', 'v2', credentials=credentials)
            user_info = oauth2_service.userinfo().get().execute()
            user_email = user_info.get('email')
            session['email'] = user_email
        except Exception as e:
            print(f"Could not fetch email: {e}")

        visitor_id = session.pop('oauth_visitor_id', None)
        analytics_session_id = session.pop('oauth_analytics_session_id', None)

        # Record oauth success — hash email before storing
        user_id = hashlib.sha256(user_email.encode()).hexdigest()[:16] if user_email else None
        record_event(
            event_name='google_oauth_success',
            visitor_id=visitor_id,
            user_id=user_id,
            session_id=analytics_session_id,
            source='backend',
        )

        if analytics_session_id:
            upsert_session(
                session_id=analytics_session_id,
                visitor_id=visitor_id,
                user_id=user_id,
                user_email=user_email,
                updates={'is_google_authed': True},
            )

        session.pop('state', None)
        session['csrf_token'] = secrets.token_urlsafe(16)
        session.permanent = True

        return redirect(
            f'{get_frontend_url()}/email?auth_success=true&csrf_token={session["csrf_token"]}'
        )

    except Exception as e:
        print(f"OAuth callback error: {e}")
        import traceback
        print(traceback.format_exc())
        record_event(event_name='google_oauth_failed', source='backend',
                     success=False, error_code='exception')
        return redirect(f'{get_frontend_url()}?error=authentication_failed')


@app.route('/api/auth/status')
@app.route('/auth/status')
def auth_status():
    try:
        credentials_data = session.get('credentials')
        if not credentials_data:
            return jsonify({"authenticated": False, "email": None})

        credentials = reconstruct_credentials(credentials_data)
        if not credentials:
            session.clear()
            return jsonify({"authenticated": False, "email": None})

        if not refresh_credentials_if_needed(credentials):
            return jsonify({"authenticated": False, "email": None})

        payload = {"authenticated": True, "email": session.get('email')}
        if session.get('csrf_token'):
            payload["csrf_token"] = session['csrf_token']
        return jsonify(payload)

    except Exception as e:
        print(f"Auth status error: {e}")
        return sanitize_error_response(e)


@app.route('/api/auth/logout', methods=['POST'])
@app.route('/auth/logout', methods=['POST'])
def auth_logout():
    try:
        if not validate_csrf_token():
            return jsonify({"error": "Invalid CSRF token"}), 403
        session.clear()
        return jsonify({"success": True})
    except Exception as e:
        return sanitize_error_response(e)

# ═══════════════════════════════════════════════════════════════════════════════
# EMAIL SENDING — server records email_send_started / completed / failed
# ═══════════════════════════════════════════════════════════════════════════════

@app.route('/api/send-email', methods=['POST'])
@app.route('/send-email', methods=['POST'])
def send_email():
    """Send one email via Gmail API. Records attempt + outcome server-side."""
    # Pull analytics context from request headers (set by frontend analyticsService)
    analytics_visitor_id = request.headers.get('X-Analytics-Visitor-Id') or None
    analytics_session_id = request.headers.get('X-Analytics-Session-Id') or None

    if not validate_csrf_token():
        return jsonify({"error": "Invalid CSRF token"}), 403

    credentials_data = session.get('credentials')
    if not credentials_data:
        return jsonify({"error": "Not authenticated"}), 401

    # Parse request body
    if request.content_type and 'multipart/form-data' in request.content_type:
        recipient = request.form.get('recipient')
        subject = request.form.get('subject')
        body = request.form.get('body')
        attachment = request.files.get('attachment')
        if not all([recipient, subject, body]):
            return jsonify({"error": "Missing required fields: recipient, subject, body"}), 400
    else:
        try:
            data = request.get_json(force=True)
        except Exception:
            return jsonify({"error": "Invalid JSON data"}), 400
        if not data:
            return jsonify({"error": "No data provided"}), 400
        recipient = data.get('recipient')
        subject = data.get('subject')
        body = data.get('body')
        attachment = None
        if not all([recipient, subject, body]):
            return jsonify({"error": "Missing required fields: recipient, subject, body"}), 400

    recipient = normalize_recipient_email(recipient)
    if not is_valid_recipient_email(recipient):
        return jsonify({"error": "Invalid recipient email address."}), 400

    credentials = reconstruct_credentials(credentials_data)
    if not credentials:
        return jsonify({"error": "Invalid credentials"}), 401

    if not refresh_credentials_if_needed(credentials):
        return jsonify({"error": "Authentication expired"}), 401

    # Determine the sender's hashed user_id
    user_email = session.get('email')
    user_id = hashlib.sha256(user_email.encode()).hexdigest()[:16] if user_email else None

    # Record the attempt
    record_event(
        event_name='email_send_started',
        visitor_id=analytics_visitor_id,
        user_id=user_id,
        session_id=analytics_session_id,
        source='backend',
    )
    if analytics_session_id:
        upsert_session(
            session_id=analytics_session_id,
            visitor_id=analytics_visitor_id,
            user_id=user_id,
            updates={'emails_attempted': 1},
        )

    try:
        gmail_service = build('gmail', 'v1', credentials=credentials)

        if attachment:
            attachment_content = attachment.read()
            attachment_filename = attachment.filename or 'certificate.pdf'
            msg = MIMEMultipart()
            msg['From'] = 'me'
            msg['To'] = recipient
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment_content)
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename= {attachment_filename}')
            msg.attach(part)
            raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')
        else:
            message = f"From: me\r\nTo: {recipient}\r\nSubject: {subject}\r\n\r\n{body}"
            raw_message = base64.urlsafe_b64encode(message.encode('utf-8')).decode('utf-8')

        result = gmail_service.users().messages().send(
            userId='me',
            body={'raw': raw_message}
        ).execute()

        # ✅ Server-confirmed success
        record_event(
            event_name='email_send_completed',
            visitor_id=analytics_visitor_id,
            user_id=user_id,
            session_id=analytics_session_id,
            source='backend',
            success=True,
        )
        if analytics_session_id:
            upsert_session(
                session_id=analytics_session_id,
                updates={'emails_succeeded': 1},
            )

        return jsonify({
            "success": True,
            "message_id": result['id'],
            "recipient": recipient,
        })

    except HttpError as e:
        error_code = 'gmail_api_error'
        if getattr(e, 'resp', None):
            status = e.resp.status
            if status == 400:
                error_code = 'invalid_recipient'
            elif status == 401:
                error_code = 'authentication_error'
            elif status == 429:
                error_code = 'rate_limit'

        record_event(
            event_name='email_send_failed',
            visitor_id=analytics_visitor_id,
            user_id=user_id,
            session_id=analytics_session_id,
            source='backend',
            success=False,
            error_code=error_code,
        )
        if analytics_session_id:
            upsert_session(session_id=analytics_session_id, updates={'emails_failed': 1})

        error_message = "Failed to send email"
        if error_code == 'invalid_recipient':
            error_message = ("Gmail rejected this message. The recipient address may be invalid "
                             "or the message could not be delivered.")
        return jsonify({"error": error_message}), 400

    except Exception as e:
        record_event(
            event_name='email_send_failed',
            visitor_id=analytics_visitor_id,
            user_id=user_id,
            session_id=analytics_session_id,
            source='backend',
            success=False,
            error_code='unknown_error',
        )
        if analytics_session_id:
            upsert_session(session_id=analytics_session_id, updates={'emails_failed': 1})

        print(f"Send email error: {e}")
        return sanitize_error_response(e)

# ═══════════════════════════════════════════════════════════════════════════════
# GOOGLE SHEETS IMPORT
# ═══════════════════════════════════════════════════════════════════════════════

def _extract_sheet_id(url):
    match = re.search(r'/spreadsheets/d/([a-zA-Z0-9-_]+)', url)
    return match.group(1) if match else None


def _extract_gid(url):
    match = re.search(r'[#&?]gid=(\d+)', url)
    return match.group(1) if match else None


@app.route('/api/sheets/import', methods=['POST'])
@app.route('/sheets/import', methods=['POST'])
def sheets_import():
    try:
        data = request.get_json(force=True)
        if not data or 'url' not in data:
            return jsonify({"error": "Sheet URL is required"}), 400

        sheet_url = data['url'].strip()
        sheet_id = _extract_sheet_id(sheet_url)
        if not sheet_id:
            return jsonify({"error": "Invalid Google Sheets URL."}), 400

        gid = _extract_gid(sheet_url)
        export_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv"
        if gid is not None:
            export_url += f"&gid={gid}"

        try:
            req = urllib.request.Request(export_url, headers={'User-Agent': 'MailMyCertificate/1.0'})
            with urllib.request.urlopen(req, timeout=30) as response:
                csv_content = response.read().decode('utf-8')
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return jsonify({"error": "Sheet not found. Ensure the URL is correct and publicly shareable."}), 404
            elif e.code == 403:
                return jsonify({"error": "Sheet access denied. Verify sharing settings are set to 'Anyone with link'."}), 403
            else:
                return jsonify({"error": "Failed to fetch sheet" if is_production() else f"HTTP {e.code} error"}), 502
        except urllib.error.URLError:
            return jsonify({"error": "Connection error. Check your internet and try again."}), 502
        except Exception as e:
            return jsonify({"error": "Failed to fetch sheet data" if is_production() else str(e)}), 502

        stripped = csv_content.strip()
        if stripped.startswith('<!DOCTYPE') or stripped.startswith('<html') or stripped.startswith('<HTML'):
            return jsonify({"error": "Sheet is not publicly accessible."}), 403

        if csv_content.startswith('\ufeff'):
            csv_content = csv_content[1:]

        reader = csv.DictReader(io.StringIO(csv_content))
        headers = reader.fieldnames or []
        if not headers:
            return jsonify({"error": "Sheet appears to be empty or has no headers."}), 400

        rows = [dict(row) for row in reader if any(v.strip() for v in row.values() if v)]
        if len(rows) == 0:
            return jsonify({"error": "Sheet has headers but no data rows."}), 400

        sanitized_headers = []
        header_map = {}
        for h in headers:
            clean_h = re.sub(r'[^\w\s-]', '', h).strip()
            clean_h = re.sub(r'\s+', ' ', clean_h)
            sanitized_headers.append(clean_h)
            header_map[h] = clean_h

        sanitized_rows = [{header_map[k]: v for k, v in row.items()} for row in rows]

        if len(sanitized_rows) > 400:
            return jsonify({"error": f"Too many rows ({len(sanitized_rows)}). Maximum 400 rows allowed."}), 400

        return jsonify({
            "headers": sanitized_headers,
            "data": sanitized_rows,
            "totalRows": len(sanitized_rows),
            "sheetId": sheet_id,
        })

    except Exception as e:
        print(f"[Sheets Import ERROR] {str(e)}")
        return sanitize_error_response(e, include_details=not is_production())


# ═══════════════════════════════════════════════════════════════════════════════
# VERCEL HANDLER
# ═══════════════════════════════════════════════════════════════════════════════

def handler(environ, start_response):
    return app(environ, start_response)


if __name__ == '__main__':
    app.run(debug=True, port=8000)
