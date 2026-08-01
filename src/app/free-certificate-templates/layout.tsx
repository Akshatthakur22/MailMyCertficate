import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { PAGE_DATES } from '@/data/pageDates';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { JsonLd } from '@/components/seo/JsonLd';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd } from '@/lib/structured-data';

const PATH = '/free-certificate-templates';

const TEMPLATE_PAGE_FAQS = [
  {
    question: 'What certificate template format does MailMyCertificate use?',
    answer: 'PNG or JPG image files. Design your certificate in Canva, Figma, PowerPoint, or any design tool, then export as PNG or JPG. MailMyCertificate uses your image as the background and overlays personalized text fields per participant.',
  },
  {
    question: 'Can I use a Canva template with MailMyCertificate?',
    answer: 'Yes. Design your certificate in Canva, leave the participant name area blank, and export as PNG. Upload that PNG to MailMyCertificate as your template.',
  },
  {
    question: 'What size should my certificate template be?',
    answer: 'Landscape orientation at 1920×1080 pixels (1080p) or higher works well for both digital delivery and printing. A4 at 300 DPI (3508×2480px) is best for print-quality certificates.',
  },
];

export const metadata: Metadata = createPageMetadata({
  title: 'Free Certificate Templates — Download PNG for Bulk Generation',
  description:
    'Free certificate templates in PNG format. Download a blank design, customise in Canva or Figma, and use with MailMyCertificate to bulk generate personalized certificates.',
  path: PATH,
  keywords: [...SEO_KEYWORDS.templates],
  datePublished: PAGE_DATES['/free-certificate-templates'].published,
  dateModified: PAGE_DATES['/free-certificate-templates'].modified,
});

export default function FreeTemplatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Free Certificate Templates', path: PATH },
      ])} />
      <JsonLd data={buildFaqPageJsonLd(TEMPLATE_PAGE_FAQS)} />
      <SpeakableSchema path={PATH} cssSelectors={['h1', 'h2', '[data-speakable]']} />
      {children}
    </>
  );
}
