import { useState, useCallback, useRef } from 'react';
import { db } from '@/core/db/schema';
import { useAppStore } from '@/store/useAppStore';
import {
    getGenerationCount,
    incrementGenerationCount,
    trackEvent,
} from '@/lib/analytics';
import { trackBackendEvent } from '@/services/analyticsService';
import type { GenerationMethod } from '@/lib/analytics';
import { CertificateWorkerPool } from '@/core/worker/workerPool';
import { renderSingleCertificate } from '@/core/engine/pdfRenderer';

export function useGenerator() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const poolRef = useRef<CertificateWorkerPool | null>(null);

    const startGeneration = useCallback(async (sessionId: string, resume = false) => {
        const generationMethod: GenerationMethod = resume ? 'resume' : 'fresh';
        // Allow restart by terminating any in-flight pool
        if (poolRef.current) {
            poolRef.current.terminate();
            poolRef.current = null;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // 1. Multi-tier Template Retrieval
            let templateFile = await db.files.get(`${sessionId}-template`);
            if (!templateFile) {
                templateFile = await db.files.where('sessionId').equals(sessionId).and((f) => f.type === 'template').first();
            }

            let templateSource: Blob | string | null = templateFile?.blob || null;

            if (!templateSource) {
                const storeTemplate = useAppStore.getState().template;
                if (storeTemplate) {
                    templateSource = storeTemplate;
                    try {
                        let blob: Blob;
                        if (storeTemplate.startsWith('data:') || storeTemplate.startsWith('http') || storeTemplate.startsWith('/')) {
                            const res = await fetch(storeTemplate);
                            blob = await res.blob();
                        } else {
                            blob = new Blob([storeTemplate], { type: 'image/png' });
                        }
                        await db.files.put({
                            id: `${sessionId}-template`,
                            sessionId,
                            type: 'template',
                            blob,
                        });
                        templateSource = blob;
                    } catch (e) {
                        console.warn('[Generator] Could not persist store template to IDB:', e);
                    }
                }
            }

            if (!templateSource) {
                // Check if any template exists in IDB
                const anyTemplate = await db.files.where('type').equals('template').last();
                if (anyTemplate?.blob) {
                    templateSource = anyTemplate.blob;
                }
            }

            if (!templateSource) {
                // Ultimate fallback: load public sample certificate template
                try {
                    const res = await fetch('/sample-certificate-template.png');
                    if (res.ok) {
                        templateSource = await res.blob();
                    }
                } catch {
                    // Ignore
                }
            }

            if (!templateSource) {
                throw new Error('Certificate template image is missing. Please upload a template in Step 1.');
            }

            // 2. Multi-tier Recipient Rows Retrieval
            let rows = await db.rows.where('sessionId').equals(sessionId).toArray();

            if (rows.length === 0) {
                const storeCsv = useAppStore.getState().csvData;
                if (storeCsv && storeCsv.length > 0) {
                    const rowRecords = storeCsv.map((row, index) => ({
                        sessionId,
                        data: { ...row, __rowIndex: index },
                    }));
                    await db.rows.bulkAdd(rowRecords as any);
                    rows = await db.rows.where('sessionId').equals(sessionId).toArray();
                }
            }

            if (rows.length === 0) {
                const allRows = await db.rows.toArray();
                if (allRows.length > 0) {
                    const rowRecords = allRows.map((r, index) => ({
                        sessionId,
                        data: { ...r.data, __rowIndex: index },
                    }));
                    await db.rows.bulkAdd(rowRecords as any);
                    rows = await db.rows.where('sessionId').equals(sessionId).toArray();
                }
            }

            if (rows.length === 0) {
                throw new Error('No participant rows found. Please upload your CSV in Step 2.');
            }

            // 3. Fallback Field Creation
            let fields = useAppStore.getState().fields;
            if (fields.length === 0 && rows.length > 0) {
                const sampleRow = rows[0]?.data || {};
                const nameKey =
                    Object.keys(sampleRow).find((k) => /name|recipient|student|attendee|participant/i.test(k)) ||
                    Object.keys(sampleRow).find((k) => k !== '__rowIndex') ||
                    'Name';
                const dims = useAppStore.getState().templateDimensions || { width: 1490, height: 1058 };
                fields = [
                    {
                        id: `field-auto-${nameKey}`,
                        columnName: nameKey,
                        x: dims.width / 2,
                        y: dims.height / 2,
                        width: Math.min(dims.width * 0.8, 600),
                        fontSize: 48,
                        fontFamily: 'Helvetica',
                        color: '#000000',
                        align: 'center',
                        type: 'text',
                        shrinkToFit: true,
                    },
                ];
                useAppStore.getState().setFields(fields);
            }

            // 4. Determine pending jobs (Resume Logic)
            let pendingRows = rows;
            if (resume) {
                const allCerts = await db.certificates.where('sessionId').equals(sessionId).toArray();
                const completedResults = allCerts.filter((c) => c.status === 'completed');
                const completedIds = new Set(
                    completedResults
                        .filter((r) => r.pdf && (r.pdf.byteLength > 0 || (r.pdf as unknown as { length: number }).length > 0))
                        .map((r) => r.rowId)
                );
                pendingRows = rows.filter((r) => !completedIds.has(r.id));
            } else {
                await db.certificates.where('sessionId').equals(sessionId).delete().catch(() => {});
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

            const total = rows.length;
            const initialOffset = rows.length - pendingRows.length;
            setProgress(Math.round((initialOffset / total) * 100));

            // Direct rendering in non-blocking batches
            const runDirectBatch = async () => {
                let completed = 0;
                for (let i = 0; i < pendingRows.length; i++) {
                    const r = pendingRows[i];
                    const rowId = Number(r.id) || (i + 1);
                    try {
                        const pdfBytes = await renderSingleCertificate({
                            template: templateSource!,
                            fields,
                            data: r.data,
                        });

                        await db.certificates.put({
                            sessionId,
                            rowId,
                            pdf: pdfBytes,
                            status: 'completed',
                            updatedAt: Date.now(),
                        });
                    } catch (rErr) {
                        console.error(`[Generator] Rendering failed for row ${rowId}:`, rErr);
                        await db.certificates.put({
                            sessionId,
                            rowId,
                            status: 'failed',
                            error: rErr instanceof Error ? rErr.message : 'Rendering failed',
                            updatedAt: Date.now(),
                        });
                    }

                    completed++;
                    const pct = Math.round(((initialOffset + completed) / total) * 100);
                    setProgress(pct);

                    // Yield to event loop every 2 rows to keep UI at 60fps
                    if (i % 2 === 0) {
                        await new Promise((resolve) => setTimeout(resolve, 0));
                    }
                }
            };

            // Use direct batch for batches <= 150 (takes < 200ms for 50 rows)
            // For larger batches, try WorkerPool with graceful fallback
            if (pendingRows.length <= 150 || !(templateSource instanceof Blob)) {
                await runDirectBatch();
            } else {
                try {
                    const pool = new CertificateWorkerPool({
                        template: templateSource,
                        fields,
                    });
                    poolRef.current = pool;
                    await pool.init();

                    const jobs = pendingRows.map((r) => ({
                        rowId: r.id,
                        rowData: r.data,
                    }));

                    await pool.processQueue(
                        jobs,
                        async (res) => {
                            if (res.status === 'success' && res.pdfBytes) {
                                await db.certificates.put({
                                    sessionId,
                                    rowId: res.rowId,
                                    pdf: res.pdfBytes,
                                    status: 'completed',
                                    updatedAt: Date.now(),
                                });
                            } else {
                                await db.certificates.put({
                                    sessionId,
                                    rowId: res.rowId,
                                    status: 'failed',
                                    error: res.error || 'Rendering failed',
                                    updatedAt: Date.now(),
                                });
                            }
                        },
                        (completed) => {
                            const currentTotal = initialOffset + completed;
                            const pct = Math.round((currentTotal / total) * 100);
                            setProgress(pct);
                        }
                    );
                    pool.terminate();
                    poolRef.current = null;
                } catch (poolErr) {
                    console.warn('WorkerPool failed or unavailable, running direct batch:', poolErr);
                    await runDirectBatch();
                }
            }

            setIsGenerating(false);

            void db.certificates
                .where('sessionId')
                .equals(sessionId)
                .toArray()
                .then((certs) => certs.filter((c) => c.status === 'failed').length)
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
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Generation failed";
            setError(message);
            setIsGenerating(false);
            if (poolRef.current) {
                (poolRef.current as CertificateWorkerPool).terminate();
                poolRef.current = null;
            }
            
            // Track generation error to backend
            trackBackendEvent('certificate_generation_failed', { 
                error_code: 'generation_init_error',
                error_message: message,
                generation_method: generationMethod 
            });
        }
    }, []);

    const stopGeneration = useCallback(() => {
        poolRef.current?.terminate();
        poolRef.current = null;
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
