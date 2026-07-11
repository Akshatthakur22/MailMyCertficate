import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { GuideStructuredData } from '@/components/seo/GuideStructuredData';

export const metadata: Metadata = createPageMetadata({
  title: 'How to Generate Bulk Certificates from CSV & Google Sheets — MailMyCertificate',
  description:
    'Step-by-step guide to generate personalized PDF certificates from CSV or Google Sheets, customize fields, and bulk email via Gmail. Privacy-first, runs locally in your browser.',
  path: '/guide',
  keywords: [...SEO_KEYWORDS.guide, ...SEO_KEYWORDS.home.slice(0, 4)],
});

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GuideStructuredData />
      {children}
    </>
  );
}
