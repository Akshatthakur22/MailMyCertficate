'use client';

import { CheckCircle2, XCircle, Clock3, Loader2, TimerReset } from 'lucide-react';
import { LiveActivityFeed } from '@/components/email/delivery/LiveActivityFeed';
import type { EmailQueueItem } from '@/core/queue/emailQueue';

interface SendingTrackerProps {
  sent: number;
  failed: number;
  remaining: number;
  total: number;
  currentRecipient: string;
  estimatedRemaining: string;
  items: EmailQueueItem[];
  currentSendingIds: string[];
}

export function SendingTracker({
  sent,
  failed,
  remaining,
  total,
  currentRecipient,
  estimatedRemaining,
  items,
  currentSendingIds,
}: SendingTrackerProps) {
  const percent = total > 0 ? Math.round(((sent + failed) / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Sending now</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              Delivering your certificates
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Live
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-semibold text-foreground">
              {sent + failed}
              <span className="text-lg text-secondary"> / {total}</span>
            </span>
            <span className="text-sm font-medium text-secondary">{percent}% complete</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-secondary">
            Sending steadily to avoid Gmail rate limits. Keep this tab open.
          </p>
        </div>

        {/* Stat tiles */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile icon={CheckCircle2} tone="green" label="Sent" value={sent} />
          <StatTile icon={XCircle} tone="rose" label="Failed" value={failed} />
          <StatTile icon={Clock3} tone="muted" label="Remaining" value={remaining} />
          <StatTile icon={TimerReset} tone="accent" label="Est. left" value={estimatedRemaining} />
        </div>

        {/* Current recipient */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted px-4 py-3">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Currently sending</p>
            <p className="truncate text-sm font-medium text-foreground">
              {currentRecipient || 'Preparing first recipient…'}
            </p>
          </div>
        </div>
      </div>

      <LiveActivityFeed items={items} currentSendingIds={currentSendingIds} />
    </div>
  );
}

function StatTile({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: 'green' | 'rose' | 'muted' | 'accent';
  label: string;
  value: number | string;
}) {
  const toneClasses: Record<string, string> = {
    green: 'text-green-600',
    rose: 'text-rose-500',
    muted: 'text-secondary',
    accent: 'text-accent',
  };
  return (
    <div className="rounded-xl border border-border bg-white px-3 py-3">
      <div className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${toneClasses[tone]}`}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default SendingTracker;
