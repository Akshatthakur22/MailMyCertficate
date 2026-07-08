'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FieldListProps {
  headers: string[];
  onAddField: (header: string) => void;
  fieldsCount: number;
  disabledState?: boolean;
}

/**
 * FieldList — Left sidebar showing available fields to add
 * Highlights first recommended field when no fields exist yet
 */
export function FieldList({
  headers,
  onAddField,
  fieldsCount,
  disabledState = false,
}: FieldListProps) {
  if (headers.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-secondary/60">
        No columns found. Go back to upload a CSV.
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
        {fieldsCount === 0 ? '📌 Add fields' : 'Add more fields'}
      </p>

      {headers.map((header, index) => {
        const isFirstField = index === 0 && fieldsCount === 0;

        return (
          <button
            key={header}
            onClick={() => onAddField(header)}
            disabled={disabledState}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left',
              isFirstField
                ? 'border-accent bg-accent/5 hover:bg-accent/10 shadow-sm animate-pulse'
                : 'border-border/40 bg-muted/50 hover:border-accent/40 hover:bg-muted/80',
              disabledState && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center h-7 w-7 rounded-md text-sm font-semibold shrink-0',
                isFirstField
                  ? 'bg-accent text-white'
                  : 'bg-background border border-border/60'
              )}
            >
              <Plus size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm font-medium truncate',
                  isFirstField ? 'text-accent' : 'text-foreground'
                )}
              >
                {header}
              </p>
              {isFirstField && (
                <p className="text-xs text-secondary/70 mt-0.5">
                  Start here
                </p>
              )}
            </div>

            {isFirstField && (
              <div className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded">
                First
              </div>
            )}
          </button>
        );
      })}

      {fieldsCount === 0 && (
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100/50 text-xs text-blue-900 space-y-1">
          <p className="font-medium">💡 New to this?</p>
          <p>
            Click a field above to add it to your certificate. You can drag it around and resize it.
          </p>
        </div>
      )}
    </div>
  );
}
