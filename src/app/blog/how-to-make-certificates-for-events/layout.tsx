import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';

const PATH = '/blog/how-to-make-certificates-for-events';

export const metadata: Metadata = createPageMetadata({
  title: 'How to Make Certificates for Events',
  description: 'Step-by-step guide to creating beautiful, personalized certificates for workshops, conferences, and webinars using templates and bulk generation.',
  path: PATH,
  keywords: [
    'event certificates',
    'certificate templates',
    'bulk certificate generation',
    'workshop certificates',
    'webinar certificates',
    'how to make certificates',
    'certificate generator',
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
