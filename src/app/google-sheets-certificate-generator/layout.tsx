import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import {
  GOOGLE_SHEETS_HOW_TO_STEPS,
  GOOGLE_SHEETS_PAGE_FAQS,
} from '@/data/googleSheetsPageContent';

const PATH = '/google-sheets-certificate-generator';

export const metadata: Metadata = createPageMetadata({
  title: 'Google Sheets Certificate Generator — Bulk PDFs & Gmail Send',
  description:
    'Generate personalized certificates from a public Google Sheets URL. Import form responses, create PDFs locally in your browser, and send bulk Gmail delivery. Free and privacy-first.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.googleSheets],
});

export default function GoogleSheetsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="Google Sheets Certificate Generator"
        path={PATH}
        faqs={GOOGLE_SHEETS_PAGE_FAQS}
        howToName="How to generate certificates from Google Sheets"
        howToDescription="Use a public Google Sheet URL with MailMyCertificate to create personalized PDF certificates locally and optionally send them via Gmail."
        howToSteps={GOOGLE_SHEETS_HOW_TO_STEPS}
      />
      {children}
    </>
  );
}
