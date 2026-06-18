export const CANVA_ALTERNATIVE_FAQS = [
  {
    question: 'Can I still design certificates in Canva?',
    answer:
      'Yes. Design your template in Canva, export as PNG or JPG, then upload to MailMyCertificate for bulk personalization. You stop repeating manual name edits in Canva — not designing there.',
  },
  {
    question: 'Why is manual Canva painful for 100+ certificates?',
    answer:
      'Canva is built for one-off designs. Copying a template, editing text, and exporting PDFs per row does not scale. MailMyCertificate automates the merge step after you design once.',
  },
  {
    question: 'Does MailMyCertificate replace Canva entirely?',
    answer:
      'No. It replaces the repetitive mail-merge and delivery workflow. Use Canva (or Figma) for design; use MailMyCertificate for batch PDF generation and Gmail send.',
  },
  {
    question: 'Is this free compared to Canva Pro exports?',
    answer:
      'MailMyCertificate is free and open source with no artificial export limits. Canva may limit bulk downloads on free tiers.',
  },
  {
    question: 'Where is participant data processed?',
    answer:
      'In your browser. Canva uploads are not required for every attendee row — you import CSV or Google Sheets locally instead.',
  },
] as const;

export const CANVA_ALTERNATIVE_HOW_TO_STEPS = [
  {
    name: 'Design once in Canva',
    text: 'Create your certificate layout in Canva. Leave clear space for dynamic name and event fields.',
  },
  {
    name: 'Export as PNG or JPG',
    text: 'Download a high-resolution image (not PDF). MailMyCertificate uses image templates today.',
  },
  {
    name: 'Prepare your participant list',
    text: 'Use CSV or a public Google Sheet with names, emails, and optional columns like event or role.',
  },
  {
    name: 'Upload and map fields in MailMyCertificate',
    text: 'Import the template and data, drag fields onto the design, and generate all PDFs locally.',
  },
  {
    name: 'Download ZIP or send via Gmail',
    text: 'Deliver certificates in minutes instead of editing each Canva file manually.',
  },
] as const;
