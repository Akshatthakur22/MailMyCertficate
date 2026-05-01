'use client';

import React from 'react';
import { CheckCircle, XCircle, Clock, Loader2, AlertTriangle, Mail } from 'lucide-react';
import { type EmailQueueItem } from '@/core/queue/emailQueue';

interface SendProgressTableProps {
  items: EmailQueueItem[];
  currentSendingIds: string[];
  compact?: boolean;
}

export function SendProgressTable({ items, currentSendingIds, compact = false }: SendProgressTableProps) {
  const getStatusIcon = (item: EmailQueueItem) => {
    if (currentSendingIds.includes(item.id)) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }

    switch (item.status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'retry':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (item: EmailQueueItem) => {
    if (currentSendingIds.includes(item.id)) {
      return 'Sending...';
    }

    switch (item.status) {
      case 'sent':
        return 'Sent';
      case 'failed':
        return item.errorType === 'permanent' ? 'Failed (Permanent)' : 'Failed (Retryable)';
      case 'retry':
        return `Retry ${item.attempts}/${item.maxAttempts - 1}`;
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (item: EmailQueueItem) => {
    if (currentSendingIds.includes(item.id)) {
      return 'text-blue-600 bg-blue-50';
    }

    switch (item.status) {
      case 'sent':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return item.errorType === 'permanent' ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50';
      case 'retry':
        return 'text-amber-600 bg-amber-50';
      case 'pending':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (compact) {
    return (
      <div className="space-y-1">
        {items.slice(0, 5).map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon(item)}
              <span className="text-sm font-medium truncate max-w-[200px]">{item.recipient}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item)}`}>
              {getStatusText(item)}
            </span>
          </div>
        ))}
        {items.length > 5 && (
          <div className="text-center text-sm text-gray-500 pt-1">
            ...and {items.length - 5} more
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Send Progress Details</h3>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attempts
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              {items.some(item => item.error) && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item)}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item)}`}>
                      {getStatusText(item)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">{item.recipient}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-600 truncate max-w-[200px]" title={item.subject}>
                    {item.subject}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {item.attempts}/{item.maxAttempts}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {item.sentAt ? formatTime(item.sentAt) : formatTime(item.createdAt)}
                  </div>
                </td>
                {items.some(i => i.error) && (
                  <td className="px-4 py-3">
                    {item.error && (
                      <div className="text-sm text-red-600 truncate max-w-[200px]" title={item.error}>
                        {item.error}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
