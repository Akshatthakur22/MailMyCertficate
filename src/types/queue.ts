export interface EmailQueueItem {
  id: string;
  sessionId: string;
  rowId: number;
  recipient: string;
  /** Participant name for UI only — not sent to Gmail */
  displayName?: string;
  subject: string;
  body: string;
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'retry';
  attempts: number;
  maxAttempts: number;
  error?: string;
  errorType?: 'temporary' | 'permanent' | 'network';
  createdAt: number;
  updatedAt: number;
  sentAt?: number;
  certificateData?: Uint8Array;
}

export interface EmailQueueState {
  items: EmailQueueItem[];
  isProcessing: boolean;
  currentSendingIds: string[];
  stats: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
    retry: number;
  };
  startedAt?: number;
  completedAt?: number;
}

export interface SendProgressUpdate {
  type: 'start' | 'progress' | 'complete' | 'error';
  queueState: EmailQueueState;
  currentItem?: EmailQueueItem;
  error?: string;
}

export interface QueueConfig {
  maxConcurrent: number;
  baseDelay: number;
  maxDelay: number;
  retryDelay: number;
  maxRetries: number;
}

export const DEFAULT_QUEUE_CONFIG: QueueConfig = {
  maxConcurrent: 2,
  baseDelay: 100,
  maxDelay: 500,
  retryDelay: 1000,
  maxRetries: 1,
};
