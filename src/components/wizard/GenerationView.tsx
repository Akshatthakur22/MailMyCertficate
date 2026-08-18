'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useGenerator } from '@/hooks/useGenerator';
import { db } from '@/core/db/schema';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Download, Mail, AlertTriangle, Loader2, Play } from 'lucide-react';
import JSZip from 'jszip';
import { useRouter } from 'next/navigation';
import { updateSession, touchActivity, startNewBatch, markRecoveryDecided } from '@/core/session/sessionManager';
import { ZipDownloadSuccessPanel } from '@/components/session/ZipDownloadSuccessPanel';
import { GitHubStarPrompt } from '@/components/github/GitHubStarPrompt';
import { SaveSessionModal } from '@/components/session/SaveSessionModal';
import { trackEvent } from '@/lib/analytics';
import { trackBackendEvent } from '@/services/analyticsService';
import type { GitHubStarPromptTrigger } from '@/lib/analytics';
import { OpenSourceSupportCard } from '@/components/product/OpenSourceSupportCard';

export function GenerationView() {
    const router = useRouter();
    const sessionId = useAppStore((state) => state.sessionId);
    const sessionHydrationVersion = useAppStore((state) => state.sessionHydrationVersion);
    const setCurrentStep = useAppStore((state) => state.setCurrentStep);

    const { startGeneration, isGenerating, progress, error } = useGenerator();
    const [countsReady, setCountsReady] = useState(false);
    const [isZipping, setIsZipping] = useState(false);
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
            const count = await db.rows.where({ sessionId }).count();
            const done = await db.certificates.where({ sessionId, status: 'completed' }).count();
            if (cancelled) return;

            setTotalCount(count);
            setCompletedCount(done);
            setCountsReady(true);

            await updateSession(sessionId, { workflowStage: 'GENERATE', currentStep: 4 });
            await touchActivity(sessionId);

            if (count === 0) return;
            if (done >= count) return;

            const partial = done > 0 && done < count;
            if (partial) return;

            if (!generationStartEventFiredRef.current) {
                trackEvent({
                    event: 'certificate_generation_started',
                    certificates_count: count,
                    generation_method: done > 0 ? 'resume' : 'fresh',
                });
                generationStartEventFiredRef.current = true;
            }

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
            const done = await db.certificates.where({ sessionId, status: 'completed' }).count();
            if (!mounted) return;
            setCompletedCount(done);

            if (isGenerating) {
                if (!startTsRef.current && done > 0) startTsRef.current = Date.now();
                if (startTsRef.current && done > 0) {
                    const elapsed = (Date.now() - startTsRef.current) / 1000;
                    const avg = elapsed / done;
                    const remaining = Math.max(0, totalCount - done);
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
        const interval = setInterval(tick, 750);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [sessionId, isGenerating, totalCount]);

    const handleDownload = async () => {
        setIsZipping(true);
        try {
            const zip = new JSZip();

            await db.certificates
                .where({ sessionId, status: 'completed' })
                .each((cert) => {
                    if (cert.pdf) {
                        zip.file(`certificate_${cert.rowId}.pdf`, cert.pdf);
                    }
                });

            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'STORE',
            });

            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificates_${sessionId}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setZipDownloaded(true);

            const completedCerts = await db.certificates
                .where({ sessionId, status: 'completed' })
                .count();

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
        } finally {
            setIsZipping(false);
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

    const starPromptTrigger: GitHubStarPromptTrigger | null = zipDownloaded
        ? 'certificate_downloaded'
        : isDone
          ? 'certificate_generated'
          : null;

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
                <div className="py-3">
                    <div className="relative mx-auto mb-4 w-fit">
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    </div>

                    <h2 className="text-base font-semibold text-foreground mb-1">Creating certificates</h2>
                    <p className="text-xs text-secondary mb-4">
                        {completedCount > 0 ? (
                            <>
                                <span className="font-medium text-foreground">{completedCount}</span> of <span className="font-medium text-foreground">{totalCount}</span> complete · Stored locally
                            </>
                        ) : (
                            <>Preparing {totalCount} PDFs locally…</>
                        )}
                    </p>

                    <div className="max-w-xs mx-auto">
                        <div className="h-2 bg-muted/80 rounded-full overflow-hidden ring-1 ring-border/40">
                            <div
                                className="h-full bg-gradient-to-r from-accent/80 to-accent transition-all duration-500 ease-out"
                                style={{ width: `${Math.max(displayProgress, 2)}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-secondary">
                            <span>{displayProgress}%</span>
                            {etaText && <span>{etaText}</span>}
                        </div>
                    </div>

                    {/* Compact trust signals */}
                    <div className="mt-3 space-y-1 max-w-xs mx-auto text-xs">
                        <div className="text-green-700 bg-green-50 border border-green-100/60 rounded px-2 py-1">
                            🛡 Generating locally
                        </div>
                        <div className="text-blue-700 bg-blue-50 border border-blue-100/60 rounded px-2 py-1">
                            💾 Safe to close · Progress saved
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-8 flex flex-col items-center">
                    {/* Success icon — balanced, not oversized */}
                    <div className="mb-6">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
                            <CheckCircle size={32} strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Title and summary */}
                    <h2 className="text-2xl font-semibold text-foreground mb-1">
                        {totalCount} certificate{totalCount !== 1 ? 's' : ''} ready
                    </h2>
                    <p className="text-sm text-secondary mb-6">
                        All saved locally. Download or send via email.
                    </p>

                    {/* Session summary — balanced card */}
                    <div className="w-full max-w-sm rounded-lg border border-border bg-muted/20 p-4 mb-8 text-sm space-y-2 text-left">
                        <div className="flex justify-between">
                            <span className="text-secondary">Certificates created:</span>
                            <span className="font-medium text-foreground">{totalCount.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-border/40" />
                        <div className="flex justify-between">
                            <span className="text-secondary">Storage:</span>
                            <span className="font-medium text-foreground">Browser (local)</span>
                        </div>
                        <div className="border-t border-border/40" />
                        <div className="flex justify-between">
                            <span className="text-secondary">Recovery:</span>
                            <span className="font-medium text-foreground">Automatic</span>
                        </div>
                    </div>

                    {/* Primary CTAs */}
                    <div className="flex gap-3 w-full max-w-sm mb-8">
                        <button
                            onClick={handleDownload}
                            disabled={isZipping}
                            className="flex-1 px-4 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isZipping ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            Download
                        </button>
                        <button
                            onClick={async () => {
                                markRecoveryDecided();
                                await updateSession(sessionId, { workflowStage: 'EMAIL_SETUP' });
                                router.push('/email');
                            }}
                            className="flex-1 px-4 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Mail className="h-4 w-4" />
                            Email
                        </button>
                    </div>

                    {/* Post-download section — only shown after download, clean composition */}
                    {zipDownloaded && (
                        <div className="w-full max-w-sm space-y-4">
                            <ZipDownloadSuccessPanel
                                onGenerateAgain={handleGenerateAgain}
                                onStartNewBatch={handleStartNewBatch}
                                busy={batchBusy}
                            />
                            {starPromptTrigger && (
                                <GitHubStarPrompt
                                    trigger={starPromptTrigger}
                                    certificatesCount={completedCount}
                                />
                            )}
                            {zipDownloaded && (
                                <OpenSourceSupportCard context="success" certificatesCount={completedCount} />
                            )}
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
