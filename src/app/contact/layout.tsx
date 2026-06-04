import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact',
  description:
    'Contact the MailMyCertificate maintainer for questions, feedback, bug reports, or collaboration on the open-source certificate generator.',
  path: '/contact',
  keywords: [...SEO_KEYWORDS.contact],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      {children}
    </>
  );
}
