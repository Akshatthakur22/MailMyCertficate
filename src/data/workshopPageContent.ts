export const WORKSHOP_PAGE_FAQS = [
  {
    question: 'How do I generate certificates for a workshop?',
    answer:
      'Upload your certificate template as PNG or JPG, import your attendee list from CSV or Google Sheets, drag text fields onto the template, and click Generate. All PDFs are created locally in your browser. Send via Gmail or download as ZIP.',
  },
  {
    question: 'Is MailMyCertificate free for workshops?',
    answer:
      'Yes — completely free, MIT licensed, no account required, no certificate limit. Whether you have 10 or 1,000 workshop attendees, the cost is zero.',
  },
  {
    question: 'Can I send workshop certificates directly to attendees by email?',
    answer:
      'Yes. Connect your Gmail account via OAuth and send personalized certificates to every attendee in one batch. Each person receives an individual email with their certificate attached as a PDF.',
  },
  {
    question: 'What data do I need to generate workshop certificates?',
    answer:
      'At minimum, a name column. If you want to email certificates, also include an email column. Extra columns like role, date, or workshop title can be added as fields on the certificate.',
  },
  {
    question: 'Can I use my Google Forms workshop registration data?',
    answer:
      'Yes. Link your Google Form to a Google Sheet (Responses tab → Link to Sheets), make the sheet publicly viewable, and paste the URL into MailMyCertificate. Form responses become certificate data automatically.',
  },
  {
    question: 'Does MailMyCertificate upload my workshop attendee data?',
    answer:
      'No. All PDF generation runs in your browser using Web Workers. Attendee names and emails are stored in IndexedDB on your device only. Nothing is uploaded to a MailMyCertificate server.',
  },
] as const;

export const WORKSHOP_HOW_TO_STEPS = [
  {
    name: 'Collect attendee data',
    text: 'Use Google Forms, Eventbrite, or any registration tool that exports CSV. Make sure you have at minimum a name column and optionally an email column.',
  },
  {
    name: 'Design your workshop certificate template',
    text: 'Create your certificate in Canva or Figma. Export as PNG or JPG. Leave space for participant name, workshop title, and date fields.',
  },
  {
    name: 'Upload template to MailMyCertificate',
    text: 'Open MailMyCertificate in your browser — no account needed. Upload your PNG/JPG certificate template.',
  },
  {
    name: 'Import your attendee list',
    text: 'Upload your CSV file or paste a public Google Sheets URL. Map columns to certificate fields in the visual editor.',
  },
  {
    name: 'Generate and send',
    text: 'Click Generate to create personalized PDFs for every attendee locally. Send via Gmail in bulk or download all as a ZIP file.',
  },
] as const;
