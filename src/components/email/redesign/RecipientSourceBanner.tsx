'use client';

import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';

interface RecipientSourceBannerProps {
  emailColumn: string | null;
  nameColumn: string | null;
  recipientCount: number;
  validation: { valid: number; invalid: number; invalidExamples: string[] };
  ambiguousColumns: string[];
  selectedColumn: string | null;
  onSelectColumn?: (column: string) => void;
}

export function RecipientSourceBanner({
  emailColumn,
  nameColumn,
  recipientCount,
  validation,
  ambiguousColumns,
  selectedColumn,
  onSelectColumn,
}: RecipientSourceBannerProps) {
  const activeColumn = selectedColumn ?? emailColumn;

  if (!activeColumn) {
    return (
      <div className="flex gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-800">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-medium">No email column found</p>
          <p className="mt-1 leading-6 text-rose-700/90">
            Add a column named <span className="font-medium">email</span> (or similar) with valid
            addresses for each participant. We could not detect one automatically in your data.
          </p>
        </div>
      </div>
    );
  }

  const showAmbiguousPicker =
    ambiguousColumns.length > 1 && onSelectColumn;

  return (
    <div className="space-y-3">
      <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div className="min-w-0">
          <p className="font-medium">Recipients detected automatically</p>
          <p className="mt-1 leading-6 text-emerald-800/90">
            Sending to the <span className="font-semibold">{activeColumn}</span> column
            {nameColumn ? (
              <>
                {' '}
                · personalizing with <span className="font-semibold">{nameColumn}</span>
              </>
            ) : null}
            {' '}
            · {recipientCount} {recipientCount === 1 ? 'person' : 'people'}
          </p>
        </div>
        <Mail className="hidden h-5 w-5 shrink-0 text-emerald-600 sm:block" />
      </div>

      {showAmbiguousPicker && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">Multiple email columns found</p>
          <p className="mt-1 text-amber-800/90">Pick which one to use for delivery:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ambiguousColumns.map((column) => (
              <button
                key={column}
                type="button"
                onClick={() => onSelectColumn(column)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeColumn === column
                    ? 'bg-amber-900 text-white'
                    : 'bg-white text-amber-900 ring-1 ring-amber-200 hover:bg-amber-100'
                }`}
              >
                {column}
              </button>
            ))}
          </div>
        </div>
      )}

      {validation.invalid > 0 && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">
              {validation.invalid} of {recipientCount}{' '}
              {validation.invalid === 1 ? 'row has' : 'rows have'} an invalid email
            </p>
            <p className="mt-1 text-amber-800/90">
              They will be skipped during delivery.
              {validation.invalidExamples.length > 0 && (
                <>
                  {' '}
                  Examples: {validation.invalidExamples.join(', ')}
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipientSourceBanner;
