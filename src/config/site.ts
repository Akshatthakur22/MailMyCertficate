/**
 * Single source of truth for public app URL (marketing + OAuth + metadata).
 * Set APP_URL or NEXT_PUBLIC_APP_URL in production (e.g. https://mailmycertificate.tech).
 */
export const PRODUCTION_APP_URL = 'https://mailmycertificate.tech';

export function getAppUrl(): string {
  const fromEnv =
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }

  if (process.env.VERCEL_ENV === 'production') {
    return PRODUCTION_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    const vercelUrl = process.env.VERCEL_URL.replace(/\/$/, '');
    return vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  return PRODUCTION_APP_URL;
}

/** Build absolute URL for metadata, sitemap, JSON-LD */
export function absoluteUrl(path: string = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getAppUrl()}${normalized}`;
}
