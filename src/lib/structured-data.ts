import { absoluteUrl, getAppUrl } from '@/config/site';
import type { GuideFaq } from '@/data/guideFaqs';

const GITHUB_REPO = 'https://github.com/akshatthakur22/MailMyCertficate';
const FOUNDER_GITHUB = 'https://github.com/akshatthakur22';
const FOUNDER_TWITTER = 'https://twitter.com/akshatt66612958';

/** Unified entity graph for Organization, Person, WebSite, and SoftwareApplication. */
export function buildEntityGraphJsonLd() {
  const appUrl = getAppUrl();

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${appUrl}/#organization`,
        name: 'MailMyCertificate',
        alternateName: ['Mail My Certificate', 'MailMyCert'],
        url: appUrl,
        logo: absoluteUrl('/logo.png'),
        description:
          'Open-source privacy-first bulk certificate generator for event organizers and educators.',
        founder: { '@id': `${appUrl}/#founder` },
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
        ],
      },
      {
        '@type': 'Person',
        '@id': `${appUrl}/#founder`,
        name: 'Akshat Thakur',
        url: FOUNDER_GITHUB,
        sameAs: [FOUNDER_GITHUB, FOUNDER_TWITTER],
      },
      {
        '@type': 'WebSite',
        '@id': `${appUrl}/#website`,
        url: appUrl,
        name: 'MailMyCertificate',
        description:
          'Free, privacy-first bulk certificate generator. Create and email personalized certificates in your browser.',
        publisher: { '@id': `${appUrl}/#organization` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${appUrl}/#software`,
        name: 'MailMyCertificate',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: appUrl,
        codeRepository: GITHUB_REPO,
        license: 'https://opensource.org/licenses/MIT',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Generate hundreds of personalized certificates from a template and CSV. Privacy-first, runs in your browser.',
        featureList: [
          'Client-side PDF certificate generation',
          'CSV and Google Sheets import',
          'Gmail bulk delivery',
          'IndexedDB session recovery',
        ],
        author: { '@id': `${appUrl}/#organization` },
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
