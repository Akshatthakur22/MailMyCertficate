import { USER_PLAN } from '@/config/analytics';
import { pushToDataLayer } from './dataLayer';
import type { AnalyticsEvent, UserPlan } from './types';
import { getVisitorId } from './visitor';

/** Omit keys from each member of a discriminated union. */
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

export type TrackEventPayload = DistributiveOmit<AnalyticsEvent, 'visitor_id' | 'user_plan'> &
  Partial<{ visitor_id: string; user_plan: UserPlan }>;

const DEDUPE_MS = 500;
const recentEvents = new Map<string, number>();

function shouldDedupe(eventName: string, dedupeKey?: string): boolean {
  const key = `${eventName}:${dedupeKey ?? ''}`;
  const now = Date.now();
  const last = recentEvents.get(key);
  if (last && now - last < DEDUPE_MS) return true;
  recentEvents.set(key, now);
  return false;
}

export interface TrackOptions {
  /** Skip duplicate events within 500ms (guards React Strict Mode). */
  dedupeKey?: string;
}

/**
 * Central analytics entry point.
 * All tracking flows through dataLayer — never call GA4 from application code.
 */
export function trackEvent(payload: TrackEventPayload, options?: TrackOptions): void {
  if (typeof window === 'undefined') return;

  if (shouldDedupe(payload.event, options?.dedupeKey)) return;

  const enriched = {
    ...payload,
    visitor_id: payload.visitor_id ?? getVisitorId(),
    user_plan: payload.user_plan ?? USER_PLAN,
  };

  pushToDataLayer(enriched as AnalyticsEvent);
}

export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined') return;

  const pageTitle = title ?? document.title;
  const pageLocation = window.location.href;

  trackEvent(
    {
      event: 'virtual_page_view',
      page_path: path,
      page_title: pageTitle,
      page_location: pageLocation,
    },
    { dedupeKey: path }
  );
}
