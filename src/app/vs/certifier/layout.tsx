import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import {
  CERTIFIER_COMPARISON_HOW_TO_STEPS,
  CERTIFIER_COMPARISON_FAQS,
} from '@/data/certifierComparisonPageContent';

const PATH = '/vs/certifier';

export const metadata: Metadata = createPageMetadata({
  title: 'MailMyCertificate vs Certifier — Honest Comparison for Organizers',
  description:
    'Compare MailMyCertificate and Certifier for bulk certificates: privacy, pricing, Gmail delivery, verification, and when each tool fits event organizers.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.certifierComparison],
});

export default function VsCertifierLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="MailMyCertificate vs Certifier"
        path={PATH}
        faqs={CERTIFIER_COMPARISON_FAQS}
        howToName="How to choose between MailMyCertificate and Certifier"
        howToDescription="Evaluate privacy, cost, verification needs, and delivery workflow before picking a bulk certificate platform."
        howToSteps={CERTIFIER_COMPARISON_HOW_TO_STEPS}
      />
      {children}
    </>
  );
}
