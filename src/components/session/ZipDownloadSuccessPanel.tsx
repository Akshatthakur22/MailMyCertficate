'use client';

import { Download, RotateCcw, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PrivacyNotice } from './PrivacyNotice';

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
    <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-3">
        <Download className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-900">ZIP downloaded successfully</h3>
          <p className="mt-1 text-sm leading-6 text-green-800">
            Your certificate data is still stored locally in this browser. You can verify files,
            re-download the ZIP, or regenerate if you need to fix something.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={onGenerateAgain}
              disabled={busy}
              className="gap-2 border-green-300 bg-white text-green-900 hover:bg-green-100"
            >
              <RefreshCw className="h-4 w-4" />
              Generate again
            </Button>
            <Button
              variant="ghost"
              onClick={onStartNewBatch}
              disabled={busy}
              className="gap-2 text-green-900"
            >
              <RotateCcw className="h-4 w-4" />
              Start new batch
            </Button>
          </div>
          <div className="mt-4">
            <PrivacyNotice compact />
          </div>
        </div>
      </div>
    </div>
  );
}
