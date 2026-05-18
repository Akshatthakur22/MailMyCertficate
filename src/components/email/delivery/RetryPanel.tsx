'use client';

import { RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function RetryPanel({
  failedCount,
  onRetryFailed,
  onDownloadFailed,
}: {
  failedCount: number;
  onRetryFailed: () => void;
  onDownloadFailed: () => void;
}) {
  if (failedCount === 0) return null;

  return (
    <div className="rounded-3xl border border-amber-100 bg-amber-50/80 p-6 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Delivery recovery</div>
      <h3 className="mt-2 text-lg font-semibold text-gray-900">{failedCount} emails need attention</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">The system handled the batch safely. You can retry the temporary failures or export the failed recipient list for review.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onRetryFailed} className="inline-flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry failed emails
        </Button>
        <Button onClick={onDownloadFailed} variant="secondary" className="inline-flex items-center justify-center gap-2">
          <Download className="h-4 w-4" />
          Download failure report
        </Button>
      </div>
    </div>
  );
}
