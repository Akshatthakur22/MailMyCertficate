'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ArrowRight, Lock } from 'lucide-react';

interface EditorOnboardingProps {
  fieldsCount: number;
  show: boolean;
}

/**
 * EditorOnboarding — Compact task intent clarification
 */
export function EditorOnboarding({ fieldsCount, show }: EditorOnboardingProps) {
  const csvData = useAppStore((state) => state.csvData);
  const [dismissed, setDismissed] = useState(false);

  // Auto-dismiss once fields are placed — derive from props
  const autoDismissed = fieldsCount > 0;

  if (!show || dismissed || autoDismissed) return null;

  const recipientCount = csvData.length;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-40 rounded-xl">
      <div className="bg-white rounded-xl border border-border shadow-lg p-5 max-w-sm mx-4 space-y-3 animate-fade-in-up">
        {/* Intent */}
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            Creating {recipientCount} certificates
          </p>
          <p className="text-xs text-secondary mt-1">
            Drag fields to show where data goes
          </p>
        </div>

        {/* Quick steps */}
        <div className="space-y-1 text-xs">
          <p className="font-medium text-secondary">How to:</p>
          <p className="text-foreground">① Select field • ② Drag to template • ③ Style in panel</p>
        </div>

        {/* Shortcuts */}
        <div className="flex items-center gap-1.5 text-xs text-secondary bg-blue-50 border border-blue-100 rounded px-2 py-1.5">
          <span>⌨️ Ctrl+Z undo · Space pan · Ctrl+scroll zoom</span>
        </div>

        {/* Trust */}
        <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1.5">
          <Lock size={13} className="shrink-0" />
          <span>Local only • Recoverable</span>
        </div>

        {/* CTA */}
        <button
          onClick={() => setDismissed(true)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          Start
          <ArrowRight size={14} />
        </button>

        <p className="text-xs text-secondary/60 text-center">
          Hides after first field
        </p>
      </div>
    </div>
  );
}
