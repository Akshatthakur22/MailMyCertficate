import LandingPage from '@/views/landing/LandingPage';
import { JsonLd } from '@/components/seo/JsonLd';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import { buildFaqPageJsonLd } from '@/lib/structured-data';
import { HOME_PAGE_FAQS } from '@/data/homeFaqs';

export default function Home() {
  return (
    <>
      {/* Homepage AEO: FAQPage makes the highest-authority page on the domain
          eligible for featured snippets and People Also Ask. Speakable points
          voice assistants at the definition paragraph and question headings. */}
      <JsonLd data={buildFaqPageJsonLd([...HOME_PAGE_FAQS])} />
      <SpeakableSchema path="/" cssSelectors={['h1', '[data-speakable]']} />
      <LandingPage />
    </>
  );
}
