export const CERTIFIER_COMPARISON_FAQS = [
  {
    question: 'Is MailMyCertificate a direct replacement for Certifier?',
    answer:
      'For bulk PDF generation and Gmail delivery from CSV or Google Sheets — yes, if you want a free, local-first tool. Certifier offers hosted verification, analytics, and CRM integrations MailMyCertificate does not provide yet.',
  },
  {
    question: 'Which tool is better for privacy?',
    answer:
      'MailMyCertificate generates PDFs in your browser and does not host participant rosters. Certifier is a cloud SaaS that processes data on their infrastructure — standard for hosted credential platforms.',
  },
  {
    question: 'Does Certifier have a free tier?',
    answer:
      'Certifier offers a limited free tier (historically around 250 certificates). MailMyCertificate has no artificial export limits on generation; Gmail sending follows Google quotas.',
  },
  {
    question: 'Can MailMyCertificate verify certificates with QR codes?',
    answer:
      'Not today. Certifier and similar platforms focus on verifiable digital credentials. MailMyCertificate focuses on fast, private bulk delivery for event organizers.',
  },
  {
    question: 'Which should hackathon organizers choose?',
    answer:
      'Choose MailMyCertificate if you need free bulk send from your Gmail with no signup and local data handling. Choose Certifier if you need branded verification portals and recipient analytics.',
  },
] as const;

export const CERTIFIER_COMPARISON_HOW_TO_STEPS = [
  {
    name: 'Define your requirements',
    text: 'List must-haves: verification portal, analytics, API, budget, and whether participant data can live in the cloud.',
  },
  {
    name: 'Evaluate privacy architecture',
    text: 'MailMyCertificate keeps merge data local; Certifier is multi-tenant SaaS with hosted issuance.',
  },
  {
    name: 'Compare total cost at your volume',
    text: 'Model certificate count per year including subscription tiers, not just per-batch fees.',
  },
  {
    name: 'Run a pilot batch',
    text: 'MailMyCertificate needs no account — upload a template and test with a 10-row CSV in minutes.',
  },
  {
    name: 'Choose delivery channel',
    text: 'Both support email delivery; MailMyCertificate sends from your Gmail via OAuth.',
  },
] as const;
