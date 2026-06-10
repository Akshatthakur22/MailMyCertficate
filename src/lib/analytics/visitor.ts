const VISITOR_ID_KEY = 'mmc_analytics_visitor_id';
const TOOL_VISIT_COUNT_KEY = 'mmc_tool_visit_count';
const GENERATION_COUNT_KEY = 'mmc_generation_count';
const HAS_ACTIVATED_KEY = 'mmc_has_activated';

function randomId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/** Persistent anonymous visitor ID — no PII. */
export function getVisitorId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

export function incrementToolVisitCount(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const current = parseInt(localStorage.getItem(TOOL_VISIT_COUNT_KEY) ?? '0', 10);
    const next = current + 1;
    localStorage.setItem(TOOL_VISIT_COUNT_KEY, String(next));
    return next;
  } catch {
    return 1;
  }
}

export function getToolVisitCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return parseInt(localStorage.getItem(TOOL_VISIT_COUNT_KEY) ?? '0', 10);
  } catch {
    return 0;
  }
}

export function markActivated(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HAS_ACTIVATED_KEY, '1');
  } catch {
    // ignore
  }
}

export function hasActivated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(HAS_ACTIVATED_KEY) === '1';
  } catch {
    return false;
  }
}

export function incrementGenerationCount(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const current = parseInt(localStorage.getItem(GENERATION_COUNT_KEY) ?? '0', 10);
    const next = current + 1;
    localStorage.setItem(GENERATION_COUNT_KEY, String(next));
    return next;
  } catch {
    return 1;
  }
}

export function getGenerationCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return parseInt(localStorage.getItem(GENERATION_COUNT_KEY) ?? '0', 10);
  } catch {
    return 0;
  }
}
