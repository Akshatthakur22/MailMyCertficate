import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';

/**
 * Authoritative robots directives.
 *
 * AI crawler rules:
 * The default wildcard (*) already allows all crawlers, but explicitly listing
 * AI bots with Allow: / signals that we WANT these crawlers to index and cite
 * our content. This matters because some AI bots check for explicit permission
 * before including a site in their training/retrieval pipeline.
 *
 * /tool is deliberately NOT disallowed. It carries noIndex:true in its own
 * layout metadata, and a crawler must fetch the page to discover that directive.
 * Blocking it in robots.txt instead produces "indexed, though blocked by robots"

* coverage errors in Search Console.
 *
 * /email, /settings and /admin are private app surfaces with no public content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all crawlers, block private app surfaces
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/email', '/settings', '/admin'],
      },
      // OpenAI / ChatGPT
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/email', '/settings', '/admin'],
      },
      // OpenAI image/browsing
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/email', '/settings', '/admin'],
      },
      // Google Gemini / AI Overviews
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/email', '/settings', '/admin'],
      },
      // Perplexity AI
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/email', '/settings', '/admin'],
      },
      // Anthropic Claude
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/email', '/settings', '/admin'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/email', '/settings', '/admin'],
      },
      // Common Crawl (used by many AI training datasets)
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/email', '/settings', '/admin'],
      },
      // Bing Copilot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/email', '/settings', '/admin'],
      },
      // Meta AI
      {
        userAgent: 'FacebookBot',
        allow: '/',
        disallow: ['/api/', '/email', '/settings', '/admin'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
