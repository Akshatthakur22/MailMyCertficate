'use client';

import { useState, useEffect } from 'react';
import { db } from '@/core/db/schema';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { emailService } from '@/services/emailService';
import { clearAllSiteData } from '../../utils/clearSiteData';

// Helper function to send email with attachment
const sendEmailWithAttachment = async ({ recipient, subject, body, certificate }: {
  recipient: string;
  subject: string;
  body: string;
  certificate: Uint8Array;
}) => {
  if (!certificate) throw new Error('No certificate PDF provided');
  const formData = new FormData();
  formData.append('recipient', recipient);
  formData.append('subject', subject);
  formData.append('body', body);
  // Convert Uint8Array to Blob
  // Fix: Ensure BlobPart is a real ArrayBuffer or Uint8Array
  // Convert certificate to a standard ArrayBuffer for Blob
  const arrayBuffer = certificate && certificate.buffer && certificate.buffer instanceof ArrayBuffer
    ? certificate.buffer
    : new Uint8Array(certificate).buffer;
  const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
  formData.append('attachment', pdfBlob, 'certificate.pdf');
  const response = await fetch('/api/send-email', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to send email');
  return data;
};
import { Mail, LogIn, LogOut, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AuthStatus {
  authenticated: boolean;
  email: string | null;
}

interface EmailRequest {
  recipient: string;
  subject: string;
  body: string;
}

export default function EmailView() {
  // CSV and certificate integration
  const sessionId = useAppStore((state) => state.sessionId);
  const csvHeaders = useAppStore((state) => state.csvHeaders);
  const [csvRows, setCsvRows] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  // Load CSV rows and certificates on mount
  useEffect(() => {
    const fetchData = async () => {
      const rows = await db.rows.where({ sessionId }).toArray();
      const certs = await db.certificates.where({ sessionId, status: 'completed' }).toArray();
      setCsvRows(rows);
      setCertificates(certs);
    };
    fetchData();
  }, [sessionId]);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ authenticated: false, email: null });
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [sending, setSending] = useState(false);
  // Prefill subject/body with mock content
  const [emailForm, setEmailForm] = useState<EmailRequest>({
    recipient: '',
    subject: 'Certificate of Completion for {{Name}}',
    body: 'Dear {{Name}},\n\nCongratulations on completing your course! Your certificate is attached.\n\nBest regards,\nYour Team'
  });

  // For bulk sending: select which CSV column is the recipient
  const [recipientColumn, setRecipientColumn] = useState<string>('');

    // Helper: get certificate for a row (by rowId)
    const getCertificateForRow = (rowId: number) => {
      return certificates.find(cert => cert.rowId === rowId);
    };
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const status = await emailService.getStatus();
      setAuthStatus(status);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to check authentication status' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setAuthenticating(true);
    try {
      const loginData = await emailService.login();
      // Redirect to Google OAuth
      window.location.href = loginData.authorization_url;
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to initiate login' });
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await emailService.logout();
      setAuthStatus({ authenticated: false, email: null });
      setMessage({ type: 'success', text: 'Logged out successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to logout' });
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailForm.recipient || !emailForm.subject || !emailForm.body) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setSending(true);
    try {
      const result = await emailService.sendEmail(emailForm);
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `Email sent successfully to ${result.recipient}! Message ID: ${result.message_id}` 
        });
        // Reset form
        setEmailForm({ recipient: '', subject: '', body: '' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send email' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send email' });
    } finally {
      setSending(false);
    }
  };

  // Check for OAuth callback
    // Bulk send handler (with certificates)
    const handleBulkSend = async () => {
      if (!recipientColumn) {
        setMessage({ type: 'error', text: 'Please select the recipient email column.' });
        return;
      }
      if (!csvRows.length) {
        setMessage({ type: 'error', text: 'No CSV data loaded.' });
        return;
      }
      setSending(true);
      setMessage(null);
      let successCount = 0;
      let failCount = 0;
      for (const row of csvRows) {
        const recipient = row.data[recipientColumn];
        const subject = emailForm.subject.replace(/{{(\w+)}}/g, (_, key) => row.data[key] || '');
        const body = emailForm.body.replace(/{{(\w+)}}/g, (_, key) => row.data[key] || '');
        const cert = getCertificateForRow(row.id);
        try {
          await sendEmailWithAttachment({ recipient, subject, body, certificate: cert?.pdf });
          successCount++;
        } catch (e) {
          failCount++;
        }
      }
      // Show success message
      setMessage({ type: 'success', text: `Sent ${successCount} emails successfully. ${failCount > 0 ? failCount + ' failed.' : ''}` });
      
      // Clear all site data after successful email sending
      if (successCount > 0) {
        try {
          await clearAllSiteData();
          // Update message to include data clearing info
          setTimeout(() => {
            setMessage({ type: 'success', text: `✅ Sent ${successCount} emails successfully! All site data has been cleared for privacy.${failCount > 0 ? ` ${failCount} failed.` : ''}` });
          }, 1000);
        } catch (error) {
          console.error('Failed to clear site data:', error);
          setMessage({ type: 'success', text: `Sent ${successCount} emails successfully. ${failCount > 0 ? failCount + ' failed.' : ''} (Note: Site data clearing failed)` });
        }
      }
      
      setSending(false);
    };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth_success') === 'true') {
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      // Check auth status after callback
      checkAuthStatus();
      setMessage({ type: 'success', text: 'Authentication successful!' });
    } else if (urlParams.get('error')) {
      const error = urlParams.get('error');
      window.history.replaceState({}, document.title, window.location.pathname);
      setMessage({ type: 'error', text: `Authentication failed: ${error}` });
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Mail className="w-8 h-8" />
          Email Integration
        </h1>
        <p className="text-gray-600">Send certificates via Gmail using OAuth2 authentication</p>
      </div>

      {/* Authentication Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {authStatus.authenticated ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-semibold">Authenticated</p>
                  <p className="text-sm text-gray-600">{authStatus.email}</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="font-semibold">Not Authenticated</p>
                  <p className="text-sm text-gray-600">Connect your Gmail account</p>
                </div>
              </>
            )}
          </div>
          
          <Button
            onClick={authStatus.authenticated ? handleLogout : handleLogin}
            disabled={authenticating}
            variant={authStatus.authenticated ? "secondary" : "primary"}
            className="flex items-center gap-2"
          >
            {authenticating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : authStatus.authenticated ? (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Connect Gmail
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}


      {/* Bulk Email Form */}
      {authStatus.authenticated && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Bulk Emails
          </h2>

          {/* CSV recipient column selection */}
          {csvHeaders.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select recipient email column</label>
              <select
                value={recipientColumn}
                onChange={e => setRecipientColumn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select column --</option>
                {csvHeaders.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          )}

          {/* Subject and body fields (mock prefilled) */}
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              id="subject"
              value={emailForm.subject}
              onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
            <textarea
              id="body"
              value={emailForm.body}
              onChange={e => setEmailForm({ ...emailForm, body: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              required
            />
          </div>

          {/* Preview summary */}
          <div className="mb-4 text-sm text-gray-700">
            <strong>Preview:</strong> {csvRows.length} emails will be sent. Each will have a unique certificate attached.<br/>
            <span className="text-xs text-gray-500">(Backend support for attachments required)</span>
          </div>

          <Button
            type="button"
            disabled={sending || !recipientColumn || !csvRows.length}
            className="w-full flex items-center justify-center gap-2"
            onClick={handleBulkSend}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Bulk Emails
              </>
            )}
          </Button>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Use <code className="bg-blue-100 px-1 rounded">{'{{ColumnName}}'}</code> syntax in your subject and message body to dynamically insert data from your CSV for each recipient.<br/>
              Attachments are matched automatically to each participant.<br/>
              <span className="text-xs">(Certificates are generated and stored per row in your browser. Backend must support attachments for sending.)</span>
            </p>
          </div>
        </div>
      )}

      {!authStatus.authenticated && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Connect Your Gmail Account
          </h3>
          <p className="text-gray-600 mb-4">
            Authenticate with Gmail to start sending certificates automatically to your recipients.
          </p>
          <Button onClick={handleLogin} disabled={authenticating} className="flex items-center gap-2 mx-auto">
            {authenticating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            Connect Gmail
          </Button>
        </div>
      )}
    </div>
  );
}
