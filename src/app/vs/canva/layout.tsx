import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import { CANVA_COMPARISON_FAQS, CANVA_HOW_TO_STEPS } from '@/data/canvaComparisonContent';

const PATH = '/vs/canva';

export const metadata: Metadata = createPageMetadata({
  title: 'MailMyCertificate vs Canva — Bulk Certificates Compared',
  description:
    'Canva is great for designing one certificate. MailMyCertificate automates the rest: bulk generate personalized PDFs from your Canva design and send via Gmail. Free.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.canvaComparison],
  datePublished: PAGE_DATES['/vs/canva'].published,
  dateModified: PAGE_DATES['/vs/canva'].modified,
});

export default function CanvaComparisonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="vs Canva"
        path={PATH}
        faqs={CANVA_COMPARISON_FAQS}
        howToName="How to bulk generate certificates after designing in Canva"
        howToDescription="Export your Canva certificate design as PNG, import participant data into MailMyCertificate, and generate hundreds of personalized PDFs locally in seconds."
        howToSteps={CANVA_HOW_TO_STEPS}
      />
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
