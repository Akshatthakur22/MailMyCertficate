# SEO setup for MailMyCertificate

Production domain: **https://mailmycertificate.tech**

## What is implemented in code

- `metadataBase` from `NEXT_PUBLIC_APP_URL` (falls back to `.tech`)
- Per-page titles, descriptions, canonical URLs, Open Graph, Twitter cards
- `sitemap.xml` — `/`, `/guide`, `/about`, `/contact`, `/privacy-policy`, `/terms-of-service`
- `robots.txt` — disallows `/tool`, `/email`, `/settings`, `/api/`
- JSON-LD: `WebSite`, `Organization`, `WebApplication` (global)
- JSON-LD on `/guide`: `FAQPage`, `HowTo`, `BreadcrumbList`
- Breadcrumb JSON-LD on `/about` and `/contact`

## Google Search Console (you do this once)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://mailmycertificate.tech`
3. Verify ownership:
   - **HTML tag** — copy the `content` value Google gives you
   - Add to Vercel env: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=that-content`
   - Redeploy
4. Submit sitemap: `https://mailmycertificate.tech/sitemap.xml`
5. Request indexing for:
   - `https://mailmycertificate.tech/`
   - `https://mailmycertificate.tech/guide`

## Bing Webmaster (optional)

Submit the same sitemap URL at [Bing Webmaster Tools](https://www.bing.com/webmasters).

## After launch

- Share the guide on communities (hackathon organizers, Reddit, LinkedIn)
- Link from GitHub README to `https://mailmycertificate.tech/guide`
- Keep page titles unique; avoid duplicate H1s
