'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Github, X } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/config/github';
import { trackEvent } from '@/lib/analytics';

interface GitHubStarBannerProps {
  /** Where this banner appears — for analytics */
  placement: 'post_upload' | 'post_csv' | 'post_generation' | 'landing' | 'guide' | 'about';
  /** Visual style */
  variant?: 'inline' | 'floating' | 'card';
  /** Custom message */
  message?: string;
  /** Allow dismissal */
  dismissible?: boolean;
  className?: string;
}

const DISMISS_KEY = 'mmc_star_banner_dismissed';

function isDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const ts = localStorage.getItem(DISMISS_KEY);
    if (!ts) return false;
    // 7-day cooldown for banner dismissal
    return Date.now() - parseInt(ts, 10) < 7 * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/**
 * Lightweight GitHub star CTA that appears throughout the user journey.
 * Non-intrusive, warm, and encouraging. Different from the modal-style
 * GitHubStarPrompt (which shows post-generation with more ceremony).
 */
export function GitHubStarBanner({
  placement,
  variant = 'inline',
  message,
  dismissible = true,
  className = '',
}: GitHubStarBannerProps) {
  const [dismissed, setDismissed] = useState(() => isDismissed());

  if (dismissed) return null;

  const defaultMessages: Record<string, string> = {
    post_upload: 'Like what you see? Help us grow.',
    post_csv: 'This tool is free and open source. A star helps others find it.',
    post_generation: 'Just saved you hours. Consider starring the repo?',
    landing: 'Open source and free forever. Star us on GitHub.',
    guide: 'Find this guide helpful? Star the project on GitHub.',
    about: 'Support the project with a GitHub star.',
  };

  const text = message || defaultMessages[placement] || defaultMessages.landing;

  const handleClick = () => {
    trackEvent({
      event: 'github_repo_clicked',
      source: 'star_prompt',
    });
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch { /* ignore */ }
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-40 max-w-xs animate-fade-in-up ${className}`}>
        <div className="bg-muted border border-border rounded-xl p-4 shadow-lg relative">
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-secondary hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          )}
          <p className="text-sm text-secondary mb-3 pr-4">{text}</p>
          <Link
            href={GITHUB_REPO_URL}
            target="_blank"
            onClick={handleClick}
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground bg-background border border-border px-4 py-2 rounded-lg hover:border-accent transition-colors"
          >
            <Github size={15} />
            Star on GitHub
          </Link>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`border border-border rounded-xl p-6 bg-muted/50 ${className}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">{text}</p>
            <p className="text-xs text-secondary">Every star helps organizers discover this tool.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={GITHUB_REPO_URL}
              target="_blank"
              onClick={handleClick}
              className="inline-flex items-center gap-2 text-sm font-semibold bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Github size={15} />
              Star
            </Link>
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="text-secondary hover:text-foreground transition-colors p-1"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: inline — minimal one-liner
  return (
    <div className={`flex items-center justify-between gap-3 py-3 px-4 bg-muted/40 border border-border/60 rounded-lg text-sm ${className}`}>
      <span className="text-secondary">{text}</span>
      <Link
        href={GITHUB_REPO_URL}
        target="_blank"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-accent transition-colors shrink-0"
      >
        <Github size={13} />
        Star
      </Link>
    </div>
  );
}
