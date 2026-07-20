import { absoluteUrl, getAppUrl } from '@/config/site';
import type { GuideFaq } from '@/data/guideFaqs';

const GITHUB_REPO = 'https://github.com/akshatthakur22/MailMyCertficate';
const FOUNDER_GITHUB = 'https://github.com/akshatthakur22';
const FOUNDER_TWITTER = 'https://twitter.com/akshatt66612958';
const FOUNDER_LINKEDIN = 'https://www.linkedin.com/in/akshatthakur22/';
const FOUNDER_EMAIL = 'mailto:akshatthakur22@gmail.com';

/** Unified entity graph for Organization, Person, WebSite, and SoftwareApplication. ADIS-compliant. */
export function buildEntityGraphJsonLd() {
  const appUrl = getAppUrl();

  return {
    '@context': 'https://schema.org',
    '@graph': [
      // Creator/Developer — Akshat Thakur
      {
        '@type': 'Person',
        '@id': `${appUrl}/#creator`,
        name: 'Akshat Thakur',
        givenName: 'Akshat',
        familyName: 'Thakur',
        url: FOUNDER_GITHUB,
        email: FOUNDER_EMAIL,
        jobTitle: 'Software Developer',
        description:
          'Software developer focused on building scalable web applications, AI-powered products, developer tools, and educational platforms.',
        image: absoluteUrl('/logo.png'),
        sameAs: [FOUNDER_GITHUB, FOUNDER_TWITTER, FOUNDER_LINKEDIN],
        knowsAbout: [
          'Web Development',
          'Full Stack Development',
          'AI Integration',
          'Python',
          'TypeScript',
          'Next.js',
          'React',
          'Privacy-First Software',
          'Certificate Automation',
          'Cloud Infrastructure',
        ],
        worksFor: { '@id': `${appUrl}/#organization` },
      },
      // Organization/Project
      {
        '@type': 'Organization',
        '@id': `${appUrl}/#organization`,
        name: 'MailMyCertificate',
        alternateName: ['Mail My Certificate', 'MailMyCert'],
        url: appUrl,
        logo: absoluteUrl('/logo.png'),
        description:
          'Open-source privacy-first bulk certificate generator for event organizers and educators. Created by Akshat Thakur.',
        creator: { '@id': `${appUrl}/#creator` },
        founder: { '@id': `${appUrl}/#creator` },
        sameAs: [GITHUB_REPO, FOUNDER_TWITTER, FOUNDER_GITHUB],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: absoluteUrl('/contact'),
        },
        knowsAbout: [
          'Bulk certificate generation',
          'Google Sheets mail merge',
          'Gmail API integration',
          'Privacy-first web applications',
          'Event automation',
          'Certificate workflows',
        ],
        // ADIS compliance statement
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'MailMyCertificate Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Certificate Generation',
                description: 'Client-side PDF certificate generation from templates',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Gmail Delivery',
                description: 'Send certificates via Gmail with full OAuth transparency',
              },
            },
          ],
        },
      },
      // Website
      {
        '@type': 'WebSite',
        '@id': `${appUrl}/#website`,
        url: appUrl,
        name: 'MailMyCertificate',
        alternateName: 'Mail My Certificate',
        description:
          'Free, privacy-first bulk certificate generator. Create and email personalized certificates in your browser.',
        publisher: { '@id': `${appUrl}/#organization` },
        creator: { '@id': `${appUrl}/#creator` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${appUrl}/guide?q={search_term_string}`,
          },
          query_input: 'required name=search_term_string',
        },
      },
      // Software Application
      {
        '@type': 'SoftwareApplication',
        '@id': `${appUrl}/#software`,
        name: 'MailMyCertificate',
        description:
          'Generate hundreds of personalized certificates from a template and CSV. Privacy-first, runs in your browser. Created by Akshat Thakur.',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'CertificateGenerator',
        operatingSystem: 'Web',
        url: appUrl,
        codeRepository: GITHUB_REPO,
        license: 'https://opensource.org/licenses/MIT',
        creator: { '@id': `${appUrl}/#creator` },
        author: { '@id': `${appUrl}/#organization` },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Client-side PDF certificate generation (no server uploads)',
          'CSV and Google Sheets import with privacy guarantees',
          'Gmail OAuth bulk delivery integration',
          'IndexedDB session recovery and persistence',
          'Local-first architecture (data stays on device)',
          'No participant data collection or storage',
          'Open source codebase for transparency',
          'AI/ML data protection guarantees (2026 compliance)',
        ],
        screenshot: absoluteUrl('/og-image.png'),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '1',
          description: 'Privacy-first certificate automation platform',
        },
        downloadUrl: appUrl,
        inLanguage: 'en-US',
        datePublished: '2024-01-01',
        isAccessibleForFree: true,
        isBasedOnUrl: undefined, // Original project (no fork)
      },
      // About Page content as CreativeWork
      {
        '@type': 'CreativeWork',
        '@id': `${appUrl}/about#work`,
        name: 'MailMyCertificate Origin Story',
        description:
          'MailMyCertificate was built from a real organizer workflow during a college event with 300+ participants. Designed to solve certificate generation problems without requiring participant data uploads.',
        creator: { '@id': `${appUrl}/#creator` },
        author: { '@id': `${appUrl}/#creator` },
        mainEntity: { '@id': `${appUrl}/#organization` },
        url: absoluteUrl('/about'),
      },
    ],
  };
}

export function buildFaqPageJsonLd(faqs: GuideFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildHowToJsonLd(
  name: string,
  description: string,
  steps: { name: string; text: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Build a multi-schema array for pages (e.g., breadcrumb + article) */
export function buildPageGraph(schemas: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}

/** Build an Article schema for blog/guide posts */
export function buildArticleJsonLd({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
}: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}) {
  return {
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    image: image ? absoluteUrl(image) : undefined,
    url: absoluteUrl(url),
  };
}
