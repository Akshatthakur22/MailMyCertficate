'use client';

import { CheckCircle2, AlertTriangle, Loader2, Clock3 } from 'lucide-react';
import { type EmailQueueItem } from '@/core/queue/emailQueue';

function getName(item: EmailQueueItem) {
  return item.recipient.split('@')[0].replace(/[._-]+/g, ' ');
}

export function LiveActivityFeed({ items, currentSendingIds }: { items: EmailQueueItem[]; currentSendingIds: string[] }) {
  const feed = [...items]
    .filter((item) => item.status !== 'pending')
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 6);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Live activity</p>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">A calm record of what is happening now</h3>
        </div>
        <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">Updates live</div>
      </div>

      <div className="mt-5 space-y-2">
        {feed.length === 0 ? (
          <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            <Clock3 className="h-4 w-4" />
            Activity will appear here as delivery begins.
          </div>
        ) : (
          feed.map((item) => {
            const active = currentSendingIds.includes(item.id);
            const tone = item.status === 'sent' ? 'sent' : item.status === 'failed' ? 'failed' : active ? 'sending' : 'retry';
            const icon = tone === 'sent' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : tone === 'failed' ? (
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
            );

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition-colors ${
                  active ? 'border-sky-200 bg-sky-50' : 'border-gray-200 bg-gray-50/80'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  {icon}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-gray-900">{item.recipient}</div>
                    <div className="truncate text-xs text-gray-500">{tone === 'sent' ? `Sent to ${getName(item)}` : tone === 'failed' ? `Needs attention for ${getName(item)}` : active ? `Sending to ${getName(item)}` : `Retry queued for ${getName(item)}`}</div>
                  </div>
                </div>
                <div className="shrink-0 text-xs font-medium text-gray-500">{new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
