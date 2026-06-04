import { db, type Session } from '@/core/db/schema';
import { useAppStore } from '@/store/useAppStore';
import type { EmailStatus, SessionSummary, WorkflowStage } from '@/types/session';
import { WORKFLOW_STAGE_LABELS } from '@/types/session';
import {
  AUTO_CLEANUP_DELAY_MS,
  BATCH_LOCAL_STORAGE_KEYS,
  PRESERVED_LOCAL_STORAGE_KEYS,
  RECOVERY_DECIDED_KEY,
  SESSION_BROADCAST_CHANNEL,
  SESSION_EXPIRY_MS,
} from './sessionConstants';
import { hydrateSessionFromIDB } from './sessionHydration';

const generateSessionId = () => Math.random().toString(36).substring(2, 11);

function broadcastSessionEvent(type: 'cleanup' | 'new-batch', sessionId?: string) {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;
  try {
    const channel = new BroadcastChannel(SESSION_BROADCAST_CHANNEL);
    channel.postMessage({ type, sessionId, at: Date.now() });
    channel.close();
  } catch {
    // ignore
  }
}

function clearBatchLocalStorage() {
  if (typeof window === 'undefined') return;
  for (const key of BATCH_LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}

function isPreservedKey(key: string): boolean {
  return (PRESERVED_LOCAL_STORAGE_KEYS as readonly string[]).includes(key);
}

async function deleteSessionData(sessionId: string): Promise<void> {
  await db.certificates.where({ sessionId }).delete();
  await db.rows.where({ sessionId }).delete();
  await db.files.where({ sessionId }).delete();
  await db.queueItems.where({ sessionId }).delete();
  await db.sessions.delete(sessionId);
}

export async function createSession(
  sessionId: string = generateSessionId(),
  overrides: Partial<Session> = {}
): Promise<Session> {
  const now = Date.now();
  const record: Session = {
    id: sessionId,
    createdAt: now,
    updatedAt: now,
    lastActivity: now,
    workflowStage: 'UPLOAD',
    templateDimensions: null,
    currentStep: 1,
    emailStatus: 'none',
    ...overrides,
  };
  await db.sessions.put(record);
  return record;
}

export async function getSessionRecord(sessionId: string): Promise<Session | undefined> {
  try {
    return await db.sessions.get(sessionId);
  } catch {
    return undefined;
  }
}

export async function touchActivity(sessionId?: string): Promise<void> {
  const id = sessionId ?? useAppStore.getState().sessionId;
  const existing = await getSessionRecord(id);
  const now = Date.now();
  if (existing) {
    await db.sessions.update(id, { lastActivity: now, updatedAt: now });
  } else {
    await createSession(id);
  }
}

export async function updateSession(
  sessionId: string,
  updates: Partial<
    Pick<
      Session,
      | 'workflowStage'
      | 'currentStep'
      | 'templateDimensions'
      | 'emailStatus'
      | 'zipDownloadedAt'
      | 'keepSessionAfterEmail'
    >
  >
): Promise<void> {
  const existing = await getSessionRecord(sessionId);
  const now = Date.now();
  if (existing) {
    await db.sessions.update(sessionId, {
      ...updates,
      updatedAt: now,
      lastActivity: now,
    });
  } else {
    await createSession(sessionId, {
      ...updates,
      updatedAt: now,
      lastActivity: now,
    });
  }
}

export async function inferWorkflowStage(sessionId: string): Promise<WorkflowStage> {
  const record = await getSessionRecord(sessionId);
  if (record?.workflowStage) return record.workflowStage;

  const [templateCount, rowCount, completedCerts, queueItems] = await Promise.all([
    db.files.where({ sessionId, type: 'template' }).count(),
    db.rows.where({ sessionId }).count(),
    db.certificates.where({ sessionId, status: 'completed' }).count(),
    db.queueItems.where({ sessionId }).toArray(),
  ]);

  const zustandStep = useAppStore.getState().currentStep;

  if (queueItems.some((item) => item.status === 'sending' || item.status === 'pending')) {
    return 'SENDING';
  }
  if (record?.emailStatus === 'complete' || queueItems.every((i) => i.status === 'sent')) {
    return 'COMPLETED';
  }
  if (record?.zipDownloadedAt) return 'DOWNLOAD';
  if (completedCerts > 0 && rowCount > 0 && completedCerts >= rowCount) return 'DOWNLOAD';
  if (zustandStep >= 4 || completedCerts > 0) return 'GENERATE';
  if (rowCount > 0 && templateCount > 0) return 'UPLOAD';
  if (templateCount > 0) return 'UPLOAD';
  return 'UPLOAD';
}

export async function buildSessionSummary(sessionId: string): Promise<SessionSummary> {
  const record = await getSessionRecord(sessionId);
  const createdAt = record?.createdAt ?? Date.now();
  const lastActivity = record?.lastActivity ?? createdAt;
  const age = Date.now() - createdAt;
  const expired = age > SESSION_EXPIRY_MS;

  const [certificatesCount, recipientsCount, hasTemplate, hasCsv, workflowStage] =
    await Promise.all([
      db.certificates.where({ sessionId, status: 'completed' }).count(),
      db.rows.where({ sessionId }).count(),
      db.files.get(`${sessionId}-template`).then(Boolean),
      db.rows.where({ sessionId }).count().then((c) => c > 0),
      inferWorkflowStage(sessionId),
    ]);

  let emailStatus: EmailStatus = record?.emailStatus ?? 'none';
  if (emailStatus === 'none') {
    const queue = await db.queueItems.where({ sessionId }).toArray();
    if (queue.length > 0) {
      const allSent = queue.every((item) => item.status === 'sent');
      const anySent = queue.some((item) => item.status === 'sent');
      emailStatus = allSent ? 'complete' : anySent ? 'partial' : 'none';
    }
  }

  return {
    sessionId,
    createdAt,
    lastActivity,
    updatedAt: record?.updatedAt ?? createdAt,
    workflowStage,
    workflowStageLabel: WORKFLOW_STAGE_LABELS[workflowStage],
    certificatesCount,
    recipientsCount,
    emailStatus,
    currentStep: record?.currentStep ?? useAppStore.getState().currentStep,
    hasTemplate,
    hasCsv,
    expired,
  };
}

export function isRecoverableSummary(summary: SessionSummary): boolean {
  if (summary.expired) return false;
  return summary.hasTemplate || summary.hasCsv || summary.certificatesCount > 0;
}

export async function getCurrentSession(): Promise<SessionSummary | null> {
  const sessionId = useAppStore.getState().sessionId;
  const summary = await buildSessionSummary(sessionId);
  if (!isRecoverableSummary(summary)) return null;
  return summary;
}

export async function detectRecoverableSession(): Promise<SessionSummary | null> {
  await cleanupExpiredSessions();

  if (typeof window !== 'undefined' && sessionStorage.getItem(RECOVERY_DECIDED_KEY) === '1') {
    return null;
  }

  const summary = await getCurrentSession();
  if (!summary || !isRecoverableSummary(summary)) return null;
  return summary;
}

export function markRecoveryDecided(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(RECOVERY_DECIDED_KEY, '1');
  }
}

export function clearRecoveryDecided(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(RECOVERY_DECIDED_KEY);
  }
}

export async function restoreSession(summary: SessionSummary): Promise<void> {
  useAppStore.getState().setSessionId(summary.sessionId);
  if (summary.currentStep >= 1 && summary.currentStep <= 4) {
    useAppStore.getState().setCurrentStep(summary.currentStep);
  }
  await hydrateSessionFromIDB(summary.sessionId);
  await touchActivity(summary.sessionId);
  useAppStore.getState().bumpSessionHydration();
  markRecoveryDecided();
}

export async function cleanupCurrentSession(sessionId?: string): Promise<void> {
  const id = sessionId ?? useAppStore.getState().sessionId;
  await deleteSessionData(id);
  clearBatchLocalStorage();
  broadcastSessionEvent('cleanup', id);
}

export async function cleanupExpiredSessions(): Promise<number> {
  const threshold = Date.now() - SESSION_EXPIRY_MS;
  let removed = 0;
  try {
    const oldSessions = await db.sessions.where('createdAt').below(threshold).toArray();
    for (const session of oldSessions) {
      await deleteSessionData(session.id);
      removed += 1;
    }
  } catch (error) {
    console.warn('Session expiry cleanup failed:', error);
  }
  return removed;
}

export async function startNewBatch(): Promise<string> {
  const previousId = useAppStore.getState().sessionId;
  await cleanupCurrentSession(previousId);

  const newSessionId = generateSessionId();
  await createSession(newSessionId);

  useAppStore.setState({
    sessionId: newSessionId,
    template: null,
    templateDimensions: null,
    csvHeaders: [],
    csvData: [],
    fields: [],
    currentStep: 1,
    isGenerating: false,
    generationProgress: 0,
    errorState: null,
  });

  clearRecoveryDecided();
  broadcastSessionEvent('new-batch', newSessionId);
  return newSessionId;
}

export async function deleteAllLocalData(): Promise<void> {
  const sessionId = useAppStore.getState().sessionId;
  await cleanupCurrentSession(sessionId);

  if (typeof window !== 'undefined') {
    const preserved: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && isPreservedKey(key)) {
        preserved[key] = localStorage.getItem(key)!;
      }
    }

    localStorage.removeItem('mailmycertificate-v2-storage');
    clearBatchLocalStorage();
    clearRecoveryDecided();

    for (const [key, value] of Object.entries(preserved)) {
      localStorage.setItem(key, value);
    }
  }

  try {
    await db.queueItems.clear();
    const remainingSessions = await db.sessions.toArray();
    for (const session of remainingSessions) {
      await deleteSessionData(session.id);
    }
  } catch (error) {
    console.warn('deleteAllLocalData IDB sweep failed:', error);
  }

  const newSessionId = generateSessionId();
  await createSession(newSessionId);
  useAppStore.setState({
    sessionId: newSessionId,
    template: null,
    templateDimensions: null,
    csvHeaders: [],
    csvData: [],
    fields: [],
    currentStep: 1,
    isGenerating: false,
    generationProgress: 0,
    errorState: null,
  });
}

export function scheduleAutoCleanup(
  sessionId: string,
  onTick: (secondsLeft: number) => void,
  onComplete: () => void
): () => void {
  let cancelled = false;
  let secondsLeft = Math.floor(AUTO_CLEANUP_DELAY_MS / 1000);

  const interval = setInterval(() => {
    if (cancelled) return;
    secondsLeft -= 1;
    onTick(Math.max(0, secondsLeft));
    if (secondsLeft <= 0) {
      clearInterval(interval);
      onComplete();
    }
  }, 1000);

  onTick(secondsLeft);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}

export async function cancelAutoCleanup(sessionId: string): Promise<void> {
  await updateSession(sessionId, { keepSessionAfterEmail: true });
}

export async function persistEmailQueueItems(
  items: Array<{
    id: string;
    sessionId: string;
    rowId: number;
    recipient: string;
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
  }>
): Promise<void> {
  if (items.length === 0) return;
  await db.queueItems.bulkPut(items);
}

export function subscribeSessionSync(
  onRemoteCleanup: (sessionId: string) => void,
  onRemoteNewBatch: (sessionId: string) => void
): () => void {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return () => {};
  }
  const channel = new BroadcastChannel(SESSION_BROADCAST_CHANNEL);
  channel.onmessage = (event) => {
    const { type, sessionId } = event.data ?? {};
    if (!sessionId) return;
    if (type === 'cleanup' && sessionId === useAppStore.getState().sessionId) {
      onRemoteCleanup(sessionId);
    }
    if (type === 'new-batch') {
      onRemoteNewBatch(sessionId);
    }
  };
  return () => channel.close();
}
