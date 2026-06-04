'use client';

import React from 'react';
import { RecipientSourceBanner } from './RecipientSourceBanner';
import type { RecipientValidationSummary } from '@/utils/recipientColumn';

interface ComposePaneProps {
  emailColumn: string | null;
  nameColumn: string | null;
  recipientCount: number;
  validation: RecipientValidationSummary;
  ambiguousColumns: string[];
  emailColumnOverride: string | null;
  onEmailColumnOverride: (column: string) => void;
  emailForm: { subject: string; body: string };
  setEmailForm: React.Dispatch<React.SetStateAction<{ subject: string; body: string }>>;
  templateTokens: string[];
  previewRows: Array<{ id: number; data?: Record<string, unknown> }>;
  previewIndex: number;
  setPreviewIndex: (index: number) => void;
  getPreviewLabel: (row: { id: number; data?: Record<string, unknown> }) => string;
  onReview: () => void;
  sending: boolean;
  canReview: boolean;
}

export function ComposePane({
  emailColumn,
  nameColumn,
  recipientCount,
  validation,
  ambiguousColumns,
  emailColumnOverride,
  onEmailColumnOverride,
  emailForm,
  setEmailForm,
  templateTokens,
  previewRows,
  previewIndex,
  setPreviewIndex,
  getPreviewLabel,
  onReview,
  sending,
  canReview,
}: ComposePaneProps) {
  const activeColumn = emailColumnOverride ?? emailColumn;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Compose</p>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900">Prepare your message</h2>
        <p className="mt-2 text-sm text-gray-600">
          Write one message — we&apos;ll personalize it for each recipient.
        </p>
      </div>

      <RecipientSourceBanner
        emailColumn={emailColumn}
        nameColumn={nameColumn}
        recipientCount={recipientCount}
        validation={validation}
        ambiguousColumns={ambiguousColumns}
        selectedColumn={activeColumn}
        onSelectColumn={
          ambiguousColumns.length > 1 ? onEmailColumnOverride : undefined
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-900">Subject</label>
            <input
              type="text"
              value={emailForm.subject}
              onChange={(e) => setEmailForm((prev) => ({ ...prev, subject: e.target.value }))}
              className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
            />
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              {templateTokens.map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() =>
                    setEmailForm((prev) => ({
                      ...prev,
                      subject: `${prev.subject}${prev.subject.endsWith(' ') ? '' : ' '}${token}`,
                    }))
                  }
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">Message</label>
            <textarea
              value={emailForm.body}
              onChange={(e) => setEmailForm((prev) => ({ ...prev, body: e.target.value }))}
              className="mt-2 h-40 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
            />
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              {templateTokens.map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() =>
                    setEmailForm((prev) => ({
                      ...prev,
                      body: `${prev.body}${prev.body.endsWith('\n') ? '' : '\n'}${token}`,
                    }))
                  }
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          {previewRows.length > 0 && (
            <div className="pt-2">
              <div className="text-sm text-gray-600">Preview using</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {previewRows.map((row, idx) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setPreviewIndex(idx)}
                    className={`rounded-full px-2 py-1 text-xs ${
                      idx === previewIndex ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {getPreviewLabel(row)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="button"
              disabled={sending || !canReview}
              onClick={onReview}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Review delivery
            </button>
          </div>
        </div>

        <div>
          <div className="sticky top-32">
            <div className="rounded-md bg-gradient-to-b from-white to-gray-50 p-4">
              <div className="text-xs text-gray-500">Live preview</div>
              <div className="mt-3 flex h-60 items-center justify-center rounded-md bg-gray-100 text-sm text-gray-500">
                Preview updates below
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComposePane;
