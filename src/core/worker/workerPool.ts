import type { Field } from '@/types/field';
import type { CSVRow } from '@/types/csv';

export interface RenderJob {
    rowId: number;
    rowData: CSVRow;
}

export interface WorkerJobResult {
    rowId: number;
    status: 'success' | 'error';
    pdfBytes?: Uint8Array;
    error?: string;
}

export interface WorkerPoolOptions {
    template: Blob;
    fields: Field[];
    poolSize?: number;
    onProgress?: (completed: number, total: number) => void;
    onResult?: (result: WorkerJobResult) => Promise<void> | void;
}

export class CertificateWorkerPool {
    private workers: Worker[] = [];
    private poolSize: number;
    private template: Blob;
    private fields: Field[];
    private isTerminated = false;

    constructor(options: WorkerPoolOptions) {
        this.template = options.template;
        this.fields = options.fields;

        const maxConcurrency = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
        // Limit pool size between 2 and 6 to avoid excessive browser memory consumption
        this.poolSize = options.poolSize || Math.max(2, Math.min(maxConcurrency, 6));
    }

    /**
     * Initializes worker instances and waits until all workers post { status: 'ready' }
     */
    async init(): Promise<void> {
        this.workers = [];
        const readyPromises: Promise<void>[] = [];

        for (let i = 0; i < this.poolSize; i++) {
            const worker = new Worker(new URL('./pdf.worker.ts', import.meta.url), { type: 'module' });
            this.workers.push(worker);

            const readyPromise = new Promise<void>((resolve) => {
                const timeout = setTimeout(() => {
                    resolve();
                }, 4000);

                const handler = (e: MessageEvent) => {
                    if (e.data?.status === 'ready') {
                        clearTimeout(timeout);
                        worker.removeEventListener('message', handler);
                        resolve();
                    }
                };
                worker.addEventListener('message', handler);
                worker.onerror = (err) => {
                    clearTimeout(timeout);
                    console.warn('Worker initialization error:', err);
                    resolve();
                };
            });

            readyPromises.push(readyPromise);

            // Send INIT message to worker
            worker.postMessage({
                type: 'INIT',
                template: this.template,
                fields: this.fields,
            });
        }

        await Promise.all(readyPromises);
    }

    /**
     * Processes a queue of render jobs concurrently across the worker pool
     */
    async processQueue(
        jobs: RenderJob[],
        onResult: (result: WorkerJobResult) => Promise<void> | void,
        onProgress?: (completed: number, total: number) => void
    ): Promise<void> {
        if (this.isTerminated || this.workers.length === 0) {
            throw new Error('Worker pool not ready or already terminated');
        }

        const total = jobs.length;
        let completedCount = 0;
        let nextJobIndex = 0;

        return new Promise<void>((resolve, reject) => {
            if (jobs.length === 0) {
                resolve();
                return;
            }

            // Function to assign the next job to an idle worker
            const dispatchNext = (workerIndex: number) => {
                if (this.isTerminated) return;

                if (nextJobIndex >= jobs.length) {
                    if (completedCount >= total) {
                        resolve();
                    }
                    return;
                }

                const job = jobs[nextJobIndex++];
                const worker = this.workers[workerIndex];

                const messageHandler = async (e: MessageEvent) => {
                    if (e.data?.rowId === job.rowId) {
                        worker.removeEventListener('message', messageHandler);

                        try {
                            await onResult({
                                rowId: e.data.rowId,
                                status: e.data.status,
                                pdfBytes: e.data.pdfBytes,
                                error: e.data.error,
                            });
                        } catch (err) {
                            console.error('Error handling worker result:', err);
                        }

                        completedCount++;
                        if (onProgress) {
                            onProgress(completedCount, total);
                        }

                        // Dispatch next job to this worker
                        dispatchNext(workerIndex);
                    }
                };

                worker.addEventListener('message', messageHandler);

                worker.postMessage({
                    type: 'PROCESS',
                    rowData: job.rowData,
                    rowId: job.rowId,
                });
            };

            // Start each worker with an initial job
            for (let i = 0; i < this.workers.length; i++) {
                dispatchNext(i);
            }
        });
    }

    /**
     * Terminates all workers in the pool
     */
    terminate(): void {
        this.isTerminated = true;
        for (const worker of this.workers) {
            worker.terminate();
        }
        this.workers = [];
    }
}
