import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, buildPageGraph } from '@/lib/structured-data';
import { GUIDE_FAQS } from '@/data/guideFaqs';

export function GuideStructuredData() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Guide', path: '/guide' },
  ]);

  const faqPage = buildFaqPageJsonLd(GUIDE_FAQS);

  // Combine both schemas into a graph for semantic clarity
  const combinedSchemas = [
    breadcrumb as Record<string, unknown>,
    {
      '@type': 'FAQPage',
      mainEntity: faqPage.mainEntity,
    },
    {
      '@type': 'WebPage',
      '@id': 'https://mailmycertificate.tech/guide#webpage',
      name: 'How-to Guide - MailMyCertificate',
      description:
        'Complete step-by-step guide for bulk certificate generation, Google Sheets integration, and Gmail delivery.',
      url: 'https://mailmycertificate.tech/guide',
      isPartOf: {
        '@id': 'https://mailmycertificate.tech#website',
      },
    },
  ];

  return (
    <>
      <JsonLd data={combinedSchemas} />
    </>
  );
}
