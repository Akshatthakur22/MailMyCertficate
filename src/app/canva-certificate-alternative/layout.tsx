import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import {
  CANVA_ALTERNATIVE_HOW_TO_STEPS,
  CANVA_ALTERNATIVE_FAQS,
} from '@/data/canvaAlternativePageContent';

const PATH = '/canva-certificate-alternative';

export const metadata: Metadata = createPageMetadata({
  title: 'Canva Certificate Alternative — Bulk Generate & Email PDFs',
  description:
    'Design once in Canva, bulk-generate personalized certificates in MailMyCertificate. Stop manual copy-paste per attendee. Free, local-first, Gmail delivery.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.canvaAlternative],
  datePublished: PAGE_DATES['/canva-certificate-alternative'].published,
  dateModified: PAGE_DATES['/canva-certificate-alternative'].modified,
});

export default function CanvaAlternativeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="Canva Certificate Alternative"
        path={PATH}
        faqs={CANVA_ALTERNATIVE_FAQS}
        howToName="How to automate certificates after designing in Canva"
        howToDescription="Export a Canva template as PNG or JPG, import participant data, and batch-generate personalized certificates locally."
        howToSteps={CANVA_ALTERNATIVE_HOW_TO_STEPS}
      />
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
