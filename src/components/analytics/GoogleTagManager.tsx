import Script from 'next/script';
import { GTM_ENABLED, GTM_ID } from '@/config/analytics';

/**
 * Google Tag Manager — injected exactly once at the root layout.
 *
 * - Head script uses afterInteractive (SSR-safe, no hydration mismatch on script tag)
 * - Noscript iframe is a real DOM element (not dangerouslySetInnerHTML) for body placement
 * - dataLayer is initialized before gtm.js loads
 * - window.__mmcGtmInitialized prevents duplicate injection if layout re-mounts
 */
export function GoogleTagManager() {
  if (!GTM_ENABLED) return null;

  return (
    <>
      <Script
        id="gtm-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            if (!window.__mmcGtmInitialized) {
              window.__mmcGtmInitialized = true;
              window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
            }
          `,
        }}
      />
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (!document.getElementById('gtm-external-script')) {
              (function(w,d,s,l,i){
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                j.id='gtm-external-script';
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            }
          `,
        }}
      />
    </>
  );
}

export function GoogleTagManagerNoscript() {
  if (!GTM_ENABLED) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
