import { useState, useCallback, useRef, useEffect } from 'react';
import { EmailQueue, type SendProgressUpdate, type EmailQueueItem } from '@/core/queue/emailQueue';
import { db } from '@/core/db/schema';
import { useAppStore } from '@/store/useAppStore';

export function useEmailQueue() {
  const queueRef = useRef<EmailQueue | null>(null);
  const [queueState, setQueueState] = useState<any>({
    items: [],
    isProcessing: false,
    currentSendingIds: [],
    stats: { total: 0, sent: 0, failed: 0, pending: 0, retry: 0 },
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const sessionId = useAppStore((state) => state.sessionId);

  // Persist queue state to IndexedDB
  const persistQueueState = useCallback(async (state: typeof queueState) => {
    try {
      // Store queue items in IndexedDB for recovery
      await db.queueItems.where({ sessionId }).delete();
      
      const itemsToStore = state.items.map((item: EmailQueueItem) => ({
        id: item.id,
        sessionId: item.sessionId,
        rowId: item.rowId,
        recipient: item.recipient,
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
      }));

      await db.queueItems.bulkAdd(itemsToStore);
    } catch (error) {
      console.error('Failed to persist queue state:', error);
    }
  }, [sessionId]);

  // Initialize queue
  useEffect(() => {
    if (!queueRef.current) {
      queueRef.current = new EmailQueue({
        maxConcurrent: 2,
        baseDelay: 100,
        maxDelay: 500,
        retryDelay: 1000,
        maxRetries: 1,
      });

      // Set up progress callback
      queueRef.current.onProgress((update: SendProgressUpdate) => {
        setQueueState(update.queueState);
        
        // Persist queue state to IndexedDB
        persistQueueState(update.queueState);
      });
    }
    setIsInitialized(true);
  }, [sessionId, persistQueueState]);

  // Load queue state from IndexedDB
  const loadQueueState = useCallback(async () => {
    try {
      const storedItems = await db.queueItems.where({ sessionId }).toArray();
      
      if (storedItems.length > 0 && queueRef.current) {
        // Convert stored items back to EmailQueueItem format
        const queueItems: EmailQueueItem[] = storedItems.map(item => ({
          id: item.id,
          sessionId: item.sessionId,
          rowId: item.rowId,
          recipient: item.recipient,
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
        }));

        // Restore queue state
        queueRef.current.clearQueue();
        queueRef.current.addItems(queueItems);
        
        const restoredState = queueRef.current.getState();
        setQueueState(restoredState);
        
        return restoredState;
      }
    } catch (error) {
      console.error('Failed to load queue state:', error);
    }
    return null;
  }, [sessionId]);

  // Add email jobs to queue
  const addToQueue = useCallback(async (emailRequests: Array<{
    rowId: number;
    recipient: string;
    subject: string;
    body: string;
    certificateData?: Uint8Array;
  }>) => {
    if (!queueRef.current || !isInitialized) return;

    const items = emailRequests.map(req => ({
      sessionId,
      rowId: req.rowId,
      recipient: req.recipient,
      subject: req.subject,
      body: req.body,
      certificateData: req.certificateData,
      maxAttempts: 2, // Default max attempts (1 initial + 1 retry)
    }));

    queueRef.current.addItems(items);
    setQueueState(queueRef.current.getState());
  }, [sessionId, isInitialized]);

  // Start queue processing
  const startQueue = useCallback(async () => {
    if (!queueRef.current || !isInitialized) return;

    // Try to restore previous state first
    const restoredState = await loadQueueState();
    
    if (restoredState && restoredState.items.length > 0) {
      // Resume processing if there are pending items
      const hasPendingItems = restoredState.items.some((item: any) => 
        item.status === 'pending' || item.status === 'retry'
      );
      
      if (hasPendingItems) {
        queueRef.current.startProcessing();
      }
    } else {
      // Start fresh
      queueRef.current.startProcessing();
    }
  }, [isInitialized, loadQueueState]);

  // Stop queue processing
  const stopQueue = useCallback(() => {
    if (!queueRef.current || !isInitialized) return;
    queueRef.current.stopProcessing();
    setQueueState(queueRef.current.getState());
  }, [isInitialized]);

  // Retry failed items
  const retryFailed = useCallback(() => {
    if (!queueRef.current || !isInitialized) return;
    queueRef.current.retryFailed();
    setQueueState(queueRef.current.getState());
  }, [isInitialized]);

  // Clear queue
  const clearQueue = useCallback(async () => {
    if (!queueRef.current || !isInitialized) return;
    
    queueRef.current.clearQueue();
    setQueueState(queueRef.current.getState());
    
    // Clear from IndexedDB - use bulkDelete for better performance
    try {
      const existingItems = await db.queueItems.where({ sessionId }).toArray();
      if (existingItems.length > 0) {
        await db.queueItems.bulkDelete(existingItems.map(item => item.id));
      }
    } catch (error) {
      console.error('Failed to clear queue from IndexedDB:', error);
      // Fallback to delete all if bulkDelete fails
      try {
        await db.queueItems.where({ sessionId }).delete();
      } catch (fallbackError) {
        console.error('Fallback queue deletion also failed:', fallbackError);
      }
    }
  }, [sessionId, isInitialized]);

  // Get failed items for display
  const getFailedItems = useCallback((): EmailQueueItem[] => {
    return queueState.items.filter((item: any) => item.status === 'failed');
  }, [queueState]);

  // Get currently sending items
  const getCurrentSendingItems = useCallback((): EmailQueueItem[] => {
    return queueState.items.filter((item: any) => 
      queueState.currentSendingIds.includes(item.id)
    );
  }, [queueState]);

  // Calculate estimated time remaining
  const getEstimatedTimeRemaining = useCallback((): number => {
    if (!queueState.isProcessing || queueState.stats.pending === 0) return 0;
    
    const { pending, sent } = queueState.stats;
    const elapsed = queueState.startedAt ? Date.now() - queueState.startedAt : 0;
    
    if (sent === 0) return 0; // Can't estimate yet
    
    const avgTimePerEmail = elapsed / sent;
    return pending * avgTimePerEmail;
  }, [queueState]);

  // Format estimated time
  const formatEstimatedTime = useCallback((ms: number): string => {
    if (ms === 0) return 'Calculating...';
    
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.ceil(seconds / 60);
    
    if (minutes < 60) {
      return `~${minutes} min${minutes !== 1 ? '' : ''}`;
    }
    
    const hours = Math.ceil(minutes / 60);
    return `~${hours} hour${hours !== 1 ? 's' : ''}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (queueRef.current) {
        queueRef.current.stopProcessing();
      }
    };
  }, []);

  return {
    // State
    queueState,
    isInitialized,
    
    // Actions
    addToQueue,
    startQueue,
    stopQueue,
    retryFailed,
    clearQueue,
    
    // Helpers
    getFailedItems,
    getCurrentSendingItems,
    getEstimatedTimeRemaining,
    formatEstimatedTime,
    loadQueueState,
  };
}
