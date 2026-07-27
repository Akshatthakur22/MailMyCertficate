import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { AboutStructuredData } from '@/components/seo/AboutStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';

export const metadata: Metadata = createPageMetadata({
  title: 'About MailMyCertificate — Who Builds It and Why',
  description:
    'MailMyCertificate is a free, open-source, privacy-first certificate generator built by Akshat Thakur out of a real event organizer workflow.',
  path: '/about',
  keywords: [...SEO_KEYWORDS.about, 'Akshat Thakur'],
  datePublished: PAGE_DATES['/about'].published,
  dateModified: PAGE_DATES['/about'].modified,
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AboutStructuredData />
      <SpeakableSchema path="/about" cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
