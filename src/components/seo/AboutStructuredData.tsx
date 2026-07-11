import { JsonLd } from '@/components/seo/JsonLd';
import { ABOUT_PAGE_FAQS } from '@/data/aboutFaqs';
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd } from '@/lib/structured-data';

export function AboutStructuredData() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      <JsonLd data={buildFaqPageJsonLd(ABOUT_PAGE_FAQS)} />
    </>
  );
}
