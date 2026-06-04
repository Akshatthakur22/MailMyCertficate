import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildOrganizationJsonLd,
  buildWebApplicationJsonLd,
  buildWebSiteJsonLd,
} from '@/lib/structured-data';

/** Site-wide structured data on every public page */
export function GlobalStructuredData() {
  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildWebApplicationJsonLd()} />
    </>
  );
}
