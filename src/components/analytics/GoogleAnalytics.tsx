import Script from 'next/script';
import { GA4_DIRECT_ENABLED, GA4_MEASUREMENT_ID } from '@/config/analytics';

/**
 * Direct GA4 gtag.js — loads alongside GTM as a reliability backup.
 * This ensures GA4 receives events even if GTM configuration is incomplete.
 * 
 * Events still flow through dataLayer (picked up by both GTM and gtag).
 * Once GTM GA4 Configuration tag is published, you can optionally remove this.
 */
export function GoogleAnalytics() {
  if (!GA4_DIRECT_ENABLED) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_MEASUREMENT_ID}', {
              send_page_view: false
            });
          `,
        }}
      />
    </>
  );
}
