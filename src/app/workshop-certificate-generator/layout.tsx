import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import { WORKSHOP_PAGE_FAQS, WORKSHOP_HOW_TO_STEPS } from '@/data/workshopPageContent';

const PATH = '/workshop-certificate-generator';

export const metadata: Metadata = createPageMetadata({
  title: 'Workshop Certificate Generator — Free & Bulk',
  description:
    'Generate and email workshop certificates in bulk. Import attendees from CSV or Google Sheets, build personalized PDFs locally in your browser, and deliver via Gmail. Free.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.workshop],
  datePublished: PAGE_DATES['/workshop-certificate-generator'].published,
  dateModified: PAGE_DATES['/workshop-certificate-generator'].modified,
});

export default function WorkshopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="Workshop Certificate Generator"
        path={PATH}
        faqs={WORKSHOP_PAGE_FAQS}
        howToName="How to generate workshop certificates in bulk"
        howToDescription="Import your workshop attendee list, upload a certificate template, and generate personalized PDFs locally in your browser for every participant."
        howToSteps={WORKSHOP_HOW_TO_STEPS}
      />
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
