'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  trackEvent,
  trackPageView,
  incrementToolVisitCount,
} from '@/lib/analytics';
import { trackPageView as trackPageViewBackend, trackBackendEvent } from '@/services/analyticsService';

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
      // Track returning user to backend analytics
      trackBackendEvent('returning_user', { visit_count: visitCount });
    }
  },
};

/**
 * Client-side route analytics — mounted as a sibling to page content
 * so marketing routes stay server-rendered with semantic HTML.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    trackPageView(pathname);
    // Also send page view to our backend for real visitor counting
    trackPageViewBackend();

    const firePageEvent = PAGE_EVENT_MAP[pathname];
    if (firePageEvent) {
      firePageEvent();
    }

    if (pathname === '/pricing') {
      trackEvent({ event: 'pricing_viewed' }, { dedupeKey: '/pricing' });
    }

    // Tool opens are high-value events — record to backend
    if (pathname === '/tool') {
      trackBackendEvent('tool_opened');
    }
  }, [pathname]);

  return null;
}

/** @deprecated Use AnalyticsTracker as a layout sibling instead of wrapping children. */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnalyticsTracker />
      {children}
    </>
  );
}
