import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import {
  GMAIL_BULK_HOW_TO_STEPS,
  GMAIL_BULK_PAGE_FAQS,
} from '@/data/gmailBulkPageContent';

const PATH = '/send-certificates-gmail-bulk';

export const metadata: Metadata = createPageMetadata({
  title: 'Send Certificates by Gmail in Bulk — Free',
  description:
    'Send personalized certificate PDFs via Gmail in bulk. Connect your own Google account and deliver hundreds of certificates with no third-party mail service.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.gmailBulk],
  datePublished: PAGE_DATES['/send-certificates-gmail-bulk'].published,
  dateModified: PAGE_DATES['/send-certificates-gmail-bulk'].modified,
});

export default function GmailBulkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="Send Certificates via Gmail"
        path={PATH}
        faqs={GMAIL_BULK_PAGE_FAQS}
        howToName="How to send certificates by Gmail in bulk"
        howToDescription="Generate personalized PDF certificates locally and send them as attachments from your own Gmail account using OAuth."
        howToSteps={GMAIL_BULK_HOW_TO_STEPS}
      />
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
