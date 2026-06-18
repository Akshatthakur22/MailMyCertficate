import { JsonLd } from '@/components/seo/JsonLd';
import { buildEntityGraphJsonLd } from '@/lib/structured-data';

/** Site-wide structured data on every public page */
export function GlobalStructuredData() {
  return <JsonLd data={buildEntityGraphJsonLd()} />;
}
