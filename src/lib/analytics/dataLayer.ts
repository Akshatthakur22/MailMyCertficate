import type { AnalyticsEvent } from './types';
import { GA4_MEASUREMENT_ID } from '@/config/analytics';
import { recordEventLocally } from './localCollector';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    __mmcGtmInitialized?: boolean;
  }
}

/** Initialize dataLayer array (SSR-safe). */
export function ensureDataLayer(): Record<string, unknown>[] {
  if (typeof window === 'undefined') {
    return [];
  }
  window.dataLayer = window.dataLayer ?? [];
  return window.dataLayer;
}

/** Push a typed event to dataLayer and fire to GA4 directly. Never throws. */
export function pushToDataLayer(payload: AnalyticsEvent | Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    const layer = ensureDataLayer();
    layer.push(payload as Record<string, unknown>);

    // Record to local analytics store for admin dashboard
    const { event, ...params } = payload as Record<string, unknown>;
    if (typeof event === 'string' && event !== 'gtm.js') {
      recordEventLocally(event, params);

      // Also fire directly to GA4 gtag for immediate event delivery
      if (window.gtag && GA4_MEASUREMENT_ID) {
        window.gtag('event', event, {
          ...params,
          send_to: GA4_MEASUREMENT_ID,
        });
      }
    }
  } catch {
    // Analytics must never break the app
  }
}
