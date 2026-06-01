'use client';

import React, { useRef, useState } from 'react';
import { Paperclip, ChevronDown, Pencil, Eye, FileText } from 'lucide-react';

interface PreviewRow {
  id: number;
  data?: Record<string, unknown>;
}

interface GmailComposerProps {
  fromEmail: string | null;
  emailColumn: string | null;
  nameColumn: string | null;
  recipientCount: number;
  validation: { valid: number; invalid: number };
  ambiguousColumns: string[];
  selectedColumn: string | null;
  onSelectColumn: (column: string) => void;
  emailForm: { subject: string; body: string };
  setEmailForm: React.Dispatch<React.SetStateAction<{ subject: string; body: string }>>;
  templateTokens: string[];
  attachmentCount: number;
  // Preview
  previewRows: PreviewRow[];
  previewIndex: number;
  setPreviewIndex: (index: number) => void;
  getPreviewLabel: (row: PreviewRow) => string;
  previewSubject: string;
  previewBody: string;
  previewName: string;
  previewEmail: string;
}

export function GmailComposer({
  fromEmail,
  emailColumn,
  recipientCount,
  validation,
  ambiguousColumns,
  selectedColumn,
  onSelectColumn,
  emailForm,
  setEmailForm,
  templateTokens,
  attachmentCount,
  previewRows,
  previewIndex,
  setPreviewIndex,
  getPreviewLabel,
  previewSubject,
  previewBody,
  previewName,
  previewEmail,
}: GmailComposerProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const activeColumn = selectedColumn ?? emailColumn;
  const showColumnPicker = ambiguousColumns.length > 1;

  const insertToken = (field: 'subject' | 'body', token: string) => {
    const el = field === 'subject' ? subjectRef.current : bodyRef.current;
    setEmailForm((prev) => {
      const current = prev[field];
      if (!el) return { ...prev, [field]: `${current}${current.endsWith(' ') || current === '' ? '' : ' '}${token}` };
      const start = el.selectionStart ?? current.length;
      const end = el.selectionEnd ?? current.length;
      const next = `${current.slice(0, start)}${token}${current.slice(end)}`;
      requestAnimationFrame(() => {
        el.focus();
        const caret = start + token.length;
        el.setSelectionRange(caret, caret);
      });
      return { ...prev, [field]: next };
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      {/* Window bar */}
      <div className="flex items-center justify-between border-b border-accent/20 bg-accent px-4 py-2.5">
        <span className="text-sm font-medium text-white">New message</span>
        <div className="inline-flex rounded-lg bg-white/15 p-0.5">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              mode === 'edit' ? 'bg-white text-accent' : 'text-white/80 hover:text-white'
            }`}
          >
            <Pencil className="h-3.5 w-3.5" />
            Compose
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              mode === 'preview' ? 'bg-white text-accent' : 'text-white/80 hover:text-white'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* From */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-sm">
        <span className="w-16 shrink-0 text-secondary">From</span>
        <span className="truncate font-medium text-foreground">{fromEmail ?? 'Your Gmail'}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Connected
        </span>
      </div>

      {/* To */}
      <div className="border-b border-border px-4 py-2.5 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-16 shrink-0 text-secondary">To</span>
          {activeColumn ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-2.5 py-1 text-xs font-medium text-accent">
                {`{{${activeColumn}}}`}
              </span>
              <span className="text-secondary">·</span>
              <span className="font-medium text-foreground">
                {recipientCount} {recipientCount === 1 ? 'recipient' : 'recipients'}
              </span>
              <span className="ml-auto text-xs text-secondary">
                {validation.valid} valid
                {validation.invalid > 0 && (
                  <span className="text-amber-600"> · {validation.invalid} skipped</span>
                )}
              </span>
            </>
          ) : (
            <span className="font-medium text-rose-600">No email column detected in your data</span>
          )}
        </div>

        {showColumnPicker && (
          <div className="mt-2 flex flex-wrap items-center gap-2 pl-[4.5rem]">
            <span className="text-xs text-secondary">Multiple email columns — pick one:</span>
            <div className="relative inline-flex items-center">
              <select
                value={activeColumn ?? ''}
                onChange={(e) => onSelectColumn(e.target.value)}
                className="appearance-none rounded-md border border-border bg-white py-1 pl-2.5 pr-7 text-xs font-medium text-foreground outline-none focus:border-accent"
              >
                {ambiguousColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-secondary" />
            </div>
          </div>
        )}
      </div>

      {mode === 'edit' ? (
        <div className="space-y-4 px-4 py-3">
          {/* Subject */}
          <div>
            <input
              ref={subjectRef}
              type="text"
              value={emailForm.subject}
              onChange={(e) => setEmailForm((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Subject"
              className="w-full border-b border-border bg-transparent pb-2 text-sm font-medium text-foreground outline-none placeholder:text-secondary/70 focus:border-accent"
            />
            <TokenRow tokens={templateTokens} onInsert={(t) => insertToken('subject', t)} />
          </div>

          {/* Body */}
          <div>
            <textarea
              ref={bodyRef}
              value={emailForm.body}
              onChange={(e) => setEmailForm((prev) => ({ ...prev, body: e.target.value }))}
              placeholder="Write your message…"
              className="h-50 w-full resize-none rounded-lg bg-transparent text-sm leading-6 text-foreground outline-none placeholder:text-secondary/70"
            />
            <TokenRow tokens={templateTokens} onInsert={(t) => insertToken('body', t)} />
          </div>

          {/* Attachment */}
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted px-3 py-2 text-xs">
            <Paperclip className="h-3.5 w-3.5 shrink-0 text-secondary" />
            <span className="truncate font-medium text-foreground">certificate.pdf</span>
            <span className="shrink-0 text-secondary">· {attachmentCount} attached</span>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4">
          {previewRows.length > 1 && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-secondary">Preview as</span>
              {previewRows.map((row, idx) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setPreviewIndex(idx)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    idx === previewIndex
                      ? 'bg-accent text-white'
                      : 'bg-muted text-secondary hover:text-foreground'
                  }`}
                >
                  {getPreviewLabel(row)}
                </button>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-border bg-white">
            <div className="border-b border-border px-4 py-3">
              <p className="text-base font-semibold text-foreground">{previewSubject || 'No subject'}</p>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-secondary">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-light text-[11px] font-semibold uppercase text-accent">
                  {(previewName || 'P').slice(0, 1)}
                </span>
                <span className="font-medium text-foreground">{previewName || 'Participant'}</span>
                {previewEmail && <span className="truncate">&lt;{previewEmail}&gt;</span>}
              </div>
            </div>
            <div className="px-4 py-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                {previewBody || 'Your message will appear here.'}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs text-secondary">
                <FileText className="h-4 w-4 text-accent" />
                <span className="font-medium text-foreground">certificate.pdf</span>
                <span>attached</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TokenRow({ tokens, onInsert }: { tokens: string[]; onInsert: (token: string) => void }) {
  if (tokens.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] text-secondary">Insert:</span>
      {tokens.map((token) => (
        <button
          key={token}
          type="button"
          onClick={() => onInsert(token)}
          className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-secondary transition-colors hover:bg-accent-light hover:text-accent"
        >
          {token}
        </button>
      ))}
    </div>
  );
}

export default GmailComposer;
