import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';

const PATH = '/blog/best-free-certificate-generators';

export const metadata: Metadata = createPageMetadata({
  title: 'Best Free Certificate Generators 2026',
  description: 'Compare free certificate generators for bulk creation and email delivery. Learn which tools are best for events, hackathons, workshops, and training programs.',
  path: PATH,
  keywords: [
    'free certificate generators',
    'best certificate tools',
    'certificate generator comparison',
    'free certificate software',
    'bulk certificate generator',
    'certificate creation tools',
    'online certificate maker',
  ],
  datePublished: PAGE_DATES[PATH].published,
  dateModified: PAGE_DATES[PATH].modified,
});

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
