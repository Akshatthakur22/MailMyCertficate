'use client';

import { AlertTriangle, ShieldCheck } from 'lucide-react';

export function RefreshGuardBanner({ active }: { active: boolean }) {
  if (active) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-semibold">Sending in progress — please don&apos;t refresh or close this tab.</p>
          <p className="mt-0.5 leading-6 text-amber-800/90">
            Delivery is running live from this page. Refreshing will stop it, and it cannot be resumed
            automatically. You can safely refresh once every certificate has been sent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-muted px-5 py-3 text-sm text-secondary">
      <ShieldCheck className="h-5 w-5 shrink-0 text-accent" />
      <p className="leading-relaxed">
        <span className="font-medium text-foreground">Keep this tab open while sending.</span>{' '}
        Don&apos;t refresh until delivery completes.
      </p>
    </div>
  );
}

export default RefreshGuardBanner;
