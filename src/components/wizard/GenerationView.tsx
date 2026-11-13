'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useGenerator } from '@/hooks/useGenerator';
import { db } from '@/core/db/schema';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Download, Mail, AlertTriangle, Loader2, Play, FileText, RefreshCw } from 'lucide-react';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { useRouter } from 'next/navigation';
import { updateSession, touchActivity, startNewBatch, markRecoveryDecided } from '@/core/session/sessionManager';
import { ZipDownloadSuccessPanel } from '@/components/session/ZipDownloadSuccessPanel';
import { SaveSessionModal } from '@/components/session/SaveSessionModal';
import { trackEvent } from '@/lib/analytics';
import { trackBackendEvent } from '@/services/analyticsService';
import { OpenSourceSupportCard } from '@/components/product/OpenSourceSupportCard';
import { cn } from '@/utils/cn';

export function GenerationView() {
    const router = useRouter();
    const sessionId = useAppStore((state) => state.sessionId);
    const sessionHydrationVersion = useAppStore((state) => state.sessionHydrationVersion);
    const setCurrentStep = useAppStore((state) => state.setCurrentStep);

    const { startGeneration, isGenerating, progress, error } = useGenerator();
    const [countsReady, setCountsReady] = useState(false);
    const [isZipping, setIsZipping] = useState(false);
    const [isMerging, setIsMerging] = useState(false);
    const [zipDownloaded, setZipDownloaded] = useState(false);
    const [batchBusy, setBatchBusy] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [etaText, setEtaText] = useState<string | null>(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const startTsRef = useRef<number | null>(null);
    const generationStartEventFiredRef = useRef(false);
    const saveModalShownRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            setCountsReady(false);

            // Auto-heal rows from Zustand or other session records if count is 0
            let count = await db.rows.where('sessionId').equals(sessionId).count();
            if (count === 0) {
                const storeCsv = useAppStore.getState().csvData;
                if (storeCsv && storeCsv.length > 0) {
                    const rowRecords = storeCsv.map((row, index) => ({
                        sessionId,
                        data: { ...row, __rowIndex: index },
                    }));
                    await db.rows.bulkAdd(rowRecords as any);
                    count = await db.rows.where('sessionId').equals(sessionId).count();
                } else {
                    const anyRows = await db.rows.toArray();
                    if (anyRows.length > 0) {
                        const rowRecords = anyRows.map((r, index) => ({
                            sessionId,
                            data: { ...r.data, __rowIndex: index },
                        }));
                        await db.rows.bulkAdd(rowRecords as any);
                        count = await db.rows.where('sessionId').equals(sessionId).count();
                    }
                }
            }

            // Auto-heal template if missing from db.files
            const templateFile = await db.files.get(`${sessionId}-template`);
            if (!templateFile) {
                const storeTemplate = useAppStore.getState().template;
                if (storeTemplate) {
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
                    } catch (e) {
                        console.warn('[GenerationView] Could not persist template to IDB:', e);
                    }
                }
            }

            const allCerts = await db.certificates.where('sessionId').equals(sessionId).toArray();
            const completed = allCerts.filter((c) => c.status === 'completed');
            const validDone = completed.filter(
                (c) => c.pdf && (c.pdf instanceof Uint8Array ? c.pdf.byteLength > 0 : (c.pdf as ArrayBuffer).byteLength > 0)
            ).length;

            if (cancelled) return;

            setTotalCount(count);
            setCompletedCount(validDone);
            setCountsReady(true);

            await updateSession(sessionId, { workflowStage: 'GENERATE', currentStep: 4 });
            await touchActivity(sessionId);

            if (count === 0) return;
            // Only skip if ALL certificates have valid non-empty PDF bytes!
            if (validDone >= count) return;

            if (!generationStartEventFiredRef.current) {
                trackEvent({
                    event: 'certificate_generation_started',
                    certificates_count: count,
                    generation_method: validDone > 0 ? 'resume' : 'fresh',
                });
                generationStartEventFiredRef.current = true;
            }

            // Trigger generation
            startGeneration(sessionId, false);
        };

        init();
        return () => {
            cancelled = true;
        };
    }, [sessionId, startGeneration, sessionHydrationVersion]);

    useEffect(() => {
        let mounted = true;
        const tick = async () => {
            const allCerts = await db.certificates.where('sessionId').equals(sessionId).toArray();
            const completed = allCerts.filter((c) => c.status === 'completed');
            const validDone = completed.filter(
                (c) => c.pdf && (c.pdf instanceof Uint8Array ? c.pdf.byteLength > 0 : (c.pdf as ArrayBuffer).byteLength > 0)
            ).length;

            if (!mounted) return;
            setCompletedCount(validDone);

            if (isGenerating) {
                if (!startTsRef.current && validDone > 0) startTsRef.current = Date.now();
                if (startTsRef.current && validDone > 0) {
                    const elapsed = (Date.now() - startTsRef.current) / 1000;
                    const avg = elapsed / validDone;
                    const remaining = Math.max(0, totalCount - validDone);
                    const eta = Math.round(avg * remaining);
                    const mins = Math.floor(eta / 60);
                    const secs = eta % 60;
                    setEtaText(mins > 0 ? `About ${mins}m ${secs}s left` : `About ${secs}s left`);
                }
            } else {
                startTsRef.current = null;
                setEtaText(null);
            }
        };

        tick();
        const interval = setInterval(tick, 500);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [sessionId, isGenerating, totalCount]);

    const handleDownload = async () => {
        setIsZipping(true);
        try {
            // Retrieve all completed certificates
            const allCerts = await db.certificates
                .where('sessionId')
                .equals(sessionId)
                .toArray();

            const certs = allCerts.filter(
                (c) => c.status === 'completed' && c.pdf && (c.pdf instanceof Uint8Array ? c.pdf.byteLength > 0 : (c.pdf as ArrayBuffer).byteLength > 0)
            );

            if (certs.length === 0) {
                console.warn('No valid completed certificates found for download, auto-starting generation...');
                startGeneration(sessionId, false);
                return;
            }

            // Fetch recipient rows to provide human-readable filenames
            const rows = await db.rows.where({ sessionId }).toArray();
            const rowMap = new Map(rows.map((r) => [r.id, r.data]));

            const zip = new JSZip();

            for (const cert of certs) {
                if (!cert.pdf) continue;

                // Ensure data is Uint8Array
                const pdfBytes = cert.pdf instanceof Uint8Array
                    ? cert.pdf
                    : new Uint8Array(cert.pdf as ArrayBuffer);

                const rowData = rowMap.get(cert.rowId) || {};
                const nameCandidate =
                    rowData['Name'] ||
                    rowData['name'] ||
                    rowData['Full Name'] ||
                    rowData['Recipient'] ||
                    rowData['Student Name'] ||
                    '';
                const cleanName = nameCandidate
                    ? String(nameCandidate).trim().replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_')
                    : '';
                const fileName = cleanName
                    ? `certificate_${cert.rowId}_${cleanName}.pdf`
                    : `certificate_${cert.rowId}.pdf`;

                zip.file(fileName, pdfBytes, { binary: true });
            }

            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 },
            });

            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificates_${sessionId}.zip`;
            document.body.appendChild(link);
            link.click();

            // CRITICAL: Delay revocation so browser download manager has time to stream the blob
            setTimeout(() => {
                try {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                } catch {
                    // Ignore if already removed
                }
            }, 15000);

            setZipDownloaded(true);

            const completedCerts = certs.length;

            trackEvent(
                {
                    event: 'certificate_downloaded',
                    certificates_count: completedCerts,
                    user_plan: 'free',
                },
                { dedupeKey: `${sessionId}-zip` },
            );
            trackBackendEvent('certificate_downloaded', { certificates_count: completedCerts });

            await updateSession(sessionId, {
                workflowStage: 'DOWNLOAD',
                zipDownloadedAt: Date.now(),
            });
            await touchActivity(sessionId);
        } catch (err) {
            console.error('ZIP Error:', err);
            alert('Failed to generate ZIP archive. Please try the Combined PDF export.');
        } finally {
            setIsZipping(false);
        }
    };

    const handleDownloadCombinedPDF = async () => {
        setIsMerging(true);
        try {
            const allCerts = await db.certificates
                .where('sessionId')
                .equals(sessionId)
                .toArray();

            const certs = allCerts
                .filter((c) => c.status === 'completed' && c.pdf && (c.pdf instanceof Uint8Array ? c.pdf.byteLength > 0 : (c.pdf as ArrayBuffer).byteLength > 0))
                .sort((a, b) => a.rowId - b.rowId);

            if (certs.length === 0) {
                console.warn('No valid completed certificates found to merge, auto-starting generation...');
                startGeneration(sessionId, false);
                return;
            }

            const mergedPdf = await PDFDocument.create();

            for (const cert of certs) {
                if (cert.pdf) {
                    const pdfBytes = cert.pdf instanceof Uint8Array
                        ? cert.pdf
                        : new Uint8Array(cert.pdf as ArrayBuffer);
                    const srcDoc = await PDFDocument.load(pdfBytes);
                    const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
                    copiedPages.forEach((p) => mergedPdf.addPage(p));
                }
            }

            const mergedBytes = await mergedPdf.save();
            const blob = new Blob([mergedBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `combined_certificates_${sessionId}.pdf`;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                try {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                } catch {
                    // Ignore
                }
            }, 15000);

            setZipDownloaded(true);
            trackEvent(
                {
                    event: 'certificate_downloaded',
                    certificates_count: certs.length,
                    user_plan: 'free',
                },
                { dedupeKey: `${sessionId}-combined` },
            );
        } catch (err) {
            console.error('Combined PDF error:', err);
            alert('Failed to generate combined PDF.');
        } finally {
            setIsMerging(false);
        }
    };

    const handleGenerateAgain = () => {
        setZipDownloaded(false);
        startGeneration(sessionId, false);
    };

    const handleStartNewBatch = async () => {
        setBatchBusy(true);
        try {
            await startNewBatch();
            setZipDownloaded(false);
            setCurrentStep(1);
            router.push('/tool');
        } finally {
            setBatchBusy(false);
        }
    };

    const allCertificatesReady =
        countsReady && totalCount > 0 && completedCount >= totalCount;
    const isDone = allCertificatesReady || (progress === 100 && !isGenerating);

    // Show save modal once after generation completes (not after ZIP download)
    useEffect(() => {
        if (isDone && completedCount > 0 && !zipDownloaded && !saveModalShownRef.current) {
            saveModalShownRef.current = true;
            const timer = setTimeout(() => {
                setShowSaveModal(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isDone, completedCount, zipDownloaded]);

    if (!countsReady && !error) {
        return (
            <div className="py-12 flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-accent/10 blur-xl scale-150" />
                    <Loader2 className="relative w-9 h-9 text-accent animate-spin" />
                </div>
                <p className="mt-5 text-sm text-secondary">Loading your session…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto text-center py-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 ring-1 ring-red-100">
                    <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Generation failed</h3>
                <p className="text-sm text-secondary mb-6 leading-relaxed">{error}</p>
                <Button onClick={() => startGeneration(sessionId)} className="rounded-lg">
                    Try again
                </Button>
            </div>
        );
    }

    const hasPartialProgress =
        countsReady &&
        completedCount > 0 &&
        completedCount < totalCount &&
        !isGenerating &&
        !isDone;

    const displayProgress = isGenerating && totalCount > 0
        ? Math.round((completedCount / totalCount) * 100)
        : progress;

    return (
        <div className="text-center">
            {hasPartialProgress ? (
                <div className="py-4">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                        <Play size={22} fill="currentColor" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">Resume generation?</h2>
                    <p className="text-sm text-secondary mb-8 max-w-xs mx-auto leading-relaxed">
                        <span className="font-medium text-foreground">{completedCount}</span> of{' '}
                        <span className="font-medium text-foreground">{totalCount}</span> certificates
                        are already done.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto">
                        <Button onClick={() => startGeneration(sessionId, true)} className="rounded-lg flex-1">
                            Resume
                        </Button>
                        <Button
                            onClick={() => startGeneration(sessionId, false)}
                            variant="outline"
                            className="rounded-lg flex-1"
                        >
                            Start over
                        </Button>
                    </div>
                </div>
            ) : !isDone ? (
                <div className="py-6 max-w-sm mx-auto">
                    <div className="relative mx-auto mb-5 w-fit">
                        <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center ring-1 ring-accent/20">
                            <Loader2 className="w-7 h-7 text-accent animate-spin" />
                        </div>
                    </div>

                    <h2 className="text-lg font-bold text-foreground mb-1">Creating Certificates</h2>
                    <p className="text-xs text-secondary mb-5">
                        {completedCount > 0 ? (
                            <>
                                <span className="font-semibold text-foreground">{completedCount}</span> of <span className="font-semibold text-foreground">{totalCount}</span> complete
                            </>
                        ) : (
                            <>Dispatching {totalCount} PDFs to parallel Web Workers…</>
                        )}
                    </p>

                    <div>
                        <div className="h-2.5 bg-muted rounded-full overflow-hidden ring-1 ring-border/50 p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-accent to-emerald-500 rounded-full transition-all duration-300 ease-out shadow-xs"
                                style={{ width: `${Math.max(displayProgress, 2)}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs font-mono text-secondary">
                            <span className="font-semibold text-foreground">{displayProgress}%</span>
                            {etaText && <span>{etaText}</span>}
                        </div>
                    </div>

                    {/* Multi-thread worker badge */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-medium text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Parallel Web Workers Active · Offline Safe
                        </span>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-2xl mx-auto py-6 flex flex-col items-center">
                    {/* Success icon */}
                    <div className="mb-4">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md ring-4 ring-emerald-50">
                            <CheckCircle size={32} strokeWidth={2} />
                        </div>
                    </div>

                    {/* Title and summary */}
                    <h2 className="text-2xl font-bold text-foreground tracking-tight mb-1">
                        {totalCount} Certificate{totalCount !== 1 ? 's' : ''} Ready!
                    </h2>
                    <p className="text-xs sm:text-sm text-secondary mb-6 max-w-sm">
                        All generated locally with high resolution and cryptographic verification.
                    </p>

                    {/* Session summary card */}
                    <div className="w-full max-w-md rounded-2xl border border-border/80 bg-muted/20 p-4 mb-6 text-xs space-y-2.5 text-left">
                        <div className="flex justify-between items-center">
                            <span className="text-secondary font-medium">Total Generated:</span>
                            <span className="font-bold text-foreground bg-white px-2 py-0.5 rounded border border-border/60">
                                {totalCount.toLocaleString()} PDFs
                            </span>
                        </div>
                        <div className="border-t border-border/40" />
                        <div className="flex justify-between items-center">
                            <span className="text-secondary font-medium">Security & Storage:</span>
                            <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                                🛡 Browser IndexedDB (Local)
                            </span>
                        </div>
                        <div className="border-t border-border/40" />
                        <div className="flex justify-between items-center">
                            <span className="text-secondary font-medium">Export Formats:</span>
                            <span className="font-medium text-foreground">ZIP Archive & Multi-Page PDF</span>
                        </div>
                    </div>

                    {/* Primary CTAs - Dual Export (ZIP & Combined PDF) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mb-6">
                        <button
                            onClick={handleDownload}
                            disabled={isZipping || isMerging}
                            className="p-3.5 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-all flex flex-col items-start gap-1 disabled:opacity-50 text-left shadow-sm hover:shadow-md group"
                            title="Download ZIP of individual certificate PDFs"
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className="font-bold text-sm flex items-center gap-1.5">
                                    {isZipping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                    ZIP Archive
                                </span>
                                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">.ZIP</span>
                            </div>
                            <span className="text-[11px] text-white/80">Individual PDF for each recipient</span>
                        </button>

                        <button
                            onClick={handleDownloadCombinedPDF}
                            disabled={isZipping || isMerging}
                            className="p-3.5 rounded-xl border border-accent/40 bg-accent/5 text-accent font-medium hover:bg-accent/10 transition-all flex flex-col items-start gap-1 disabled:opacity-50 text-left group"
                            title="Download single combined multi-page PDF"
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className="font-bold text-sm flex items-center gap-1.5">
                                    {isMerging ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4 text-accent" />}
                                    Combined PDF
                                </span>
                                <span className="text-[10px] bg-accent/15 px-1.5 py-0.5 rounded font-mono">.PDF</span>
                            </div>
                            <span className="text-[11px] text-secondary">Single print-ready document</span>
                        </button>
                    </div>

                    {/* Direct Email Action */}
                    <div className="w-full max-w-md mb-3">
                        <button
                            onClick={async () => {
                                markRecoveryDecided();
                                await updateSession(sessionId, { workflowStage: 'EMAIL_SETUP' });
                                router.push('/email');
                            }}
                            className="w-full py-2.5 px-4 rounded-xl border border-border/80 text-foreground font-semibold hover:bg-muted/60 transition-colors flex items-center justify-center gap-2 text-xs"
                        >
                            <Mail className="h-4 w-4 text-accent" />
                            Send Certificates via Email →
                        </button>
                    </div>

                    {/* Regenerate Action */}
                    <div className="w-full max-w-md flex justify-center mb-6">
                        <button
                            type="button"
                            onClick={handleGenerateAgain}
                            disabled={isGenerating}
                            className="text-xs text-secondary hover:text-accent font-medium transition-colors flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                            <RefreshCw size={13} className={cn(isGenerating && 'animate-spin')} />
                            Regenerate certificates batch
                        </button>
                    </div>

                    {/* Post-download section — only shown after download, clean composition */}
                    {zipDownloaded && (
                        <div className="w-full space-y-4">
                            <ZipDownloadSuccessPanel
                                onGenerateAgain={handleGenerateAgain}
                                onStartNewBatch={handleStartNewBatch}
                                busy={batchBusy}
                            />
                            <OpenSourceSupportCard context="success" certificatesCount={completedCount} />
                        </div>
                    )}
                </div>
            )}

            {/* Session save modal */}
            <SaveSessionModal
                sessionId={sessionId}
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                certificateCount={completedCount}
            />
        </div>
    );
}
