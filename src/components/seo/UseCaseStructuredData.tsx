import { JsonLd } from '@/components/seo/JsonLd';
import type { GuideFaq } from '@/data/guideFaqs';
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildHowToJsonLd,
} from '@/lib/structured-data';

type UseCaseStructuredDataProps = {
  breadcrumbLabel: string;
  path: string;
  faqs: readonly GuideFaq[];
  howToName: string;
  howToDescription: string;
  howToSteps: readonly { name: string; text: string }[];
};

export function UseCaseStructuredData({
  breadcrumbLabel,
  path,
  faqs,
  howToName,
  howToDescription,
  howToSteps,
}: UseCaseStructuredDataProps) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: breadcrumbLabel, path },
        ])}
      />
      <JsonLd data={buildFaqPageJsonLd([...faqs])} />
      <JsonLd
        data={buildHowToJsonLd(howToName, howToDescription, [...howToSteps])}
      />
    </>
  );
}
