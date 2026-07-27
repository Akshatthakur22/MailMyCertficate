import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { UseCaseStructuredData } from '@/components/seo/UseCaseStructuredData';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import {
  GOOGLE_FORMS_HOW_TO_STEPS,
  GOOGLE_FORMS_PAGE_FAQS,
} from '@/data/googleFormsPageContent';

const PATH = '/google-forms-to-certificates';

export const metadata: Metadata = createPageMetadata({
  title: 'Google Forms to Certificates — Automated Workflow',
  description:
    'Turn Google Form responses into personalized certificates. Link Forms to Sheets, generate PDFs locally in your browser, then bulk send them via Gmail. Free.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.googleForms],
  datePublished: PAGE_DATES['/google-forms-to-certificates'].published,
  dateModified: PAGE_DATES['/google-forms-to-certificates'].modified,
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
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
