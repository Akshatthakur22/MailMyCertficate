'use client';

import { CheckCircle2, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DeliveryIllustrationSection } from './DeliveryIllustrationSection';

export function DeliveryCompletionState({
  delivered,
  failed,
  totalTime,
  onDownloadReport,
  onSendAnotherBatch,
}: {
  delivered: number;
  failed: number;
  totalTime: string;
  onDownloadReport: () => void;
  onSendAnotherBatch: () => void;
}) {
  return (
    <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <DeliveryIllustrationSection tone={failed > 0 ? 'failure' : 'success'} />

      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">{failed > 0 ? 'Delivery completed with a few items to review' : 'All certificates delivered successfully ✨'}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          {delivered} personalized certificates were securely delivered through your Gmail account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Delivered</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{delivered}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Failed</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{failed}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Total time</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{totalTime}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onDownloadReport} variant="secondary" className="inline-flex items-center justify-center gap-2">
          <Download className="h-4 w-4" />
          Download delivery report
        </Button>
        <Button onClick={onSendAnotherBatch} className="inline-flex items-center justify-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Send another batch
        </Button>
      </div>
    </div>
  );
}
