import { JsonLd } from '@/components/seo/JsonLd';
import { GUIDE_FAQS, GUIDE_HOW_TO_STEPS } from '@/data/guideFaqs';
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, buildHowToJsonLd } from '@/lib/structured-data';

export function GuideStructuredData() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'User Guide', path: '/guide' },
        ])}
      />
      <JsonLd data={buildFaqPageJsonLd(GUIDE_FAQS)} />
      <JsonLd
        data={buildHowToJsonLd(
          'How to generate and send bulk certificates with MailMyCertificate',
          'Upload a template, import participants, generate PDFs in your browser, and optionally send via Gmail.',
          GUIDE_HOW_TO_STEPS
        )}
      />
    </>
  );
}
