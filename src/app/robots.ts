import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';

/**
 * Authoritative robots directives.
 *
 * NOTE: a static public/robots.txt silently takes precedence over this route in
 * Next.js. That file has been removed so this remains the single source of truth.
 *
 * /tool is deliberately NOT disallowed. It carries `noIndex: true` in its own
 * layout metadata, and a crawler has to be able to fetch the page to see that
 * directive. Disallowing it instead would leave the many internal CTA links
 * pointing at an uncrawlable URL, which Google reports as "indexed, though
 * blocked by robots.txt" rather than excluding it cleanly.
 *
 * /email, /settings and /admin are private application surfaces with no public
 * content, so blocking the crawl outright is the correct posture for those.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/email', '/settings', '/admin'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
