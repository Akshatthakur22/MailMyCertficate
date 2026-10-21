"""The certificate email endpoint must reject sends without a usable PDF."""

import io
import json
import os
import sys
import unittest
from pathlib import Path

os.environ['FLASK_SECRET_KEY'] = 'unit-test-only-key'
os.environ['NODE_ENV'] = 'test'
os.environ['DATABASE_URL'] = ''
os.environ['ANALYTICS_DB_PATH'] = ':memory:'
os.environ['GOOGLE_CREDENTIALS_JSON'] = json.dumps({'web': {'client_id': 'test', 'client_secret': 'test'}})
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'api'))

from api import index as email_api  # noqa: E402


class EmailAttachmentRequiredTests(unittest.TestCase):
    def setUp(self):
        email_api.app.config['TESTING'] = True
        email_api.app.config['SECRET_KEY'] = 'unit-test-only-key'
        self.client = email_api.app.test_client()
        with self.client.session_transaction() as current_session:
            current_session['csrf_token'] = 'test-csrf'
            current_session['credentials'] = 'test-credentials'

    def test_rejects_missing_certificate_attachment(self):
        response = self.client.post(
            '/api/send-email',
            data={'recipient': 'person@example.test', 'subject': 'Certificate', 'body': 'Attached.'},
            content_type='multipart/form-data',
            headers={'X-CSRF-Token': 'test-csrf'},
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('PDF attachment is required', response.get_json()['error'])

    def test_rejects_empty_or_non_pdf_attachment(self):
        for payload, expected in ((b'', 'empty'), (b'not a pdf', 'not a valid PDF')):
            with self.subTest(expected=expected):
                response = self.client.post(
                    '/api/send-email',
                    data={
                        'recipient': 'person@example.test',
                        'subject': 'Certificate',
                        'body': 'Attached.',
                        'attachment': (io.BytesIO(payload), 'certificate.pdf', 'application/pdf'),
                    },
                    headers={'X-CSRF-Token': 'test-csrf'},
                )

                self.assertEqual(response.status_code, 400)
                self.assertIn(expected, response.get_json()['error'])


if __name__ == '__main__':
    unittest.main()
