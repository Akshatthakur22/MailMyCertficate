import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import { EXCEL_CSV_PAGE_FAQS, EXCEL_CSV_HOW_TO_STEPS } from '@/data/excelCsvPageContent';

const PATH = '/certificate-generator-from-excel';

export const metadata: Metadata = createPageMetadata({
  title: 'Certificate Generator from Excel / CSV — Free & Bulk',
  description:
    'Generate personalized certificates from an Excel spreadsheet or CSV file. Upload your data, build PDFs locally in your browser, and send via Gmail. Free, no account required.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.excelCsv],
  datePublished: PAGE_DATES['/certificate-generator-from-excel'].published,
  dateModified: PAGE_DATES['/certificate-generator-from-excel'].modified,
});

export default function ExcelCsvLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="Certificate Generator from Excel"
        path={PATH}
        faqs={EXCEL_CSV_PAGE_FAQS}
        howToName="How to generate certificates from an Excel or CSV file"
        howToDescription="Export your Excel spreadsheet as CSV, upload it to MailMyCertificate alongside your certificate template, and generate personalized PDFs locally in your browser."
        howToSteps={EXCEL_CSV_HOW_TO_STEPS}
      />
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
