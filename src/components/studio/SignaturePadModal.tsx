'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { trimCanvasTransparency, getMidPoint, type Point } from '@/core/studio/signature';
import { removePaperBackground } from '@/core/studio/imageProcessing';
import { Pen, Eraser, Check, X, Upload, Sparkles, Sliders } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SignaturePadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSignature: (dataUrl: string) => void;
}

export function SignaturePadModal({
    isOpen,
    onClose,
    onSaveSignature,
}: SignaturePadModalProps) {
    const [mode, setMode] = useState<'draw' | 'scan'>('draw');
    const [inkColor, setInkColor] = useState('#0F172A'); // Deep ink navy
    const [threshold, setThreshold] = useState(65);
    const [scannedPreview, setScannedPreview] = useState<string | null>(null);
    const [rawScanSrc, setRawScanSrc] = useState<string | null>(null);
    const [isProcessingScan, setIsProcessingScan] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawingRef = useRef(false);
    const pointsRef = useRef<Point[]>([]);

    // Clear canvas
    const handleClear = useCallback(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        pointsRef.current = [];
    }, []);

    useEffect(() => {
        if (isOpen && mode === 'draw' && canvasRef.current) {
            handleClear();
        }
    }, [isOpen, mode, handleClear]);

    // Handle mouse/touch drawing with Bezier smoothing
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        isDrawingRef.current = true;
        const point: Point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            time: Date.now(),
        };
        pointsRef.current = [point];
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const currentPoint: Point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            time: Date.now(),
        };

        const points = pointsRef.current;
        points.push(currentPoint);

        if (points.length < 3) return;

        ctx.strokeStyle = inkColor;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const len = points.length;
        const p1 = points[len - 2];
        const p2 = points[len - 1];
        const midPoint = getMidPoint(p1, p2);

        ctx.beginPath();
        const prevMid = len > 3 ? getMidPoint(points[len - 3], p1) : p1;
        ctx.moveTo(prevMid.x, prevMid.y);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        ctx.stroke();
    };

    const handlePointerUp = () => {
        isDrawingRef.current = false;
    };

    // Save drawn signature with transparency trimming
    const handleSaveDrawn = () => {
        if (!canvasRef.current) return;
        const trimmed = trimCanvasTransparency(canvasRef.current);
        onSaveSignature(trimmed);
        onClose();
    };

    // Handle uploaded paper scan
    const handleScanFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const src = ev.target?.result as string;
            setRawScanSrc(src);
            setIsProcessingScan(true);
            try {
                const cleaned = await removePaperBackground(src, threshold);
                setScannedPreview(cleaned);
            } catch (err) {
                console.error(err);
            } finally {
                setIsProcessingScan(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // Re-run background threshold on slider change
    const handleThresholdChange = async (newVal: number) => {
        setThreshold(newVal);
        if (rawScanSrc) {
            try {
                const cleaned = await removePaperBackground(rawScanSrc, newVal);
                setScannedPreview(cleaned);
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
                    <div className="flex items-center gap-2">
                        <Pen size={18} className="text-accent" />
                        <h3 className="font-semibold text-foreground text-base">Digital Signature Pad</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex border-b border-border/60 bg-muted/30 p-1.5 gap-1.5">
                    <button
                        type="button"
                        onClick={() => setMode('draw')}
                        className={cn(
                            'flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5',
                            mode === 'draw'
                                ? 'bg-white text-foreground shadow-sm'
                                : 'text-secondary hover:text-foreground'
                        )}
                    >
                        <Pen size={14} />
                        Draw Ink Signature
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('scan')}
                        className={cn(
                            'flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5',
                            mode === 'scan'
                                ? 'bg-white text-foreground shadow-sm'
                                : 'text-secondary hover:text-foreground'
                        )}
                    >
                        <Sparkles size={14} />
                        Scan Paper / Strip Background
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-6">
                    {mode === 'draw' ? (
                        <div className="space-y-4">
                            {/* Ink Palette */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-secondary">Ink Color:</span>
                                <div className="flex gap-2">
                                    {[
                                        { label: 'Black', color: '#0F172A' },
                                        { label: 'Navy', color: '#1E3A8A' },
                                        { label: 'Royal Blue', color: '#2563EB' },
                                    ].map((c) => (
                                        <button
                                            key={c.color}
                                            type="button"
                                            onClick={() => setInkColor(c.color)}
                                            style={{ backgroundColor: c.color }}
                                            className={cn(
                                                'w-6 h-6 rounded-full border-2 transition-transform',
                                                inkColor === c.color ? 'border-accent scale-110 shadow-sm' : 'border-transparent'
                                            )}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Canvas Drawing Area */}
                            <div className="relative border-2 border-dashed border-border rounded-xl bg-slate-50/50 overflow-hidden">
                                <canvas
                                    ref={canvasRef}
                                    width={460}
                                    height={200}
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerLeave={handlePointerUp}
                                    className="cursor-crosshair w-full h-[200px] touch-none"
                                />
                                <div className="absolute bottom-2 left-3 pointer-events-none text-[10px] text-secondary/60">
                                    Sign smoothly using mouse, trackpad, or stylus
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClear}
                                    className="text-xs"
                                >
                                    <Eraser size={14} className="mr-1" />
                                    Clear
                                </Button>
                                <div className="flex gap-2">
                                    <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button type="button" size="sm" onClick={handleSaveDrawn}>
                                        <Check size={14} className="mr-1" />
                                        Use Signature
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {!rawScanSrc ? (
                                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border hover:border-accent rounded-xl cursor-pointer bg-slate-50/50 transition-colors">
                                    <Upload size={24} className="text-secondary mb-2" />
                                    <span className="text-xs font-medium text-foreground">Upload scanned paper signature</span>
                                    <span className="text-[11px] text-secondary mt-1">PNG, JPG photograph on paper</span>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleScanFile}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="border border-border rounded-lg p-2 text-center bg-slate-50">
                                            <span className="text-[10px] text-secondary uppercase font-bold block mb-1">Original Paper</span>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={rawScanSrc} alt="Original" className="h-28 object-contain mx-auto" />
                                        </div>
                                        <div className="border border-accent/40 rounded-lg p-2 text-center bg-slate-100/50 relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px]" />
                                            <span className="text-[10px] text-accent uppercase font-bold block mb-1">Clean Transparent</span>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={scannedPreview || rawScanSrc} alt="Cleaned" className="h-28 object-contain mx-auto relative z-10" />
                                        </div>
                                    </div>

                                    {/* Sensitivity slider */}
                                    <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border/60">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-secondary flex items-center gap-1">
                                                <Sliders size={12} /> Paper Threshold:
                                            </span>
                                            <span className="font-semibold text-foreground">{threshold}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={20}
                                            max={180}
                                            value={threshold}
                                            onChange={(e) => handleThresholdChange(Number(e.target.value))}
                                            className="w-full accent-accent cursor-pointer"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setRawScanSrc(null);
                                                setScannedPreview(null);
                                            }}
                                            className="text-xs"
                                        >
                                            Upload Different
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                disabled={isProcessingScan || !scannedPreview}
                                                onClick={() => {
                                                    if (scannedPreview) {
                                                        onSaveSignature(scannedPreview);
                                                        onClose();
                                                    }
                                                }}
                                            >
                                                <Check size={14} className="mr-1" />
                                                Use Extracted Ink
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
