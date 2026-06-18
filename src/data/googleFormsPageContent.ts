export const GOOGLE_FORMS_PAGE_FAQS = [
  {
    question: 'Do I need a Google Forms add-on?',
    answer:
      'No. MailMyCertificate is a standalone web app. Link your form to a Google Sheet, make the sheet public, and import the URL — no Workspace marketplace install required.',
  },
  {
    question: 'Will new form responses appear automatically?',
    answer:
      'Google Sheets updates when new responses arrive. Re-import or refresh your sheet URL in MailMyCertificate when you are ready to generate certificates for the latest rows.',
  },
  {
    question: 'Can I send certificates to the email collected in the form?',
    answer:
      'Yes. Include an email question in your Google Form. Map that column when importing the linked sheet, then use Gmail delivery in MailMyCertificate.',
  },
  {
    question: 'Is Certify’em better for Google Forms?',
    answer:
      'Certify’em runs inside Google Forms as an add-on. MailMyCertificate is free, open source, and keeps PDF generation local in your browser — better if you want privacy and no per-certificate limits.',
  },
  {
    question: 'What certificate template format do I need?',
    answer:
      'Upload a PNG or JPG template. Design in Canva or export from any tool, then place dynamic fields (name, email, event) in the visual editor.',
  },
] as const;

export const GOOGLE_FORMS_HOW_TO_STEPS = [
  {
    name: 'Create a Google Form with name and email fields',
    text: 'Add questions for participant name and email address. Publish the form and collect responses.',
  },
  {
    name: 'Link responses to Google Sheets',
    text: 'In the form editor: Responses → Link to Sheets → Create a new spreadsheet or select an existing one.',
  },
  {
    name: 'Make the spreadsheet publicly viewable',
    text: 'Open the sheet → Share → Anyone with the link → Viewer. Copy the sheet URL.',
  },
  {
    name: 'Import into MailMyCertificate',
    text: 'Upload your certificate template, paste the public sheet URL, and map form columns to certificate fields.',
  },
  {
    name: 'Generate PDFs and deliver',
    text: 'Generate certificates locally in your browser. Download a ZIP or send personalized emails via Gmail OAuth.',
  },
] as const;
