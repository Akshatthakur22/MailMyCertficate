export const HACKATHON_PAGE_FAQS = [
  {
    question: 'How fast can I send hackathon certificates after judging ends?',
    answer:
      'Organizers typically upload a template, import a CSV or Google Sheet of winners and participants, generate PDFs locally, and send via Gmail in under 10–15 minutes for a few hundred recipients.',
  },
  {
    question: 'Can I use different certificate designs for winners and participants?',
    answer:
      'Run separate batches: upload one template per category (e.g. Winner, Participant), import the filtered sheet rows, generate, and send. Each batch stays in its own local session.',
  },
  {
    question: 'Is MailMyCertificate free for large hackathons?',
    answer:
      'Yes. There are no artificial export limits. Gmail sending is subject to Google API quotas on your connected account.',
  },
  {
    question: 'Do hackers need to create accounts?',
    answer:
      'No. Organizers use MailMyCertificate in the browser. Participants only receive email with their PDF attachment.',
  },
  {
    question: 'Where does participant data go?',
    answer:
      'Roster data and generated PDFs stay in the organizer browser (IndexedDB) unless you choose Gmail delivery. We do not host hackathon attendee databases.',
  },
] as const;

export const HACKATHON_HOW_TO_STEPS = [
  {
    name: 'Export your hackathon roster',
    text: 'Use judging spreadsheets, Devpost exports, or Google Form responses linked to Sheets. Include name, email, and track or prize tier columns.',
  },
  {
    name: 'Prepare certificate templates',
    text: 'Create PNG or JPG designs for each category (winner, participant, mentor). Export from Canva or Figma.',
  },
  {
    name: 'Import data and place fields',
    text: 'Upload the template, import CSV or a public Google Sheet, drag name and event fields onto the design.',
  },
  {
    name: 'Batch-generate PDFs locally',
    text: 'Generate hundreds of certificates in your browser. Preview individual PDFs before sending.',
  },
  {
    name: 'Bulk send from organizer Gmail',
    text: 'Connect Gmail, personalize the message, and deliver certificates before your closing ceremony stream ends.',
  },
] as const;
