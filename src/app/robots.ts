import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/tool', '/email', '/api/'], // Wizard steps and internal APIs shouldn't be indexed
            },
        ],
        sitemap: 'https://mailmycertificate.com/sitemap.xml',
    };
}
