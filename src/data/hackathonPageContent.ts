export const HACKATHON_PAGE_FAQS = [
  {
    question: 'Can I generate certificates for 500+ hackathon participants?',
    answer:
      'Yes. MailMyCertificate runs entirely in your browser using Web Workers and pdf-lib. There is no artificial cap on the number of certificates you can generate in a single batch.',
  },
  {
    question: 'How do I get participant data from my hackathon registration form?',
    answer:
      'Export from Google Forms to Google Sheets, or download a CSV from Devfolio, Unstop, or your registration platform. Import the file or public sheet URL into MailMyCertificate.',
  },
  {
    question: 'Can I add different certificate types (winner, participant, mentor)?',
    answer:
      'Yes. Add a "type" or "role" column in your spreadsheet and map it to a text field on the certificate. Run separate batches with different templates for each category.',
  },
  {
    question: 'Is this suitable for MLH-partnered hackathons?',
    answer:
      'MailMyCertificate generates standard PDF certificates. It does not integrate with MLH verification systems. For standard participation and winner certificates, it works perfectly.',
  },
  {
    question: 'Can multiple organizers use the same batch?',
    answer:
      'Currently, sessions are browser-local. Share the generated ZIP with co-organizers, or have them open the same public Google Sheet URL independently.',
  },
] as const;

export const HACKATHON_HOW_TO_STEPS = [
  {
    name: 'Collect registrations',
    text: 'Use Google Forms, Devfolio, or any platform that exports CSV or connects to Google Sheets.',
  },
  {
    name: 'Design your certificate template',
    text: 'Create a hackathon certificate in Canva or Figma. Export as PNG or JPG with space for participant name and category.',
  },
  {
    name: 'Import participant data',
    text: 'Upload CSV or paste a public Google Sheets URL. Map name, email, and optional columns like team or track.',
  },
  {
    name: 'Place fields and generate',
    text: 'Drag text fields onto the template canvas. Generate all personalized PDFs locally in seconds.',
  },
  {
    name: 'Distribute via Gmail or ZIP',
    text: 'Send certificates from your Gmail account in bulk, or download a ZIP to share via Discord, Slack, or email manually.',
  },
] as const;
