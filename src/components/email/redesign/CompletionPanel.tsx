'use client';

import { CheckCircle2, PartyPopper, RefreshCw, Download, RotateCcw, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { EmailQueueItem } from '@/core/queue/emailQueue';
import { AutoCleanupCountdown } from '@/components/session/AutoCleanupCountdown';
import { PrivacyNotice } from '@/components/session/PrivacyNotice';

interface CompletionPanelProps {
  sent: number;
  failed: number;
  total: number;
  totalTime: string;
  failedItems: EmailQueueItem[];
  isRetrying: boolean;
  onRetryFailed: () => void;
  onDownloadReport: () => void;
  onDownloadFailed: () => void;
  onSendAnother: () => void;
  onStartNewBatch: () => void;
  onKeepSession: () => void;
  showAutoCleanup?: boolean;
}

export function CompletionPanel({
  sent,
  failed,
  total,
  totalTime,
  failedItems,
  isRetrying,
  onRetryFailed,
  onDownloadReport,
  onDownloadFailed,
  onSendAnother,
  onStartNewBatch,
  onKeepSession,
  showAutoCleanup = false,
}: CompletionPanelProps) {
  const successRate = total > 0 ? Math.round((sent / total) * 100) : 0;
  const allDelivered = failed === 0;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span
            className={`inline-flex h-14 w-14 items-center justify-center rounded-full ${
              allDelivered ? 'bg-green-100' : 'bg-amber-100'
            }`}
          >
            {allDelivered ? (
              <PartyPopper className="h-7 w-7 text-green-600" />
            ) : (
              <CheckCircle2 className="h-7 w-7 text-amber-600" />
            )}
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            {allDelivered ? 'All certificates delivered' : 'Delivery finished — a few need attention'}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-secondary">
            {sent} / {total} {total === 1 ? 'email was' : 'emails were'} sent successfully
            {totalTime !== '—' ? ` in ${totalTime}` : ''}. Your certificate and recipient data is still stored
            locally in this browser.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <SummaryTile label="Sent" value={sent} tone="green" />
          <SummaryTile label="Failed" value={failed} tone={failed > 0 ? 'rose' : 'muted'} />
          <SummaryTile label="Success rate" value={`${successRate}%`} tone="accent" />
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
          {failed > 0 && (
            <Button
              variant="primary"
              onClick={onRetryFailed}
              disabled={isRetrying}
              className="inline-flex items-center justify-center gap-2"
            >
              {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Retry {failed} failed
            </Button>
          )}
          <Button variant="outline" onClick={onDownloadReport} className="inline-flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Delivery report
          </Button>
          {failed > 0 && (
            <Button
              variant="outline"
              onClick={onDownloadFailed}
              className="inline-flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Failed list
            </Button>
          )}
          <Button variant="ghost" onClick={onStartNewBatch} className="inline-flex items-center justify-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Start new batch
          </Button>
          <Button variant="ghost" onClick={onKeepSession} className="inline-flex items-center justify-center gap-2">
            Keep session
          </Button>
          {failed === 0 && (
            <Button variant="ghost" onClick={onSendAnother} className="inline-flex items-center justify-center gap-2">
              Back to tool
            </Button>
          )}
        </div>

        {showAutoCleanup && allDelivered && (
          <div className="mt-5">
            <AutoCleanupCountdown active onKeepSession={onKeepSession} />
          </div>
        )}

        <div className="mt-5">
          <PrivacyNotice compact />
        </div>
      </div>

      {failed > 0 && (
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <XCircle className="h-4 w-4 text-rose-500" />
            <h3 className="text-sm font-semibold text-foreground">Failed recipients ({failed})</h3>
          </div>
          <ul className="max-h-72 divide-y divide-border overflow-y-auto">
            {failedItems.map((item) => (
              <li key={item.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.recipient}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-rose-600">
                      {item.error || 'Delivery failed'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: 'green' | 'rose' | 'muted' | 'accent';
}) {
  const toneClasses: Record<string, string> = {
    green: 'text-green-600',
    rose: 'text-rose-500',
    muted: 'text-foreground',
    accent: 'text-accent',
  };
  return (
    <div className="rounded-xl border border-border bg-muted px-4 py-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${toneClasses[tone]}`}>{value}</p>
    </div>
  );
}

export default CompletionPanel;
