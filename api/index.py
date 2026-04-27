import os
import json
import base64
import secrets
import email
from datetime import datetime, timedelta
from urllib.parse import urlencode
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

# Session configuration for serverless
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)

# In-memory session storage for serverless (consider Redis for production)
session_store = {}

def get_session_id():
    """Get or create session ID for serverless environment"""
    session_id = session.get('session_id')
    if not session_id:
        session_id = secrets.token_urlsafe(32)
        session['session_id'] = session_id
    return session_id

def get_flow():
    """Create OAuth flow with environment credentials"""
    flow = Flow.from_client_config(
        CLIENT_SECRETS,
        scopes=[
            'https://www.googleapis.com/auth/gmail.send',
            'openid',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
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
    """Initiate OAuth login flow"""
    try:
        # Debug: Check if credentials are properly loaded
        if not GOOGLE_CREDENTIALS_JSON:
            return jsonify({"error": "GOOGLE_CREDENTIALS_JSON environment variable not set"}), 500
        
        flow = get_flow()
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        
        # Store state in session
        session_id = get_session_id()
        session_store[session_id] = {
            'state': state,
            'created_at': datetime.utcnow()
        }
        
        return jsonify({
            "authorization_url": authorization_url,
            "state": state
        })
    
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Login error: {error_details}")
        return jsonify({"error": str(e), "details": error_details}), 500

@app.route('/api/auth/callback')
def auth_callback():
    """Handle OAuth callback"""
    try:
        error = request.args.get('error')
        if error:
            # Determine the frontend URL based on the request origin
            frontend_url = 'https://mailcertficate.vercel.app' if 'vercel.app' in request.host else 'http://localhost:3000'
            return redirect(f'{frontend_url}?error={error}')
        
        state = request.args.get('state')
        code = request.args.get('code')
        
        if not state or not code:
            frontend_url = 'https://mailcertficate.vercel.app' if 'vercel.app' in request.host else 'http://localhost:3000'
            return redirect(f'{frontend_url}?error=missing_parameters')
        
        # Verify state
        session_id = get_session_id()
        stored_session = session_store.get(session_id)
        
        if not stored_session or stored_session.get('state') != state:
            frontend_url = 'https://mailcertficate.vercel.app' if 'vercel.app' in request.host else 'http://localhost:3000'
            return redirect(f'{frontend_url}?error=invalid_state')
        
        # Exchange code for tokens
        flow = get_flow()
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        session_store[session_id].update({
            'credentials': {
                'token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_uri': credentials.token_uri,
                'client_id': credentials.client_id,
                'client_secret': credentials.client_secret,
                'scopes': credentials.scopes
            },
            'email': None  # Will be set after fetching user info
        })
        
        # Get user email
        try:
            oauth2_service = build('oauth2', 'v2', credentials=credentials)
            user_info = oauth2_service.userinfo().get().execute()
            session_store[session_id]['email'] = user_info.get('email')
        except Exception as e:
            print(f"Could not fetch email: {e}")
            
        frontend_url = 'https://mailcertficate.vercel.app' if 'vercel.app' in request.host else 'http://localhost:3000'
        return redirect(f'{frontend_url}/email?auth_success=true')
    
    except Exception as e:
        frontend_url = 'https://mailcertficate.vercel.app' if 'vercel.app' in request.host else 'http://localhost:3000'
        return redirect(f'{frontend_url}?error={str(e)}')

@app.route('/api/auth/status')
def auth_status():
    """Check authentication status"""
    try:
        session_id = get_session_id()
        stored_session = session_store.get(session_id)
        
        if not stored_session or not stored_session.get('credentials'):
            return jsonify({
                "authenticated": False,
                "email": None
            })
        
        # Check if credentials are expired
        credentials_data = stored_session['credentials']
        credentials = Credentials(
            token=credentials_data.get('token'),
            refresh_token=credentials_data.get('refresh_token'),
            token_uri=credentials_data.get('token_uri'),
            client_id=credentials_data.get('client_id'),
            client_secret=credentials_data.get('client_secret'),
            scopes=credentials_data.get('scopes')
        )
        
        if credentials.expired and credentials.refresh_token:
            try:
                credentials.refresh(google.auth.transport.requests.Request())
                # Update stored credentials
                session_store[session_id]['credentials'] = {
                    'token': credentials.token,
                    'refresh_token': credentials.refresh_token,
                    'token_uri': credentials.token_uri,
                    'client_id': credentials.client_id,
                    'client_secret': credentials.client_secret,
                    'scopes': credentials.scopes
                }
            except Exception:
                # Refresh failed, clear session
                del session_store[session_id]
                return jsonify({
                    "authenticated": False,
                    "email": None
                })
        
        return jsonify({
            "authenticated": True,
            "email": stored_session.get('email')
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/send-email', methods=['POST'])
def send_email():
    """Send email using Gmail API"""
    try:
        session_id = get_session_id()
        stored_session = session_store.get(session_id)
        
        if not stored_session or not stored_session.get('credentials'):
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
                return jsonify({"error": f"Invalid JSON data: {str(e)}"}), 400
            
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            recipient = data.get('recipient')
            subject = data.get('subject')
            body = data.get('body')
            attachment = None
            
            if not all([recipient, subject, body]):
                return jsonify({"error": "Missing required fields: recipient, subject, body"}), 400
        
        # Create credentials object
        credentials_data = stored_session['credentials']
        credentials = Credentials(
            token=credentials_data.get('token'),
            refresh_token=credentials_data.get('refresh_token'),
            token_uri=credentials_data.get('token_uri'),
            client_id=credentials_data.get('client_id'),
            client_secret=credentials_data.get('client_secret'),
            scopes=credentials_data.get('scopes')
        )
        
        # Refresh if needed
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(google.auth.transport.requests.Request())
            # Update stored credentials
            session_store[session_id]['credentials'] = {
                'token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_uri': credentials.token_uri,
                'client_id': credentials.client_id,
                'client_secret': credentials.client_secret,
                'scopes': credentials.scopes
            }
        
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
        return jsonify({"error": f"Gmail API error: {str(e)}"}), 400
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/logout', methods=['POST'])
def auth_logout():
    """Logout user"""
    try:
        session_id = get_session_id()
        if session_id in session_store:
            del session_store[session_id]
        session.clear()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Vercel serverless function handler
def handler(environ, start_response):
    """Vercel serverless function entry point"""
    try:
        return app(environ, start_response)
    except Exception as e:
        # Log error for debugging
        print(f"Serverless function error: {e}")
        start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
        return [b'Internal Server Error']

# For local testing
if __name__ == '__main__':
    app.run(debug=True, port=8000)
