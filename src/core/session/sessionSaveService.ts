import { db, type SavedSession } from '@/core/db/schema';
import { useAppStore } from '@/store/useAppStore';
import { trackEvent } from '@/lib/analytics';

/**
 * Service for saving and resuming sessions for returning users.
 * Uses IndexedDB locally; backend would handle email verification/magic links.
 */

export async function saveSessionForEmail(email: string, sessionId: string): Promise<SavedSession> {
  const now = Date.now();
  const id = `${email}-${sessionId}`;

  const saved: SavedSession = {
    id,
    email,
    sessionId,
    createdAt: now,
    lastAccessedAt: now,
  };

  await db.savedSessions.put(saved);

  trackEvent({
    event: 'session_saved',
    email_domain: email.split('@')[1] || 'unknown',
  });

  return saved;
}

export async function getSavedSessionsForEmail(email: string): Promise<SavedSession[]> {
  try {
    return await db.savedSessions.where('email').equals(email).toArray();
  } catch {
    return [];
  }
}

export async function resumeSession(savedSession: SavedSession): Promise<void> {
  // Update last accessed
  const now = Date.now();
  await db.savedSessions.update(savedSession.id, { lastAccessedAt: now });

  // Restore session ID in Zustand
  useAppStore.getState().setSessionId(savedSession.sessionId);

  // Trigger hydration
  useAppStore.getState().bumpSessionHydration();

  trackEvent({
    event: 'session_resumed',
    email_domain: savedSession.email.split('@')[1] || 'unknown',
    days_since_creation: Math.floor((now - savedSession.createdAt) / (1000 * 60 * 60 * 24)),
  });
}

export async function deleteSavedSession(id: string): Promise<void> {
  await db.savedSessions.delete(id);
}

export async function cleanupOldSavedSessions(maxAgeDays: number = 30): Promise<number> {
  const threshold = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  const oldSessions = await db.savedSessions.where('createdAt').below(threshold).toArray();
  
  let deleted = 0;
  for (const session of oldSessions) {
    await db.savedSessions.delete(session.id);
    deleted++;
  }
  
  return deleted;
}
