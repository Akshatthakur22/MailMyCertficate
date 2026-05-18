'use client';

export function DeliverySummary({
  sent,
  active,
  failed,
  remaining,
}: {
  sent: number;
  active: number;
  failed: number;
  remaining: number;
}) {
  const pills = [
    { label: 'Sent', value: sent, tone: 'green' },
    { label: 'Sending', value: active, tone: 'blue' },
    { label: 'Failed', value: failed, tone: 'rose' },
    { label: 'Remaining', value: remaining, tone: 'gray' },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {pills.map((pill) => (
        <div
          key={pill.label}
          className={`rounded-2xl border px-4 py-3 shadow-sm ${
            pill.tone === 'green'
              ? 'border-emerald-100 bg-emerald-50/80'
              : pill.tone === 'blue'
                ? 'border-sky-100 bg-sky-50/80'
                : pill.tone === 'rose'
                  ? 'border-rose-100 bg-rose-50/80'
                  : 'border-gray-200 bg-gray-50/80'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">{pill.label}</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{pill.value}</div>
        </div>
      ))}
    </div>
  );
}
