import {
  GITHUB_STAR_PROMPT_COOLDOWN_MS,
  GITHUB_STAR_PROMPT_MIN_CERTIFICATES,
} from '@/config/github';
import { getGenerationCount } from '@/lib/analytics';

const DISMISSED_AT_KEY = 'mmc_github_star_prompt_dismissed_at';
const SHOWN_SESSION_KEY = 'mmc_github_star_prompt_shown_session';

function readDismissedAt(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DISMISSED_AT_KEY);
    if (!raw) return null;
    const ts = parseInt(raw, 10);
    return Number.isFinite(ts) ? ts : null;
  } catch {
    return null;
  }
}

/** True when the user dismissed the prompt within the 30-day cooldown window. */
export function isGitHubStarPromptInCooldown(): boolean {
  const dismissedAt = readDismissedAt();
  if (!dismissedAt) return false;
  return Date.now() - dismissedAt < GITHUB_STAR_PROMPT_COOLDOWN_MS;
}

/** Persist dismissal timestamp for the 30-day cooldown. */
export function dismissGitHubStarPrompt(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
  } catch {
    // ignore storage failures
  }
}

/** Prevent showing the prompt twice in one browser tab session (e.g. generate then download). */
export function hasGitHubStarPromptShownThisSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SHOWN_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function markGitHubStarPromptShownThisSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SHOWN_SESSION_KEY, '1');
  } catch {
    // ignore
  }
}

/**
 * Eligibility: meaningful batch (20+ certs) or a returning generator (2nd+ successful run).
 */
export function isEligibleForGitHubStarPrompt(certificatesCount: number): boolean {
  if (certificatesCount <= 0) return false;
  if (certificatesCount >= GITHUB_STAR_PROMPT_MIN_CERTIFICATES) return true;
  return getGenerationCount() > 1;
}

export function shouldShowGitHubStarPrompt(certificatesCount: number): boolean {
  if (typeof window === 'undefined') return false;
  if (isGitHubStarPromptInCooldown()) return false;
  if (hasGitHubStarPromptShownThisSession()) return false;
  return isEligibleForGitHubStarPrompt(certificatesCount);
}
