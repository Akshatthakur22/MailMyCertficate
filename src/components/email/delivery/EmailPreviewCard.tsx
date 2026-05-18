'use client';

import { CheckCircle2, Paperclip, Mail } from 'lucide-react';

export function EmailPreviewCard({
  subject,
  body,
  recipientCount,
  attachmentCount,
  previewRecipient,
}: {
  subject: string;
  body: string;
  recipientCount: number;
  attachmentCount: number;
  previewRecipient: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Live preview</p>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">How each email will feel</h3>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          {recipientCount} personalized emails ready
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Mail className="h-4 w-4" />
          <span>Previewing</span>
          <span className="font-medium text-gray-700">{previewRecipient || 'First participant'}</span>
        </div>
        <div className="mt-4 text-sm font-semibold text-gray-900">{subject || 'Certificate of Completion'}</div>
        <div className="mt-3 space-y-3 text-sm leading-6 text-gray-600 whitespace-pre-wrap">{body || 'Your personalized certificate will appear here.'}</div>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1"><CheckCircle2 className="h-3.5 w-3.5" /> Personalized subject</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1"><Paperclip className="h-3.5 w-3.5" /> {attachmentCount} attachment{attachmentCount === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
}
