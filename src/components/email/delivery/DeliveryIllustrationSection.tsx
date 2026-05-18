'use client';

export function DeliveryIllustrationSection({
  tone = 'delivery',
  className = '',
}: {
  tone?: 'delivery' | 'success' | 'failure' | 'empty';
  className?: string;
}) {
  const label =
    tone === 'success'
      ? 'All set'
      : tone === 'failure'
        ? 'Needs attention'
        : tone === 'empty'
          ? 'Ready when you are'
          : 'Preparing delivery';

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50 p-6 ${className}`}>
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100/70 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-sky-100/70 blur-2xl" />
      <div className="relative flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <div className="absolute inset-3 rounded-[1.5rem] bg-gray-900/5" />
          <div className="absolute inset-0 rounded-[1.5rem] border border-gray-200 bg-white shadow-sm" />
          <div className="absolute left-3 top-6 h-10 w-14 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm" />
          <div className="absolute left-8 top-7 h-8 w-8 rounded-full bg-sky-100" />
          <div className="absolute bottom-3 right-3 h-4 w-4 rounded-full bg-emerald-400" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">{label}</p>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">Your certificates are moving quietly through Gmail.</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
            Premium delivery should feel controlled, calm, and easy to trust. This studio keeps the important details visible without overwhelming the workflow.
          </p>
        </div>
      </div>
    </div>
  );
}
