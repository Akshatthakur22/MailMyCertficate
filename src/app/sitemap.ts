import { MetadataRoute } from 'next';
import { getAppUrl } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getAppUrl();
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/google-sheets-certificate-generator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/google-forms-to-certificates`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/send-certificates-gmail-bulk`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/hackathon-certificate-generator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/canva-certificate-alternative`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.86,
    },
    {
      url: `${baseUrl}/vs/certifier`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.86,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  return routes;
}
