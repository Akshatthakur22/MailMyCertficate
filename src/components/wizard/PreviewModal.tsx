'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { X, Loader2 } from 'lucide-react';
import { generateQRDataUrl, generateBarcodeDataUrl } from '@/core/studio/qrBarcode';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
    const template = useAppStore((state) => state.template);
    const templateDimensions = useAppStore((state) => state.templateDimensions);
    const fields = useAppStore((state) => state.fields);
    const csvData = useAppStore((state) => state.csvData);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        let isCancelled = false;

        const runPreview = async () => {
            if (!template || !templateDimensions || fields.length === 0 || csvData.length === 0) {
                return;
            }

            setIsGenerating(true);
            try {
                const recipientData = csvData[0];
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = templateDimensions.width;
                canvas.height = templateDimensions.height;

                // Load base template
                const img = new Image();
                await new Promise<void>((resolve, reject) => {
                    img.onload = () => resolve();
                    img.onerror = reject;
                    img.src = template;
                });

                if (isCancelled) return;

                ctx.drawImage(img, 0, 0, templateDimensions.width, templateDimensions.height);

                // Render each field
                for (const field of fields) {
                    const fieldType = field.type || 'text';

                    if (fieldType === 'qr') {
                        const qrPayload = field.pattern
                            ? field.pattern.replace(/\{\{([^}]+)\}\}/g, (_, key) => String(recipientData[key] ?? ''))
                            : String(recipientData[field.columnName] ?? 'SAMPLE');
                        const qrDataUrl = await generateQRDataUrl(qrPayload, {
                            errorCorrectionLevel: field.errorCorrectionLevel || 'M',
                            fgColor: field.color || '#000000',
                            bgColor: field.bgColor || '#FFFFFF',
                            width: field.width || 120,
                        });
                        const qrImg = new Image();
                        await new Promise<void>((r) => {
                            qrImg.onload = () => r();
                            qrImg.src = qrDataUrl;
                        });
                        const size = field.width || 120;
                        const x = field.align === 'center' ? field.x - size / 2 : field.align === 'right' ? field.x - size : field.x;
                        ctx.drawImage(qrImg, x, field.y, size, size);
                        continue;
                    }

                    if (fieldType === 'barcode') {
                        const val = String(recipientData[field.columnName] ?? '00000000');
                        const barcodeDataUrl = generateBarcodeDataUrl(val, {
                            format: field.barcodeFormat || 'CODE128',
                            lineColor: field.color || '#000000',
                            height: field.height || 60,
                        });
                        if (barcodeDataUrl) {
                            const bImg = new Image();
                            await new Promise<void>((r) => {
                                bImg.onload = () => r();
                                bImg.src = barcodeDataUrl;
                            });
                            const bw = field.width || 180;
                            const bh = field.height || 60;
                            const x = field.align === 'center' ? field.x - bw / 2 : field.align === 'right' ? field.x - bw : field.x;
                            ctx.drawImage(bImg, x, field.y, bw, bh);
                        }
                        continue;
                    }

                    if (fieldType === 'signature' || fieldType === 'image') {
                        const src = field.signatureDataUrl || String(recipientData[field.columnName] || field.fallbackImage || '');
                        if (src) {
                            const mediaImg = new Image();
                            await new Promise<void>((r) => {
                                mediaImg.onload = () => r();
                                mediaImg.onerror = () => r();
                                mediaImg.src = src;
                            });
                            const mw = field.width || 140;
                            const mh = field.height || 70;
                            const x = field.align === 'center' ? field.x - mw / 2 : field.align === 'right' ? field.x - mw : field.x;
                            ctx.drawImage(mediaImg, x, field.y, mw, mh);
                        }
                        continue;
                    }

                    // Text Field
                    const value = recipientData[field.columnName] || '';
                    if (!value) continue;

                    let fontSize = field.fontSize;
                    ctx.font = `${fontSize}px ${field.fontFamily || 'Helvetica'}`;
                    const measured = ctx.measureText(String(value)).width;

                    // Shrink to fit if enabled
                    if (field.shrinkToFit && field.width && measured > field.width) {
                        fontSize = Math.max(12, field.width * (fontSize / measured));
                        ctx.font = `${fontSize}px ${field.fontFamily || 'Helvetica'}`;
                    }

                    ctx.fillStyle = field.color || '#000000';
                    ctx.textAlign = field.align as CanvasTextAlign;
                    ctx.fillText(String(value), field.x, field.y + fontSize * 0.35);
                }

                if (!isCancelled) {
                    setPreviewImage(canvas.toDataURL('image/png'));
                }
            } catch (err) {
                console.error('Preview generation failed:', err);
            } finally {
                if (!isCancelled) {
                    setIsGenerating(false);
                }
            }
        };

        runPreview();

        return () => {
            isCancelled = true;
        };
    }, [isOpen, template, templateDimensions, fields, csvData]);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-border"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div>
                        <h3 className="text-base font-semibold text-foreground">
                            Certificate Preview
                        </h3>
                        <p className="text-xs text-secondary mt-0.5">
                            Sample preview with recipient row #1
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-secondary hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-50 min-h-[300px]">
                    {isGenerating ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 size={32} className="animate-spin text-accent" />
                            <p className="text-xs text-secondary">Rendering sample certificate...</p>
                        </div>
                    ) : previewImage ? (
                        <div className="relative max-w-full max-h-full shadow-lg rounded-lg overflow-hidden border border-border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={previewImage}
                                alt="Certificate Preview"
                                className="max-w-full max-h-[70vh] object-contain"
                            />
                        </div>
                    ) : (
                        <p className="text-xs text-secondary">No preview available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
