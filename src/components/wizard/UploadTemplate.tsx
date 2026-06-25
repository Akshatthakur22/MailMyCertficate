'use client';

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { loadTemplate } from '@/services/templateService';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { db } from '@/core/db/schema';
import { updateSession, touchActivity } from '@/core/session/sessionManager';
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

            const allowedTypes = ['image/png', 'image/jpeg'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Invalid file type. Please upload a PNG or JPEG image.');
            }
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('File too large. Maximum size is 5MB.');
            }

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
            <p className="text-secondary text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                Upload your certificate design. Recipient names are added in the next step.
            </p>

            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    'border-2 border-dashed rounded-xl p-10 md:p-12 transition-colors cursor-pointer group',
                    dragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40 hover:bg-muted/30',
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

                <div className="flex flex-col items-center gap-4">
                    <div
                        className={cn(
                            'w-14 h-14 rounded-xl flex items-center justify-center transition-colors',
                            dragging ? 'bg-accent text-white' : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white',
                        )}
                    >
                        <UploadCloud size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">
                            {dragging ? 'Drop to upload' : 'Drop your template here'}
                        </p>
                        <p className="text-sm text-secondary mt-1">or click to browse</p>
                    </div>
                    <p className="text-xs text-secondary/70">PNG or JPG · max 5 MB</p>
                </div>
            </div>

            {error && (
                <div className="mt-4 flex items-center justify-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100 text-sm">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <p className="mt-6 text-xs text-secondary/60">
                Tip: use at least 2000px width for crisp print quality.
            </p>
        </div>
    );
}
