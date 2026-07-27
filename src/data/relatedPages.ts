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
  home: ['guide', 'googleSheets', 'hackathon', 'certifier'],
  guide: ['googleSheets', 'googleForms', 'gmailBulk', 'canva'],
  googleSheets: ['googleForms', 'guide', 'gmailBulk', 'canva'],
  googleForms: ['googleSheets', 'guide', 'gmailBulk', 'hackathon'],
  gmailBulk: ['guide', 'googleSheets', 'hackathon', 'privacy'],
  hackathon: ['gmailBulk', 'googleForms', 'canva', 'guide'],
  canva: ['guide', 'googleSheets', 'hackathon', 'certifier'],
  certifier: ['canva', 'guide', 'privacy', 'about'],
  about: ['guide', 'privacy', 'contact', 'certifier'],
  contact: ['guide', 'about', 'privacy', 'certifier'],
} as const satisfies Record<string, readonly PageKey[]>;

export type RelatedPagesKey = keyof typeof RELATED_PAGES;

export function getRelatedPages(key: RelatedPagesKey): RelatedLink[] {
  return RELATED_PAGES[key].map((pageKey) => PAGE_REGISTRY[pageKey]);
}
