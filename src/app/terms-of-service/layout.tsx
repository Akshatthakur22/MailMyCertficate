import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = createPageMetadata({
  title: 'Terms of Service — MailMyCertificate',
  description:
    'MailMyCertificate terms of service: usage conditions for the free, open-source certificate generator, MIT licence terms, and your Gmail OAuth responsibilities.',
  path: '/terms-of-service',
  keywords: [...SEO_KEYWORDS.terms],
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Terms of Service', path: '/terms-of-service' },
        ])}
      />
      {children}
    </>
  );
}
