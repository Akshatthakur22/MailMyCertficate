'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, RotateCcw, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PrivacyNotice } from '@/components/session/PrivacyNotice';
import {
  buildSessionSummary,
  deleteAllLocalData,
  isRecoverableSummary,
  startNewBatch,
} from '@/core/session/sessionManager';
import type { SessionSummary } from '@/types/session';
import { useAppStore } from '@/store/useAppStore';

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function SettingsView() {
  const router = useRouter();
  const sessionId = useAppStore((state) => state.sessionId);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const next = await buildSessionSummary(sessionId);
      setSummary(isRecoverableSummary(next) ? next : null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [sessionId]);

  const runAction = async (action: () => Promise<void>, redirect?: string) => {
    setBusy(true);
    try {
      await action();
      if (redirect) router.push(redirect);
      else await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container-width flex flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
          <Link href="/" className="brand-text hover:opacity-80 transition-opacity">
            <span>Mail</span><span>My</span><span>Certificate</span>
          </Link>
          <Link href="/tool" className="text-sm font-medium text-secondary hover:text-accent">
            Back to tool
          </Link>
        </div>
      </header>

      <main className="container-width max-w-2xl py-8 sm:py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Session &amp; privacy</h1>
        <p className="mt-2 text-sm text-secondary leading-relaxed">
          All certificate and recipient data is stored in <strong className="text-foreground">this browser only</strong>.
          Use the options below to continue, start over, or remove data.
        </p>

        <section className="mt-8 space-y-6">
          <PrivacyNotice />

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Current batch</h2>
            </div>
            <p className="text-xs text-secondary mb-4">
              Also available anytime via <strong>Your local data</strong> in the tool or email header.
            </p>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-secondary" />
              </div>
            ) : summary ? (
              <dl className="space-y-3 text-sm mb-6">
                <Row label="Session ID" value={summary.sessionId} mono />
                <Row label="Created" value={formatDateTime(summary.createdAt)} />
                <Row label="Last activity" value={formatDateTime(summary.lastActivity)} />
                <Row label="Certificates" value={String(summary.certificatesCount)} />
                <Row label="Recipients" value={String(summary.recipientsCount)} />
                <Row label="Stage" value={summary.workflowStageLabel} />
              </dl>
            ) : (
              <p className="text-sm text-secondary mb-6">No batch data in this browser right now.</p>
            )}

            <div className="space-y-4">
              <ActionCard
                title="Delete this batch & start fresh"
                description="Removes the template, CSV rows, generated PDFs, and email queue for the current batch. You will return to step 1 with a new session ID."
                buttonLabel="Start new batch"
                icon={RotateCcw}
                disabled={busy}
                onClick={() =>
                  runAction(async () => {
                    if (
                      summary &&
                      !window.confirm(
                        'Delete your current batch and start fresh? This cannot be undone.'
                      )
                    ) {
                      throw new Error('cancelled');
                    }
                    await startNewBatch();
                  }, '/tool').catch(() => {})
                }
              />

              <ActionCard
                title="Delete everything in this browser"
                description="Clears all Mail My Certificate batch data and wizard progress. Your Gmail sign-in token may be kept so you do not have to reconnect."
                buttonLabel="Delete all local data"
                icon={Trash2}
                variant="danger"
                disabled={busy}
                onClick={() => {
                  if (
                    !window.confirm(
                      'Delete ALL local Mail My Certificate data in this browser? This cannot be undone.'
                    )
                  ) {
                    return;
                  }
                  runAction(() => deleteAllLocalData(), '/tool');
                }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-xs text-secondary leading-relaxed">
            <p className="font-medium text-foreground mb-1">Other places you may see these options</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>When you reopen the site — &quot;Previous session found&quot; (continue or start new)</li>
              <li>After downloading a ZIP — &quot;Start new batch&quot;</li>
              <li>After sending emails — &quot;Start new batch&quot; or optional auto-cleanup countdown</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <dt className="text-secondary">{label}</dt>
      <dd className={`font-medium text-foreground sm:text-right ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </dd>
    </div>
  );
}

function ActionCard({
  title,
  description,
  buttonLabel,
  icon: Icon,
  onClick,
  disabled,
  variant = 'default',
}: {
  title: string;
  description: string;
  buttonLabel: string;
  icon: typeof RotateCcw;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-secondary leading-relaxed">{description}</p>
      <Button
        variant={variant === 'danger' ? 'ghost' : 'outline'}
        size="sm"
        className={`mt-3 w-full sm:w-auto gap-2 ${variant === 'danger' ? 'text-rose-600 hover:text-rose-700' : ''}`}
        disabled={disabled}
        onClick={onClick}
      >
        <Icon className="h-4 w-4" />
        {buttonLabel}
      </Button>
    </div>
  );
}
