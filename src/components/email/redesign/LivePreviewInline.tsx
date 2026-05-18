import React from 'react';

export function LivePreviewInline({ subject, body, previewRecipient, attachmentCount }: any) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">Previewing</div>
          <div className="font-medium text-gray-900 mt-1">{previewRecipient || 'First participant'}</div>
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
