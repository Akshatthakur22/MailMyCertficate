import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { JsonLd } from '@/components/seo/JsonLd';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd } from '@/lib/structured-data';
import { CONTACT_PAGE_FAQS } from '@/data/contactFaqs';
import { PAGE_DATES } from '@/data/pageDates';

const PATH = '/contact';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact MailMyCertificate',
  description:
    'Contact the MailMyCertificate maintainer with questions, feedback or bug reports, or open an issue on GitHub for anything code-related.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.contact],
  datePublished: PAGE_DATES[PATH].published,
  dateModified: PAGE_DATES[PATH].modified,
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: PATH },
        ])}
      />
      <JsonLd data={buildFaqPageJsonLd([...CONTACT_PAGE_FAQS])} />
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
