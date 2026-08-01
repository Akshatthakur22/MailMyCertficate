import { MetadataRoute } from 'next';
import { getAppUrl } from '@/config/site';
import { PAGE_DATES } from '@/data/pageDates';

/**
 * Dynamic sitemap.
 *
 * lastModified uses the actual content-modification date from PAGE_DATES
 * instead of new Date() at build time. Google treats identical timestamps
 * across all URLs as an unreliable signal and deprioritises crawling them.
 * Real dates tell Googlebot which pages were genuinely updated.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getAppUrl();

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(PAGE_DATES['/'].modified),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(PAGE_DATES['/guide'].modified),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/google-sheets-certificate-generator`,
      lastModified: new Date(PAGE_DATES['/google-sheets-certificate-generator'].modified),
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/google-forms-to-certificates`,
      lastModified: new Date(PAGE_DATES['/google-forms-to-certificates'].modified),
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/send-certificates-gmail-bulk`,
      lastModified: new Date(PAGE_DATES['/send-certificates-gmail-bulk'].modified),
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/hackathon-certificate-generator`,
      lastModified: new Date(PAGE_DATES['/hackathon-certificate-generator'].modified),
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/canva-certificate-alternative`,
      lastModified: new Date(PAGE_DATES['/canva-certificate-alternative'].modified),
      changeFrequency: 'monthly',
      priority: 0.86,
    },
    {
      url: `${baseUrl}/vs/certifier`,
      lastModified: new Date(PAGE_DATES['/vs/certifier'].modified),
      changeFrequency: 'monthly',
      priority: 0.86,
    },
    // New comparison pages
    {
      url: `${baseUrl}/vs/canva`,
      lastModified: new Date(PAGE_DATES['/vs/canva'].modified),
      changeFrequency: 'monthly',
      priority: 0.86,
    },
    {
      url: `${baseUrl}/vs/certifyem`,
      lastModified: new Date(PAGE_DATES['/vs/certifyem'].modified),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    // New use-case landing pages
    {
      url: `${baseUrl}/workshop-certificate-generator`,
      lastModified: new Date(PAGE_DATES['/workshop-certificate-generator'].modified),
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/webinar-certificate-generator`,
      lastModified: new Date(PAGE_DATES['/webinar-certificate-generator'].modified),
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/certificate-generator-from-excel`,
      lastModified: new Date(PAGE_DATES['/certificate-generator-from-excel'].modified),
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    // Template gallery
    {
      url: `${baseUrl}/free-certificate-templates`,
      lastModified: new Date(PAGE_DATES['/free-certificate-templates'].modified),
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    // Blog
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(PAGE_DATES['/blog'].modified),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog/how-to-make-certificates-for-events`,
      lastModified: new Date(PAGE_DATES['/blog/how-to-make-certificates-for-events'].modified),
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${baseUrl}/blog/how-to-send-certificates-to-participants`,
      lastModified: new Date(PAGE_DATES['/blog/how-to-send-certificates-to-participants'].modified),
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${baseUrl}/blog/best-free-certificate-generators`,
      lastModified: new Date(PAGE_DATES['/blog/best-free-certificate-generators'].modified),
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    // Core pages
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(PAGE_DATES['/about'].modified),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(PAGE_DATES['/contact'].modified),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(PAGE_DATES['/privacy-policy'].modified),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(PAGE_DATES['/terms-of-service'].modified),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  return routes;
}
