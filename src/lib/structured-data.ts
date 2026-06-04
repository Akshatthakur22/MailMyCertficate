import { absoluteUrl, getAppUrl } from '@/config/site';
import type { GuideFaq } from '@/data/guideFaqs';

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MailMyCertificate',
    url: getAppUrl(),
    logo: absoluteUrl('/logo.png'),
    sameAs: ['https://github.com/akshatthakur22/MailMyCertficate'],
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MailMyCertificate',
    url: getAppUrl(),
    description:
      'Free, privacy-first bulk certificate generator. Create and email personalized certificates in your browser.',
    publisher: {
      '@type': 'Organization',
      name: 'MailMyCertificate',
    },
  };
}

export function buildWebApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MailMyCertificate',
    url: getAppUrl(),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Generate hundreds of personalized certificates from a template and CSV. Privacy-first, runs in your browser.',
    featureList: [
      'Bulk PDF certificate generation',
      'CSV and Google Sheets import',
      'Gmail bulk delivery',
      'Local browser storage',
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
