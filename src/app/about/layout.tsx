import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = createPageMetadata({
  title: 'About MailMyCertificate',
  description:
    'MailMyCertificate is a free, privacy-first, open-source certificate generator built by Akshat Thakur from a real event organizer workflow.',
  path: '/about',
  keywords: [...SEO_KEYWORDS.about, 'Akshat Thakur'],
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
