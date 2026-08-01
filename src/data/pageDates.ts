/**
 * Single source of truth for content publish / update dates.
 *
 * Consumed by:
 *  - route layouts, which feed `datePublished` / `dateModified` into createPageMetadata
 *    (emitted as article:published_time / article:modified_time)
 *  - the <LastUpdated /> component, which renders the same date visibly for readers
 *
 * Keeping both readers on one map prevents the metadata date and the on-page date
 * from drifting apart, which is a trust signal for both crawlers and AI engines.
 */

export type PageDates = {
  published: string;
  modified: string;
};

export const PAGE_DATES = {
  '/': { published: '2024-01-01', modified: '2026-07-27' },
  '/guide': { published: '2024-06-01', modified: '2026-07-27' },
  '/google-sheets-certificate-generator': { published: '2024-08-01', modified: '2026-07-27' },
  '/google-forms-to-certificates': { published: '2024-08-01', modified: '2026-07-27' },
  '/send-certificates-gmail-bulk': { published: '2024-08-15', modified: '2026-07-27' },
  '/hackathon-certificate-generator': { published: '2024-08-15', modified: '2026-07-27' },
  '/canva-certificate-alternative': { published: '2024-09-01', modified: '2026-07-27' },
  '/vs/certifier': { published: '2024-09-15', modified: '2026-07-27' },
  '/vs/canva': { published: '2026-07-31', modified: '2026-07-31' },
  '/vs/certifyem': { published: '2026-07-31', modified: '2026-07-31' },
  '/workshop-certificate-generator': { published: '2026-07-31', modified: '2026-07-31' },
  '/webinar-certificate-generator': { published: '2026-07-31', modified: '2026-07-31' },
  '/certificate-generator-from-excel': { published: '2026-07-31', modified: '2026-07-31' },
  '/free-certificate-templates': { published: '2026-07-31', modified: '2026-07-31' },
  '/blog': { published: '2026-07-31', modified: '2026-07-31' },
  '/blog/how-to-make-certificates-for-events': { published: '2026-07-31', modified: '2026-07-31' },
  '/blog/how-to-send-certificates-to-participants': { published: '2026-07-31', modified: '2026-07-31' },
  '/blog/best-free-certificate-generators': { published: '2026-07-31', modified: '2026-07-31' },
  '/about': { published: '2024-01-01', modified: '2026-07-27' },
  '/contact': { published: '2024-01-01', modified: '2026-07-27' },
  '/privacy-policy': { published: '2024-01-01', modified: '2026-07-27' },
  '/terms-of-service': { published: '2024-01-01', modified: '2026-07-27' },
} as const satisfies Record<string, PageDates>;

export type DatedPath = keyof typeof PAGE_DATES;

export function getPageDates(path: DatedPath): PageDates {
  return PAGE_DATES[path];
}

/** Human-readable form for on-page display, e.g. "27 July 2026". */
export function formatPageDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const monthName = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ][month - 1];
  return `${day} ${monthName} ${year}`;
}
