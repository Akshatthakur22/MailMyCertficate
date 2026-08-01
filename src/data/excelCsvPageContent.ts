export const EXCEL_CSV_PAGE_FAQS = [
  {
    question: 'Can I generate certificates from an Excel spreadsheet?',
    answer:
      'Yes. Export your Excel file as CSV (File → Save As → CSV UTF-8), then upload that CSV into MailMyCertificate. Map your name and email columns to certificate fields and generate all PDFs locally in your browser.',
  },
  {
    question: 'What CSV format does MailMyCertificate accept?',
    answer:
      'Standard CSV with a header row. The first row should contain column names like "name", "email", "event". Any delimiter-separated file exported from Excel, Google Sheets, or any spreadsheet tool works.',
  },
  {
    question: 'Do I need to reformat my Excel data before importing?',
    answer:
      'Usually not. MailMyCertificate auto-detects column headers. Clean up duplicate rows and check that name capitalisation is consistent — what you import is exactly what prints on each certificate.',
  },
  {
    question: 'Is there a row limit for CSV files?',
    answer:
      'No artificial limit. Generation runs in your browser using Web Workers, so the practical limit is your device memory. Batches of 500–1,000 rows are routine.',
  },
  {
    question: 'Can I use Google Sheets instead of uploading a CSV?',
    answer:
      'Yes. Make your sheet publicly viewable (Share → Anyone with the link → Viewer) and paste the URL directly into MailMyCertificate. No download or export step needed.',
  },
  {
    question: 'Can I generate certificates from multiple Excel sheets in one batch?',
    answer:
      'Combine the rows you want into one sheet and export as a single CSV. MailMyCertificate processes one import per session, so merging beforehand is the cleanest approach.',
  },
] as const;

export const EXCEL_CSV_HOW_TO_STEPS = [
  {
    name: 'Prepare your Excel or CSV file',
    text: 'Open your spreadsheet and ensure it has a header row with at least a "name" column. Add an "email" column if you want to send certificates directly. Export as CSV if starting from Excel.',
  },
  {
    name: 'Upload your certificate template',
    text: 'Design your certificate in Canva, PowerPoint, or any tool and export as PNG or JPG. Upload this template file to MailMyCertificate.',
  },
  {
    name: 'Import your CSV or paste Google Sheets URL',
    text: 'Click the CSV upload zone and select your file, or paste a public Google Sheets URL. Column headers are auto-detected.',
  },
  {
    name: 'Map columns to certificate fields',
    text: 'Drag text fields (name, event, date, etc.) onto the certificate canvas and position them exactly where each value should appear.',
  },
  {
    name: 'Generate and deliver',
    text: 'Click Generate. All PDFs are created locally in your browser. Download as ZIP or send each certificate to the email address in the corresponding row via Gmail.',
  },
] as const;
