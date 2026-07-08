'use client';

import { FileText, MousePointer2 } from 'lucide-react';

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
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        perspective: '1000px',
      }}
    >
      <div className="text-center space-y-4 select-none">
        {/* Icon with pulse */}
        <div className="flex justify-center">
          <div className="relative h-16 w-16">
            {/* Pulsing background */}
            <div className="absolute inset-0 rounded-xl bg-accent/10 animate-pulse" />
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <MousePointer2 className="h-8 w-8 text-accent" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Main text */}
        <div>
          <p className="text-lg font-semibold text-foreground">
            Ready to add fields?
          </p>
          <p className="text-sm text-secondary mt-1">
            Pick a field from the left and drag it here
          </p>
        </div>

        {/* Quick visual hint */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/30 text-xs text-secondary">
            <FileText className="h-3.5 w-3.5" />
            <span>Drag fields onto the certificate to position them</span>
          </div>
        </div>
      </div>
    </div>
  );
}
