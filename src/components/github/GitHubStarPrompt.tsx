'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GITHUB_REPO_URL } from '@/config/github';
import { trackEvent } from '@/lib/analytics';
import type { GitHubStarPromptTrigger } from '@/lib/analytics';
import {
  dismissGitHubStarPrompt,
  markGitHubStarPromptShownThisSession,
  shouldShowGitHubStarPrompt,
} from '@/lib/github/starPrompt';
import { Github } from 'lucide-react';

interface GitHubStarPromptProps {
  trigger: GitHubStarPromptTrigger;
  certificatesCount: number;
}

/**
 * Non-blocking appreciation prompt after certificate success milestones.
 * SSR-safe: eligibility and storage are evaluated only on the client.
 */
export function GitHubStarPrompt({ trigger, certificatesCount }: GitHubStarPromptProps) {
  const [visible, setVisible] = useState(false);
  const trackedShownRef = useRef(false);

  useEffect(() => {
    if (!shouldShowGitHubStarPrompt(certificatesCount)) return;

    setVisible(true);
    markGitHubStarPromptShownThisSession();

    if (trackedShownRef.current) return;
    trackedShownRef.current = true;

    trackEvent(
      {
        event: 'github_star_prompt_shown',
        trigger,
        certificates_count: certificatesCount,
      },
      { dedupeKey: `star-prompt-${trigger}-${certificatesCount}` }
    );
  }, [trigger, certificatesCount]);

  const handleStarClick = () => {
    trackEvent(
      {
        event: 'github_repo_clicked',
        source: 'star_prompt',
        trigger,
      },
      { dedupeKey: `star-prompt-click-${trigger}` }
    );
    window.open(GITHUB_REPO_URL, '_blank', 'noopener,noreferrer');
    setVisible(false);
  };

  const handleDismiss = () => {
    dismissGitHubStarPrompt();
    trackEvent(
      {
        event: 'github_star_prompt_dismissed',
        trigger,
        certificates_count: certificatesCount,
      },
      { dedupeKey: `star-prompt-dismiss-${trigger}` }
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="mt-8 max-w-lg mx-auto rounded-2xl border border-border/50 bg-muted/20 p-5 text-left animate-in fade-in slide-in-from-bottom-4 duration-500"
      role="region"
      aria-label="Support MailMyCertificate on GitHub"
    >
      <div className="flex items-start gap-3">
        <Github className="mt-0.5 h-5 w-5 shrink-0 text-foreground/70" aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-6 text-secondary">
            MailMyCertificate is open source and free. If it saved you time today, a GitHub star
            helps other organizers discover it.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              type="button"
              size="sm"
              onClick={handleStarClick}
              className="gap-2 rounded-xl"
            >
              ⭐ Star on GitHub
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="rounded-xl text-secondary"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
