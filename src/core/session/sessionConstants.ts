export const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
export const AUTO_CLEANUP_DELAY_MS = 60 * 1000;
export const RECOVERY_DECIDED_KEY = 'mmc-recovery-decided';
export const SESSION_BROADCAST_CHANNEL = 'mmc-session-sync';

/** localStorage keys cleared on batch cleanup (not app-wide delete). */
export const BATCH_LOCAL_STORAGE_KEYS = ['mmc-import-source', 'mmc-sheet-url'] as const;

/** Keys preserved during batch cleanup and delete-all-local-data (except full wipe). */
export const PRESERVED_LOCAL_STORAGE_KEYS = ['csrf_token'] as const;
