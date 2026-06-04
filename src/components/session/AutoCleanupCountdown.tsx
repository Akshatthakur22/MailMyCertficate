'use client';

import { useEffect, useState } from 'react';
import { Timer, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  cancelAutoCleanup,
  cleanupCurrentSession,
  scheduleAutoCleanup,
  startNewBatch,
} from '@/core/session/sessionManager';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';

interface AutoCleanupCountdownProps {
  active: boolean;
  onKeepSession: () => void;
}

export function AutoCleanupCountdown({ active, onKeepSession }: AutoCleanupCountdownProps) {
  const router = useRouter();
  const sessionId = useAppStore((state) => state.sessionId);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!active || dismissed) return;

    const cancel = scheduleAutoCleanup(
      sessionId,
      (seconds) => setSecondsLeft(seconds),
      async () => {
        await cleanupCurrentSession(sessionId);
        await startNewBatch();
        router.push('/tool');
      }
    );

    return cancel;
  }, [active, dismissed, sessionId, router]);

  if (!active || dismissed) return null;

  const handleKeep = async () => {
    await cancelAutoCleanup(sessionId);
    setDismissed(true);
    onKeepSession();
  };

  const handleClearNow = async () => {
    await cleanupCurrentSession(sessionId);
    await startNewBatch();
    router.push('/tool');
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <Timer className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            This session will be removed automatically in{' '}
            <span className="font-semibold">{secondsLeft}</span> seconds.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={handleKeep} className="gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Keep session
          </Button>
          <Button size="sm" variant="ghost" onClick={handleClearNow} className="gap-1.5 text-amber-900">
            <Trash2 className="h-3.5 w-3.5" />
            Clear now
          </Button>
        </div>
      </div>
    </div>
  );
}
