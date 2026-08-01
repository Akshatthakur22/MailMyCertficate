export const CANVA_COMPARISON_FAQS = [
  {
    question: 'Can Canva generate certificates in bulk automatically?',
    answer:
      'No. Canva requires you to manually edit each certificate individually. There is no built-in bulk generation or mail-merge feature — you must duplicate the design, edit the name, export, and repeat for every participant.',
  },
  {
    question: 'What is the difference between MailMyCertificate and Canva for certificates?',
    answer:
      'Canva is a design tool — great for creating one beautiful certificate. MailMyCertificate is an automation tool — it takes your finished design (exported as PNG or JPG from Canva) and generates hundreds of personalized PDFs in seconds, then sends them via Gmail.',
  },
  {
    question: 'Can I use my Canva certificate design with MailMyCertificate?',
    answer:
      'Yes. Export your Canva design as PNG or JPG (leave the name area blank), then import it into MailMyCertificate as your template. Add text fields for participant names, and generate all certificates in one batch.',
  },
  {
    question: 'Is MailMyCertificate free compared to Canva?',
    answer:
      'MailMyCertificate is completely free with no tier limits — MIT licensed, no account required, no watermark, no export cap. Canva has a free tier but certain templates and features require Canva Pro.',
  },
  {
    question: 'Does MailMyCertificate upload my participant data like Canva does?',
    answer:
      'No. All certificate generation happens locally in your browser. Participant names and emails never leave your device. Canva stores your designs on their cloud servers.',
  },
  {
    question: 'How long does it take to send 200 certificates using Canva vs MailMyCertificate?',
    answer:
      'With Canva: approximately 4+ hours (edit each name, export each PDF, attach each email manually). With MailMyCertificate: approximately 2–5 minutes for generation plus Gmail send time.',
  },
] as const;

export const CANVA_COMPARISON_FEATURES = [
  {
    feature: 'Bulk certificate generation',
    mailMyCertificate: 'Yes — unlimited, one click',
    canva: 'No — manual edit per certificate',
  },
  {
    feature: 'Bulk email delivery',
    mailMyCertificate: 'Yes — via your own Gmail (OAuth)',
    canva: 'No — manual email per recipient',
  },
  {
    feature: 'Import CSV / Google Sheets',
    mailMyCertificate: 'Yes — auto-detected headers',
    canva: 'No built-in data import',
  },
  {
    feature: 'Certificate design',
    mailMyCertificate: 'Upload PNG/JPG (design in Canva first)',
    canva: 'Full design tool with 500k+ templates',
  },
  {
    feature: 'Participant data privacy',
    mailMyCertificate: 'Local only — never uploaded',
    canva: 'Stored on Canva cloud servers',
  },
  {
    feature: 'Cost',
    mailMyCertificate: 'Free forever (MIT open source)',
    canva: 'Free tier + Canva Pro required for some features',
  },
  {
    feature: 'Account required',
    mailMyCertificate: 'No',
    canva: 'Yes',
  },
  {
    feature: 'Open source',
    mailMyCertificate: 'Yes — full code on GitHub',
    canva: 'No — proprietary',
  },
  {
    feature: 'Time for 200 certificates',
    mailMyCertificate: '~2 minutes',
    canva: '~4 hours',
  },
] as const;

export const CANVA_HOW_TO_STEPS = [
  {
    name: 'Design your certificate in Canva',
    text: 'Create your certificate in Canva with all static elements: borders, logos, titles, and signature lines. Leave the participant name area blank.',
  },
  {
    name: 'Export from Canva as PNG or JPG',
    text: 'Download your design from Canva as PNG (recommended) or JPG. This becomes your certificate template in MailMyCertificate.',
  },
  {
    name: 'Import your participant list',
    text: 'Upload a CSV file or paste a public Google Sheets URL with participant names and emails.',
  },
  {
    name: 'Place text fields on the template',
    text: 'Drag the name and any other fields onto the certificate canvas exactly where you want them to appear.',
  },
  {
    name: 'Generate and send in bulk',
    text: 'Click Generate to create all personalized PDFs locally in your browser, then send via Gmail or download as a ZIP.',
  },
] as const;
