'use client';

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { loadTemplate } from '@/services/templateService';
import { UploadCloud, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { db } from '@/core/db/schema';
import { updateSession, touchActivity } from '@/core/session/sessionManager';
import { hasActivated, markActivated, trackEvent } from '@/lib/analytics';
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
            const templateName = `custom_${fileType}_${width}x${height}`;

            trackEvent(
                {
                    event: 'template_selected',
                    template_name: templateName,
                    template_width: width,
                    template_height: height,
                    file_type: fileType,
                },
                { dedupeKey: `${sessionId}-template` },
            );

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

    return (
        <div className="text-center">
            {/* Success state — show after upload */}
            {template && templateDimensions ? (
                <div className="space-y-4">
                    {/* Success summary */}
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <CheckCircle size={20} className="text-green-600 shrink-0" />
                        <span className="font-semibold text-foreground">Certificate ready</span>
                        <span className="text-secondary/50">•</span>
                        <span className="text-xs text-secondary">{templateDimensions.width}×{templateDimensions.height}px</span>
                        <span className="text-secondary/50">•</span>
                        <span className="text-xs text-secondary">{fileSize || '...'}</span>
                    </div>

                    {/* Trust indicator */}
                    <div className="text-xs text-green-700 bg-green-50 border border-green-100/60 rounded-lg px-3 py-2.5">
                        🛡 Saved locally • Never uploaded
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={() => {
                                setTemplate(null, null);
                                setFileSize(null);
                                setError(null);
                            }}
                            className="flex-1 px-4 py-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                        >
                            Change
                        </button>
                        <button
                            onClick={() => setCurrentStep(2)}
                            className="flex-1 px-4 py-3 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-1.5"
                        >
                            Continue
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Upload form — initial state */}
                    <p className="text-secondary text-sm mb-5 max-w-sm mx-auto">
                        Your design will be personalized with each recipient's data.
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
                            'border-2 border-dashed rounded-xl p-10 transition-colors cursor-pointer group',
                            dragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40 hover:bg-muted/20',
                            error && 'border-red-300 bg-red-50/50',
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
                                    'w-12 h-12 rounded-lg flex items-center justify-center transition-colors',
                                    dragging ? 'bg-accent text-white' : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white',
                                )}
                            >
                                <UploadCloud size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="font-medium text-foreground text-sm">
                                    {dragging ? 'Drop to upload' : 'Drop certificate here'}
                                </p>
                                <p className="text-xs text-secondary">PNG/JPG · max 5 MB</p>
                            </div>
                        </div>
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
