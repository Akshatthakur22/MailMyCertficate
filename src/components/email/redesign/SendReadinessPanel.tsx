'use client';

import { CheckCircle2, AlertTriangle, Mail, Users, FileCheck2, Send, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SampleRecipient {
  name: string;
  email: string;
}

interface SendReadinessPanelProps {
  email: string | null;
  validRecipients: number;
  totalRows: number;
  invalidRecipients: number;
  invalidExamples?: string[];
  certificateCount: number;
  sampleRecipients: SampleRecipient[];
  canSend: boolean;
  estimatedMinutes: number;
  confirming: boolean;
  onLogout: () => void;
  onRequestSend: () => void;
  onConfirmSend: () => void;
  onCancelConfirm: () => void;
}

export function SendReadinessPanel({
  email,
  validRecipients,
  totalRows,
  invalidRecipients,
  invalidExamples = [],
  certificateCount,
  sampleRecipients,
  canSend,
  estimatedMinutes,
  confirming,
  onLogout,
  onRequestSend,
  onConfirmSend,
  onCancelConfirm,
}: SendReadinessPanelProps) {
  const certShortfall = Math.max(0, validRecipients - certificateCount);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Before you send</p>
        <h3 className="mt-0.5 text-sm font-semibold text-foreground">Everything ready to go</h3>
      </div>

      {/* Connection */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
          {email ? email.slice(0, 1).toUpperCase() : 'G'}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Gmail connected
          </div>
          <p className="truncate text-sm font-medium text-foreground">{email ?? 'Not connected'}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 px-3 py-1.5 rounded-md bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors border border-red-200"
        >
          Logout
        </button>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
        <Stat icon={Users} label="Recipients" value={validRecipients} sub={`of ${totalRows} rows`} />
        <Stat
          icon={FileCheck2}
          label="Certificates"
          value={certificateCount}
          sub={certShortfall > 0 ? `${certShortfall} missing` : 'all attached'}
          subTone={certShortfall > 0 ? 'warn' : 'ok'}
        />
      </div>

      {/* Verification */}
      <div className="border-b border-border px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Verification</p>
        <div className="mt-1.5 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            {validRecipients} valid email {validRecipients === 1 ? 'address' : 'addresses'}
          </div>
          {invalidRecipients > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                {invalidRecipients} won&apos;t receive (invalid)
              </div>
              {invalidExamples.length > 0 && (
                <div className="ml-6 space-y-0.5 rounded border border-amber-200 bg-amber-50 px-2 py-1.5">
                  {invalidExamples.map((ex, i) => (
                    <p key={i} className="text-[11px] text-amber-700 font-mono">
                      {ex}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-secondary">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              All addresses valid
            </div>
          )}
        </div>
      </div>

      {/* Fills remaining height so card matches composer */}
      {sampleRecipients.length > 0 ? (
        <div className="flex min-h-0 flex-1 flex-col border-b border-border px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Sample recipients</p>
          <ul className="mt-1.5 space-y-2">
            {sampleRecipients.map((r) => (
              <li key={r.email} className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-light text-[11px] font-semibold uppercase text-accent">
                  {(r.name || r.email).slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{r.name}</p>
                  <p className="truncate text-xs text-secondary">{r.email}</p>
                </div>
              </li>
            ))}
          </ul>
          {validRecipients > sampleRecipients.length && (
            <p className="mt-auto pt-3 text-xs text-secondary">
              + {validRecipients - sampleRecipients.length} more
            </p>
          )}
        </div>
      ) : (
        <div className="min-h-0 flex-1 border-b border-border" aria-hidden />
      )}

      {/* Action */}
      <div className="mt-auto px-4 py-3">
        {confirming ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-accent/20 bg-accent-light px-4 py-3 text-sm text-foreground">
              <p className="font-medium">Send {validRecipients} {validRecipients === 1 ? 'certificate' : 'certificates'} now?</p>
              <p className="mt-1 text-secondary">
                Personalized emails will be sent from <span className="font-medium text-foreground">{email}</span>.
                Estimated time ~{estimatedMinutes} min. Keep this tab open until it finishes.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onCancelConfirm} className="flex-1">
                Go back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onConfirmSend}
                className="flex-1 inline-flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Start sending
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={onRequestSend}
              disabled={!canSend}
              className="w-full inline-flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Review &amp; send {validRecipients > 0 ? validRecipients : ''}{' '}
              {validRecipients === 1 ? 'certificate' : 'certificates'}
            </Button>
            {!canSend && (
              <p className="mt-2 text-center text-xs text-secondary">
                Add valid email addresses to your data to enable sending.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  subTone = 'muted',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  sub: string;
  subTone?: 'muted' | 'ok' | 'warn';
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-secondary">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-0.5 text-xl font-semibold text-foreground">{value}</p>
      <p
        className={`text-xs ${
          subTone === 'warn' ? 'text-amber-600' : subTone === 'ok' ? 'text-green-600' : 'text-secondary'
        }`}
      >
        {sub}
      </p>
    </div>
  );
}

export default SendReadinessPanel;
