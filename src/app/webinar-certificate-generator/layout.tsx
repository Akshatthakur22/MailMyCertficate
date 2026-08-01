import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import { WEBINAR_PAGE_FAQS, WEBINAR_HOW_TO_STEPS } from '@/data/webinarPageContent';

const PATH = '/webinar-certificate-generator';

export const metadata: Metadata = createPageMetadata({
  title: 'Webinar Certificate Generator — Free & Bulk',
  description:
    'Generate and email webinar attendance certificates in bulk. Import attendees from Zoom CSV or Google Sheets, build personalized PDFs locally, and deliver via Gmail. Free.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.webinar],
  datePublished: PAGE_DATES['/webinar-certificate-generator'].published,
  dateModified: PAGE_DATES['/webinar-certificate-generator'].modified,
});

export default function WebinarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="Webinar Certificate Generator"
        path={PATH}
        faqs={WEBINAR_PAGE_FAQS}
        howToName="How to generate webinar attendance certificates in bulk"
        howToDescription="Export your Zoom or Google Meet attendee list as CSV, upload a certificate template, and generate personalized PDFs locally in your browser."
        howToSteps={WEBINAR_HOW_TO_STEPS}
      />
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
