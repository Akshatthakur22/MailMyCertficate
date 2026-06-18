export const GMAIL_BULK_PAGE_FAQS = [
  {
    question: 'Does MailMyCertificate send email from my Gmail account?',
    answer:
      'Yes. You connect via official Google OAuth. Messages are sent through the Gmail API from your inbox — not from a shared MailMyCertificate SMTP server.',
  },
  {
    question: 'How many certificates can I email in one batch?',
    answer:
      'We recommend about 400 emails per batch for reliability. Limits also depend on Gmail API quotas and your Google account type.',
  },
  {
    question: 'Can I personalize the email subject and body?',
    answer:
      'Yes. Use column placeholders such as {{name}} or {{event}} in the subject and message body. Each recipient gets their own certificate PDF attached.',
  },
  {
    question: 'Do I need to upload PDFs to your server to send email?',
    answer:
      'Certificates are read from IndexedDB in your browser and attached when you send. Only the Gmail OAuth handshake uses our Flask API — not bulk storage of participant files.',
  },
  {
    question: 'Can I download ZIP instead of emailing?',
    answer:
      'Yes. Generate all PDFs locally and download a ZIP if you prefer manual distribution or another email tool.',
  },
] as const;

export const GMAIL_BULK_HOW_TO_STEPS = [
  {
    name: 'Generate certificates in the tool',
    text: 'Complete template upload, data import, field placement, and PDF generation in /tool first.',
  },
  {
    name: 'Open the email delivery page',
    text: 'Go to /email after your batch is generated. Your session data loads from local browser storage.',
  },
  {
    name: 'Connect Gmail with OAuth',
    text: 'Click Connect Gmail and approve the gmail.send scope. Tokens stay in an encrypted server session cookie.',
  },
  {
    name: 'Compose subject and body with variables',
    text: 'Write a subject like "Your certificate — {{event}}" and a message body with {{name}} placeholders.',
  },
  {
    name: 'Send and track delivery',
    text: 'Start the send queue. Keep the tab open until completion. Retry failed recipients from the tracker UI.',
  },
] as const;
