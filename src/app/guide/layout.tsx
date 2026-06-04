import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { GuideStructuredData } from '@/components/seo/GuideStructuredData';

export const metadata: Metadata = createPageMetadata({
  title: 'User Guide — Bulk Certificates from CSV & Google Sheets',
  description:
    'Complete guide: upload a certificate template, import CSV or Google Sheets, generate personalized PDFs in your browser, and send bulk certificates with Gmail. Free and privacy-first.',
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
