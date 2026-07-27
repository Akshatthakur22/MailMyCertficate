import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd } from '@/lib/structured-data';
import { absoluteUrl, getAppUrl } from '@/config/site';
import { GUIDE_FAQS } from '@/data/guideFaqs';

export function GuideStructuredData() {
  const appUrl = getAppUrl();

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
      '@id': `${appUrl}/guide#webpage`,
      name: 'How-to Guide - MailMyCertificate',
      description:
        'Complete step-by-step guide for bulk certificate generation, Google Sheets integration, and Gmail delivery.',
      url: absoluteUrl('/guide'),
      isPartOf: {
        '@id': `${appUrl}/#website`,
      },
    },
  ];

  return (
    <>
      <JsonLd data={combinedSchemas} />
    </>
  );
}
