'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { X } from 'lucide-react';

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

    const generatePreview = useCallback(async () => {
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

            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, templateDimensions.width, templateDimensions.height);

                for (const field of fields) {
                    const value = recipientData[field.columnName] || '';
                    if (!value) continue;

                    ctx.font = `${field.fontSize}px ${field.fontFamily}`;
                    ctx.fillStyle = field.color;
                    ctx.textAlign = field.align as CanvasTextAlign;

                    const x = field.align === 'center' ? field.x : field.align === 'right' ? field.width - field.x : field.x;
                    ctx.fillText(String(value), x, field.y);
                }

                const dataUrl = canvas.toDataURL('image/png');
                setPreviewImage(dataUrl);
                setIsGenerating(false);
            };
            img.src = template;
            
        } catch (error) {
            console.error('Preview generation failed:', error);
            setIsGenerating(false);
        }
    }, [template, templateDimensions, fields, csvData]);

    useEffect(() => {
        if (isOpen && csvData.length > 0) {
            generatePreview();
        }
    }, [isOpen, csvData.length, generatePreview]);

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

    // Cleanup when modal closes
    useEffect(() => {
        if (!isOpen) {
            setPreviewImage(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                ref={modalRef}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/40">
                    <h3 className="text-lg font-bold tracking-tight">Certificate Preview</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-secondary/10 flex items-center justify-center text-secondary transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-auto p-6 bg-[#F8F9FA]">
                    <div className="flex items-center justify-center min-h-full">
                        {isGenerating ? (
                            <div className="text-center p-12">
                                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mx-auto mb-4 animate-pulse">
                                    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                </div>
                                <p className="text-sm font-medium text-secondary">Generating preview...</p>
                            </div>
                        ) : previewImage ? (
                            <div className="relative inline-block">
                                <img
                                    src={previewImage}
                                    alt="Certificate Preview"
                                    className="max-w-full max-h-[60vh] shadow-2xl rounded-xl border border-white/50"
                                />
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                                    LIVE PREVIEW
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-12">
                                <p className="text-sm font-medium text-secondary/60">Preview unavailable</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border/40 bg-white/50">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-secondary">
                            This is how your certificate will look when generated
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
