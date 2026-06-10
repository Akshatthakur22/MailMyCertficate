'use client';

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { loadTemplate } from '@/services/templateService';
import { Button } from '@/components/ui/Button';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { db } from '@/core/db/schema';
import { createSession, updateSession, touchActivity } from '@/core/session/sessionManager';
import { hasActivated, markActivated, trackEvent } from '@/lib/analytics';

export function UploadTemplate() {
    const setTemplate = useAppStore((state) => state.setTemplate);
    const setCurrentStep = useAppStore((state) => state.setCurrentStep);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const sessionId = useAppStore((state) => state.sessionId);

    const handleFile = async (file: File) => {
        try {
            setError(null);

            // Robust validation
            const allowedTypes = ['image/png', 'image/jpeg'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error("Invalid file type. Please upload a PNG or JPEG image.");
            }
            if (file.size > 5 * 1024 * 1024) {
                throw new Error("File too large. Maximum size is 5MB.");
            }

            const { base64, width, height } = await loadTemplate(file);


            // 1. Store in IDB (Blob for efficiency)
            await db.files.put({
                id: `${sessionId}-template`,
                sessionId,
                type: 'template',
                blob: file
            });

            await updateSession(sessionId, {
                templateDimensions: { width, height },
                currentStep: 2,
                workflowStage: 'UPLOAD',
            });
            await touchActivity(sessionId);

            // 3. Update Zustand with only necessary metadata for UI
            setTemplate(base64, { width, height }); // base64 is kept for preview only in Step 3
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
                { dedupeKey: `${sessionId}-template` }
            );

            if (!hasActivated()) {
                markActivated();
                trackEvent(
                    { event: 'sign_up_completed', activation_step: 'template_uploaded' },
                    { dedupeKey: `${sessionId}-activation` }
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
        <div className="max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-3">Let&apos;s start with the design</h2>
                <p className="text-secondary text-sm max-w-md mx-auto">
                    Upload the high-resolution image of your certificate. <br />
                    Don&apos;t worry about the names yet, we&apos;ll add them next.
                </p>
            </div>

            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    'border-2 border-dashed rounded-[2rem] p-16 transition-all duration-500 cursor-pointer bg-white/50 hover:bg-white hover:shadow-2xl hover:shadow-accent/5 group relative overflow-hidden',
                    dragging
                        ? 'border-accent bg-accent/5 scale-[1.02]'
                        : 'border-border/60',
                    error ? 'border-red-500 bg-red-50' : ''
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={onFileChange}
                />

                <div className="flex flex-col items-center justify-center gap-6 relative z-10">
                    <div className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm",
                        dragging ? "bg-accent text-white scale-110 rotate-6" : "bg-accent/5 text-accent group-hover:bg-accent group-hover:text-white group-hover:rotate-6"
                    )}>
                        <UploadCloud size={40} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                        <p className="font-bold text-xl tracking-tight">
                            {dragging ? 'Drop it like it&apos;s hot!' : 'Drop your template here'}
                        </p>
                        <p className="text-sm text-secondary font-medium">
                            or click to browse your files
                        </p>
                    </div>

                    <div className="pt-4 flex items-center gap-6 opacity-40 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> PNG
                        </div>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> JPG
                        </div>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> MAX 5MB
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-8 flex items-center justify-center gap-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 animate-shake">
                    <AlertCircle size={20} />
                    <span className="text-sm font-bold tracking-tight">{error}</span>
                </div>
            )}

            <div className="mt-16 p-6 rounded-2xl bg-accent/5 border border-accent/10 flex items-start gap-4 text-left max-w-lg mx-auto">
                <div className="shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <AlertCircle size={16} />
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Pro Tip</h4>
                    <p className="text-xs text-secondary leading-relaxed">
                        For the best quality, use a template with at least <span className="font-bold">2000px width</span>. This ensures the text looks crisp when printed or viewed on high-res screens.
                    </p>
                </div>
            </div>
        </div>
    );
}
