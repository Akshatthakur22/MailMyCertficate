/**
 * Registry of indexable pages plus the contextual link graph between them.
 *
 * The audit found every page exposed an identical 17-18 link targets, i.e. the
 * navbar and footer only, with no in-body contextual linking. That leaves crawlers
 * no signal about which pages are topically related, and leaves readers no path
 * between sibling use-case pages. This map defines that graph in one place.
 */

export type RelatedLink = {
  href: string;
  label: string;
  blurb: string;
};

const PAGE_REGISTRY = {
  guide: {
    href: '/guide',
    label: 'Full step-by-step guide',
    blurb: 'The complete walkthrough: template setup, field mapping, generation and Gmail delivery.',
  },
  googleSheets: {
    href: '/google-sheets-certificate-generator',
    label: 'Google Sheets certificate generator',
    blurb: 'Pull names straight from a public Google Sheets URL instead of exporting a CSV first.',
  },
  googleForms: {
    href: '/google-forms-to-certificates',
    label: 'Google Forms to certificates',
    blurb: 'Turn form responses into certificates, with the Forms to Sheets link explained.',
  },
  gmailBulk: {
    href: '/send-certificates-gmail-bulk',
    label: 'Bulk Gmail delivery',
    blurb: 'How OAuth sending works, what the gmail.send scope covers, and Gmail sending limits.',
  },
  hackathon: {
    href: '/hackathon-certificate-generator',
    label: 'Hackathon certificate generator',
    blurb: 'Winner, runner-up and participation batches for Devfolio, Unstop and MLH-style events.',
  },
  canva: {
    href: '/canva-certificate-alternative',
    label: 'Canva certificate alternative',
    blurb: 'Keep designing in Canva, then automate the per-attendee merge you would otherwise do by hand.',
  },
  certifier: {
    href: '/vs/certifier',
    label: 'MailMyCertificate vs Certifier',
    blurb: 'An honest side-by-side, including the cases where Certifier is the better choice.',
  },
  vsCanva: {
    href: '/vs/canva',
    label: 'MailMyCertificate vs Canva',
    blurb: 'When to use Canva for design, when to use MailMyCertificate for bulk automation, and how to combine both.',
  },
  vsCertifyem: {
    href: '/vs/certifyem',
    label: 'MailMyCertificate vs CertifyEM',
    blurb: 'Feature-by-feature comparison for event managers, with pricing and use-case guidance.',
  },
  workshop: {
    href: '/workshop-certificate-generator',
    label: 'Workshop certificate generator',
    blurb: 'Best practices for creating and sending certificates to workshop participants at scale.',
  },
  webinar: {
    href: '/webinar-certificate-generator',
    label: 'Webinar certificate generator',
    blurb: 'Generate certificates for online events with optional attendance tracking and bulk delivery.',
  },
  excel: {
    href: '/certificate-generator-from-excel',
    label: 'Certificate generator from Excel/CSV',
    blurb: 'Import participant data directly from Excel, CSV, or any spreadsheet format.',
  },
  templates: {
    href: '/free-certificate-templates',
    label: 'Free certificate templates',
    blurb: 'Browse ready-made certificate designs for events, courses, achievements, and recognition.',
  },
  blog: {
    href: '/blog',
    label: 'Blog & guides',
    blurb: 'Articles on certificate creation, bulk delivery, best practices, and tool comparisons.',
  },
  about: {
    href: '/about',
    label: 'About the project',
    blurb: 'Who builds MailMyCertificate, why it exists, and how the local-first architecture works.',
  },
  contact: {
    href: '/contact',
    label: 'Contact the maintainer',
    blurb: 'Questions, bug reports and feature requests, answered by the person who wrote the code.',
  },
  privacy: {
    href: '/privacy-policy',
    label: 'Privacy policy',
    blurb: 'Exactly what stays on your device, what Google receives, and what is never collected.',
  },
} as const satisfies Record<string, RelatedLink>;

export type PageKey = keyof typeof PAGE_REGISTRY;

/** Contextual "related pages" graph. Each page points at topically adjacent pages. */
export const RELATED_PAGES = {
  home: ['guide', 'googleSheets', 'hackathon', 'certifier', 'workshop', 'blog'],
  guide: ['googleSheets', 'googleForms', 'gmailBulk', 'canva', 'excel', 'blog'],
  googleSheets: ['googleForms', 'guide', 'gmailBulk', 'canva', 'excel', 'workshop'],
  googleForms: ['googleSheets', 'guide', 'gmailBulk', 'hackathon', 'workshop', 'webinar'],
  gmailBulk: ['guide', 'googleSheets', 'hackathon', 'privacy', 'blog', 'excel'],
  hackathon: ['gmailBulk', 'googleForms', 'canva', 'guide', 'webinar', 'blog'],
  canva: ['guide', 'googleSheets', 'hackathon', 'certifier', 'vsCanva', 'workshop'],
  workshop: ['guide', 'googleSheets', 'webinar', 'hackathon', 'templates', 'blog'],
  webinar: ['googleForms', 'workshop', 'excel', 'templates', 'blog', 'guide'],
  excel: ['googleSheets', 'guide', 'gmailBulk', 'templates', 'workshop', 'blog'],
  templates: ['workshop', 'webinar', 'excel', 'canva', 'blog', 'guide'],
  blog: ['guide', 'workshop', 'webinar', 'excel', 'templates', 'contact'],
  certifier: ['canva', 'guide', 'privacy', 'about', 'vsCanva', 'vsCertifyem'],
  vsCanva: ['certifier', 'canva', 'guide', 'vsCertifyem', 'templates', 'blog'],
  vsCertifyem: ['certifier', 'vsCanva', 'workshop', 'webinar', 'blog', 'guide'],
  about: ['guide', 'privacy', 'contact', 'certifier', 'blog', 'contact'],
  contact: ['guide', 'about', 'privacy', 'certifier', 'blog', 'contact'],
} as const satisfies Record<string, readonly PageKey[]>;

export type RelatedPagesKey = keyof typeof RELATED_PAGES;

export function getRelatedPages(key: RelatedPagesKey): RelatedLink[] {
  return RELATED_PAGES[key].map((pageKey) => PAGE_REGISTRY[pageKey]);
}
