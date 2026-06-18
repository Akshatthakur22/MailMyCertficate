import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import {
  GMAIL_BULK_HOW_TO_STEPS,
  GMAIL_BULK_PAGE_FAQS,
} from '@/data/gmailBulkPageContent';

const PATH = '/send-certificates-gmail-bulk';

export const metadata: Metadata = createPageMetadata({
  title: 'Send Certificates via Gmail in Bulk — Personalized Attachments',
  description:
    'Bulk send personalized certificate PDFs through your Gmail account. OAuth-connected delivery with {{name}} variables, local PDF generation, and send tracking. Free tool for event organizers.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.gmailBulk],
});

export default function GmailBulkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="Send Certificates via Gmail Bulk"
        path={PATH}
        faqs={GMAIL_BULK_PAGE_FAQS}
        howToName="How to bulk send certificates via Gmail"
        howToDescription="Generate certificates locally, connect Gmail OAuth, compose personalized messages, and deliver PDF attachments to each recipient."
        howToSteps={GMAIL_BULK_HOW_TO_STEPS}
      />
      {children}
    </>
  );
}
