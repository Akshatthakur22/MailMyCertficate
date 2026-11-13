'use client';

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { loadTemplate } from '@/services/templateService';
import { UploadCloud, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { db } from '@/core/db/schema';
import { updateSession, touchActivity } from '@/core/session/sessionManager';
import { hasActivated, markActivated, trackEvent } from '@/lib/analytics';
import { trackBackendEvent } from '@/services/analyticsService';
import { TrustBoundaryNotice } from '@/components/product/TrustBoundaryNotice';

export function UploadTemplate() {
    const setTemplate = useAppStore((state) => state.setTemplate);
    const setCurrentStep = useAppStore((state) => state.setCurrentStep);
    const template = useAppStore((state) => state.template);
    const templateDimensions = useAppStore((state) => state.templateDimensions);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<string | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const sessionId = useAppStore((state) => state.sessionId);

    const handleFile = async (file: File) => {
        try {
            setError(null);

            const allowedTypes = ['image/png', 'image/jpeg'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Invalid file type. Please upload a PNG or JPEG image.');
            }
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('File too large. Maximum size is 5MB.');
            }

            // Format file size for display
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            setFileSize(`${sizeMB} MB`);

            const { base64, width, height } = await loadTemplate(file);

            await db.files.put({
                id: `${sessionId}-template`,
                sessionId,
                type: 'template',
                blob: file,
            });

            await updateSession(sessionId, {
                templateDimensions: { width, height },
                currentStep: 2,
                workflowStage: 'UPLOAD',
            });
            await touchActivity(sessionId);

            setTemplate(base64, { width, height });
            setCurrentStep(2);

            const fileType = file.type === 'image/png' ? 'png' : 'jpeg';

            trackEvent(
                {
                    event: 'template_selected',
                    template_width: width,
                    template_height: height,
                    file_type: fileType,
                },
                { dedupeKey: `${sessionId}-template` },
            );
            // Mirror to backend for central analytics
            // Filenames can contain names or event details, so keep analytics categorical.
            trackBackendEvent('template_selected', { file_type: fileType });

            if (!hasActivated()) {
                markActivated();
                trackEvent(
                    { event: 'sign_up_completed', activation_step: 'template_uploaded' },
                    { dedupeKey: `${sessionId}-activation` },
                );
            }
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message || 'Failed to upload template.');
            } else {
                setError('Failed to upload template.');
            }
        }
    };

    const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const onDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleLoadSampleTemplate = async () => {
        try {
            setError(null);
            const res = await fetch('/sample-certificate-template.png');
            if (!res.ok) throw new Error('Could not load sample template');
            const blob = await res.blob();
            const file = new File([blob], 'sample-certificate-template.png', { type: 'image/png' });
            await handleFile(file);
        } catch (err) {
            console.error(err);
            setError('Failed to load sample template.');
        }
    };

    return (
        <div className="text-center">
            {/* Success state — show after upload */}
            {template && templateDimensions ? (
                <div className="space-y-5 animate-in fade-in duration-300">
                    {/* Visual Preview Card */}
                    <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden border border-border/80 shadow-lg bg-muted/20 group ring-1 ring-black/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={template}
                            alt="Uploaded certificate"
                            className="w-full h-auto object-cover max-h-56"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full text-[10px] text-white font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {templateDimensions.width > templateDimensions.height ? 'Landscape' : 'Portrait'}
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full text-[10px] text-white font-mono">
                            {templateDimensions.width} × {templateDimensions.height} px
                        </div>
                    </div>

                    {/* Success summary badge */}
                    <div className="flex items-center justify-center gap-2 text-sm bg-emerald-50/80 border border-emerald-200/60 rounded-xl px-4 py-2.5 max-w-md mx-auto">
                        <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                        <span className="font-semibold text-emerald-950">Certificate Template Loaded</span>
                        {fileSize && (
                            <>
                                <span className="text-emerald-400">•</span>
                                <span className="text-xs text-emerald-800 font-medium">{fileSize}</span>
                            </>
                        )}
                    </div>

                    {/* Trust indicator */}
                    <div className="text-[11px] text-secondary/80 bg-muted/40 border border-border/50 rounded-lg px-3 py-1.5 max-w-md mx-auto">
                        🛡 Stored locally in your browser (IndexedDB) • Zero cloud tracking
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex gap-3 pt-2 max-w-md mx-auto">
                        <button
                            onClick={() => {
                                setTemplate(null, null);
                                setFileSize(null);
                                setError(null);
                            }}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors"
                        >
                            Change Template
                        </button>
                        <button
                            onClick={() => setCurrentStep(2)}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
                        >
                            Continue to Participants
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Upload form — initial state */}
                    <p className="text-secondary text-sm mb-4 max-w-sm mx-auto leading-relaxed">
                        Upload your base certificate design. Your layout will be personalized with each recipient&apos;s data.
                    </p>

                    <div className="mb-4 text-left">
                        <TrustBoundaryNotice variant="upload" />
                    </div>

                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                            'border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer group relative overflow-hidden',
                            dragging
                                ? 'border-accent bg-accent/5 ring-4 ring-accent/10 scale-[1.01]'
                                : 'border-border/80 hover:border-accent hover:bg-accent/2 hover:shadow-md bg-white/50',
                            error && 'border-red-300 bg-red-50/50'
                        )}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            onChange={onFileChange}
                        />

                        <div className="flex flex-col items-center gap-3">
                            <div
                                className={cn(
                                    'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xs',
                                    dragging
                                        ? 'bg-accent text-white scale-110 shadow-md'
                                        : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white group-hover:scale-105'
                                )}
                            >
                                <UploadCloud size={30} strokeWidth={1.75} />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground text-sm">
                                    {dragging ? 'Release to upload' : 'Drop your certificate template here'}
                                </p>
                                <p className="text-xs text-secondary mt-0.5">PNG or JPG · Up to 5 MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Sample Action Pill */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={handleLoadSampleTemplate}
                            className="px-3 py-1.5 rounded-full bg-accent/5 hover:bg-accent/10 border border-accent/20 text-xs font-semibold text-accent transition-all inline-flex items-center gap-1.5 shadow-2xs hover:shadow-xs group"
                        >
                            <span>Don&apos;t have a file ready?</span>
                            <span className="underline group-hover:no-underline">Try sample template →</span>
                        </button>
                    </div>

                    {error && (
                        <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2.5 rounded-lg border border-red-100 text-xs">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Collapsed help section */}
                    {!showHelp && (
                        <button
                            onClick={() => setShowHelp(true)}
                            className="mt-4 text-xs text-secondary hover:text-foreground transition-colors"
                        >
                            Need help? →
                        </button>
                    )}

                    {showHelp && (
                        <div className="mt-4 p-4 bg-muted/40 rounded-lg border border-border/60 text-left text-xs space-y-2">
                            <p className="font-medium text-foreground">Design tips:</p>
                            <ul className="text-secondary space-y-1 list-disc list-inside">
                                <li>Landscape (e.g., 1920×1080)</li>
                                <li>Min 2000px width for print</li>
                                <li>Space for recipient names</li>
                            </ul>
                            <button
                                onClick={() => setShowHelp(false)}
                                className="text-secondary/60 hover:text-secondary mt-2 text-xs"
                            >
                                Hide
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
