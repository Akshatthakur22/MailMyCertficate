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
            Delivery is saved locally as it runs. If this page closes, you can return and choose whether to
            resume, but any email interrupted while Gmail was responding may need review.
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
        Progress is saved locally so an interrupted campaign can be reviewed before resuming.
      </p>
    </div>
  );
}

export default RefreshGuardBanner;
