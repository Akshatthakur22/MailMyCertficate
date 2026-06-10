import type { AnalyticsEvent } from './types';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
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

/** Push a typed event to dataLayer. Never throws. */
export function pushToDataLayer(payload: AnalyticsEvent | Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    const layer = ensureDataLayer();
    layer.push(payload as Record<string, unknown>);
  } catch {
    // Analytics must never break the app
  }
}
