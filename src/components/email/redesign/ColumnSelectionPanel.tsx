'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ColumnSelectionPanelProps {
  csvHeaders: string[];
  onEmailColumnSelect: (column: string) => void;
  onNameColumnSelect: (column: string) => void;
  emailColumn?: string;
  nameColumn?: string;
  validRecipientCount?: number;
  totalRowCount?: number;
}

/**
 * ColumnSelectionPanel — Helps users select which columns contain emails and names
 * Shows validation feedback in real-time
 */
export function ColumnSelectionPanel({
  csvHeaders,
  onEmailColumnSelect,
  onNameColumnSelect,
  emailColumn,
  nameColumn,
  validRecipientCount,
  totalRowCount,
}: ColumnSelectionPanelProps) {
  const [hasValidEmail, setHasValidEmail] = useState(!!emailColumn && (validRecipientCount ?? 0) > 0);

  useEffect(() => {
    setHasValidEmail(!!emailColumn && (validRecipientCount ?? 0) > 0);
  }, [emailColumn, validRecipientCount]);

  return (
    <div className="p-6 border border-accent/20 bg-accent-light/20 rounded-xl space-y-5">
      <div>
        <h3 className="font-semibold text-foreground mb-4">Tell us which columns to use</h3>
        <p className="text-sm text-secondary mb-4">
          We'll use these to personalize your emails.
        </p>
      </div>

      <div className="space-y-4">
        {/* Email Column Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email addresses (required)
          </label>
          <select
            value={emailColumn || ''}
            onChange={(e) => onEmailColumnSelect(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-hidden"
          >
            <option value="">Choose the email column...</option>
            {csvHeaders.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
          <p className="text-xs text-secondary/60 mt-2">
            Which column contains recipient email addresses?
          </p>

          {/* Validation feedback */}
          {emailColumn && (
            <div className={`mt-3 flex items-start gap-2 text-sm ${
              hasValidEmail ? 'text-green-700' : 'text-amber-700'
            }`}>
              {hasValidEmail ? (
                <>
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Found {validRecipientCount} valid email{validRecipientCount === 1 ? '' : 's'} in {totalRowCount} rows
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    No valid emails detected. Check the column or look for typos.
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Name Column Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Names for personalization (optional)
          </label>
          <select
            value={nameColumn || ''}
            onChange={(e) => onNameColumnSelect(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-hidden"
          >
            <option value="">Choose the name column...</option>
            {csvHeaders.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
          <p className="text-xs text-secondary/60 mt-2">
            Use this to personalize emails with recipient names (e.g., &quot;Dear {`{{`}name{`}}`}&quot;)
          </p>
        </div>
      </div>

      {emailColumn && hasValidEmail && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50/50 border border-green-200/50 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Ready to compose your email!</span>
        </div>
      )}
    </div>
  );
}
