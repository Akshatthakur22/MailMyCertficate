import { useState, useCallback, useRef } from 'react';
import { db } from '@/core/db/schema';
import { useAppStore } from '@/store/useAppStore';
import {
    getGenerationCount,
    incrementGenerationCount,
    trackEvent,
} from '@/lib/analytics';
import type { GenerationMethod } from '@/lib/analytics';

export function useGenerator() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const workerRef = useRef<Worker | null>(null);

    const startGeneration = useCallback(async (sessionId: string, resume = false) => {
        const generationMethod: GenerationMethod = resume ? 'resume' : 'fresh';
        // Allow restart (e.g. after session recovery) by terminating any in-flight worker
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // 1. Fetch Template and Rows from IDB
            const templateFile = await db.files.get(`${sessionId}-template`);
            const rows = await db.rows.where({ sessionId }).toArray();
            const fields = useAppStore.getState().fields;

            if (!templateFile || rows.length === 0) {
                throw new Error("Missing template or recipient data.");
            }

            // 2. Determine pending jobs (Resume Logic)
            let pendingRows = rows;
            if (resume) {
                const completedResults = await db.certificates
                    .where({ sessionId, status: 'completed' })
                    .toArray();
                const completedIds = new Set(completedResults.map(r => r.rowId));
                pendingRows = rows.filter(r => !completedIds.has(r.id));
            } else {
                await db.certificates.where({ sessionId }).delete();
            }

            if (pendingRows.length === 0) {
                setProgress(100);
                setIsGenerating(false);
                return;
            }

            trackEvent(
                {
                    event: 'certificate_generation_started',
                    certificates_count: pendingRows.length,
                    generation_method: generationMethod,
                },
                { dedupeKey: `${sessionId}-gen-start-${generationMethod}` }
            );

            // 3. Initialize Worker
            workerRef.current = new Worker(new URL('../core/worker/pdf.worker.ts', import.meta.url));

            let processedCount = rows.length - pendingRows.length;
            const total = rows.length;
            setProgress(Math.round((processedCount / total) * 100));

            // 4. Set up worker listener
            workerRef.current.onmessage = async (e) => {
                const { rowId, pdfBytes, status, error: workerError } = e.data;

                if (status === 'ready') {
                    // Start feeding jobs once worker is ready
                    for (const row of pendingRows) {
                        workerRef.current?.postMessage({
                            type: 'PROCESS',
                            rowData: row.data,
                            rowId: row.id
                        });
                    }
                    return;
                }

                if (status === 'success') {
                    await db.certificates.put({
                        sessionId,
                        rowId,
                        pdf: pdfBytes,
                        status: 'completed',
                        updatedAt: Date.now()
                    });
                } else if (status === 'error') {
                    await db.certificates.put({
                        sessionId,
                        rowId,
                        status: 'failed',
                        error: workerError,
                        updatedAt: Date.now()
                    });
                }

                processedCount++;
                const newProgress = Math.round((processedCount / total) * 100);
                setProgress(newProgress);

                if (processedCount === total) {
                    setIsGenerating(false);
                    workerRef.current?.terminate();

                    void db.certificates
                        .where({ sessionId, status: 'failed' })
                        .count()
                        .then((failedCount) => {
                            const dimensions = useAppStore.getState().templateDimensions;
                            const templateName = dimensions
                                ? `custom_${dimensions.width}x${dimensions.height}`
                                : 'custom_upload';

                            const priorGenerations = getGenerationCount();
                            const generationCount = incrementGenerationCount();

                            trackEvent(
                                {
                                    event: 'certificate_generated',
                                    certificates_count: total - failedCount,
                                    failed_count: failedCount,
                                    template_name: templateName,
                                    generation_method: generationMethod,
                                    user_plan: 'free',
                                },
                                { dedupeKey: `${sessionId}-gen-done-${total}` }
                            );

                            if (priorGenerations > 0) {
                                trackEvent(
                                    {
                                        event: 'repeat_certificate_generation',
                                        generation_count: generationCount,
                                        certificates_count: total - failedCount,
                                    },
                                    { dedupeKey: `${sessionId}-repeat-${generationCount}` }
                                );
                            }
                        });
                }
            };

            // 5. Initialize worker with template
            workerRef.current.postMessage({
                type: 'INIT',
                template: templateFile.blob,
                fields
            });

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Generation failed";
            setError(message);
            setIsGenerating(false);
            workerRef.current?.terminate();
            workerRef.current = null;
        }
    }, []);

    const stopGeneration = useCallback(() => {
        workerRef.current?.terminate();
        workerRef.current = null;
        setIsGenerating(false);
    }, []);

    return {
        startGeneration,
        stopGeneration,
        isGenerating,
        progress,
        error
    };
}
