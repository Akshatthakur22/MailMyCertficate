export const GMAIL_BULK_PAGE_FAQS = [
  {
    question: 'How many certificates can I send via Gmail at once?',
    answer:
      'We recommend batches of around 400 emails for reliability. Gmail API has daily sending limits (typically 500 for free accounts, 2000 for Workspace). MailMyCertificate respects these limits automatically.',
  },
  {
    question: 'Does MailMyCertificate store my Gmail credentials?',
    answer:
      'No. We use official Google OAuth — you authorize directly with Google. MailMyCertificate never sees or stores your password. Tokens remain in your browser session.',
  },
  {
    question: 'Can I customize the email subject and body?',
    answer:
      'Yes. The email composer lets you write a personalized subject and body. You can use merge fields like participant name in the message.',
  },
  {
    question: 'What happens if sending is interrupted?',
    answer:
      'MailMyCertificate tracks which emails have been sent. If you close the tab or lose connection, you can resume from where you left off when you return.',
  },
  {
    question: 'Is the certificate attached as PDF or inline?',
    answer:
      'Certificates are attached as PDF files to each email. Recipients see a personalized message with their certificate as a downloadable attachment.',
  },
] as const;

export const GMAIL_BULK_HOW_TO_STEPS = [
  {
    name: 'Generate certificates locally',
    text: 'Upload your template, import participant data, place fields, and generate all PDFs in your browser.',
  },
  {
    name: 'Switch to the Email tab',
    text: 'After generation, navigate to the Send step. Your certificates are ready to attach.',
  },
  {
    name: 'Connect your Gmail account',
    text: 'Click "Connect Gmail" and authorize via Google OAuth. No passwords are shared with MailMyCertificate.',
  },
  {
    name: 'Compose your email',
    text: 'Write a subject line and body message. Use merge fields to personalize each email.',
  },
  {
    name: 'Send in bulk',
    text: 'Click Send All. Certificates are delivered from your own Gmail account with PDF attachments. Track progress in real time.',
  },
] as const;
