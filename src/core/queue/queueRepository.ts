import { db, type QueueItem } from '@/core/db/schema';
import type { EmailQueueItem, QueueItemStatus } from '@/types/queue';

export type QueueCreateItem = Pick<
  EmailQueueItem,
  'rowId' | 'recipient' | 'displayName' | 'subject' | 'body'
> &
  Partial<Pick<EmailQueueItem, 'maxAttempts'>>;

const TERMINAL_STATUSES = new Set<QueueItemStatus>(['sent', 'failed']);
const ACTIVE_STATUSES = new Set<QueueItemStatus>(['pending', 'sending', 'retry', 'interrupted']);

export function getQueueItemId(sessionId: string, rowId: number): string {
  return `${sessionId}-${rowId}`;
}

function toStoredItem(item: EmailQueueItem): QueueItem {
  return {
    id: item.id,
    sessionId: item.sessionId,
    rowId: item.rowId,
    recipient: item.recipient,
    displayName: item.displayName,
    subject: item.subject,
    body: item.body,
    status: item.status,
    attempts: item.attempts,
    maxAttempts: item.maxAttempts,
    error: item.error,
    errorType: item.errorType,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    sentAt: item.sentAt,
  };
}

function fromStoredItem(item: QueueItem): EmailQueueItem {
  return {
    id: item.id,
    sessionId: item.sessionId,
    rowId: item.rowId,
    recipient: item.recipient,
    displayName: item.displayName,
    subject: item.subject,
    body: item.body,
    status: item.status,
    attempts: item.attempts,
    maxAttempts: item.maxAttempts,
    error: item.error,
    errorType: item.errorType,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    sentAt: item.sentAt,
  };
}

export class QueueRepository {
  async createQueue(sessionId: string, items: QueueCreateItem[], options: { replace?: boolean } = {}) {
    const now = Date.now();
    const records = items.map<EmailQueueItem>((item) => ({
      id: getQueueItemId(sessionId, item.rowId),
      sessionId,
      rowId: item.rowId,
      recipient: item.recipient,
      displayName: item.displayName,
      subject: item.subject,
      body: item.body,
      status: 'pending',
      attempts: 0,
      maxAttempts: item.maxAttempts ?? 3,
      createdAt: now,
      updatedAt: now,
    }));

    await db.transaction('rw', db.queueItems, async () => {
      if (options.replace) {
        await db.queueItems.where({ sessionId }).delete();
      }
      if (records.length > 0) {
        await db.queueItems.bulkPut(records.map(toStoredItem));
      }
    });

    return records;
  }

  async loadQueue(sessionId: string): Promise<EmailQueueItem[]> {
    const items = await db.queueItems.where({ sessionId }).toArray();
    return items
      .map(fromStoredItem)
      .sort((a, b) => a.createdAt - b.createdAt || a.rowId - b.rowId);
  }

  async updateItem(
    id: string,
    updates: Partial<Omit<EmailQueueItem, 'id' | 'sessionId' | 'rowId' | 'createdAt'>>
  ): Promise<void> {
    await db.queueItems.update(id, {
      ...updates,
      updatedAt: updates.updatedAt ?? Date.now(),
    });
  }

  async claimForSending(item: EmailQueueItem): Promise<EmailQueueItem | null> {
    return db.transaction('rw', db.queueItems, async () => {
      const stored = await db.queueItems.get(item.id);
      if (!stored || (stored.status !== 'pending' && stored.status !== 'retry')) {
        return null;
      }

      const now = Date.now();
      const next: QueueItem = {
        ...stored,
        status: 'sending',
        attempts: stored.attempts + 1,
        error: undefined,
        errorType: undefined,
        updatedAt: now,
      };

      await db.queueItems.put(next);
      return fromStoredItem(next);
    });
  }

  async markInterrupted(sessionId: string): Promise<EmailQueueItem[]> {
    const now = Date.now();
    const sendingItems = await db.queueItems
      .where({ sessionId, status: 'sending' })
      .toArray();

    if (sendingItems.length === 0) return [];

    await db.transaction('rw', db.queueItems, async () => {
      for (const item of sendingItems) {
        await db.queueItems.update(item.id, {
          status: 'interrupted',
          error: 'Sending was interrupted before the browser received Gmail confirmation.',
          errorType: 'network',
          updatedAt: now,
        });
      }
    });

    return this.loadQueue(sessionId);
  }

  async clearQueue(sessionId: string): Promise<void> {
    await db.queueItems.where({ sessionId }).delete();
  }

  async hasUnfinishedQueue(sessionId: string): Promise<boolean> {
    const items = await this.loadQueue(sessionId);
    return items.some((item) => ACTIVE_STATUSES.has(item.status));
  }

  isComplete(items: EmailQueueItem[]): boolean {
    return items.length > 0 && items.every((item) => TERMINAL_STATUSES.has(item.status));
  }
}

export const queueRepository = new QueueRepository();
