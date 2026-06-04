import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = createPageMetadata({
  title: 'About — Open Source Certificate Automation',
  description:
    'MailMyCertificate is a free, privacy-first, open-source tool built by an event organizer to generate and email bulk certificates locally in your browser.',
  path: '/about',
  keywords: [...SEO_KEYWORDS.about, 'bulk certificate generator'],
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
