export const CERTIFIER_COMPARISON_FAQS = [
  {
    question: 'What is the main difference between MailMyCertificate and Certifier?',
    answer:
      'MailMyCertificate is free, open source, and processes everything locally in your browser. Certifier is a paid SaaS that stores data on their servers and offers features like verification portals and LMS integrations.',
  },
  {
    question: 'Does Certifier offer anything MailMyCertificate does not?',
    answer:
      'Yes. Certifier provides verifiable credential links, public verification portals, analytics dashboards, and enterprise LMS API integrations. MailMyCertificate focuses on fast, private, free certificate generation and delivery.',
  },
  {
    question: 'Is MailMyCertificate really free with no limits?',
    answer:
      'Yes. MIT-licensed, no per-certificate fees, no export caps, no account required. The only limits are Gmail API daily quotas when sending emails.',
  },
  {
    question: 'Which tool is better for privacy?',
    answer:
      'MailMyCertificate. All participant data stays in your browser (IndexedDB). Certifier requires uploading recipient information to their cloud servers for processing.',
  },
  {
    question: 'Can I switch from Certifier to MailMyCertificate?',
    answer:
      'Yes. Export your participant list as CSV from Certifier, design a new template (or reuse your exported design as PNG/JPG), and import everything into MailMyCertificate.',
  },
] as const;

export const CERTIFIER_COMPARISON_FEATURES = [
  {
    feature: 'Pricing',
    mailMyCertificate: 'Free forever (MIT open source)',
    certifier: 'Freemium with paid tiers',
  },
  {
    feature: 'Data processing',
    mailMyCertificate: 'Local browser (IndexedDB + Web Worker)',
    certifier: 'Cloud servers',
  },
  {
    feature: 'Open source',
    mailMyCertificate: 'Yes — full code on GitHub',
    certifier: 'No — proprietary',
  },
  {
    feature: 'Account required',
    mailMyCertificate: 'No',
    certifier: 'Yes',
  },
  {
    feature: 'Verification portal',
    mailMyCertificate: 'Not yet available',
    certifier: 'Yes — public verification links',
  },
  {
    feature: 'LMS integration',
    mailMyCertificate: 'Not yet available',
    certifier: 'Yes — API integrations',
  },
  {
    feature: 'Gmail delivery',
    mailMyCertificate: 'Yes — from your own account via OAuth',
    certifier: 'Uses Certifier email servers',
  },
  {
    feature: 'Export limits',
    mailMyCertificate: 'None',
    certifier: 'Tier-dependent',
  },
] as const;
