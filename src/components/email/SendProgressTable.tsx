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
      return (
        <div className="relative flex items-center justify-center">
          <div className="absolute w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <Loader2 className="w-4 h-4 animate-spin text-blue-500 opacity-80" />
        </div>
      )
    }

    switch (item.status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'retry':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'interrupted':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-300" />;
      default:
        return <Clock className="w-4 h-4 text-gray-300" />;
    }
  };

  const getStatusText = (item: EmailQueueItem) => {
    if (currentSendingIds.includes(item.id)) {
      return 'Sending…';
    }

    switch (item.status) {
      case 'sent':
        return 'Sent';
      case 'failed':
        return item.errorType === 'permanent' ? 'Failed' : 'Failed (Retry)';
      case 'retry':
        return `Retry (${item.attempts}/${item.maxAttempts})`;
      case 'interrupted':
        return 'Interrupted';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (item: EmailQueueItem) => {
    if (currentSendingIds.includes(item.id)) {
      return 'text-blue-700 bg-blue-50 border border-blue-200';
    }

    switch (item.status) {
      case 'sent':
        return 'text-green-700 bg-green-50';
      case 'failed':
        return item.errorType === 'permanent' ? 'text-red-700 bg-red-50' : 'text-amber-700 bg-amber-50';
      case 'retry':
        return 'text-amber-700 bg-amber-50';
      case 'interrupted':
        return 'text-rose-700 bg-rose-50';
      case 'pending':
        return 'text-gray-500 bg-gray-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const isCurrentRow = (item: EmailQueueItem) => currentSendingIds.includes(item.id);

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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Delivery Progress</h3>
          <span className="text-sm text-gray-500 ml-auto">{items.filter(i => i.status === 'sent').length} sent</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wide">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wide">
                Recipient
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wide">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wide">
                Attempts
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wide">
                Time
              </th>
              {items.some(item => item.error) && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wide">
                  Error
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr 
                key={item.id} 
                className={`transition-colors ${
                  isCurrentRow(item)
                    ? 'bg-blue-50 border-l-2 border-l-blue-400'
                    : 'hover:bg-gray-50 border-l-2 border-l-transparent'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item)}
                    <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${getStatusColor(item)}`}>
                      {getStatusText(item)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    isCurrentRow(item)
                      ? 'text-blue-900'
                      : 'text-gray-900'
                  }`}>
                    {item.recipient}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 truncate max-w-[250px]" title={item.subject}>
                    {item.subject}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {item.attempts}/{item.maxAttempts}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {item.sentAt ? formatTime(item.sentAt) : formatTime(item.createdAt)}
                  </div>
                </td>
                {items.some(i => i.error) && (
                  <td className="px-6 py-4">
                    {item.error && (
                      <div className="text-xs text-red-600 truncate max-w-[180px]" title={item.error}>
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
