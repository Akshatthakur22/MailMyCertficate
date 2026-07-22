'use client';

import { RotateCcw, RefreshCw, CheckCircle2, Lock, Archive } from 'lucide-react';

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
    <div className="max-w-md mx-auto rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-6 text-left space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-emerald-950">Certificates downloaded</h3>
          <p className="mt-1 text-xs leading-relaxed text-emerald-800/80">
            All files are saved to your computer as a ZIP file.
          </p>
        </div>
      </div>

      {/* Storage & Recovery Info */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2 text-xs text-emerald-800">
          <Archive className="w-3.5 h-3.5 shrink-0" />
          <span>ZIP file downloaded and ready</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-800">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Batch saved locally · Return anytime to re-download</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onGenerateAgain}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Generate again
        </button>
        <button
          onClick={onStartNewBatch}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-emerald-900 hover:bg-emerald-100/60 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Start new batch
        </button>
      </div>
    </div>
  );
}
