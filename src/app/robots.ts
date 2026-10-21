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
 * App pages that carry noindex metadata remain crawlable so search engines can
 * see and honor the directive. robots.txt only blocks API endpoints; it is not
 * an access-control mechanism.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow crawlers to see page-level noindex directives; block API routes.
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // OpenAI / ChatGPT
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/'],
      },
      // OpenAI image/browsing
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/'],
      },
      // Google Gemini / AI Overviews
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/'],
      },
      // Perplexity AI
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/'],
      },
      // Anthropic Claude
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/'],
      },
      // Common Crawl (used by many AI training datasets)
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/'],
      },
      // Bing Copilot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/'],
      },
      // Meta AI
      {
        userAgent: 'FacebookBot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
