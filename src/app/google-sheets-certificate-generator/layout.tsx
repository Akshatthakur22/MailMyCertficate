import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import {
  GOOGLE_SHEETS_HOW_TO_STEPS,
  GOOGLE_SHEETS_PAGE_FAQS,
} from '@/data/googleSheetsPageContent';

const PATH = '/google-sheets-certificate-generator';

export const metadata: Metadata = createPageMetadata({
  title: 'Google Sheets Certificate Generator — Free',
  description:
    'Generate personalized certificates straight from a public Google Sheets URL. PDFs are created locally in your browser, then sent in bulk via Gmail. Free.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.googleSheets],
  datePublished: PAGE_DATES['/google-sheets-certificate-generator'].published,
  dateModified: PAGE_DATES['/google-sheets-certificate-generator'].modified,
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
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
