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
    // 3.8 — Address AI/automation anxiety directly; names the unasked objection upfront
    question: 'Does this use AI on my data?',
    answer:
      'MailMyCertificate does not use AI to generate certificates. PDF rendering happens in your browser. Public Google Sheets imports are fetched through our backend, and Gmail delivery sends recipient details and PDF attachments through our backend to Google.',
  },
  {
    question: 'How do I generate certificates in bulk?',
    answer:
      'Export your certificate design as a PNG or JPG, then import your participant list as a CSV file or a public Google Sheets URL. Drag name and event fields onto the template, and generate every PDF in one batch.',
  },
  {
    question: 'Is my participant data uploaded anywhere?',
    answer:
      'CSV rows and generated PDFs are stored in your browser for generation and download. Public Google Sheets data passes through our backend during import. If you send email, recipient details, message content, and PDF attachments pass through our backend to Gmail.',
  },
  {
    question: 'How many certificates can I generate at once?',
    answer:
      'There is no artificial limit. Because generation happens locally, the practical ceiling is your own device memory rather than a plan tier. Batches of several hundred are routine for hackathons and workshops.',
  },
  // 3.8 — Address implicit "what's the catch" skepticism directly; naming objection = stronger trust move
  {
    question: 'Why is this free? What\'s the catch?',
    answer:
      'No catch. MailMyCertificate is MIT-licensed open-source software created to solve a real problem — the certificate automation headache after events. It is funded by the creator solving their own problem, not VC. You can read the entire codebase on GitHub to verify.',
  },
  {
    question: 'Do I need a Google account to use it?',
    answer:
      'Only if you want to email the certificates. Generating and downloading them as a ZIP file needs no account at all. Gmail delivery uses your Google account via OAuth, requesting gmail.send plus OpenID and profile/email scopes to identify the connected account.',
  },
  {
    question: 'What file format should my certificate template be?',
    answer:
      'A PNG or JPG image. Design it in Canva, Figma or any editor, then export as an image rather than a PDF. Leave the name and event areas blank so those can be filled per participant.',
  },
] as const;
