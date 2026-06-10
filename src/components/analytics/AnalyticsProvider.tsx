'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  trackEvent,
  trackPageView,
  incrementToolVisitCount,
} from '@/lib/analytics';

const PAGE_EVENT_MAP: Record<string, () => void> = {
  '/': () => {
    trackEvent({ event: 'landing_page_viewed' }, { dedupeKey: '/' });
  },
  '/contact': () => {
    trackEvent({ event: 'contact_page_viewed' }, { dedupeKey: '/contact' });
  },
  '/tool': () => {
    const visitCount = incrementToolVisitCount();
    const isReturning = visitCount > 1;

    trackEvent(
      { event: 'dashboard_viewed', is_returning: isReturning },
      { dedupeKey: '/tool' }
    );

    if (isReturning) {
      trackEvent(
        { event: 'returning_dashboard_visit', visit_count: visitCount },
        { dedupeKey: `returning-${visitCount}` }
      );
    }
  },
};

/**
 * Tracks virtual pageviews on client-side navigation (App Router).
 * Fires business page events once per route change.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (lastPathRef.current === fullPath) return;
    lastPathRef.current = fullPath;

    trackPageView(pathname);

    const firePageEvent = PAGE_EVENT_MAP[pathname];
    if (firePageEvent) {
      firePageEvent();
    }

    // Pricing page not built yet — hook ready for /pricing
    if (pathname === '/pricing') {
      trackEvent({ event: 'pricing_viewed' }, { dedupeKey: '/pricing' });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
