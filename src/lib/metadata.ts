import type { Metadata } from 'next';
import { absoluteUrl, getAppUrl } from '@/config/site';

const SITE_NAME = 'MailMyCertificate';

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

/** Consistent per-page SEO metadata */
export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  const url = absoluteUrl(canonicalPath);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
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
