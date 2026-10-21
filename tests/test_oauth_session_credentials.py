"""Regression tests for encrypted credentials in Flask's existing session cookie."""

import json
import os
import sys
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from unittest.mock import patch


# Importing the API must not use a developer's or production database during tests.
os.environ['FLASK_SECRET_KEY'] = 'unit-test-only-key'
os.environ['NODE_ENV'] = 'test'
os.environ['DATABASE_URL'] = ''
os.environ['ANALYTICS_DB_PATH'] = ':memory:'
os.environ['GOOGLE_CREDENTIALS_JSON'] = json.dumps({
    'web': {
        'client_id': 'test-client-id',
        'client_secret': 'test-client-secret',
        'token_uri': 'https://oauth2.googleapis.com/token',
    }
})
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'api'))

from api import index as oauth_api  # noqa: E402
from google.oauth2.credentials import Credentials  # noqa: E402


class OAuthSessionCredentialTests(unittest.TestCase):
    def setUp(self):
        oauth_api.app.config['TESTING'] = True
        oauth_api.app.config['SECRET_KEY'] = 'unit-test-only-key'

    def test_new_credentials_are_encrypted_and_round_trip(self):
        raw_access_token = 'test-access-token-should-not-be-readable'
        raw_refresh_token = 'test-refresh-token-should-not-be-readable'
        credentials = Credentials(
            token=raw_access_token,
            refresh_token=raw_refresh_token,
            token_uri='https://oauth2.googleapis.com/token',
            client_id='test-client-id',
            client_secret='test-client-secret',
            scopes=['https://www.googleapis.com/auth/gmail.send'],
        )

        with oauth_api.app.test_request_context('/'):
            oauth_api.store_credentials_in_session(credentials)
            stored = oauth_api.session['credentials']
            self.assertTrue(stored.startswith('enc:v1:'))
            self.assertNotIn(raw_access_token, stored)
            self.assertNotIn(raw_refresh_token, stored)

            restored = oauth_api.reconstruct_credentials(stored)
            self.assertEqual(restored.token, raw_access_token)
            self.assertEqual(restored.refresh_token, raw_refresh_token)

    def test_legacy_cookie_credentials_migrate_on_first_use(self):
        legacy = {
            'token': 'legacy-access-token',
            'refresh_token': 'legacy-refresh-token',
            'scopes': ['https://www.googleapis.com/auth/gmail.send'],
        }

        with oauth_api.app.test_request_context('/'):
            oauth_api.session['credentials'] = legacy
            restored = oauth_api.reconstruct_credentials(legacy)
            stored = oauth_api.session['credentials']

            self.assertEqual(restored.token, legacy['token'])
            self.assertEqual(restored.refresh_token, legacy['refresh_token'])
            self.assertTrue(stored.startswith('enc:v1:'))
            self.assertNotIn(legacy['token'], stored)

    def test_invalid_encrypted_credentials_are_removed(self):
        with oauth_api.app.test_request_context('/'):
            oauth_api.session['credentials'] = 'enc:v1:not-valid-ciphertext'
            self.assertIsNone(oauth_api.reconstruct_credentials(oauth_api.session['credentials']))
            self.assertNotIn('credentials', oauth_api.session)

    def test_refresh_restores_credentials_in_encrypted_format(self):
        credentials = Credentials(
            token='expired-access-token',
            refresh_token='refresh-token',
            token_uri='https://oauth2.googleapis.com/token',
            client_id='test-client-id',
            client_secret='test-client-secret',
            scopes=['https://www.googleapis.com/auth/gmail.send'],
            expiry=datetime.utcnow() - timedelta(minutes=5),
        )

        def mock_refresh(instance, _request):
            instance.token = 'refreshed-access-token'
            instance.expiry = datetime.utcnow() + timedelta(hours=1)

        with oauth_api.app.test_request_context('/'):
            with patch.object(Credentials, 'refresh', autospec=True, side_effect=mock_refresh):
                self.assertTrue(oauth_api.refresh_credentials_if_needed(credentials))
            stored = oauth_api.session['credentials']
            self.assertTrue(stored.startswith('enc:v1:'))
            self.assertNotIn('refreshed-access-token', stored)
            restored = oauth_api.reconstruct_credentials(stored)
            self.assertEqual(restored.token, 'refreshed-access-token')

    def test_logout_clears_existing_session_cookie_state(self):
        client = oauth_api.app.test_client()
        with client.session_transaction() as current_session:
            current_session['credentials'] = oauth_api._encrypt_session_credentials({
                'token': 'access-token',
                'refresh_token': 'refresh-token',
                'scopes': [],
            })
            current_session['csrf_token'] = 'test-csrf'

        with patch.object(oauth_api, 'is_production', return_value=False):
            response = client.post('/api/auth/logout')

        self.assertEqual(response.status_code, 200)
        with client.session_transaction() as current_session:
            self.assertNotIn('credentials', current_session)
            self.assertNotIn('csrf_token', current_session)

    def test_oauth_callback_stores_encrypted_credentials(self):
        client = oauth_api.app.test_client()
        credentials = Credentials(
            token='callback-access-token',
            refresh_token='callback-refresh-token',
            token_uri='https://oauth2.googleapis.com/token',
            client_id='test-client-id',
            client_secret='test-client-secret',
            scopes=['https://www.googleapis.com/auth/gmail.send'],
        )

        class FakeFlow:
            def __init__(self):
                self.credentials = credentials

            def fetch_token(self, code):
                self.code = code

        class FakeUserInfo:
            def get(self):
                return self

            def execute(self):
                return {'email': 'organizer@example.test'}

        class FakeOAuthService:
            def userinfo(self):
                return FakeUserInfo()

        fake_flow = FakeFlow()
        with client.session_transaction() as current_session:
            current_session['state'] = 'expected-state'

        with patch.object(oauth_api, 'get_flow', return_value=fake_flow), \
             patch.object(oauth_api, 'build', return_value=FakeOAuthService()), \
             patch.object(oauth_api, 'record_event'), \
             patch.object(oauth_api, 'upsert_session'):
            response = client.get(
                '/api/auth/callback?code=authorization-code&state=expected-state'
            )

        self.assertEqual(response.status_code, 302)
        self.assertIn('/email?auth_success=true&csrf_token=', response.headers['Location'])
        self.assertEqual(fake_flow.code, 'authorization-code')
        with client.session_transaction() as current_session:
            stored = current_session['credentials']
            self.assertTrue(stored.startswith('enc:v1:'))
            self.assertNotIn('callback-access-token', stored)
            self.assertNotIn('callback-refresh-token', stored)

    def test_oauth_callback_rejects_state_mismatch(self):
        client = oauth_api.app.test_client()
        with client.session_transaction() as current_session:
            current_session['state'] = 'expected-state'

        with patch.object(oauth_api, 'get_flow') as get_flow, \
             patch.object(oauth_api, 'record_event'):
            response = client.get(
                '/api/auth/callback?code=authorization-code&state=wrong-state'
            )

        self.assertEqual(response.status_code, 302)
        self.assertIn('error=invalid_state', response.headers['Location'])
        get_flow.assert_not_called()

    def test_email_route_accepts_encrypted_session_credentials(self):
        client = oauth_api.app.test_client()
        credentials = Credentials(
            token='send-access-token',
            refresh_token='send-refresh-token',
            token_uri='https://oauth2.googleapis.com/token',
            client_id='test-client-id',
            client_secret='test-client-secret',
            scopes=['https://www.googleapis.com/auth/gmail.send'],
        )

        class FakeMessages:
            def send(self, **_kwargs):
                return self

            def execute(self):
                return {'id': 'test-message-id'}

        class FakeUsers:
            def messages(self):
                return FakeMessages()

        class FakeGmailService:
            def users(self):
                return FakeUsers()

        with client.session_transaction() as current_session:
            current_session['credentials'] = oauth_api._encrypt_session_credentials({
                'token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'scopes': credentials.scopes,
            })
            current_session['csrf_token'] = 'test-csrf'
            current_session['email'] = 'organizer@example.test'

        with patch.object(oauth_api, 'build', return_value=FakeGmailService()), \
             patch.object(oauth_api, 'record_event'), \
             patch.object(oauth_api, 'upsert_session'):
            response = client.post('/api/send-email', json={
                'recipient': 'recipient@example.test',
                'subject': 'Certificate',
                'body': 'Your certificate is attached.',
            })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['message_id'], 'test-message-id')


if __name__ == '__main__':
    unittest.main()
