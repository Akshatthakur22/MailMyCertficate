'use client';

import { Download, RotateCcw, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ZipDownloadSuccessPanelProps {
  onGenerateAgain: () => void;
  onStartNewBatch: () => void;
  busy?: boolean;
}

export function ZipDownloadSuccessPanel({
  onGenerateAgain,
  onStartNewBatch,
  busy = false,
}: ZipDownloadSuccessPanelProps) {
  return (
    <div className="max-w-md mx-auto rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-5 text-left">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-emerald-950">ZIP downloaded</h3>
          <p className="mt-1 text-xs leading-relaxed text-emerald-800/80">
            Your files are saved locally. Re-download, regenerate, or start a new batch anytime.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateAgain}
              disabled={busy}
              className="gap-2 rounded-lg border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Generate again
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onStartNewBatch}
              disabled={busy}
              className="gap-2 rounded-lg text-emerald-900 hover:bg-emerald-100/60"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New batch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
