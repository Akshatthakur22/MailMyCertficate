import Dexie, { Table } from 'dexie';
import { CSVRow } from '@/types/csv';
import type { EmailStatus, WorkflowStage } from '@/types/session';

export interface Session {
    id: string;
    createdAt: number;
    updatedAt: number;
    lastActivity: number;
    workflowStage: WorkflowStage;
    templateDimensions: { width: number; height: number } | null;
    currentStep: number;
    emailStatus?: EmailStatus;
    zipDownloadedAt?: number;
    keepSessionAfterEmail?: boolean;
}

export interface FileData {
    id: string; // e.g., "template-session123"
    sessionId: string;
    type: 'template' | 'csv-raw';
    blob: Blob;
}

export interface CSVRowData {
    id: number;
    sessionId: string;
    data: CSVRow;
}

export interface CertificateResult {
    rowId: number;
    sessionId: string;
    pdf?: Uint8Array;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error?: string;
    updatedAt: number;
}

export interface QueueItem {
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
}

export class MailMyDB extends Dexie {
    sessions!: Table<Session>;
    files!: Table<FileData>;
    rows!: Table<CSVRowData>;
    certificates!: Table<CertificateResult>;
    queueItems!: Table<QueueItem>;

    constructor() {
        super('MailMyCertificateDB');
        this.version(1).stores({
            sessions: 'id, createdAt',
            files: 'id, sessionId, type',
            rows: '++id, sessionId',
            certificates: '[sessionId+rowId], sessionId, status'
        });
        this.version(2).stores({
            sessions: 'id, createdAt',
            files: 'id, sessionId, type',
            rows: '++id, sessionId',
            certificates: '[sessionId+rowId], sessionId, status',
            queueItems: 'id, sessionId, status, [sessionId+status]'
        });
        this.version(3).stores({
            sessions: 'id, createdAt, lastActivity, workflowStage',
            files: 'id, sessionId, type',
            rows: '++id, sessionId',
            certificates: '[sessionId+rowId], sessionId, status',
            queueItems: 'id, sessionId, status, [sessionId+status]'
        }).upgrade(async (tx) => {
            const now = Date.now();
            await tx.table('sessions').toCollection().modify((session: Session) => {
                session.updatedAt = session.updatedAt ?? session.createdAt ?? now;
                session.lastActivity = session.lastActivity ?? session.updatedAt;
                session.workflowStage = session.workflowStage ?? 'UPLOAD';
                session.emailStatus = session.emailStatus ?? 'none';
            });
        });
    }

    async cleanupOldSessions() {
        const { cleanupExpiredSessions } = await import('@/core/session/sessionManager');
        return cleanupExpiredSessions();
    }
}

export const db = new MailMyDB();
