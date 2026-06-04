'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { SessionSummary } from '@/types/session';
import {
  detectRecoverableSession,
  markRecoveryDecided,
  restoreSession,
  startNewBatch,
  subscribeSessionSync,
  cleanupExpiredSessions,
} from '@/core/session/sessionManager';
import { hydrateSessionFromIDB } from '@/core/session/sessionHydration';
import { SessionRecoveryModal } from './SessionRecoveryModal';
import { useAppStore } from '@/store/useAppStore';

const SKIP_RECOVERY_PREFIXES = ['/privacy-policy', '/terms-of-service'];

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await cleanupExpiredSessions();

      const skip =
        SKIP_RECOVERY_PREFIXES.some((prefix) => pathname?.startsWith(prefix)) ?? false;

      if (!skip) {
        const recoverable = await detectRecoverableSession();
        if (mounted && recoverable) {
          setSummary(recoverable);
          return;
        }
      }

      const sessionId = useAppStore.getState().sessionId;
      await hydrateSessionFromIDB(sessionId).catch(() => {});
      if (mounted) setSummary(null);
    };

    const timer = setTimeout(() => {
      init().catch(() => {});
    }, 0);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    return subscribeSessionSync(
      () => {
        window.location.reload();
      },
      () => {
        window.location.reload();
      }
    );
  }, []);

  const handleContinue = useCallback(async () => {
    if (!summary) return;
    setBusy(true);
    try {
      await restoreSession(summary);
      setSummary(null);
      if (summary.workflowStage === 'EMAIL_SETUP' || summary.workflowStage === 'SENDING' || summary.workflowStage === 'COMPLETED') {
        router.push('/email');
      } else if (pathname === '/') {
        router.push('/tool');
      }
    } finally {
      setBusy(false);
    }
  }, [summary, router, pathname]);

  const handleStartNew = useCallback(async () => {
    setBusy(true);
    try {
      await startNewBatch();
      setSummary(null);
      markRecoveryDecided();
      router.push('/tool');
    } finally {
      setBusy(false);
    }
  }, [router]);

  return (
    <>
      {children}
      {summary && (
        <SessionRecoveryModal
          summary={summary}
          onContinue={handleContinue}
          onStartNew={handleStartNew}
          busy={busy}
        />
      )}
    </>
  );
}
