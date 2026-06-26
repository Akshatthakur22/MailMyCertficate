import {
  DEFAULT_QUEUE_CONFIG,
  type EmailQueueItem,
  type EmailQueueState,
  type QueueConfig,
  type QueueItemStatus,
  type SendProgressUpdate,
} from '@/types/queue';
import { emailService } from '@/services/emailService';
import { queueRepository, type QueueCreateItem, type QueueRepository } from './queueRepository';

export type { EmailQueueItem, EmailQueueState, SendProgressUpdate };

export class EmailQueue {
  private state: EmailQueueState;
  private config: QueueConfig;
  private repository: QueueRepository;
  private progressCallback?: (update: SendProgressUpdate) => void;
  private certificateResolver?: (sessionId: string, rowId: number) => Promise<Uint8Array | undefined>;
  private processingTimer?: NodeJS.Timeout;
  private currentDelay = DEFAULT_QUEUE_CONFIG.baseDelay;
  private sessionId?: string;
  private startPromise?: Promise<void>;

  constructor(config: Partial<QueueConfig> = {}, repository: QueueRepository = queueRepository) {
    this.config = { ...DEFAULT_QUEUE_CONFIG, ...config };
    this.repository = repository;
    this.state = this.getEmptyState();
  }

  onProgress(callback: (update: SendProgressUpdate) => void) {
    this.progressCallback = callback;
  }

  setCertificateResolver(resolver: (sessionId: string, rowId: number) => Promise<Uint8Array | undefined>) {
    this.certificateResolver = resolver;
  }

  async createCampaign(sessionId: string, items: QueueCreateItem[]) {
    this.sessionId = sessionId;
    const queueItems = await this.repository.createQueue(sessionId, items, { replace: true });
    this.setItems(queueItems);
    this.notifyProgress('progress');
    return this.getState();
  }

  async loadCampaign(sessionId: string, options: { markInterrupted?: boolean } = {}) {
    this.sessionId = sessionId;
    if (options.markInterrupted) {
      await this.repository.markInterrupted(sessionId);
    }
    const items = await this.repository.loadQueue(sessionId);
    this.setItems(items);
    this.notifyProgress('progress');
    return this.getState();
  }

  async startProcessing() {
    if (this.state.isProcessing) return this.startPromise;
    if (!this.sessionId) return;

    this.state.isProcessing = true;
    this.state.startedAt = this.state.startedAt ?? Date.now();
    this.currentDelay = this.config.baseDelay;
    this.notifyProgress('start');

    this.startPromise = this.processQueue();
    return this.startPromise;
  }

  stopProcessing() {
    this.state.isProcessing = false;
    this.startPromise = undefined;
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = undefined;
    }
    this.notifyProgress('progress');
  }

  async retryItems(statuses: QueueItemStatus[] = ['failed', 'interrupted']) {
    const now = Date.now();
    const retryable = this.state.items.filter((item) => {
      if (!statuses.includes(item.status)) return false;
      if (item.status === 'interrupted') return true;
      return item.attempts < item.maxAttempts;
    });

    for (const item of retryable) {
      await this.repository.updateItem(item.id, {
        status: 'retry',
        error: undefined,
        errorType: undefined,
        updatedAt: now,
      });
    }

    await this.reload();
    return this.startProcessing();
  }

  async clearQueue() {
    this.stopProcessing();
    if (this.sessionId) {
      await this.repository.clearQueue(this.sessionId);
    }
    this.state = this.getEmptyState();
    this.notifyProgress('progress');
  }

  getState(): EmailQueueState {
    return {
      ...this.state,
      items: [...this.state.items],
      currentSendingIds: [...this.state.currentSendingIds],
      stats: { ...this.state.stats },
    };
  }

  private async reload() {
    if (!this.sessionId) return;
    const items = await this.repository.loadQueue(this.sessionId);
    this.setItems(items);
    this.notifyProgress('progress');
  }

  private async processQueue() {
    while (this.state.isProcessing) {
      const pendingItems = this.state.items.filter((item) => item.status === 'pending' || item.status === 'retry');
      const availableSlots = this.config.maxConcurrent - this.state.currentSendingIds.length;

      if (pendingItems.length === 0 && this.state.currentSendingIds.length === 0) {
        if (this.state.items.some((item) => item.status === 'interrupted')) {
          this.state.isProcessing = false;
          this.notifyProgress('progress');
          return;
        }

        this.state.isProcessing = false;
        this.state.completedAt = Date.now();
        this.notifyProgress('complete');
        return;
      }

      if (availableSlots > 0 && pendingItems.length > 0) {
        const itemsToSend = pendingItems.slice(0, availableSlots);
        await this.sendBatch(itemsToSend);
      }

      await new Promise<void>((resolve) => {
        this.processingTimer = setTimeout(resolve, this.currentDelay);
      });
    }
  }

  private async sendBatch(items: EmailQueueItem[]) {
    const results = await Promise.allSettled(items.map((item) => this.sendSingle(item)));
    const rejected = results.find((result) => result.status === 'rejected');
    if (rejected) {
      console.error('Batch send error:', rejected.reason);
    }

    const recentItems = this.state.items.filter((item) => Date.now() - item.updatedAt < 10000);
    if (recentItems.length === 0) return;

    const successRate = recentItems.filter((item) => item.status === 'sent').length / recentItems.length;
    if (successRate > 0.9) {
      this.currentDelay = Math.max(this.config.baseDelay, this.currentDelay * 0.9);
    } else if (successRate < 0.7) {
      this.currentDelay = Math.min(this.config.maxDelay, this.currentDelay * 1.2);
    }
  }

  private async sendSingle(item: EmailQueueItem) {
    const sendingItem = await this.repository.claimForSending(item);
    if (!sendingItem) {
      await this.reload();
      return;
    }

    this.replaceItem(sendingItem);
    this.state.currentSendingIds = Array.from(new Set([...this.state.currentSendingIds, item.id]));
    this.notifyProgress('progress', undefined, sendingItem);

    try {
      let certificateData = sendingItem.certificateData;
      if (!certificateData && this.certificateResolver) {
        certificateData = await this.certificateResolver(sendingItem.sessionId, sendingItem.rowId);
      }

      const result = certificateData
        ? await emailService.sendEmailWithAttachment({
            recipient: sendingItem.recipient,
            subject: sendingItem.subject,
            body: sendingItem.body,
            certificate: certificateData,
          })
        : await emailService.sendEmail({
            recipient: sendingItem.recipient,
            subject: sendingItem.subject,
            body: sendingItem.body,
          });

      if (result.success) {
        await this.persistItemStatus(sendingItem.id, 'sent', { sentAt: Date.now() });
      } else {
        const error = result.error || 'Unknown error';
        await this.persistItemStatus(sendingItem.id, 'failed', {
          error,
          errorType: this.classifyError(error),
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.persistItemStatus(sendingItem.id, 'failed', {
        error: errorMessage,
        errorType: this.classifyError(errorMessage),
      });
    } finally {
      this.state.currentSendingIds = this.state.currentSendingIds.filter((id) => id !== item.id);
      await this.reload();
    }
  }

  private async persistItemStatus(id: string, status: QueueItemStatus, updates: Partial<EmailQueueItem> = {}) {
    const updatedAt = Date.now();
    await this.repository.updateItem(id, { status, updatedAt, ...updates });
    this.state.items = this.state.items.map((item) =>
      item.id === id ? { ...item, status, updatedAt, ...updates } : item
    );
    this.updateStats();
    this.notifyProgress('progress');
  }

  private replaceItem(nextItem: EmailQueueItem) {
    this.state.items = this.state.items.map((item) => (item.id === nextItem.id ? nextItem : item));
    this.updateStats();
  }

  private setItems(items: EmailQueueItem[]) {
    this.state.items = items;
    this.state.currentSendingIds = items.filter((item) => item.status === 'sending').map((item) => item.id);
    this.updateStats();
  }

  private updateStats() {
    this.state.stats = this.state.items.reduce(
      (acc, item) => {
        acc.total++;
        switch (item.status) {
          case 'sent':
            acc.sent++;
            break;
          case 'failed':
            acc.failed++;
            break;
          case 'pending':
            acc.pending++;
            break;
          case 'retry':
            acc.retry++;
            break;
          case 'interrupted':
            acc.interrupted++;
            break;
          case 'sending':
            break;
        }
        return acc;
      },
      { total: 0, sent: 0, failed: 0, pending: 0, retry: 0, interrupted: 0 }
    );
  }

  private classifyError(error: string): 'temporary' | 'permanent' | 'network' {
    const lowerError = error.toLowerCase();

    if (
      lowerError.includes('network') ||
      lowerError.includes('timeout') ||
      lowerError.includes('connection') ||
      lowerError.includes('fetch')
    ) {
      return 'network';
    }

    if (
      lowerError.includes('rate limit') ||
      lowerError.includes('too many requests') ||
      lowerError.includes('quota exceeded')
    ) {
      return 'temporary';
    }

    if (
      lowerError.includes('unauthorized') ||
      lowerError.includes('authentication') ||
      lowerError.includes('forbidden')
    ) {
      return 'permanent';
    }

    if (lowerError.includes('invalid email') || lowerError.includes('recipient') || lowerError.includes('address')) {
      return 'permanent';
    }

    return 'temporary';
  }

  private notifyProgress(type: SendProgressUpdate['type'], error?: string, currentItem?: EmailQueueItem) {
    this.progressCallback?.({
      type,
      queueState: this.getState(),
      currentItem:
        currentItem ??
        this.state.items.find((item) => this.state.currentSendingIds.includes(item.id)),
      error,
    });
  }

  private getEmptyState(): EmailQueueState {
    return {
      items: [],
      isProcessing: false,
      currentSendingIds: [],
      stats: { total: 0, sent: 0, failed: 0, pending: 0, retry: 0, interrupted: 0 },
    };
  }
}
