export const GOOGLE_SHEETS_PAGE_FAQS = [
  {
    question: 'Can MailMyCertificate read a private Google Sheet?',
    answer:
      'You need a public Google Sheet URL (Anyone with the link can view). MailMyCertificate fetches the sheet as CSV — your spreadsheet is not stored on our servers. Certificate generation still runs locally in your browser.',
  },
  {
    question: 'Does this work with Google Forms responses?',
    answer:
      'Yes. Connect your Google Form to a Google Sheet (Responses tab → Link to Sheets). When new rows appear in the sheet, re-import the public URL to generate certificates for new participants.',
  },
  {
    question: 'What columns does my Google Sheet need?',
    answer:
      'At minimum, include a name column. Add an email column if you plan to send certificates via Gmail. Extra columns (event, date, role) can be mapped to certificate fields in the visual editor.',
  },
  {
    question: 'Is participant data uploaded to MailMyCertificate?',
    answer:
      'No. The sheet is fetched to populate your local session. PDF generation uses IndexedDB and Web Workers in your browser. We do not operate a cloud database of attendee lists.',
  },
  {
    question: 'How is this different from Certify’em or Certifier?',
    answer:
      'MailMyCertificate is free, open source, and privacy-first: no account required, no per-certificate export limits, and no requirement to upload your roster to a third-party SaaS. Paid platforms may offer verification portals or LMS integrations we do not provide yet.',
  },
] as const;

export const GOOGLE_SHEETS_HOW_TO_STEPS = [
  {
    name: 'Collect responses in Google Sheets',
    text: 'Create a Google Form or spreadsheet with participant names and emails. Link form responses to a sheet if using Google Forms.',
  },
  {
    name: 'Make the sheet publicly viewable',
    text: 'In Google Sheets: Share → General access → Anyone with the link → Viewer. Copy the sheet URL.',
  },
  {
    name: 'Upload your certificate template',
    text: 'In MailMyCertificate, upload a PNG or JPG design (export from Canva or Figma if needed).',
  },
  {
    name: 'Import the Google Sheet URL',
    text: 'Paste the public sheet link in the import step. Map columns such as name and email to certificate fields.',
  },
  {
    name: 'Generate PDFs and send via Gmail',
    text: 'Generate personalized certificates locally, download a ZIP, or connect Gmail OAuth to send bulk email with attachments.',
  },
] as const;
