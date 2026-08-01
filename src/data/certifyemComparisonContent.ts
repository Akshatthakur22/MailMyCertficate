export const CERTIFYEM_COMPARISON_FAQS = [
  {
    question: 'What is Certify\'em?',
    answer:
      'Certify\'em is a Google Workspace Marketplace add-on that installs inside Google Forms. It generates certificates when a form is submitted, using templates stored in Google Slides. It requires a Google Workspace account and sends certificates from Google\'s infrastructure.',
  },
  {
    question: 'What is the main difference between MailMyCertificate and Certify\'em?',
    answer:
      'Certify\'em lives inside Google Forms and triggers on submission. MailMyCertificate is a standalone tool you open in any browser — import your existing data (CSV or Google Sheets), generate PDFs locally, and send via Gmail. No Google Workspace installation required.',
  },
  {
    question: 'Is MailMyCertificate free compared to Certify\'em?',
    answer:
      'MailMyCertificate is MIT-licensed and completely free with no certificate cap. Certify\'em has a free tier with limits — paid plans are required for higher certificate volumes.',
  },
  {
    question: 'Does MailMyCertificate require a Google Workspace account?',
    answer:
      'No. MailMyCertificate works with any Gmail account (personal or Workspace) for email delivery. For data import, you can use a CSV file or a publicly viewable Google Sheets URL — no Workspace subscription needed.',
  },
  {
    question: 'Which tool is better for privacy?',
    answer:
      'MailMyCertificate. All PDF generation happens locally in your browser using Web Workers. Participant data is stored in IndexedDB on your device only. Certify\'em processes certificates on Google\'s cloud infrastructure.',
  },
  {
    question: 'Can I switch from Certify\'em to MailMyCertificate?',
    answer:
      'Yes. Export your participant list from the linked Google Sheet as CSV. Design or export your certificate template as PNG/JPG (Canva or Google Slides). Import both into MailMyCertificate and generate your batch.',
  },
] as const;

export const CERTIFYEM_COMPARISON_FEATURES = [
  {
    feature: 'Installation',
    mailMyCertificate: 'No install — open in any browser',
    certifyem: 'Google Workspace Marketplace add-on',
  },
  {
    feature: 'Pricing',
    mailMyCertificate: 'Free forever (MIT open source)',
    certifyem: 'Free tier with limits; paid plans for higher volume',
  },
  {
    feature: 'Certificate generation location',
    mailMyCertificate: 'Your browser (local, private)',
    certifyem: 'Google cloud infrastructure',
  },
  {
    feature: 'Template format',
    mailMyCertificate: 'PNG or JPG image',
    certifyem: 'Google Slides template',
  },
  {
    feature: 'Data source',
    mailMyCertificate: 'CSV file or public Google Sheets URL',
    certifyem: 'Linked Google Form / Sheet',
  },
  {
    feature: 'Google Workspace required',
    mailMyCertificate: 'No',
    certifyem: 'Yes (for add-on installation)',
  },
  {
    feature: 'Open source',
    mailMyCertificate: 'Yes — full code on GitHub',
    certifyem: 'No',
  },
  {
    feature: 'Account required',
    mailMyCertificate: 'No',
    certifyem: 'Yes',
  },
  {
    feature: 'Export limits',
    mailMyCertificate: 'None',
    certifyem: 'Tier-dependent',
  },
] as const;

export const CERTIFYEM_HOW_TO_STEPS = [
  {
    name: 'Export your participant list',
    text: 'Open the Google Sheet linked to your Form. File → Download → CSV. This is your data source for MailMyCertificate.',
  },
  {
    name: 'Prepare your certificate template',
    text: 'Export your Google Slides certificate template as PNG/JPG, or design a new one in Canva. Leave the name and event fields blank.',
  },
  {
    name: 'Upload template to MailMyCertificate',
    text: 'Open MailMyCertificate in your browser (no install needed), upload the PNG/JPG template file.',
  },
  {
    name: 'Import the CSV participant list',
    text: 'Upload your CSV or paste your public Google Sheets URL. Map columns (name, email) to certificate fields.',
  },
  {
    name: 'Generate and send',
    text: 'Generate all personalized PDFs locally in your browser, then send via Gmail or download as ZIP.',
  },
] as const;
