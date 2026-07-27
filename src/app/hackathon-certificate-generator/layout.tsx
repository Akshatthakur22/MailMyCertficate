import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import {
  HACKATHON_HOW_TO_STEPS,
  HACKATHON_PAGE_FAQS,
} from '@/data/hackathonPageContent';

const PATH = '/hackathon-certificate-generator';

export const metadata: Metadata = createPageMetadata({
  title: 'Hackathon Certificate Generator — Free & Bulk',
  description:
    'Generate and send hackathon certificates in bulk. Import participants from CSV or Google Sheets, build PDFs locally, and deliver them via Gmail. Free.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.hackathon],
  datePublished: PAGE_DATES['/hackathon-certificate-generator'].published,
  dateModified: PAGE_DATES['/hackathon-certificate-generator'].modified,
});

export default function HackathonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="Hackathon Certificate Generator"
        path={PATH}
        faqs={HACKATHON_PAGE_FAQS}
        howToName="How to generate hackathon certificates in bulk"
        howToDescription="Import participant data from your hackathon registration platform, upload a certificate template, and generate personalized PDFs locally in your browser."
        howToSteps={HACKATHON_HOW_TO_STEPS}
      />
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
