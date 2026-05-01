'use client';

import React from 'react';
import { XCircle, AlertTriangle, RefreshCw, Mail, Download, Filter } from 'lucide-react';
import { type EmailQueueItem } from '@/core/queue/emailQueue';

interface FailedRecipientsListProps {
  failedItems: EmailQueueItem[];
  onRetryFailed?: () => void;
  onRetrySingle?: (item: EmailQueueItem) => void;
  isRetrying?: boolean;
}

export function FailedRecipientsList({ 
  failedItems, 
  onRetryFailed, 
  onRetrySingle, 
  isRetrying = false 
}: FailedRecipientsListProps) {
  const [filter, setFilter] = React.useState<'all' | 'temporary' | 'permanent'>('all');

  const filteredItems = failedItems.filter(item => {
    if (filter === 'all') return true;
    return item.errorType === filter;
  });

  const temporaryFailures = failedItems.filter(item => item.errorType === 'temporary');
  const permanentFailures = failedItems.filter(item => item.errorType === 'permanent');

  const getErrorIcon = (item: EmailQueueItem) => {
    return item.errorType === 'permanent' ? (
      <XCircle className="w-5 h-5 text-red-500" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-amber-500" />
    );
  };

  const getErrorDescription = (item: EmailQueueItem) => {
    if (item.errorType === 'permanent') {
      return 'Permanent failure - check email address';
    }
    return 'Temporary failure - can be retried';
  };

  const canRetry = (item: EmailQueueItem) => {
    return item.errorType === 'temporary' && item.attempts < item.maxAttempts;
  };

  if (failedItems.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">All Emails Sent Successfully!</h3>
        <p className="text-green-600">No failed deliveries to report.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-gray-900">Failed Deliveries</h3>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-amber-600 font-medium">
                {temporaryFailures.length} Temporary
              </span>
              <span className="text-red-600 font-medium">
                {permanentFailures.length} Permanent
              </span>
            </div>
          </div>
          
          {temporaryFailures.length > 0 && onRetryFailed && (
            <button
              onClick={onRetryFailed}
              disabled={isRetrying}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              Retry Failed ({temporaryFailures.length})
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-gray-200 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({failedItems.length})
            </button>
            <button
              onClick={() => setFilter('temporary')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'temporary' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Temporary ({temporaryFailures.length})
            </button>
            <button
              onClick={() => setFilter('permanent')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'permanent' 
                  ? 'bg-red-100 text-red-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Permanent ({permanentFailures.length})
            </button>
          </div>
        </div>
      </div>

      {/* Failed Items List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredItems.map((item) => (
          <div key={item.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getErrorIcon(item)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{item.recipient}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.errorType === 'permanent' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.errorType === 'permanent' ? 'Permanent' : 'Temporary'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <div className="font-medium truncate">{item.subject}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getErrorDescription(item)}
                    </div>
                  </div>

                  {item.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      {item.error}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Attempts: {item.attempts}/{item.maxAttempts}</span>
                    <span>Failed: {new Date(item.updatedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {canRetry(item) && onRetrySingle && (
                  <button
                    onClick={() => onRetrySingle(item)}
                    disabled={isRetrying}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                )}
                
                <button
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  title="View certificate details"
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-gray-400" />
            </div>
            <p>No {filter} failures found</p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-medium">{failedItems.length}</span> total failures •
            <span className="text-amber-600 font-medium ml-1">{temporaryFailures.length}</span> can be retried
          </div>
          
          {temporaryFailures.length > 0 && (
            <div className="text-amber-600 font-medium">
              Retry rate limit: 1 attempt remaining
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
