import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { GuideStructuredData } from '@/components/seo/GuideStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';

export const metadata: Metadata = createPageMetadata({
  title: 'How to Generate Bulk Certificates from CSV or Sheets',
  description:
    'Step-by-step guide to generating personalized PDF certificates from CSV or Google Sheets and bulk emailing them via Gmail. Runs locally in your browser.',
  path: '/guide',
  keywords: [...SEO_KEYWORDS.guide, ...SEO_KEYWORDS.home.slice(0, 4)],
  datePublished: PAGE_DATES['/guide'].published,
  dateModified: PAGE_DATES['/guide'].modified,
});

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GuideStructuredData />
      <SpeakableSchema path="/guide" cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
