import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import { CERTIFYEM_COMPARISON_FAQS, CERTIFYEM_HOW_TO_STEPS } from '@/data/certifyemComparisonContent';

const PATH = '/vs/certifyem';

export const metadata: Metadata = createPageMetadata({
  title: 'MailMyCertificate vs Certify\'em — Free Alternative',
  description:
    'Compare MailMyCertificate and Certify\'em. No Google Workspace install, no certificate limits, no cloud upload of participant data. Free and open source.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.certifyemComparison],
  datePublished: PAGE_DATES['/vs/certifyem'].published,
  dateModified: PAGE_DATES['/vs/certifyem'].modified,
});

export default function CertifyemComparisonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="vs Certify'em"
        path={PATH}
        faqs={CERTIFYEM_COMPARISON_FAQS}
        howToName="How to switch from Certify'em to MailMyCertificate"
        howToDescription="Export your participant CSV from Google Sheets, prepare a PNG/JPG certificate template, and import both into MailMyCertificate to generate and send certificates without a Google Workspace add-on."
        howToSteps={CERTIFYEM_HOW_TO_STEPS}
      />
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
