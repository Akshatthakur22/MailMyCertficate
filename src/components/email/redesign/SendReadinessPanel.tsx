'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, FileCheck2, ShieldCheck, Users } from 'lucide-react';

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
  onLogout: () => void;
}

export function SendReadinessPanel({
  email,
  validRecipients,
  totalRows,
  invalidRecipients,
  invalidExamples = [],
  certificateCount,
  sampleRecipients,
  onLogout,
}: SendReadinessPanelProps) {
  const [showSamples, setShowSamples] = useState(false);
  const missingCertificates = Math.max(0, validRecipients - certificateCount);

  return (
    <aside className="overflow-hidden rounded-2xl border border-[#dadce0] bg-white shadow-sm" aria-label="Send review">
      <div className="border-b border-[#e8eaed] px-5 py-4">
        <p className="text-xs font-medium text-[#5f6368]">Ready to send?</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#202124]">Review your delivery</h2>
      </div>

      <div className="flex items-center gap-3 px-5 py-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f0fe] text-sm font-semibold uppercase text-[#1a73e8]">
          {email?.slice(0, 1) || 'G'}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#188038]">
            <CheckCircle2 className="h-3.5 w-3.5" /> Gmail connected
          </div>
          <p className="truncate text-sm font-medium text-[#202124]">{email ?? 'Not connected'}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]"
        >
          Disconnect
        </button>
      </div>

      <div className="grid grid-cols-2 border-y border-[#e8eaed]">
        <Stat icon={Users} label="Recipients" value={validRecipients} detail={`of ${totalRows} rows`} />
        <Stat
          icon={FileCheck2}
          label="Certificates"
          value={certificateCount}
          detail={missingCertificates ? `${missingCertificates} missing` : 'All attached'}
          warning={missingCertificates > 0}
        />
      </div>

      <div className="space-y-2.5 px-5 py-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6368]">Recipient check</p>
        <div className="flex items-center gap-2 text-sm text-[#3c4043]">
          {invalidRecipients > 0 ? <AlertTriangle className="h-4 w-4 text-amber-600" /> : <CheckCircle2 className="h-4 w-4 text-[#188038]" />}
          {validRecipients} valid email {validRecipients === 1 ? 'address' : 'addresses'}
        </div>
        {invalidRecipients > 0 ? (
          <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <p>{invalidRecipients} rows will be skipped because their email address is invalid.</p>
            {invalidExamples.length > 0 && <p className="mt-1 truncate font-mono">Example: {invalidExamples[0]}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#5f6368]">
            <ShieldCheck className="h-4 w-4 text-[#188038]" /> Every recipient is checked before sending
          </div>
        )}
      </div>

      {sampleRecipients.length > 0 && (
        <div className="border-t border-[#e8eaed] px-5 py-3">
          <button
            type="button"
            onClick={() => setShowSamples((visible) => !visible)}
            aria-expanded={showSamples}
            className="flex w-full items-center justify-between text-left text-sm font-medium text-[#3c4043] hover:text-[#1a73e8]"
          >
            <span>Preview recipients <span className="font-normal text-[#5f6368]">· {validRecipients} total</span></span>
            {showSamples ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showSamples && (
            <ul className="mt-3 space-y-2">
              {sampleRecipients.map((recipient) => (
                <li key={recipient.email} className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e6f4ea] text-xs font-semibold uppercase text-[#188038]">
                    {(recipient.name || recipient.email).slice(0, 1)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-[#202124]">{recipient.name}</span>
                    <span className="block truncate text-xs text-[#5f6368]">{recipient.email}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </aside>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  detail,
  warning = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  detail: string;
  warning?: boolean;
}) {
  return (
    <div className="px-5 py-3.5 even:border-l even:border-[#e8eaed]">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#5f6368]">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className="mt-1 text-2xl font-semibold leading-none text-[#202124]">{value}</p>
      <p className={`mt-1 text-xs ${warning ? 'text-amber-700' : 'text-[#188038]'}`}>{detail}</p>
    </div>
  );
}

export default SendReadinessPanel;
