export const WEBINAR_PAGE_FAQS = [
  {
    question: 'How do I generate certificates for webinar attendees?',
    answer:
      'Export your webinar attendee list as CSV from Zoom, Google Meet, or your registration platform. Upload your certificate template as PNG/JPG, import the CSV into MailMyCertificate, map the name and email columns, and generate personalized PDFs locally. Send via Gmail or download as ZIP.',
  },
  {
    question: 'Can I generate certificates from Zoom webinar attendance?',
    answer:
      'Yes. Export the attendee report from Zoom as CSV (Reports → Usage → Webinars → Export). Upload the CSV to MailMyCertificate and map the participant name and email columns to your certificate fields.',
  },
  {
    question: 'Is there a limit to how many webinar certificates I can generate?',
    answer:
      'No. MailMyCertificate is MIT licensed and free with no certificate cap. Whether you have 50 or 5,000 webinar attendees, the tool handles it in your browser — the limit is only your device memory.',
  },
  {
    question: 'How do I send webinar certificates to all attendees at once?',
    answer:
      'After generating PDFs, connect your Gmail account via OAuth. MailMyCertificate sends each attendee a personalized email with their certificate attached. Gmail API daily limits typically allow 400–500 emails per batch.',
  },
  {
    question: 'What certificate template format works for webinars?',
    answer:
      'A PNG or JPG image exported from Canva, Figma, or any design tool. Design your webinar certificate with static elements (title, logo, date) and leave the participant name area blank — MailMyCertificate fills that per attendee.',
  },
  {
    question: 'Can I add the webinar date and topic on each certificate?',
    answer:
      'Yes. Add columns for date and topic/title in your spreadsheet, then drag those fields onto the certificate canvas in MailMyCertificate. Each field is filled from the corresponding column row by row.',
  },
] as const;

export const WEBINAR_HOW_TO_STEPS = [
  {
    name: 'Export your webinar attendee list',
    text: 'Download attendee data as CSV from Zoom (Reports → Usage), Google Meet, or your webinar registration form. You need at minimum a name column; include email to send certificates directly.',
  },
  {
    name: 'Design your webinar certificate',
    text: 'Create a certificate in Canva or Figma with your webinar title, date, and branding. Export as PNG or JPG, leaving the participant name area blank.',
  },
  {
    name: 'Upload template to MailMyCertificate',
    text: 'Open MailMyCertificate in your browser — no account required. Upload your PNG/JPG certificate template.',
  },
  {
    name: 'Import attendee CSV and map fields',
    text: 'Upload your attendee CSV. Drag name, email, and any other fields (date, topic) onto the certificate canvas to position them.',
  },
  {
    name: 'Generate PDFs and send via Gmail',
    text: 'Click Generate to create all personalized certificate PDFs locally. Send to every attendee via your Gmail account or download as a ZIP.',
  },
] as const;
