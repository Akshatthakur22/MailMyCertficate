'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useGenerator } from '@/hooks/useGenerator';
import { db } from '@/core/db/schema';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Download, Mail, AlertTriangle, Loader2, Play } from 'lucide-react';
import JSZip from 'jszip';
import { useRouter } from 'next/navigation';

export function GenerationView() {
    const router = useRouter();
    const sessionId = useAppStore((state) => state.sessionId);

    const { startGeneration, isGenerating, progress, error } = useGenerator();
    const [isZipping, setIsZipping] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [activityLog, setActivityLog] = useState<{ text: string; ts: number }[]>([]);
    const [etaText, setEtaText] = useState<string | null>(null);
    const startTsRef = useRef<number | null>(null);

    useEffect(() => {
        const init = async () => {
            const count = await db.rows.where({ sessionId }).count();
            const done = await db.certificates.where({ sessionId, status: 'completed' }).count();
            setTotalCount(count);
            setCompletedCount(done);

            // Auto-start if no progress yet, otherwise wait for user to "Resume" or "Restart"
            if (done === 0) {
                startGeneration(sessionId);
            }
        };
        init();
    }, [sessionId, startGeneration]);

    // Poll IDB for live updates (processed count + recent activity)
    useEffect(() => {
        let mounted = true;
        const tick = async () => {
            const done = await db.certificates.where({ sessionId, status: 'completed' }).count();
            if (!mounted) return;
            setCompletedCount(done);

            // Recent activity: last 6 entries
            const recent = await db.certificates.where({ sessionId }).reverse().sortBy('updatedAt');
            const lastSix = recent ? recent.slice(-6) : [];
            const rows = await db.rows.where({ sessionId }).toArray();
            const logs = lastSix.reverse().map(r => {
                const row = rows.find(rr => rr.id === r.rowId);
                const name = row?.data?.Name || row?.data?.name || `#${r.rowId}`;
                const text = r.status === 'completed' ? `Rendered: ${name}.pdf` : `${r.status}: ${name}`;
                return { text, ts: r.updatedAt || Date.now() };
            });
            setActivityLog(logs);

            // ETA calculation (very lightweight): average time per completed
            if (isGenerating) {
                if (!startTsRef.current && done > 0) startTsRef.current = Date.now();
                if (startTsRef.current && done > 0) {
                    const elapsed = (Date.now() - startTsRef.current) / 1000; // seconds
                    const avg = elapsed / done;
                    const remaining = Math.max(0, totalCount - done);
                    const eta = Math.round(avg * remaining);
                    const mins = Math.floor(eta / 60);
                    const secs = eta % 60;
                    setEtaText(mins > 0 ? `${mins}m ${secs}s remaining` : `${secs}s remaining`);
                }
            } else {
                startTsRef.current = null;
                setEtaText(null);
            }
        };

        // Kick off and poll every 750ms for smooth but lightweight updates
        tick();
        const interval = setInterval(tick, 750);
        return () => { mounted = false; clearInterval(interval); };
    }, [sessionId, isGenerating, totalCount]);

    const handleDownload = async () => {
        setIsZipping(true);
        try {
            const zip = new JSZip();

            // Memory safe cursor-based processing
            await db.certificates
                .where({ sessionId, status: 'completed' })
                .each((cert) => {
                    if (cert.pdf) {
                        const fileName = `certificate_${cert.rowId}.pdf`;
                        zip.file(fileName, cert.pdf);
                    }
                });

            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'STORE' // Faster, as PDFs are already compressed
            });

            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificates_${sessionId}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("ZIP Error:", err);
        } finally {
            setIsZipping(false);
        }
    };

    if (error) {
        return (
            <div className="max-w-xl mx-auto text-center mt-12 p-8 border border-red-200 bg-red-50 rounded-xl">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-800 mb-2">Generation Failed</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button onClick={() => startGeneration(sessionId)}>Try Again</Button>
            </div>
        );
    }

    const isDone = progress === 100 && !isGenerating;
    const hasPartialProgress = completedCount > 0 && completedCount < totalCount && !isGenerating;

    const stages = [
        { key: 'prepare', label: 'Preparing participant data', done: progress > 3 },
        { key: 'load', label: 'Loading certificate template', done: progress > 8 },
        { key: 'render', label: 'Rendering personalized certificates', done: progress > 95 },
        { key: 'package', label: 'Packaging ZIP files', done: progress >= 99 },
        { key: 'finish', label: 'Finalizing output', done: isDone },
    ];

    return (
        <div className="max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            {hasPartialProgress ? (
                <div className="py-16">
                    <div className="w-20 h-20 bg-amber-100 rounded-[2rem] flex items-center justify-center text-amber-600 mx-auto mb-8">
                        <Play size={32} fill="currentColor" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Resume Generation?</h2>
                    <p className="text-secondary mb-10">
                        We found <span className="font-bold text-accent">{completedCount}</span> certificates already generated from a previous attempt.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => startGeneration(sessionId, true)} size="lg" className="rounded-2xl px-8 h-14">
                            Resume Session
                        </Button>
                        <Button onClick={() => startGeneration(sessionId, false)} variant="secondary" size="lg" className="rounded-2xl px-8 h-14">
                            Start Over
                        </Button>
                    </div>
                </div>
            ) : !isDone ? (
                <div className="py-16">
                    <div className="relative w-32 h-32 mx-auto mb-10">
                        <div className="absolute inset-0 bg-accent/10 rounded-full animate-ping opacity-20" />
                        <div className="relative w-32 h-32 bg-accent/5 rounded-full flex items-center justify-center border-2 border-accent/20">
                            <Loader2 className="w-12 h-12 text-accent animate-spin" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight mb-3">Brewing your certificates...</h2>
                    <p className="text-secondary text-sm max-w-md mx-auto mb-12 italic">
                        Processing <span className="font-bold text-accent">{totalCount}</span> individual PDFs.
                    </p>

                    <div className="max-w-md mx-auto relative px-4">
                        <div className="h-4 bg-muted/40 rounded-full overflow-hidden border border-border/20 shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-accent/80 to-accent transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Privacy Protected</span>
                            <span className="text-lg font-mono font-black text-accent">{progress}%</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-16 animate-in zoom-in-95 duration-700">
                    <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl shadow-green-200 rotate-6 hover:rotate-0 transition-transform duration-500">
                        <CheckCircle size={48} strokeWidth={2.5} />
                    </div>

                    <h2 className="text-4xl font-black tracking-tight mb-4">Done!</h2>
                    <p className="text-secondary text-lg mb-12 max-w-md mx-auto">
                        <span className="text-foreground font-bold underline decoration-accent decoration-2 underline-offset-4">{totalCount} certificates</span> are ready for download.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
                        <Button onClick={handleDownload} disabled={isZipping} size="lg" className="h-16 px-10 text-lg font-bold rounded-2xl w-full sm:w-auto shadow-xl shadow-accent/20 group">
                            {isZipping ? <Loader2 className="mr-3 animate-spin" /> : <Download className="mr-3 group-hover:-translate-y-1 transition-transform" />}
                            {isZipping ? 'Zipping...' : 'Download All (ZIP)'}
                        </Button>
                        <Button onClick={() => router.push('/email')} variant="secondary" size="lg" className="h-16 px-10 text-lg font-bold rounded-2xl w-full sm:w-auto border-2 border-accent/10 hover:border-accent group">
                            <Mail className="mr-3 group-hover:scale-110 transition-transform text-accent" />
                            Send Email
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
