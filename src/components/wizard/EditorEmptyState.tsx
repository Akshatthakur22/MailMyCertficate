'use client';

import { Sparkles, MousePointerClick } from 'lucide-react';

interface EditorEmptyStateProps {
  templateDimensions?: { width: number; height: number };
}

/**
 * EditorEmptyState — Centered empty state in the certificate canvas
 * Shows when no fields are placed yet
 */
export function EditorEmptyState({ templateDimensions }: EditorEmptyStateProps) {
  if (!templateDimensions) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
      <div className="max-w-md w-full mx-auto p-6 rounded-2xl bg-white/85 backdrop-blur-md border border-border/80 shadow-xl text-center space-y-4 select-none">
        {/* Glowing Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent ring-1 ring-accent/30 shadow-xs">
            <Sparkles className="h-7 w-7" strokeWidth={1.75} />
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div>
          <h3 className="text-base font-bold text-foreground tracking-tight">
            Design Your Certificate Layout
          </h3>
          <p className="text-xs text-secondary mt-1 leading-relaxed">
            Click any column from the <span className="font-semibold text-foreground">Columns</span> tab on the left, or insert dynamic QR codes, signatures, and recipient avatars from the <span className="font-semibold text-foreground">Insert</span> tab.
          </p>
        </div>

        {/* Feature Hint Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/60 text-[11px] font-medium text-secondary">
            <MousePointerClick size={12} className="text-accent" />
            Drag & Resize
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/60 text-[11px] font-medium text-secondary">
            🧲 Smart Snapping
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/60 text-[11px] font-medium text-secondary">
            📐 Shrink-to-Fit Font
          </span>
        </div>
      </div>
    </div>
  );
}
