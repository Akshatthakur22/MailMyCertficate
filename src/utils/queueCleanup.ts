import { db } from '@/core/db/schema';

/**
 * Queue cleanup utilities for safe IndexedDB persistence
 */

export interface CleanupOptions {
  sessionId?: string;
  keepActiveCampaign?: boolean;
  forceCleanup?: boolean;
}

/**
 * Clean up stale queue items and orphaned data
 */
export async function cleanupQueueData(options: CleanupOptions = {}) {
  const { sessionId, keepActiveCampaign = true, forceCleanup = false } = options;
  
  try {
    console.log('🧹 Starting queue cleanup...');

    // 1. Clean up old completed queues (older than 24 hours)
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const threshold = Date.now() - ONE_DAY;
    let oldCompletedItemsCount = 0;

    if (forceCleanup || !keepActiveCampaign) {
      // Clean up all queue items for the session
      if (sessionId) {
        await db.queueItems.where({ sessionId }).delete();
        console.log(`✅ Cleaned up queue items for session: ${sessionId}`);
      }
    } else {
      // Only clean up old completed queues
      const oldCompletedItems = await db.queueItems
        .where('status')
        .equals('sent')
        .and(item => item.updatedAt < threshold)
        .toArray();

      if (oldCompletedItems.length > 0) {
        const oldSessionIds = [...new Set(oldCompletedItems.map(item => item.sessionId))];

        for (const oldSessionId of oldSessionIds) {
          const sessionItems = await db.queueItems.where({ sessionId: oldSessionId }).toArray();
          const completed = sessionItems.length > 0 && sessionItems.every(item => item.status === 'sent' || item.status === 'failed');
          if (completed) {
            oldCompletedItemsCount += sessionItems.length;
            await db.queueItems.where({ sessionId: oldSessionId }).delete();
          }
        }

        console.log(`✅ Cleaned up ${oldCompletedItemsCount} old completed queue items`);
      }
    }

    // 2. Clean up orphaned queue items (no corresponding session)
    const allQueueItems = await db.queueItems.toArray();
    const allSessionIds = await db.sessions.toCollection().primaryKeys() as string[];
    
    const orphanedItems = allQueueItems.filter(item => !allSessionIds.includes(item.sessionId));
    
    if (orphanedItems.length > 0) {
      await db.queueItems.bulkDelete(orphanedItems.map(item => item.id));
      console.log(`✅ Cleaned up ${orphanedItems.length} orphaned queue items`);
    }

    // 3. Mark stale "sending" items as interrupted so users can explicitly resume.
    const THIRTY_MINUTES = 30 * 60 * 1000;
    const stuckSendingItems = await db.queueItems
      .where('status')
      .equals('sending')
      .and(item => item.updatedAt < (Date.now() - THIRTY_MINUTES))
      .toArray();

    if (stuckSendingItems.length > 0) {
      const now = Date.now();
      for (const item of stuckSendingItems) {
        await db.queueItems.update(item.id, {
          status: 'interrupted',
          error: 'Sending was interrupted before the browser received Gmail confirmation.',
          errorType: 'network',
          updatedAt: now,
        });
      }
      console.log(`✅ Marked ${stuckSendingItems.length} stuck sending items as interrupted`);
    }

    console.log('🎉 Queue cleanup completed successfully!');
    
    return {
      oldCompletedItems: oldCompletedItemsCount,
      orphanedItems: orphanedItems.length,
      stuckSendingItems: stuckSendingItems.length,
    };
    
  } catch (error) {
    console.error('❌ Queue cleanup failed:', error);
    throw error;
  }
}

/**
 * Get queue statistics for monitoring
 */
export async function getQueueStats() {
  try {
    const allItems = await db.queueItems.toArray();
    const uniqueSessionIds = [...new Set(allItems.map(item => item.sessionId))];
    
    const stats = {
      total: allItems.length,
      pending: allItems.filter(item => item.status === 'pending').length,
      sending: allItems.filter(item => item.status === 'sending').length,
      sent: allItems.filter(item => item.status === 'sent').length,
      failed: allItems.filter(item => item.status === 'failed').length,
      retry: allItems.filter(item => item.status === 'retry').length,
      sessions: uniqueSessionIds,
    };

    return stats;
  } catch (error) {
    console.error('Failed to get queue stats:', error);
    return null;
  }
}

/**
 * Check if queue has active processing items
 */
export async function hasActiveQueueItems(sessionId?: string) {
  try {
    const activeStatuses = ['pending', 'sending', 'retry', 'interrupted'];
    
    let query = db.queueItems.where('status').anyOf(activeStatuses);
    
    if (sessionId) {
      query = query.and(item => item.sessionId === sessionId);
    }
    
    const count = await query.count();
    return count > 0;
  } catch (error) {
    console.error('Failed to check active queue items:', error);
    return false;
  }
}

/**
 * Safe cleanup for new campaign start
 */
export async function prepareForNewCampaign() {
  const { startNewBatch } = await import('@/core/session/sessionManager');
  await startNewBatch();
}

/**
 * Emergency cleanup - clear all queue data
 */
export async function emergencyQueueCleanup() {
  try {
    console.log('🚨 Emergency queue cleanup initiated...');
    
    await db.queueItems.clear();
    console.log('✅ All queue data cleared');
    
  } catch (error) {
    console.error('❌ Emergency cleanup failed:', error);
    throw error;
  }
}
