import { EmailQueueItem, EmailQueueState, SendProgressUpdate, QueueConfig, DEFAULT_QUEUE_CONFIG } from '@/types/queue';

export type { EmailQueueItem, EmailQueueState, SendProgressUpdate };
import { emailService } from '@/services/emailService';

export class EmailQueue {
  private state: EmailQueueState;
  private config: QueueConfig;
  private progressCallback?: (update: SendProgressUpdate) => void;
  private processingTimer?: NodeJS.Timeout;
  private currentDelay: number = DEFAULT_QUEUE_CONFIG.baseDelay;

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = { ...DEFAULT_QUEUE_CONFIG, ...config };
    this.state = {
      items: [],
      isProcessing: false,
      currentSendingIds: [],
      stats: { total: 0, sent: 0, failed: 0, pending: 0, retry: 0 },
    };
  }

  // Set progress callback for real-time updates
  onProgress(callback: (update: SendProgressUpdate) => void) {
    this.progressCallback = callback;
  }

  // Add items to queue
  addItems(items: Omit<EmailQueueItem, 'id' | 'status' | 'attempts' | 'createdAt' | 'updatedAt'>[]) {
    const now = Date.now();
    const newItems: EmailQueueItem[] = items.map(item => ({
      ...item,
      id: `${item.sessionId}-${item.rowId}-${now}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending' as const,
      attempts: 0,
      maxAttempts: this.config.maxRetries + 1,
      createdAt: now,
      updatedAt: now,
    }));

    this.state.items = [...this.state.items, ...newItems];
    this.updateStats();
    this.notifyProgress('progress');
  }

  // Start processing queue
  async startProcessing() {
    if (this.state.isProcessing) return;

    this.state.isProcessing = true;
    this.state.startedAt = Date.now();
    this.currentDelay = this.config.baseDelay;
    
    this.notifyProgress('start');
    this.processQueue();
  }

  // Stop processing queue
  stopProcessing() {
    this.state.isProcessing = false;
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = undefined;
    }
  }

  // Retry failed items
  retryFailed() {
    const now = Date.now();
    this.state.items = this.state.items.map(item => {
      if (item.status === 'failed' && item.errorType === 'temporary' && item.attempts < item.maxAttempts) {
        return {
          ...item,
          status: 'retry' as const,
          attempts: item.attempts + 1,
          updatedAt: now,
        };
      }
      return item;
    });

    this.updateStats();
    this.notifyProgress('progress');
    
    // Auto-start processing if not already running
    if (!this.state.isProcessing) {
      this.startProcessing();
    }
  }

  // Get current state
  getState(): EmailQueueState {
    return { ...this.state };
  }

  // Clear queue
  clearQueue() {
    this.stopProcessing();
    this.state = {
      items: [],
      isProcessing: false,
      currentSendingIds: [],
      stats: { total: 0, sent: 0, failed: 0, pending: 0, retry: 0 },
    };
  }

  // Private methods
  private async processQueue() {
    if (!this.state.isProcessing) return;

    const pendingItems = this.state.items.filter(item => 
      item.status === 'pending' || item.status === 'retry'
    );

    const availableSlots = this.config.maxConcurrent - this.state.currentSendingIds.length;
    
    if (pendingItems.length === 0 && this.state.currentSendingIds.length === 0) {
      // Queue is complete
      this.state.isProcessing = false;
      this.state.completedAt = Date.now();
      this.notifyProgress('complete');
      return;
    }

    if (availableSlots > 0 && pendingItems.length > 0) {
      // Start sending next batch
      const itemsToSend = pendingItems.slice(0, availableSlots);
      await this.sendBatch(itemsToSend);
    }

    // Continue processing after delay
    this.processingTimer = setTimeout(() => {
      this.processQueue();
    }, this.currentDelay);
  }

  private async sendBatch(items: EmailQueueItem[]) {
    const sendPromises = items.map(item => this.sendSingle(item));
    
    try {
      await Promise.allSettled(sendPromises);
    } catch (error) {
      console.error('Batch send error:', error);
    }

    // Adaptive delay based on success rate
    const recentItems = this.state.items.filter(item => 
      Date.now() - item.updatedAt < 10000 // Last 10 seconds
    );
    
    const successRate = recentItems.filter(item => item.status === 'sent').length / recentItems.length;
    
    if (successRate > 0.9) {
      this.currentDelay = Math.max(this.config.baseDelay, this.currentDelay * 0.9);
    } else if (successRate < 0.7) {
      this.currentDelay = Math.min(this.config.maxDelay, this.currentDelay * 1.2);
    }
  }

  private async sendSingle(item: EmailQueueItem) {
    // Mark as sending
    this.updateItemStatus(item.id, 'sending');
    this.state.currentSendingIds.push(item.id);

    try {
      // Only send with attachment if certificateData exists
      const result = item.certificateData 
        ? await emailService.sendEmailWithAttachment({
            recipient: item.recipient,
            subject: item.subject,
            body: item.body,
            certificate: item.certificateData,
          })
        : await emailService.sendEmail({
            recipient: item.recipient,
            subject: item.subject,
            body: item.body,
          });

      if (result.success) {
        this.updateItemStatus(item.id, 'sent', { sentAt: Date.now() });
      } else {
        const errorType = this.classifyError(result.error || 'Unknown error');
        this.updateItemStatus(item.id, 'failed', { 
          error: result.error, 
          errorType 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorType = this.classifyError(errorMessage);
      this.updateItemStatus(item.id, 'failed', { 
        error: errorMessage, 
        errorType 
      });
    } finally {
      // Remove from current sending
      this.state.currentSendingIds = this.state.currentSendingIds.filter(id => id !== item.id);
      this.notifyProgress('progress');
    }
  }

  private updateItemStatus(id: string, status: EmailQueueItem['status'], updates: Partial<EmailQueueItem> = {}) {
    this.state.items = this.state.items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          updatedAt: Date.now(),
          ...updates,
        };
      }
      return item;
    });
    this.updateStats();
  }

  private updateStats() {
    const stats = this.state.items.reduce((acc, item) => {
      acc.total++;
      switch (item.status) {
        case 'sent': acc.sent++; break;
        case 'failed': acc.failed++; break;
        case 'pending': acc.pending++; break;
        case 'retry': acc.retry++; break;
      }
      return acc;
    }, { total: 0, sent: 0, failed: 0, pending: 0, retry: 0 });

    this.state.stats = stats;
  }

  private classifyError(error: string): 'temporary' | 'permanent' | 'network' {
    const lowerError = error.toLowerCase();
    
    // Network-related errors (temporary)
    if (lowerError.includes('network') || lowerError.includes('timeout') || 
        lowerError.includes('connection') || lowerError.includes('fetch')) {
      return 'network';
    }
    
    // Rate limiting (temporary)
    if (lowerError.includes('rate limit') || lowerError.includes('too many requests') ||
        lowerError.includes('quota exceeded')) {
      return 'temporary';
    }
    
    // Authentication errors (permanent)
    if (lowerError.includes('unauthorized') || lowerError.includes('authentication') ||
        lowerError.includes('forbidden')) {
      return 'permanent';
    }
    
    // Invalid email addresses (permanent)
    if (lowerError.includes('invalid email') || lowerError.includes('recipient') ||
        lowerError.includes('address')) {
      return 'permanent';
    }
    
    // Default to temporary for unknown errors
    return 'temporary';
  }

  private notifyProgress(type: SendProgressUpdate['type'], error?: string) {
    if (this.progressCallback) {
      const currentItem = this.state.items.find(item => 
        this.state.currentSendingIds.includes(item.id)
      );
      
      this.progressCallback({
        type,
        queueState: this.getState(),
        currentItem,
        error,
      });
    }
  }
}
