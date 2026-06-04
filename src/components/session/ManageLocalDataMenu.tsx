'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Database, Play, RotateCcw, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  buildSessionSummary,
  isRecoverableSummary,
  startNewBatch,
  touchActivity,
} from '@/core/session/sessionManager';
import { hydrateSessionFromIDB } from '@/core/session/sessionHydration';
import type { SessionSummary } from '@/types/session';
import { useAppStore } from '@/store/useAppStore';

interface ManageLocalDataMenuProps {
  /** Compact pill in header vs full-width button */
  variant?: 'header' | 'button';
}

export function ManageLocalDataMenu({ variant = 'header' }: ManageLocalDataMenuProps) {
  const router = useRouter();
  const sessionId = useAppStore((state) => state.sessionId);
  const bumpSessionHydration = useAppStore((state) => state.bumpSessionHydration);
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [busy, setBusy] = useState(false);

  const loadSummary = useCallback(async () => {
    const next = await buildSessionSummary(sessionId);
    setSummary(isRecoverableSummary(next) ? next : null);
  }, [sessionId]);

  useEffect(() => {
    if (open) loadSummary();
  }, [open, loadSummary]);

  const handleContinue = async () => {
    setBusy(true);
    try {
      await hydrateSessionFromIDB(sessionId);
      await touchActivity(sessionId);
      bumpSessionHydration();
      setOpen(false);
      if (
        summary?.workflowStage === 'EMAIL_SETUP' ||
        summary?.workflowStage === 'SENDING' ||
        summary?.workflowStage === 'COMPLETED'
      ) {
        router.push('/email');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleStartFresh = async () => {
    const ok = window.confirm(
      'Delete your current batch (template, CSV, certificates, and email queue) and start over?\n\nThis only affects data in this browser. It cannot be undone.'
    );
    if (!ok) return;

    setBusy(true);
    try {
      await startNewBatch();
      setOpen(false);
      router.push('/tool');
    } finally {
      setBusy(false);
    }
  };

  const trigger =
    variant === 'header' ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:border-accent/30 hover:bg-accent/5 transition-colors"
        aria-haspopup="dialog"
      >
        <Database className="h-3.5 w-3.5 text-accent" />
        <span className="hidden sm:inline">Your local data</span>
        <span className="sm:hidden">Data</span>
      </button>
    ) : (
      <Button type="button" variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <Database className="h-4 w-4" />
        Manage local data
      </Button>
    );

  return (
    <>
      {trigger}

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="manage-data-title"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="manage-data-title" className="text-lg font-semibold text-foreground">
                  Manage local data
                </h2>
                <p className="mt-1 text-sm text-secondary leading-relaxed">
                  Certificates and recipient lists live only in this browser. Choose what to do with
                  your current batch.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={busy}
                className="rounded-lg p-1 text-secondary hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {summary ? (
              <dl className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-3 text-xs">
                <Stat label="Recipients" value={summary.recipientsCount} />
                <Stat label="Certificates" value={summary.certificatesCount} />
                <Stat label="Progress" value={summary.workflowStageLabel} className="col-span-2" />
              </dl>
            ) : (
              <p className="mt-4 rounded-xl bg-muted/60 px-3 py-2 text-xs text-secondary">
                No batch data saved yet. Upload a template and CSV to begin.
              </p>
            )}

            <div className="mt-5 space-y-2">
              {summary && (
                <ActionRow
                  icon={Play}
                  title="Continue this batch"
                  description="Keep your data and pick up where you left off."
                  onClick={handleContinue}
                  disabled={busy}
                  primary
                />
              )}

              <ActionRow
                icon={RotateCcw}
                title="Delete data & start fresh"
                description="Remove this batch from your browser and open a blank workflow."
                onClick={handleStartFresh}
                disabled={busy}
              />

              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex w-full items-start gap-3 rounded-xl border border-border px-4 py-3 text-left hover:bg-muted/50 transition-colors"
              >
                <Settings className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Session &amp; privacy settings</p>
                  <p className="text-xs text-secondary mt-0.5">
                    View session details or delete all local app data.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Stat({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-secondary">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function ActionRow({
  icon: Icon,
  title,
  description,
  onClick,
  disabled,
  primary,
}: {
  icon: typeof Play;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors disabled:opacity-50 ${
        primary
          ? 'border-accent/30 bg-accent/5 hover:bg-accent/10'
          : 'border-border hover:bg-muted/50'
      }`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${primary ? 'text-accent' : 'text-secondary'}`} />
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-secondary mt-0.5">{description}</p>
      </div>
    </button>
  );
}
