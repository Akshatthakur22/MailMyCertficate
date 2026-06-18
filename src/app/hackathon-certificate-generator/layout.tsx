import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import {
  HACKATHON_HOW_TO_STEPS,
  HACKATHON_PAGE_FAQS,
} from '@/data/hackathonPageContent';

const PATH = '/hackathon-certificate-generator';

export const metadata: Metadata = createPageMetadata({
  title: 'Hackathon Certificate Generator — Bulk PDFs & Gmail Delivery',
  description:
    'Generate and email hackathon certificates in minutes. Import judging sheets or Google Forms data, create personalized PDFs locally, and bulk send from your Gmail. Free for organizers.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.hackathon],
});

export default function HackathonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="Hackathon Certificate Generator"
        path={PATH}
        faqs={HACKATHON_PAGE_FAQS}
        howToName="How to generate and send hackathon certificates in bulk"
        howToDescription="Export your hackathon roster, design templates, generate PDFs locally, and deliver certificates via Gmail before your event wrap-up."
        howToSteps={HACKATHON_HOW_TO_STEPS}
      />
      {children}
    </>
  );
}
