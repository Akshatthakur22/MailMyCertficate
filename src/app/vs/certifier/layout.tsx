import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import { CERTIFIER_COMPARISON_FAQS } from '@/data/certifierComparisonContent';

const PATH = '/vs/certifier';

export const metadata: Metadata = createPageMetadata({
  title: 'MailMyCertificate vs Certifier — Honest Comparison',
  description:
    'Compare MailMyCertificate and Certifier on pricing, privacy, verification and bulk delivery, including the cases where Certifier is the better choice.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.certifierComparison],
  datePublished: PAGE_DATES['/vs/certifier'].published,
  dateModified: PAGE_DATES['/vs/certifier'].modified,
});

export default function CertifierComparisonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="vs Certifier"
        path={PATH}
        faqs={CERTIFIER_COMPARISON_FAQS}
        howToName="How to switch from Certifier to MailMyCertificate"
        howToDescription="Export your participant list from Certifier, prepare your template, and import into MailMyCertificate for free, private certificate generation."
        howToSteps={[
          { name: 'Export participant CSV from Certifier', text: 'Download your recipient list as CSV from your Certifier dashboard.' },
          { name: 'Prepare your certificate template', text: 'Export your Certifier template design as PNG/JPG, or create a new one in Canva or Figma.' },
          { name: 'Import into MailMyCertificate', text: 'Upload the template, import the CSV, and map name/email columns to certificate fields.' },
          { name: 'Generate and send', text: 'Create all PDFs locally in your browser and send via Gmail or download as ZIP.' },
        ]}
      />
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
