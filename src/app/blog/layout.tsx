import { Metadata } from 'next';
import { PAGE_DATES } from '@/data/pageDates';
import { buildSpeakableJsonLd } from '@/lib/structured-data';

const PAGE_NAME = '/blog';

export const metadata: Metadata = {
  title: 'MailMyCertificate Blog | Certificate Generation Tips & Guides',
  description: 'Learn best practices for creating and sending certificates in bulk. Read guides on certificate templates, event management, and certificate automation.',
  keywords: ['certificate blog', 'certificate guides', 'bulk certificate tips', 'certificate templates', 'event certificates'],
  alternates: {
    canonical: `https://mailmycertificate.tech${PAGE_NAME}`,
  },
  openGraph: {
    title: 'MailMyCertificate Blog',
    description: 'Certificate generation tips, guides, and best practices',
    url: `https://mailmycertificate.tech${PAGE_NAME}`,
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = buildSpeakableJsonLd(PAGE_NAME, ['h1', 'h2', '[data-speakable]']);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
