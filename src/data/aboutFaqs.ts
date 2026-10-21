export const ABOUT_PAGE_FAQS = [
  {
    question: 'Is MailMyCertificate free to use?',
    answer:
      'Yes. MailMyCertificate is free and open source. Certificate generation runs in your browser; public Sheets import and optional Gmail delivery use the backend.',
  },
  {
    question: 'Who built MailMyCertificate?',
    answer:
      'MailMyCertificate was created by Akshat Thakur, a full-stack engineer and open-source contributor. It started as a Python automation script for a college event and evolved into a web tool to solve the bulk certificate problem for event organizers worldwide.',
  },
  {
    question: 'Where is my data stored?',
    answer:
      'CSV rows, templates, and generated PDFs are stored in your browser. Public Sheets imports pass through our backend, and Gmail delivery sends recipient details and attachments through our backend to Google.',
  },
  {
    question: 'Can I use MailMyCertificate for commercial events?',
    answer:
      'Absolutely. The MIT license allows commercial use, modification, and distribution. Whether you\'re running a hackathon, workshop, conference, or corporate training event, MailMyCertificate is built for it.',
  },
  {
    question: 'How many certificates can I generate?',
    answer:
      'The practical limit depends on your browser\'s memory and your internet connection (for email sending). Most users process 50–500 certificates in a batch. Larger batches are possible but may take longer.',
  },
  {
    question: 'Do you store participant emails?',
    answer:
      'Participant emails are used in your browser to prepare the send queue and are sent with each message request through our backend to Gmail. The application code does not intentionally save recipient addresses in its database, though operational logging outside this codebase may vary.',
  },
  {
    question: 'Can I contribute to the project?',
    answer:
      'Yes! MailMyCertificate is fully open source on GitHub. Contributions, bug reports, and feature requests are always welcome. See the GitHub repository for contribution guidelines.',
  },
  {
    question: 'How do I send certificates via email?',
    answer:
      'You can connect your Gmail account via OAuth. MailMyCertificate acts as a client to your Gmail account, sending certificates on your behalf. No additional credentials or app passwords needed.',
  },
];
