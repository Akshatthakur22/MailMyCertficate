'use client';

import { Clock, FileStack, Users, MapPin } from 'lucide-react';
import type { SessionSummary } from '@/types/session';
import { Button } from '@/components/ui/Button';
import { PrivacyNotice } from './PrivacyNotice';

interface SessionRecoveryModalProps {
  summary: SessionSummary;
  onContinue: () => void;
  onStartNew: () => void;
  busy?: boolean;
}

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function SessionRecoveryModal({
  summary,
  onContinue,
  onStartNew,
  busy = false,
}: SessionRecoveryModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-recovery-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <h2 id="session-recovery-title" className="text-xl font-semibold tracking-tight text-foreground">
          Previous session found
        </h2>
        <p className="mt-2 text-sm leading-6 text-secondary">
          We found data from a previous certificate batch stored in this browser.
        </p>

        <dl className="mt-5 space-y-3 rounded-xl border border-border bg-muted/50 p-4 text-sm">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 shrink-0 text-secondary" />
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                Last activity
              </dt>
              <dd className="font-medium text-foreground">{formatDateTime(summary.lastActivity)}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileStack className="h-4 w-4 shrink-0 text-secondary" />
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                Certificates
              </dt>
              <dd className="font-medium text-foreground">{summary.certificatesCount}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 shrink-0 text-secondary" />
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                Recipients
              </dt>
              <dd className="font-medium text-foreground">{summary.recipientsCount}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-secondary" />
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                Progress
              </dt>
              <dd className="font-medium text-foreground">{summary.workflowStageLabel}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Button className="flex-1" onClick={onContinue} disabled={busy}>
            Continue previous session
          </Button>
          <Button className="flex-1" variant="outline" onClick={onStartNew} disabled={busy}>
            Start new batch
          </Button>
        </div>

        <div className="mt-5">
          <PrivacyNotice compact />
        </div>
      </div>
    </div>
  );
}
