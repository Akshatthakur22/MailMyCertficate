import os
import json
import base64
import secrets
from datetime import timedelta
import google.auth.transport.requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# Load environment variables from .env.local
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    os.environ[key] = value

load_env()

from flask import Flask, request, jsonify, redirect, session, url_for
from flask_cors import CORS
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Initialize Flask app for Vercel
app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', secrets.token_hex(32))

# Configure CORS for Next.js frontend
allowed_origins = [
    'http://localhost:3000',
    'https://mailcertficate.vercel.app',
    'https://mailcertficate-fe4oojaus-akshatthakur22s-projects.vercel.app'
]
CORS(app, origins=allowed_origins, supports_credentials=True)

# Google OAuth Configuration
GOOGLE_CREDENTIALS_JSON = os.environ.get('GOOGLE_CREDENTIALS_JSON')
if not GOOGLE_CREDENTIALS_JSON:
    raise ValueError("GOOGLE_CREDENTIALS_JSON environment variable is required")

# Parse credentials from environment variable
CLIENT_SECRETS = json.loads(GOOGLE_CREDENTIALS_JSON)
CLIENT_ID = CLIENT_SECRETS['web']['client_id']
CLIENT_SECRET = CLIENT_SECRETS['web']['client_secret']
# Use the first redirect URI or fallback to production callback
redirect_uris = CLIENT_SECRETS['web'].get('redirect_uris', [])
if redirect_uris:
    REDIRECT_URI = redirect_uris[0]
else:
    # Fallback to production callback URL
    REDIRECT_URI = 'https://mailcertficate.vercel.app/api/auth/callback'

# Session configuration for serverless - using Flask session cookies
app.config['SESSION_COOKIE_SECURE'] = os.environ.get('VERCEL') == '1'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)
# Production-safe session settings
app.config['SESSION_COOKIE_DOMAIN'] = None  # Auto-detect
app.config['SESSION_COOKIE_PATH'] = '/'
# Flask session will be used instead of in-memory storage

# Helper functions for production-safe credential management
def get_frontend_url():
    """Get appropriate frontend URL based on request host"""
    return 'https://mailcertficate.vercel.app' if 'vercel.app' in request.host else 'http://localhost:3000'

def reconstruct_credentials(session_data):
    """Reconstruct Google OAuth credentials from minimal session data"""
    if not session_data:
        return None
    
    # Get token_uri from CLIENT_SECRETS with fallback
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
    """Store minimal essential credential data in Flask session"""
    session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'scopes': credentials.scopes
        # Removed: token_uri, client_id, client_secret (use global config)
    }
    session.permanent = True

def refresh_credentials_if_needed(credentials):
    """Refresh credentials if expired and update session"""
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
    """Sanitize error responses for production"""
    if include_details:
        return jsonify({"error": str(error_msg)}), 500
    
    # Generic error for production, specific for development
    if 'vercel.app' in request.host:
        return jsonify({"error": "Internal server error"}), 500
    else:
        return jsonify({"error": str(error_msg)}), 500

def validate_csrf_token():
    """Lightweight CSRF protection for POST routes"""
    # Check for custom header or session token
    csrf_token = request.headers.get('X-CSRF-Token') or request.form.get('csrf_token')
    session_token = session.get('csrf_token')
    
    # In development, be more lenient
    if 'vercel.app' not in request.host:
        return True
    
    return csrf_token == session_token

def get_flow():
    """Create OAuth flow with environment credentials - standard confidential flow"""
    flow = Flow.from_client_config(
        CLIENT_SECRETS,
        scopes=[
            'https://www.googleapis.com/auth/gmail.send',
            'openid',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        # Disable PKCE for standard confidential OAuth flow
        autogenerate_code_verifier=False
    )
    flow.redirect_uri = REDIRECT_URI
    return flow


@app.route('/')
def index():
    return jsonify({"status": "Gmail API Backend is running"})


# Alias routes for compatibility with frontend requests lacking /api prefix
@app.route('/auth/login')
def auth_login_alias():
    return auth_login()

@app.route('/auth/status')
def auth_status_alias():
    return auth_status()

# Alias for /auth/callback to support proxy from Next.js
@app.route('/auth/callback')
def auth_callback_alias():
    return auth_callback()

# Alias for /send-email
@app.route('/send-email', methods=['POST'])
def send_email_alias():
    return send_email()

# Alias for /auth/logout
@app.route('/auth/logout', methods=['POST'])
def auth_logout_alias():
    return auth_logout()

@app.route('/api/auth/login')
def auth_login():
    """Initiate standard OAuth login flow (no PKCE)"""
    try:
        # Validate credentials are properly loaded
        if not GOOGLE_CREDENTIALS_JSON:
            return sanitize_error_response("GOOGLE_CREDENTIALS_JSON environment variable not set", include_details=True)
        
        flow = get_flow()
        # Standard OAuth authorization URL without PKCE
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
            # No code_challenge or code_verifier for standard OAuth
        )
        
        # Store state and CSRF token directly in Flask session
        session['state'] = state
        session['csrf_token'] = secrets.token_urlsafe(16)
        session.permanent = True
        
        return jsonify({
            "authorization_url": authorization_url,
            "state": state,
            "csrf_token": session['csrf_token']
        })
    
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Login error: {error_details}")
        return sanitize_error_response(e, include_details=True)

@app.route('/api/auth/callback')
def auth_callback():
    """Handle standard OAuth callback (no PKCE)"""
    try:
        error = request.args.get('error')
        if error:
            frontend_url = get_frontend_url()
            return redirect(f'{frontend_url}?error={error}')
        
        state = request.args.get('state')
        code = request.args.get('code')
        
        if not state or not code:
            frontend_url = get_frontend_url()
            return redirect(f'{frontend_url}?error=missing_parameters')
        
        # Verify state from Flask session
        stored_state = session.get('state')
        if stored_state != state:
            frontend_url = get_frontend_url()
            return redirect(f'{frontend_url}?error=invalid_state')
        
        # Exchange code for tokens using standard OAuth flow (no PKCE)
        flow = get_flow()
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        
        # Store minimal credential data in Flask session
        store_credentials_in_session(credentials)
        
        # Get user email and store in session
        try:
            oauth2_service = build('oauth2', 'v2', credentials=credentials)
            user_info = oauth2_service.userinfo().get().execute()
            session['email'] = user_info.get('email')
        except Exception as e:
            print(f"Could not fetch email: {e}")
            session['email'] = None
        
        # Clear state from session
        session.pop('state', None)
            
        frontend_url = get_frontend_url()
        return redirect(f'{frontend_url}/email?auth_success=true')
    
    except Exception as e:
        print(f"OAuth callback error: {e}")
        frontend_url = get_frontend_url()
        return redirect(f'{frontend_url}?error=authentication_failed')

@app.route('/api/auth/status')
def auth_status():
    """Check authentication status"""
    try:
        credentials_data = session.get('credentials')
        
        if not credentials_data:
            return jsonify({
                "authenticated": False,
                "email": None
            })
        
        # Reconstruct credentials from minimal session data
        credentials = reconstruct_credentials(credentials_data)
        if not credentials:
            session.clear()
            return jsonify({
                "authenticated": False,
                "email": None
            })
        
        # Refresh credentials if needed
        if not refresh_credentials_if_needed(credentials):
            return jsonify({
                "authenticated": False,
                "email": None
            })
        
        return jsonify({
            "authenticated": True,
            "email": session.get('email')
        })
    
    except Exception as e:
        print(f"Auth status error: {e}")
        return sanitize_error_response(e)

@app.route('/api/send-email', methods=['POST'])
def send_email():
    """Send email using Gmail API"""
    try:
        # Lightweight CSRF protection for POST routes
        if not validate_csrf_token():
            return jsonify({"error": "Invalid CSRF token"}), 403
        
        credentials_data = session.get('credentials')
        
        if not credentials_data:
            return jsonify({"error": "Not authenticated"}), 401
        
        # Handle both JSON and FormData formats
        if request.content_type and 'multipart/form-data' in request.content_type:
            # FormData format (with attachments)
            recipient = request.form.get('recipient')
            subject = request.form.get('subject')
            body = request.form.get('body')
            attachment = request.files.get('attachment')
            
            if not all([recipient, subject, body]):
                return jsonify({"error": "Missing required fields: recipient, subject, body"}), 400
                
        else:
            # JSON format (simple email)
            try:
                data = request.get_json(force=True)
            except Exception as e:
                return jsonify({"error": "Invalid JSON data"}), 400
            
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            recipient = data.get('recipient')
            subject = data.get('subject')
            body = data.get('body')
            attachment = None
            
            if not all([recipient, subject, body]):
                return jsonify({"error": "Missing required fields: recipient, subject, body"}), 400
        
        # Reconstruct credentials from minimal session data
        credentials = reconstruct_credentials(credentials_data)
        if not credentials:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Refresh credentials if needed
        if not refresh_credentials_if_needed(credentials):
            return jsonify({"error": "Authentication expired"}), 401
        
        # Build Gmail service
        gmail_service = build('gmail', 'v1', credentials=credentials)
        
        # Create email message
        if attachment:
            # Email with attachment
            # Read attachment content
            attachment_content = attachment.read()
            attachment_filename = attachment.filename or 'certificate.pdf'
            
            # Create message with attachment
            msg = MIMEMultipart()
            msg['From'] = 'me'
            msg['To'] = recipient
            msg['Subject'] = subject
            
            # Add body
            msg.attach(MIMEText(body, 'plain'))
            
            # Add attachment
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment_content)
            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename= {attachment_filename}'
            )
            msg.attach(part)
            
            # Convert to raw message
            raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')
        else:
            # Simple email without attachment
            message = f"From: me\r\nTo: {recipient}\r\nSubject: {subject}\r\n\r\n{body}"
            raw_message = base64.urlsafe_b64encode(message.encode('utf-8')).decode('utf-8')
        
        # Send email
        result = gmail_service.users().messages().send(
            userId='me',
            body={'raw': raw_message}
        ).execute()
        
        return jsonify({
            "success": True,
            "message_id": result['id'],
            "recipient": recipient
        })
    
    except HttpError as e:
        print(f"Gmail API error: {e}")
        return jsonify({"error": "Failed to send email"}), 400
    except Exception as e:
        print(f"Send email error: {e}")
        return sanitize_error_response(e)

@app.route('/api/auth/logout', methods=['POST'])
def auth_logout():
    """Logout user"""
    try:
        # Lightweight CSRF protection for POST routes
        if not validate_csrf_token():
            return jsonify({"error": "Invalid CSRF token"}), 403
        
        session.clear()
        return jsonify({"success": True})
    except Exception as e:
        print(f"Logout error: {e}")
        return sanitize_error_response(e)

# Vercel serverless function handler
def handler(environ, start_response):
    """Vercel Python serverless function handler"""
    return app(environ, start_response)

# For local testing
if __name__ == '__main__':
    app.run(debug=True, port=8000)
