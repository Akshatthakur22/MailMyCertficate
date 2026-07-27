/**
 * Homepage FAQ content.
 *
 * The audit found the homepage — the highest-authority page on the domain — had
 * no FAQ schema and no question-phrased headings, making it ineligible for
 * featured snippets and People Also Ask. Answers are kept in the 40-60 word band
 * that paragraph snippets favour.
 */
export const HOME_PAGE_FAQS = [
  {
    question: 'What is MailMyCertificate?',
    answer:
      'MailMyCertificate is a free, open-source bulk certificate generator. You upload a template image and a participant list, and it produces a personalized PDF certificate for every row, then emails them through your own Gmail account. All PDF generation runs in your browser.',
  },
  {
    question: 'Is MailMyCertificate free?',
    answer:
      'Yes, entirely. It is MIT licensed with no paid tier, no trial, no per-certificate charge and no cap on how many you generate. There is nothing to sign up for, and no payment details are ever requested.',
  },
  {
    question: 'How do I generate certificates in bulk?',
    answer:
      'Export your certificate design as a PNG or JPG, then import your participant list as a CSV file or a public Google Sheets URL. Drag name and event fields onto the template, and generate every PDF in one batch.',
  },
  {
    question: 'Is my participant data uploaded anywhere?',
    answer:
      'No. Certificates are rendered in your browser using pdf-lib in a Web Worker, and participant rows are stored in IndexedDB on your own device. The list is never uploaded to a MailMyCertificate server.',
  },
  {
    question: 'How many certificates can I generate at once?',
    answer:
      'There is no artificial limit. Because generation happens locally, the practical ceiling is your own device memory rather than a plan tier. Batches of several hundred are routine for hackathons and workshops.',
  },
  {
    question: 'Do I need a Google account to use it?',
    answer:
      'Only if you want to email the certificates. Generating and downloading them as a ZIP file needs no account at all. Gmail delivery uses your own Google account via OAuth, requesting only the gmail.send scope.',
  },
  {
    question: 'What file format should my certificate template be?',
    answer:
      'A PNG or JPG image. Design it in Canva, Figma or any editor, then export as an image rather than a PDF. Leave the name and event areas blank so those can be filled per participant.',
  },
  {
    question: 'Can MailMyCertificate issue verifiable credentials?',
    answer:
      'No. It produces standard PDF certificates without a public verification portal or QR registry. If recipients must validate credentials through a hosted verification page, a paid platform is the right choice instead.',
  },
] as const;
