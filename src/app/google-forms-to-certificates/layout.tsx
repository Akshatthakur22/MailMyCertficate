import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import {
  GOOGLE_FORMS_HOW_TO_STEPS,
  GOOGLE_FORMS_PAGE_FAQS,
} from '@/data/googleFormsPageContent';

const PATH = '/google-forms-to-certificates';

export const metadata: Metadata = createPageMetadata({
  title: 'Google Forms to Certificates — Automated PDF & Email Workflow',
  description:
    'Turn Google Form responses into personalized certificates. Link to Sheets, import in MailMyCertificate, generate PDFs locally, and send bulk Gmail delivery. Free and privacy-first.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.googleForms],
});

export default function GoogleFormsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UseCaseStructuredData
        breadcrumbLabel="Google Forms to Certificates"
        path={PATH}
        faqs={GOOGLE_FORMS_PAGE_FAQS}
        howToName="How to create certificates from Google Forms responses"
        howToDescription="Link Google Forms to Sheets, import participant data in MailMyCertificate, and generate personalized certificates locally."
        howToSteps={GOOGLE_FORMS_HOW_TO_STEPS}
      />
      {children}
    </>
  );
}
