/**
 * analyticsService.ts
 * ───────────────────────────────────────────────────────────────────────────
 * Central bridge between the browser and the backend analytics store.
 *
 * Design goals:
 *  - NEVER throws or blocks the calling code — analytics must not break the app
 *  - Batches rapid events with a 200ms debounce to avoid flooding /api/analytics/event
 *  - Attaches visitor_id and analytics_session_id to every call
 *  - Also attaches the same IDs as request headers on email sends (X-Analytics-*)
 *  - Provides a thin typed wrapper around the /api/admin/* endpoints
 */

import { getVisitorId } from '@/lib/analytics/visitor';

// ─── Stable analytics session ID ──────────────────────────────────────────────
// Different from the product session (IndexedDB). This is a lightweight ID
// that groups all browser events in one tab session. Persists across SPA navigations
// but resets on true page reload / new tab.
const _analyticsSessionId: string = (() => {
  try {
    const key = 'mmc_asid';
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : `as_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `as_${Date.now()}`;
  }
})();

export function getAnalyticsSessionId(): string {
  return _analyticsSessionId;
}

// ─── Allowed frontend event names ─────────────────────────────────────────────
export type FrontendEventName =
  | 'page_viewed'
  | 'tool_opened'
  | 'template_selected'
  | 'csv_uploaded'
  | 'certificate_generation_started'
  | 'certificate_generated'
  | 'certificate_downloaded'
  | 'returning_user';

// ─── Event queue / debounce ────────────────────────────────────────────────────
interface QueuedEvent {
  event_name: FrontendEventName;
  meta?: Record<string, unknown>;
}

let _queue: QueuedEvent[] = [];
let _flushTimer: ReturnType<typeof setTimeout> | null = null;

function _scheduleFlush() {
  if (_flushTimer) return;
  _flushTimer = setTimeout(_flush, 200);
}

async function _flush() {
  _flushTimer = null;
  if (_queue.length === 0) return;

  const batch = _queue.splice(0);
  const visitorId = getVisitorId();

  for (const item of batch) {
    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          event_name: item.event_name,
          visitor_id: visitorId,
          session_id: _analyticsSessionId,
          meta: item.meta ?? {},
        }),
      });
    } catch {
      // Silently swallow — analytics never breaks the app
    }
  }
}

// ─── Public tracking API ───────────────────────────────────────────────────────

/**
 * Record an analytics event to the backend.
 * Fire-and-forget — never awaited by callers.
 */
export function trackBackendEvent(
  event_name: FrontendEventName,
  meta?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return;
  _queue.push({ event_name, meta });
  _scheduleFlush();
}

/**
 * Track a page view + unique visitor in one call.
 * Called from AnalyticsProvider on every route change.
 */
export function trackPageView(): void {
  trackBackendEvent('page_viewed');
}

// ─── Email send headers (attach to every /api/send-email request) ──────────────
/**
 * Returns the two analytics headers the backend needs to attribute
 * email events to the right visitor/session.
 */
export function getAnalyticsHeaders(): Record<string, string> {
  const visitorId = getVisitorId();
  const headers: Record<string, string> = {
    'X-Analytics-Session-Id': _analyticsSessionId,
  };
  if (visitorId) {
    headers['X-Analytics-Visitor-Id'] = visitorId;
  }
  return headers;
}

// ─── OAuth login URL helpers ───────────────────────────────────────────────────
/**
 * Appends visitor_id and analytics_session_id to the OAuth login request
 * so the backend can record oauth_started against the right visitor.
 */
export function buildLoginUrl(baseUrl: string): string {
  const visitorId = getVisitorId();
  const params = new URLSearchParams();
  if (visitorId) params.set('visitor_id', visitorId);
  params.set('analytics_session_id', _analyticsSessionId);
  const sep = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${sep}${params.toString()}`;
}

// ─── Admin API client ──────────────────────────────────────────────────────────

export interface AdminOverview {
  range: string;
  today: Record<string, number>;
  period: Record<string, number>;
  db_available: boolean;
}

export interface AdminTrend {
  date: string;
  unique_visitors: number;
  tool_opens: number;
  certs_generated: number;
  cert_count: number;
  email_attempts: number;
  email_success: number;
  email_failed: number;
  oauth_success: number;
}

export interface AdminEvent {
  id: string;
  ts: number;
  event_name: string;
  visitor_id: string | null;
  user_id: string | null;
  session_id: string | null;
  source: string;
  success: number;
  error_code: string | null;
  meta: string | null;
}

export interface AdminUser {
  user_id: string;
  user_email: string | null;
  first_seen: number;
  last_active: number;
  google_authed: number;
  total_certs: number;
  total_email_attempts: number;
  total_email_success: number;
  total_email_failed: number;
}

export interface AdminHealth {
  db_available: boolean;
  backend: string;
  total_events?: number;
  analytics_module_ready: boolean;
  password_configured: boolean;
}

async function _adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.error ?? `HTTP ${res.status}`), { status: res.status, code: body.code });
  }
  return res.json();
}

export const adminApi = {
  /** Check if the browser has an active admin session. */
  async status(): Promise<{ authenticated: boolean; has_password_configured: boolean }> {
    return _adminFetch('/api/admin/auth/status');
  },

  /** Login with password. Returns { success: true } or throws. */
  async login(password: string): Promise<{ success: boolean }> {
    return _adminFetch('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },

  /** Logout the admin session. */
  async logout(): Promise<void> {
    await _adminFetch('/api/admin/auth/logout', { method: 'POST' });
  },

  /** KPI overview. range: today | 7d | 30d | all */
  async overview(range: 'today' | '7d' | '30d' | 'all' = 'all'): Promise<AdminOverview> {
    return _adminFetch(`/api/admin/overview?range=${range}`);
  },

  /** Daily trend data. days: 7 | 30 | 90 */
  async trends(days: 7 | 30 | 90 = 30): Promise<{ days: number; data: AdminTrend[] }> {
    return _adminFetch(`/api/admin/trends?days=${days}`);
  },

  /** Recent events feed. */
  async events(limit = 50): Promise<{ events: AdminEvent[]; count: number }> {
    return _adminFetch(`/api/admin/events?limit=${limit}`);
  },

  /** Authenticated user list. */
  async users(limit = 50, offset = 0): Promise<{ users: AdminUser[]; count: number; offset: number }> {
    return _adminFetch(`/api/admin/users?limit=${limit}&offset=${offset}`);
  },

  /** Event timeline for one user. */
  async userJourney(userId: string): Promise<{ user_id: string; events: AdminEvent[] }> {
    return _adminFetch(`/api/admin/users/${encodeURIComponent(userId)}/journey`);
  },

  /** Analytics system health. */
  async health(): Promise<AdminHealth> {
    return _adminFetch('/api/admin/health');
  },
};
