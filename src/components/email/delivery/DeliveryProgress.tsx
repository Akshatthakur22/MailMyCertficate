'use client';

import { Loader2, MailCheck, TimerReset } from 'lucide-react';

export function DeliveryProgress({
  sent,
  total,
  currentRecipient,
  estimatedRemaining,
  active,
}: {
  sent: number;
  total: number;
  currentRecipient: string;
  estimatedRemaining: string;
  active: boolean;
}) {
  const percent = total > 0 ? Math.round((sent / total) * 100) : 0;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Delivery studio</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">Preparing your certificates for delivery</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            MailMyCertificate is securely sending personalized certificates through your connected Gmail account.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700">
          {active ? <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-600" /> : <MailCheck className="h-3.5 w-3.5 text-emerald-600" />}
          {active ? 'Active delivery' : 'Delivery idle'}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div className="text-4xl font-semibold text-gray-900">
            {sent} <span className="text-xl text-gray-400">/ {total}</span>
          </div>
          <div className="text-right text-sm text-gray-500">{percent}% complete</div>
        </div>
        <div className="mt-3 h-3 rounded-full bg-gray-100">
          <div className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Currently sending</div>
          <div className="mt-2 truncate text-sm font-medium text-gray-900">{currentRecipient || 'Waiting for the first recipient'}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Estimated remaining</div>
          <div className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-gray-900">
            <TimerReset className="h-4 w-4 text-gray-500" />
            {estimatedRemaining}
          </div>
        </div>
      </div>
    </div>
  );
}
