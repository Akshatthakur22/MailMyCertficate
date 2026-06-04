export type GuideFaq = {
  question: string;
  answer: string;
};

/** Shared FAQ copy for guide UI + FAQPage JSON-LD */
export const GUIDE_FAQS: GuideFaq[] = [
  {
    question: 'Is my data uploaded to your servers?',
    answer:
      'No. Certificate generation happens locally in your browser. Participant lists and PDFs stay on your device unless you choose to send email through Gmail.',
  },
  {
    question: 'Can I use Google Sheets instead of CSV?',
    answer:
      'Yes. Provide a public Google Sheets URL — ideal for Google Forms → Sheets → certificate workflows.',
  },
  {
    question: 'Does this work on mobile devices?',
    answer:
      'The visual field editor works best on desktop. You can generate and download certificates on mobile after setup.',
  },
  {
    question: 'Why does Google ask for permissions?',
    answer:
      'MailMyCertificate uses official Google OAuth to send mail from your Gmail account. We never handle your Google password.',
  },
  {
    question: 'Can I only download certificates without email?',
    answer:
      'Yes. Download all certificates as a ZIP and distribute them manually if you prefer.',
  },
  {
    question: 'How many emails can I send at once?',
    answer:
      'We recommend about 400 emails per batch for reliability, subject to Gmail API limits and browser performance.',
  },
  {
    question: 'Are PDF templates supported?',
    answer:
      'Use PNG or JPG templates today. Convert PDF designs to images with any standard export tool.',
  },
  {
    question: 'Why should I avoid refreshing during email sending?',
    answer:
      'Refreshing mid-send can interrupt delivery. Keep the tab open until sending completes.',
  },
  {
    question: 'How do I delete my certificate data from this browser?',
    answer:
      'Use Your local data in the tool or email header, or open Session settings to clear a batch or all local data.',
  },
  {
    question: 'What happens when I return to the site later?',
    answer:
      'You may see a Previous session found prompt. Continue to resume or start a new batch. Sessions older than 7 days expire automatically.',
  },
  {
    question: 'Does downloading the ZIP delete my certificates?',
    answer:
      'No. Files remain in your browser so you can re-download, verify, or regenerate before starting a new batch.',
  },
];

export const GUIDE_HOW_TO_STEPS = [
  {
    name: 'Upload your certificate template',
    text: 'Add a PNG or JPG design as your certificate background.',
  },
  {
    name: 'Import participant data',
    text: 'Upload a CSV or connect a public Google Sheet with names and emails.',
  },
  {
    name: 'Position fields and generate PDFs',
    text: 'Drag text fields onto the template, then generate personalized certificates locally.',
  },
  {
    name: 'Download or send with Gmail',
    text: 'Export a ZIP or connect Gmail to send certificates with personalized messages.',
  },
];
