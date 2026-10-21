import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';

const PATH = '/blog/how-to-send-certificates-to-participants';

export const metadata: Metadata = createPageMetadata({
  title: 'How to Send Certificates to Participants',
  description: 'Bulk send personalized PDF certificates through Gmail. Generate PDFs in your browser; recipient details and attachments pass through the API for delivery.',
  path: PATH,
  keywords: [
    'send certificates',
    'bulk email certificates',
    'Gmail certificate delivery',
    'participant certificates',
    'batch certificate sending',
    'certificate email delivery',
    'automated certificate sending',
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
