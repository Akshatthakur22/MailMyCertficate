import type { Metadata } from 'next';
import { absoluteUrl, getAppUrl } from '@/config/site';

const SITE_NAME = 'MailMyCertificate';

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  /** ISO date string for content publish date (e.g. '2024-06-01') */
  datePublished?: string;
  /** ISO date string for last content update (e.g. '2025-07-20') */
  dateModified?: string;
};

/** Consistent per-page SEO metadata */
export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  datePublished,
  dateModified,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  const url = absoluteUrl(canonicalPath);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    // `absolute` opts out of the root layout's "%s | MailMyCertificate" template.
    // Without it the template appends the brand a second time, producing titles
    // like "About MailMyCertificate | MailMyCertificate". Page titles are authored
    // at their final length here (<= 60 chars) so they survive SERP truncation.
    title: { absolute: title },
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonicalPath,
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: absoluteUrl('/og-image.png'),
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - Bulk Certificate Generator`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [absoluteUrl('/og-image.png')],
    },
    ...(datePublished || dateModified
      ? {
          other: {
            ...(datePublished ? { 'article:published_time': datePublished } : {}),
            ...(dateModified ? { 'article:modified_time': dateModified } : {}),
          },
        }
      : {}),
  };
}

export function getRootMetadataBase(): URL {
  return new URL(getAppUrl());
}

export function getGoogleSiteVerification(): Metadata['verification'] | undefined {
  const token = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  if (!token) return undefined;
  return { google: token };
}
