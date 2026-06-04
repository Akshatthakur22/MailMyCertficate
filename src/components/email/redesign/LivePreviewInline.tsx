import React from 'react';

export function LivePreviewInline({ subject, body, previewName, previewEmail, attachmentCount }: {
  subject: string;
  body: string;
  previewName: string;
  previewEmail: string;
  attachmentCount: number;
}) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-xs text-gray-500">Previewing</div>
          <div className="mt-1 font-medium text-gray-900">{previewName || 'First participant'}</div>
          {previewEmail ? (
            <div className="truncate text-xs text-gray-500">To: {previewEmail}</div>
          ) : null}
        </div>
        <div className="text-sm text-gray-500">{attachmentCount} attachment{attachmentCount === 1 ? '' : 's'}</div>
      </div>

      <div className="mt-4">
        <div className="font-semibold text-gray-900">{subject}</div>
        <div className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{body}</div>
      </div>
    </div>
  );
}

export default LivePreviewInline;
