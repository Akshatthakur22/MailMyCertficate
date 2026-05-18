import React from 'react';

export function ComposePane({
  csvHeaders,
  recipientColumn,
  setRecipientColumn,
  emailForm,
  setEmailForm,
  previewRows,
  previewIndex,
  setPreviewIndex,
  onReview,
  sending,
}: any) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Compose</p>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900">Prepare your message</h2>
        <p className="mt-2 text-sm text-gray-600">Write one message — we’ll personalize it for each recipient.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-900">Recipient column</label>
            <select
              value={recipientColumn}
              onChange={(e) => setRecipientColumn(e.target.value)}
              className="mt-2 w-full rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none"
            >
              <option value="">Select a column</option>
              {csvHeaders.map((h: string) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">Subject</label>
            <input
              type="text"
              value={emailForm.subject}
              onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              className="mt-2 w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-none"
            />
            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              {['{{Name}}','{{Event}}','{{College}}'].map((t) => (
                <button key={t} type="button" onClick={() => setEmailForm((prev:any) => ({ ...prev, subject: `${prev.subject}${prev.subject.endsWith(' ') ? '' : ' '}${t}` }))} className="text-xs px-2 py-1 rounded-full bg-gray-100">{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">Message</label>
            <textarea
              value={emailForm.body}
              onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
              className="mt-2 w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 h-40 outline-none"
            />
            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              {['{{Name}}','{{Event}}','{{College}}'].map((t) => (
                <button key={t} type="button" onClick={() => setEmailForm((prev:any) => ({ ...prev, body: `${prev.body}${prev.body.endsWith('\n') ? '' : '\n'}${t}` }))} className="text-xs px-2 py-1 rounded-full bg-gray-100">{t}</button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <div className="text-sm text-gray-600">Preview using</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {previewRows.map((row: any, idx: number) => (
                <button key={row.id} onClick={() => setPreviewIndex(idx)} className={`text-xs px-2 py-1 rounded-full ${idx === previewIndex ? 'bg-gray-900 text-white' : 'bg-white'}`}>
                  {row.data?.Name || row.data?.name || `#${row.id}`}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button disabled={sending} onClick={onReview} className="inline-flex items-center gap-2 px-4 py-3 bg-accent text-white rounded-lg">
              Review delivery
            </button>
          </div>
        </div>

        <div>
          <div className="sticky top-32">
            <div className="bg-gradient-to-b from-white to-gray-50 p-4 rounded-md">
              {/* Live preview area will be replaced by a separate component */}
              <div className="text-xs text-gray-500">Live preview</div>
              <div className="mt-3">
                {/* placeholder — parent will render actual preview component here if needed */}
                <div className="w-full h-60 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">Preview</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComposePane;
