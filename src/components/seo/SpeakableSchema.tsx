import { JsonLd } from '@/components/seo/JsonLd';
import { buildSpeakableJsonLd } from '@/lib/structured-data';

type SpeakableSchemaProps = {
  path: string;
  /** CSS selectors pointing to the most voice-friendly content on the page */
  cssSelectors?: string[];
};

/**
 * Adds SpeakableSpecification JSON-LD for voice search targeting.
 * Place on pages with concise, answer-style content (FAQs, guides, use-case pages).
 */
export function SpeakableSchema({ path, cssSelectors }: SpeakableSchemaProps) {
  return <JsonLd data={buildSpeakableJsonLd(path, cssSelectors)} />;
}
