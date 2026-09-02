import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = createPageMetadata({
  title: 'Certificate Blog — Tips, Guides & Tutorials',
  description: 'Learn best practices for creating and sending certificates in bulk. Read guides on certificate templates, event management, and certificate automation.',
  path: '/blog',
  keywords: [
    'certificate generation',
    'bulk certificates',
    'certificate templates',
    'certificate automation',
    'event certificates',
    'certificate tips',
    'certificate guides',
  ],
  datePublished: PAGE_DATES['/blog'].published,
  dateModified: PAGE_DATES['/blog'].modified,
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
