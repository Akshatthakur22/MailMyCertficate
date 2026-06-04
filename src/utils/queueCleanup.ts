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
        oldCompletedItemsCount = oldCompletedItems.length;
        const oldSessionIds = [...new Set(oldCompletedItems.map(item => item.sessionId))];
        
        for (const oldSessionId of oldSessionIds) {
          await db.queueItems.where({ sessionId: oldSessionId }).delete();
        }
        
        console.log(`✅ Cleaned up ${oldCompletedItems.length} old completed queue items from ${oldSessionIds.length} sessions`);
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

    // 3. Clean up stuck "sending" items (older than 30 minutes)
    const THIRTY_MINUTES = 30 * 60 * 1000;
    const stuckSendingItems = await db.queueItems
      .where('status')
      .equals('sending')
      .and(item => item.updatedAt < (Date.now() - THIRTY_MINUTES))
      .toArray();

    if (stuckSendingItems.length > 0) {
      await db.queueItems.bulkDelete(stuckSendingItems.map(item => item.id));
      console.log(`✅ Cleaned up ${stuckSendingItems.length} stuck sending items`);
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
    const activeStatuses = ['pending', 'sending', 'retry'];
    
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
export async function prepareForNewCampaign(_newSessionId: string) {
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
