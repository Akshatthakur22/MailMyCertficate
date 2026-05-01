import Dexie, { Table } from 'dexie';

export interface Session {
    id: string;
    createdAt: number;
    templateDimensions: { width: number; height: number } | null;
    currentStep: number;
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
    data: Record<string, string>;
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
    }

    async cleanupOldSessions() {
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
        const threshold = Date.now() - SEVEN_DAYS;

        const oldSessions = await this.sessions.where('createdAt').below(threshold).toArray();
        for (const session of oldSessions) {
            await this.certificates.where({ sessionId: session.id }).delete();
            await this.rows.where({ sessionId: session.id }).delete();
            await this.files.where({ sessionId: session.id }).delete();
            await this.queueItems.where({ sessionId: session.id }).delete();
            await this.sessions.delete(session.id);
        }
    }
}

export const db = new MailMyDB();
