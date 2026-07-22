'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github, X } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/config/github';
import { trackEvent } from '@/lib/analytics';

const DISMISS_KEY = 'mmc_floating_star_dismissed';
const SCROLL_THRESHOLD = 0.5; // Show after 50% scroll

/**
 * A small floating GitHub star pill that appears after the user
 * has scrolled past 50% of the page. Non-intrusive, easily dismissed.
 * Shows on landing page only.
 */
export function FloatingStarWidget() {
  const [visible, setVisible] = useState(false);
  const [userDismissed, setUserDismissed] = useState(false);

  // Check dismissal upfront during render (avoids set-state-in-effect)
  const [initiallyDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const ts = localStorage.getItem(DISMISS_KEY);
      if (ts && Date.now() - parseInt(ts, 10) < 24 * 60 * 60 * 1000) {
        return true;
      }
    } catch { /* ignore */ }
    return false;
  });

  const dismissed = initiallyDismissed || userDismissed;

  useEffect(() => {
    if (dismissed) return;

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPercent > SCROLL_THRESHOLD) {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const handleDismiss = () => {
    setUserDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch { /* ignore */ }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className="flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-full shadow-lg">
        <Link
          href={GITHUB_REPO_URL}
          target="_blank"
          onClick={() => {
            trackEvent({ event: 'github_repo_clicked', source: 'star_prompt' });
          }}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Github size={16} />
          <span>Star on GitHub</span>
        </Link>
        <button
          onClick={handleDismiss}
          className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
