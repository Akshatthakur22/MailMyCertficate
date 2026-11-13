'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useStore } from 'zustand';
import { useAppStore } from '@/store/useAppStore';
import { DraggableField } from '@/components/wizard/DraggableField';
import { EditorOnboarding } from '@/components/wizard/EditorOnboarding';
import { EditorEmptyState } from '@/components/wizard/EditorEmptyState';
import { FieldList } from '@/components/wizard/FieldList';
import { Button } from '@/components/ui/Button';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Trash2,
    ZoomIn,
    ZoomOut,
    ArrowRight,
    ChevronLeft,
    PanelLeft,
    PanelRight,
    Undo2,
    Redo2,
    Table,
    PenTool,
    QrCode,
    Barcode,
    Type,
    Image as ImageIcon,
    ShieldCheck,
    WrapText,
    Minimize2,
    Eye,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { trackBackendEvent } from '@/services/analyticsService';
import { db } from '@/core/db/schema';
import type { GuideLine } from '@/core/studio/snapping';
import { POPULAR_GOOGLE_FONTS } from '@/core/engine/fontManager';
import { SignaturePadModal } from '@/components/studio/SignaturePadModal';
import { DataGridModal } from '@/components/studio/DataGridModal';
import { CanvasMiniMap } from '@/components/studio/CanvasMiniMap';
import { BatchAlignmentBar } from '@/components/studio/BatchAlignmentBar';
import { PreviewModal } from '@/components/wizard/PreviewModal';
import type { FieldType, ShapeMask, QRErrorCorrectionLevel } from '@/types/field';

const PRESET_COLORS = ['#000000', '#1F4ED8', '#DC2626', '#16A34A', '#FFFFFF', '#D97706', '#9333EA'];

const generateId = () => Math.random().toString(36).substring(7);

export function AdjustPreview() {
    const sessionId = useAppStore((state) => state.sessionId);
    const setTemplate = useAppStore((state) => state.setTemplate);
    const setCurrentStep = useAppStore((state) => state.setCurrentStep);
    const template = useAppStore((state) => state.template);
    const templateDimensions = useAppStore((state) => state.templateDimensions);
    const csvHeaders = useAppStore((state) => state.csvHeaders);
    const fields = useAppStore((state) => state.fields);
    const addField = useAppStore((state) => state.addField);
    const updateField = useAppStore((state) => state.updateField);
    const removeField = useAppStore((state) => state.removeField);
    const selectedFieldIds = useAppStore((state) => state.selectedFieldIds);
    const setSelectedFieldIds = useAppStore((state) => state.setSelectedFieldIds);
    const toggleFieldSelection = useAppStore((state) => state.toggleFieldSelection);
    const groupSelectedFields = useAppStore((state) => state.groupSelectedFields);
    const ungroupSelectedFields = useAppStore((state) => state.ungroupSelectedFields);
    const removeMultipleFields = useAppStore((state) => state.removeMultipleFields);

    const { undo, redo, pastStates, futureStates } = useStore(useAppStore.temporal, (state) => state);

    const containerRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<HTMLDivElement>(null);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [scale, setScale] = useState(0.52);
    const [isFit, setIsFit] = useState(true);
    const [isPanning, setIsPanning] = useState(false);
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [rightPanelOpen, setRightPanelOpen] = useState(true);
    const [showOnboarding] = useState(true);

    // Smart Snapping Guidelines State
    const [activeGuides, setActiveGuides] = useState<GuideLine[]>([]);
    const [leftTab, setLeftTab] = useState<'fields' | 'insert' | 'layers'>('fields');

    // Modals
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [isDataGridOpen, setIsDataGridOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    // Marquee Selection Box State
    const [marquee, setMarquee] = useState<{
        startX: number;
        startY: number;
        currentX: number;
        currentY: number;
    } | null>(null);
    const isMarqueeActiveRef = useRef(false);

    const fitToScreen = useCallback(() => {
        if (!workspaceRef.current || !templateDimensions) return;
        const rect = workspaceRef.current.getBoundingClientRect();

        // If container is still animating or unlaid-out (e.g. during transition from Step 2 to Step 3), do not set bogus tiny scale!
        if (rect.width < 250 || rect.height < 250) {
            return;
        }

        const padding = 56;
        const scaleX = (rect.width - padding) / templateDimensions.width;
        const scaleY = (rect.height - padding) / templateDimensions.height;
        // Clamp to a healthy minimum of 0.35 and max of 1.0 (never drop down to 2%)
        const target = Math.max(0.35, Math.min(scaleX, scaleY, 1));
        setScale(target);
        setIsFit(true);
    }, [templateDimensions]);

    const fitToWidth = useCallback(() => {
        if (!workspaceRef.current || !templateDimensions) return;
        const rect = workspaceRef.current.getBoundingClientRect();
        if (rect.width < 250) return;
        const padding = 56;
        const scaleX = (rect.width - padding) / templateDimensions.width;
        setScale(Math.max(0.35, Math.min(scaleX, 2)));
        setIsFit(false);
    }, [templateDimensions]);

    useEffect(() => {
        if (!isFit) return;

        // Immediate fit attempt
        fitToScreen();

        // Staggered retries to wait for CSS flex & parent height transitions (e.g. 200ms transition in ToolWizardView)
        const t1 = setTimeout(fitToScreen, 50);
        const t2 = setTimeout(fitToScreen, 150);
        const t3 = setTimeout(fitToScreen, 300);

        // Window resize listener
        window.addEventListener('resize', fitToScreen);

        // ResizeObserver for dynamic layout/panel toggles
        let observer: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined' && workspaceRef.current) {
            observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    if (entry.contentRect.width > 250 && entry.contentRect.height > 250) {
                        fitToScreen();
                    }
                }
            });
            observer.observe(workspaceRef.current);
        }

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            window.removeEventListener('resize', fitToScreen);
            observer?.disconnect();
        };
    }, [fitToScreen, isFit]);

    // Keyboard Shortcuts (Undo, Redo, Zoom, Grouping, Delete)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName);

            // Undo / Redo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) redo();
                else undo();
                e.preventDefault();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                redo();
                e.preventDefault();
            }

            // Group / Ungroup (Cmd/Ctrl + G)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
                e.preventDefault();
                if (e.shiftKey) ungroupSelectedFields();
                else groupSelectedFields();
            }

            // Quick Zoom Actions
            if (e.shiftKey && e.key === '!') { // Shift + 1
                e.preventDefault();
                fitToScreen();
            }
            if (e.shiftKey && e.key === '@') { // Shift + 2
                e.preventDefault();
                fitToWidth();
            }
            if (e.shiftKey && e.key === ')') { // Shift + 0
                e.preventDefault();
                setScale(1);
                setIsFit(false);
            }

            // Delete selected
            if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
                if (selectedFieldIds.length > 0) {
                    e.preventDefault();
                    removeMultipleFields(selectedFieldIds);
                    setSelectedFieldId(null);
                } else if (selectedFieldId) {
                    e.preventDefault();
                    removeField(selectedFieldId);
                    setSelectedFieldId(null);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, fitToScreen, fitToWidth, groupSelectedFields, ungroupSelectedFields, selectedFieldIds, selectedFieldId, removeMultipleFields, removeField]);

    // Spacebar Panning
    useEffect(() => {
        const handleSpaceDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
                setIsPanning(true);
                e.preventDefault();
            }
        };
        const handleSpaceUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') setIsPanning(false);
        };
        window.addEventListener('keydown', handleSpaceDown);
        window.addEventListener('keyup', handleSpaceUp);
        return () => {
            window.removeEventListener('keydown', handleSpaceDown);
            window.removeEventListener('keyup', handleSpaceUp);
        };
    }, []);

    // Load template from IDB if not loaded
    useEffect(() => {
        const loadFromIDB = async () => {
            if (!template && sessionId) {
                const file = await db.files.get(`${sessionId}-template`);
                if (file && templateDimensions) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const base64 = e.target?.result as string;
                        setTemplate(base64, templateDimensions);
                    };
                    reader.readAsDataURL(file.blob);
                }
            }
        };
        loadFromIDB();
    }, [template, sessionId, templateDimensions, setTemplate]);

    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.1, 3));
        setIsFit(false);
    };
    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.1, 0.2));
        setIsFit(false);
    };

    const handleAddField = (header: string) => {
        if (!templateDimensions) return;
        trackBackendEvent('field_editor_opened', { csv_columns: csvHeaders.length });
        const newField = {
            id: `${header}-${generateId()}`,
            columnName: header,
            x: templateDimensions.width / 2,
            y: templateDimensions.height / 2,
            width: 260,
            fontSize: 48,
            fontFamily: 'Helvetica',
            color: '#000000',
            align: 'center' as const,
            type: 'text' as FieldType,
            shrinkToFit: true,
        };
        addField(newField);
        setSelectedFieldId(newField.id);
        setSelectedFieldIds([newField.id]);
        setRightPanelOpen(true);
    };

    // Auto-place primary name column on canvas if no fields exist yet
    useEffect(() => {
        // Read the current store value so React Strict Mode effect replay cannot
        // enqueue the initial field twice before this render updates.
        if (useAppStore.getState().fields.length === 0 && templateDimensions && csvHeaders.length > 0) {
            const nameHeader = csvHeaders.find((h) => /name|recipient|student|attendee|participant/i.test(h)) || csvHeaders[0];
            if (nameHeader) {
                handleAddField(nameHeader);
            }
        }
    }, [fields.length, templateDimensions, csvHeaders]);

    // Add Signature as an active asset field on canvas
    const handleAddSignatureAsset = (dataUrl: string) => {
        if (!templateDimensions) return;
        const sigField = {
            id: `signature-${generateId()}`,
            columnName: 'Signature',
            x: templateDimensions.width / 2,
            y: templateDimensions.height * 0.75,
            width: 180,
            height: 90,
            fontSize: 16,
            fontFamily: 'Helvetica',
            color: '#000000',
            align: 'center' as const,
            type: 'signature' as FieldType,
            signatureDataUrl: dataUrl,
        };
        addField(sigField);
        setSelectedFieldId(sigField.id);
        setSelectedFieldIds([sigField.id]);
        setRightPanelOpen(true);
    };

    // Add QR Code Field
    const handleAddQRField = () => {
        if (!templateDimensions) return;
        const targetCol = csvHeaders[0] || 'Certificate_ID';
        const qrField = {
            id: `qr-${generateId()}`,
            columnName: targetCol,
            x: templateDimensions.width * 0.85,
            y: templateDimensions.height * 0.85,
            width: 120,
            height: 120,
            fontSize: 14,
            fontFamily: 'Helvetica',
            color: '#000000',
            align: 'center' as const,
            type: 'qr' as FieldType,
            pattern: 'https://verify.domain.com/cert/{{' + targetCol + '}}?hash={{HMAC}}',
            errorCorrectionLevel: 'M' as QRErrorCorrectionLevel,
        };
        addField(qrField);
        setSelectedFieldId(qrField.id);
        setSelectedFieldIds([qrField.id]);
        setRightPanelOpen(true);
    };

    // Add Barcode Field
    const handleAddBarcodeField = () => {
        if (!templateDimensions) return;
        const targetCol = csvHeaders[0] || 'Certificate_ID';
        const bField = {
            id: `barcode-${generateId()}`,
            columnName: targetCol,
            x: templateDimensions.width / 2,
            y: templateDimensions.height * 0.88,
            width: 180,
            height: 60,
            fontSize: 12,
            fontFamily: 'Helvetica',
            color: '#000000',
            align: 'center' as const,
            type: 'barcode' as FieldType,
            barcodeFormat: 'CODE128' as const,
        };
        addField(bField);
        setSelectedFieldId(bField.id);
        setSelectedFieldIds([bField.id]);
        setRightPanelOpen(true);
    };

    // Add Student Photo Field
    const handleAddPhotoField = () => {
        if (!templateDimensions) return;
        const targetCol = csvHeaders.find((h) => h.toLowerCase().includes('photo') || h.toLowerCase().includes('image')) || csvHeaders[0] || 'Photo';
        const pField = {
            id: `photo-${generateId()}`,
            columnName: targetCol,
            x: templateDimensions.width * 0.15,
            y: templateDimensions.height * 0.35,
            width: 120,
            height: 120,
            fontSize: 12,
            fontFamily: 'Helvetica',
            color: '#000000',
            align: 'center' as const,
            type: 'image' as FieldType,
            shapeMask: 'circle' as ShapeMask,
        };
        addField(pField);
        setSelectedFieldId(pField.id);
        setSelectedFieldIds([pField.id]);
        setRightPanelOpen(true);
    };

    // Add Custom Static Text Field
    const handleAddCustomTextField = () => {
        if (!templateDimensions) return;
        const tField = {
            id: `text-${generateId()}`,
            columnName: 'Certificate of Achievement',
            x: templateDimensions.width / 2,
            y: templateDimensions.height * 0.3,
            width: 400,
            fontSize: 32,
            fontFamily: 'Playfair Display',
            color: '#1E293B',
            align: 'center' as const,
            type: 'text' as FieldType,
            shrinkToFit: true,
        };
        addField(tField);
        setSelectedFieldId(tField.id);
        setSelectedFieldIds([tField.id]);
        setRightPanelOpen(true);
    };

    // Active field selection
    const selectedField = useMemo(() => {
        if (selectedFieldId) return fields.find((f) => f.id === selectedFieldId);
        if (selectedFieldIds.length === 1) return fields.find((f) => f.id === selectedFieldIds[0]);
        return undefined;
    }, [fields, selectedFieldId, selectedFieldIds]);

    const handleSelectField = (id: string, isShift: boolean = false) => {
        if (isShift) {
            toggleFieldSelection(id);
        } else {
            setSelectedFieldId(id);
            setSelectedFieldIds([id]);
        }
        setRightPanelOpen(true);
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setScale((prev) => Math.min(Math.max(prev - e.deltaY * 0.001, 0.1), 3));
            setIsFit(false);
        }
    };

    // Canvas Background Mouse Down (Pan vs Rubberband Marquee)
    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (isPanning && workspaceRef.current) {
            const startX = e.clientX;
            const startY = e.clientY;
            const scrollLeft = workspaceRef.current.scrollLeft;
            const scrollTop = workspaceRef.current.scrollTop;
            const onMouseMove = (m: MouseEvent) => {
                if (workspaceRef.current) {
                    workspaceRef.current.scrollLeft = scrollLeft - (m.clientX - startX);
                    workspaceRef.current.scrollTop = scrollTop - (m.clientY - startY);
                }
            };
            const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        } else if (e.target === e.currentTarget || (containerRef.current && (e.target as HTMLElement).tagName === 'IMG')) {
            // Clicked empty canvas or template image background
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const startX = (e.clientX - rect.left) / scale;
            const startY = (e.clientY - rect.top) / scale;

            isMarqueeActiveRef.current = true;
            setMarquee({ startX, startY, currentX: startX, currentY: startY });

            if (!e.shiftKey) {
                setSelectedFieldId(null);
                setSelectedFieldIds([]);
            }

            const onMouseMove = (m: MouseEvent) => {
                if (!isMarqueeActiveRef.current || !containerRef.current) return;
                const curX = (m.clientX - rect.left) / scale;
                const curY = (m.clientY - rect.top) / scale;

                setMarquee((prev) => (prev ? { ...prev, currentX: curX, currentY: curY } : null));

                // Find fields intersecting marquee box
                const minX = Math.min(startX, curX);
                const maxX = Math.max(startX, curX);
                const minY = Math.min(startY, curY);
                const maxY = Math.max(startY, curY);

                const intersectingIds = fields
                    .filter((f) => {
                        const fw = f.width || 120;
                        const fh = f.fontSize || 30;
                        const fx = f.align === 'center' ? f.x - fw / 2 : f.align === 'right' ? f.x - fw : f.x;
                        const fy = f.y;
                        return fx < maxX && fx + fw > minX && fy < maxY && fy + fh > minY;
                    })
                    .map((f) => f.id);

                setSelectedFieldIds(intersectingIds);
            };

            const onMouseUp = () => {
                isMarqueeActiveRef.current = false;
                setMarquee(null);
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
    };

    if (!template || !templateDimensions) return null;

    return (
        <div className="flex flex-col h-full min-h-0 bg-white select-none">
            {/* Top Studio Control Bar */}
            <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-border/70 bg-white/90 backdrop-blur-md gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(2)}
                        className="shrink-0 rounded-lg px-2.5 h-8 text-xs text-secondary hover:text-foreground hover:bg-muted/60"
                        title="Back to Participants"
                    >
                        <ChevronLeft size={15} className="mr-0.5" />
                        Back
                    </Button>

                    <div className="h-4 w-px bg-border/60 mx-0.5 shrink-0" />

                    {/* Undo / Redo */}
                    <div className="flex items-center gap-0.5 shrink-0 bg-muted/40 p-0.5 rounded-lg border border-border/50">
                        <button
                            type="button"
                            onClick={() => undo()}
                            disabled={pastStates.length === 0}
                            className="p-1 rounded-md text-secondary hover:text-foreground hover:bg-white disabled:opacity-30 transition-colors"
                            title="Undo (Cmd/Ctrl+Z)"
                        >
                            <Undo2 size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => redo()}
                            disabled={futureStates.length === 0}
                            className="p-1 rounded-md text-secondary hover:text-foreground hover:bg-white disabled:opacity-30 transition-colors"
                            title="Redo (Cmd/Ctrl+Y)"
                        >
                            <Redo2 size={14} />
                        </button>
                    </div>

                    <div className="h-4 w-px bg-border/60 mx-0.5 shrink-0" />

                    {/* Zoom Toolbar */}
                    <div className="flex items-center gap-0.5 rounded-lg border border-border/60 bg-muted/40 p-0.5 shrink-0">
                        <button
                            type="button"
                            onClick={handleZoomOut}
                            className="p-1 rounded-md hover:bg-white text-secondary hover:text-foreground transition-colors"
                            title="Zoom out"
                        >
                            <ZoomOut size={13} />
                        </button>
                        <span className="px-1.5 text-[11px] font-semibold tabular-nums min-w-[2.5rem] text-center text-foreground">
                            {(scale * 100).toFixed(0)}%
                        </span>
                        <button
                            type="button"
                            onClick={handleZoomIn}
                            className="p-1 rounded-md hover:bg-white text-secondary hover:text-foreground transition-colors"
                            title="Zoom in"
                        >
                            <ZoomIn size={13} />
                        </button>
                        <button
                            type="button"
                            onClick={fitToScreen}
                            className={cn(
                                'px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all',
                                isFit ? 'bg-accent text-white shadow-2xs' : 'hover:bg-white text-secondary hover:text-foreground'
                            )}
                            title="Fit to screen (Shift+1)"
                        >
                            Fit
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setScale(1);
                                setIsFit(false);
                            }}
                            className={cn(
                                'px-1.5 py-0.5 text-[11px] font-medium rounded-md transition-all',
                                !isFit && Math.abs(scale - 1) < 0.05
                                    ? 'bg-accent text-white shadow-2xs'
                                    : 'hover:bg-white text-secondary hover:text-foreground'
                            )}
                            title="100% scale (Shift+0)"
                        >
                            100%
                        </button>
                    </div>

                    <div className="h-4 w-px bg-border/60 mx-0.5 shrink-0" />

                    {/* Studio Advanced Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsDataGridOpen(true)}
                            className="text-xs h-8 text-secondary hover:text-foreground border-border/70 hover:border-accent/40"
                            title="Edit participant columns and serial numbers"
                        >
                            <Table size={13} className="mr-1 text-accent" />
                            Data Grid
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsSignatureModalOpen(true)}
                            className="text-xs h-8 text-secondary hover:text-foreground border-border/70 hover:border-accent/40"
                            title="Draw signature or scan paper signature"
                        >
                            <PenTool size={13} className="mr-1 text-accent" />
                            Signature
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddQRField}
                            className="text-xs h-8 text-secondary hover:text-foreground border-border/70 hover:border-accent/40"
                            title="Insert Dynamic Vector QR code"
                        >
                            <QrCode size={13} className="mr-1 text-accent" />
                            QR Code
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsPreviewModalOpen(true)}
                            className="text-xs h-8 text-secondary hover:text-foreground border-border/70 hover:border-accent/40 bg-accent/5"
                            title="Preview recipient certificate in high resolution"
                        >
                            <Eye size={13} className="mr-1 text-accent" />
                            Preview
                        </Button>
                    </div>

                    {/* Canvas dimension pill */}
                    <span className="hidden 2xl:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-[10px] text-secondary font-mono border border-border/40 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {templateDimensions.width} × {templateDimensions.height}px
                    </span>
                </div>

                {/* Right CTAs */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => setLeftPanelOpen((v) => !v)}
                        className={cn(
                            'p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1',
                            leftPanelOpen
                                ? 'bg-accent/10 border-accent/30 text-accent font-semibold'
                                : 'border-border/60 text-secondary hover:bg-muted/60'
                        )}
                        title="Toggle elements & columns panel"
                    >
                        <PanelLeft size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setRightPanelOpen((v) => !v)}
                        className={cn(
                            'p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1',
                            rightPanelOpen
                                ? 'bg-accent/10 border-accent/30 text-accent font-semibold'
                                : 'border-border/60 text-secondary hover:bg-muted/60'
                        )}
                        title="Toggle inspector panel"
                    >
                        <PanelRight size={15} />
                    </button>

                    <Button
                        size="sm"
                        onClick={async () => {
                            if (fields.length === 0 && csvHeaders.length > 0) {
                                const nameHeader = csvHeaders.find((h) => /name|recipient|student|attendee|participant/i.test(h)) || csvHeaders[0];
                                handleAddField(nameHeader);
                            }
                            // Delete stale certificates for this session
                            await db.certificates.where('sessionId').equals(sessionId).delete().catch(() => {});

                            // Pre-ensure rows in IDB before moving to GenerationView
                            const rowCount = await db.rows.where('sessionId').equals(sessionId).count();
                            const storeCsv = useAppStore.getState().csvData;
                            if (rowCount === 0 && storeCsv && storeCsv.length > 0) {
                                const rowRecords = storeCsv.map((row, index) => ({
                                    sessionId,
                                    data: { ...row, __rowIndex: index },
                                }));
                                await db.rows.bulkAdd(rowRecords as any);
                            }

                            // Pre-ensure template in IDB if missing
                            const templateFile = await db.files.get(`${sessionId}-template`);
                            if (!templateFile && template) {
                                try {
                                    let blob: Blob;
                                    if (template.startsWith('data:') || template.startsWith('http') || template.startsWith('/')) {
                                        const res = await fetch(template);
                                        blob = await res.blob();
                                    } else {
                                        blob = new Blob([template], { type: 'image/png' });
                                    }
                                    await db.files.put({
                                        id: `${sessionId}-template`,
                                        sessionId,
                                        type: 'template',
                                        blob,
                                    });
                                } catch (e) {
                                    console.warn('[AdjustPreview] Could not cache template to IDB:', e);
                                }
                            }

                            setCurrentStep(4);
                        }}
                        className="rounded-lg h-8 px-3.5 text-xs font-semibold shadow-xs ml-1 bg-accent hover:bg-accent/90 text-white cursor-pointer"
                    >
                        Generate Certificates
                        <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                            {Math.max(fields.length, 1)}
                        </span>
                        <ArrowRight size={13} className="ml-1" />
                    </Button>
                </div>
            </div>

            {/* Studio Workspace */}
            <div className="flex-1 min-h-0 flex overflow-hidden">
                {/* Left Panel: Field List, Insert Elements & Layers */}
                {leftPanelOpen && (
                    <aside className="w-60 shrink-0 border-r border-border/60 flex flex-col bg-muted/20">
                        {/* Tab Switcher */}
                        <div className="flex border-b border-border/60 bg-muted/30 p-1 gap-1">
                            <button
                                type="button"
                                onClick={() => setLeftTab('fields')}
                                className={cn(
                                    'flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all text-center',
                                    leftTab === 'fields'
                                        ? 'bg-white text-foreground shadow-xs'
                                        : 'text-secondary hover:text-foreground'
                                )}
                            >
                                Columns
                            </button>
                            <button
                                type="button"
                                onClick={() => setLeftTab('insert')}
                                className={cn(
                                    'flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all text-center',
                                    leftTab === 'insert'
                                        ? 'bg-white text-foreground shadow-xs'
                                        : 'text-secondary hover:text-foreground'
                                )}
                            >
                                Insert
                            </button>
                            <button
                                type="button"
                                onClick={() => setLeftTab('layers')}
                                className={cn(
                                    'flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all text-center',
                                    leftTab === 'layers'
                                        ? 'bg-white text-foreground shadow-xs'
                                        : 'text-secondary hover:text-foreground'
                                )}
                            >
                                Layers ({fields.length})
                            </button>
                        </div>

                        {/* Tab 1: CSV Columns */}
                        {leftTab === 'fields' && (
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-3 border-b border-border/40">
                                    <p className="text-xs font-semibold text-foreground">Participant Data</p>
                                    <p className="text-[11px] text-secondary mt-0.5">Click column to place on certificate</p>
                                </div>
                                <FieldList
                                    headers={csvHeaders}
                                    onAddField={handleAddField}
                                    fieldsCount={fields.length}
                                />
                            </div>
                        )}

                        {/* Tab 2: Insert Studio Elements */}
                        {leftTab === 'insert' && (
                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider mb-2">
                                    Add Elements
                                </p>

                                <button
                                    type="button"
                                    onClick={handleAddQRField}
                                    className="w-full text-left p-2.5 rounded-xl border border-border/80 bg-white hover:border-accent hover:shadow-xs transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                                        <QrCode size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">Dynamic QR Code</p>
                                        <p className="text-[10px] text-secondary">Vector verification hash</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAddBarcodeField}
                                    className="w-full text-left p-2.5 rounded-xl border border-border/80 bg-white hover:border-accent hover:shadow-xs transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                                        <Barcode size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">Dynamic Barcode</p>
                                        <p className="text-[10px] text-secondary">Code128 / Code39</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsSignatureModalOpen(true)}
                                    className="w-full text-left p-2.5 rounded-xl border border-border/80 bg-white hover:border-accent hover:shadow-xs transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                                        <PenTool size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">Digital Signature</p>
                                        <p className="text-[10px] text-secondary">Draw or scan paper</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAddPhotoField}
                                    className="w-full text-left p-2.5 rounded-xl border border-border/80 bg-white hover:border-accent hover:shadow-xs transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                                        <ImageIcon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">Recipient Photo</p>
                                        <p className="text-[10px] text-secondary">Avatar badge with mask</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAddCustomTextField}
                                    className="w-full text-left p-2.5 rounded-xl border border-border/80 bg-white hover:border-accent hover:shadow-xs transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                                        <Type size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">Static Title / Label</p>
                                        <p className="text-[10px] text-secondary">Fixed certificate text</p>
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* Tab 3: Placed Elements Stack (Layers) */}
                        {leftTab === 'layers' && (
                            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                                <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider mb-2">
                                    Element Hierarchy ({fields.length})
                                </p>
                                {fields.length === 0 ? (
                                    <p className="text-xs text-secondary/70 italic text-center py-6">
                                        No elements placed yet.
                                    </p>
                                ) : (
                                    fields.map((field) => (
                                        <div
                                            key={field.id}
                                            onClick={() => handleSelectField(field.id)}
                                            className={cn(
                                                'w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all border flex items-center justify-between cursor-pointer group',
                                                selectedFieldIds.includes(field.id)
                                                    ? 'bg-accent text-white border-accent shadow-xs'
                                                    : 'border-border/60 bg-white text-foreground hover:border-accent/40'
                                            )}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                {field.type === 'qr' ? (
                                                    <QrCode size={14} className="shrink-0" />
                                                ) : field.type === 'signature' ? (
                                                    <PenTool size={14} className="shrink-0" />
                                                ) : field.type === 'barcode' ? (
                                                    <Barcode size={14} className="shrink-0" />
                                                ) : field.type === 'image' ? (
                                                    <ImageIcon size={14} className="shrink-0" />
                                                ) : (
                                                    <Type size={14} className="shrink-0" />
                                                )}
                                                <span className="truncate">{field.columnName}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeField(field.id);
                                                    if (selectedFieldId === field.id) setSelectedFieldId(null);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-0.5"
                                                title="Delete element"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </aside>
                )}

                {/* Central Canvas Studio */}
                <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#f8fafc] [background-image:radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] [background-size:24px_24px] relative">
                    <div
                        ref={workspaceRef}
                        className={cn(
                            'flex-1 overflow-auto flex items-center justify-center p-8 select-none',
                            isPanning && 'cursor-grab active:cursor-grabbing'
                        )}
                        onWheel={handleWheel}
                        onMouseDown={handleCanvasMouseDown}
                    >
                        <div
                            className="relative bg-white shadow-[0_20px_50px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.08)] rounded-xs"
                            style={{
                                width: templateDimensions.width * scale,
                                height: templateDimensions.height * scale,
                            }}
                        >
                            <div
                                ref={containerRef}
                                className="absolute top-0 left-0 origin-top-left overflow-hidden"
                                style={{
                                    width: templateDimensions.width,
                                    height: templateDimensions.height,
                                    transform: `scale(${scale})`,
                                }}
                            >
                                {/* Certificate Template Image */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={template}
                                    alt="Template"
                                    className="w-full h-full pointer-events-none select-none"
                                />

                                {/* Empty State when no fields exist */}
                                {fields.length === 0 && (
                                    <EditorEmptyState templateDimensions={templateDimensions} />
                                )}

                                {/* Magnetic Snapping Guidelines Overlay */}
                                {activeGuides.map((guide) => (
                                    <div
                                        key={guide.id}
                                        style={
                                            guide.type === 'vertical'
                                                ? {
                                                      left: `${guide.position}px`,
                                                      top: 0,
                                                      bottom: 0,
                                                      width: '1px',
                                                      borderLeft: `1px dashed ${guide.color || '#EC4899'}`,
                                                  }
                                                : {
                                                      top: `${guide.position}px`,
                                                      left: 0,
                                                      right: 0,
                                                      height: '1px',
                                                      borderTop: `1px dashed ${guide.color || '#EC4899'}`,
                                                  }
                                        }
                                        className="absolute z-40 pointer-events-none"
                                    >
                                        {guide.label && (
                                            <span
                                                style={{ backgroundColor: guide.color || '#EC4899' }}
                                                className="absolute text-[9px] font-bold text-white px-1 py-0.5 rounded shadow-sm top-1 left-1 pointer-events-none"
                                            >
                                                {guide.label}
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {/* Rubberband Marquee Selection Box */}
                                {marquee && (
                                    <div
                                        style={{
                                            left: `${Math.min(marquee.startX, marquee.currentX)}px`,
                                            top: `${Math.min(marquee.startY, marquee.currentY)}px`,
                                            width: `${Math.abs(marquee.currentX - marquee.startX)}px`,
                                            height: `${Math.abs(marquee.currentY - marquee.startY)}px`,
                                        }}
                                        className="absolute z-50 border border-accent bg-accent/15 pointer-events-none"
                                    />
                                )}

                                {/* Draggable Placed Fields */}
                                {fields.map((field) => (
                                    <DraggableField
                                        key={field.id}
                                        field={field}
                                        isSelected={selectedFieldIds.includes(field.id)}
                                        onSelect={handleSelectField}
                                        onUpdate={(id, updates) => updateField(id, updates)}
                                        onRemove={(id) => {
                                            removeField(id);
                                            if (selectedFieldId === id) setSelectedFieldId(null);
                                        }}
                                        containerRef={containerRef}
                                        scale={scale}
                                        allFields={fields}
                                        canvasWidth={templateDimensions.width}
                                        canvasHeight={templateDimensions.height}
                                        onGuidesChange={setActiveGuides}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Status / Shortcuts Helper */}
                    <div className="shrink-0 px-4 py-1.5 border-t border-border/40 bg-white/90 backdrop-blur-sm text-[11px] text-secondary flex justify-between items-center">
                        <span>Space + Drag to Pan · Marquee Box or Shift+Click for Multi-Select · Cmd+G to Group</span>
                        <span className="font-mono text-[10px]">
                            Canvas: {templateDimensions.width} × {templateDimensions.height}px
                        </span>
                    </div>

                    {/* Mini-map Viewport Navigator */}
                    <CanvasMiniMap
                        templateSrc={template}
                        templateWidth={templateDimensions.width}
                        templateHeight={templateDimensions.height}
                        scale={scale}
                        workspaceRef={workspaceRef}
                    />

                    {/* Batch Alignment Bar */}
                    <BatchAlignmentBar />
                </div>

                {/* Right Panel: Advanced Field Inspector & Typography */}
                {rightPanelOpen && (
                    <aside className="w-72 shrink-0 border-l border-border/60 flex flex-col bg-white">
                        <div className="p-3 border-b border-border/40 shrink-0">
                            <p className="text-xs font-semibold text-foreground">Element Inspector</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {selectedField ? (
                                <div className="space-y-5">
                                    {/* Element Type Selector */}
                                    <div>
                                        <label className="text-[11px] font-medium text-secondary block mb-1">
                                            Element Type
                                        </label>
                                        <select
                                            value={selectedField.type || 'text'}
                                            onChange={(e) =>
                                                updateField(selectedField.id, {
                                                    type: e.target.value as FieldType,
                                                })
                                            }
                                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-border bg-white font-medium focus:ring-1 focus:ring-accent"
                                        >
                                            <option value="text">Typography (Text Field)</option>
                                            <option value="qr">Dynamic QR Code</option>
                                            <option value="barcode">Dynamic Barcode</option>
                                            <option value="signature">Digital Signature</option>
                                            <option value="image">Student Photo / Badge</option>
                                        </select>
                                    </div>

                                    {/* Column / Token */}
                                    <div>
                                        <label className="text-[11px] font-medium text-secondary block mb-1">
                                            Source Column
                                        </label>
                                        <select
                                            value={selectedField.columnName}
                                            onChange={(e) =>
                                                updateField(selectedField.id, { columnName: e.target.value })
                                            }
                                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-border bg-white font-medium focus:ring-1 focus:ring-accent"
                                        >
                                            {csvHeaders.map((h) => (
                                                <option key={h} value={h}>
                                                    {h}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* ================= TEXT / TYPOGRAPHY SETTINGS ================= */}
                                    {(!selectedField.type || selectedField.type === 'text') && (
                                        <div className="space-y-4 pt-2 border-t border-border/40">
                                            {/* Font Family Selection */}
                                            <div>
                                                <label className="text-[11px] font-medium text-secondary block mb-1">
                                                    Font Family & Script
                                                </label>
                                                <select
                                                    value={selectedField.fontFamily || 'Helvetica'}
                                                    onChange={(e) =>
                                                        updateField(selectedField.id, { fontFamily: e.target.value })
                                                    }
                                                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-border bg-white font-medium focus:ring-1 focus:ring-accent"
                                                >
                                                    {POPULAR_GOOGLE_FONTS.map((font) => (
                                                        <option key={font.name} value={font.family}>
                                                            {font.name} ({font.scriptSupport})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Font Size */}
                                            <div>
                                                <label className="text-[11px] font-medium text-secondary flex justify-between mb-1">
                                                    <span>Font Size</span>
                                                    <span className="text-foreground font-semibold">
                                                        {selectedField.fontSize}px
                                                    </span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="12"
                                                    max="200"
                                                    value={selectedField.fontSize}
                                                    onChange={(e) =>
                                                        updateField(selectedField.id, {
                                                            fontSize: Number(e.target.value),
                                                        })
                                                    }
                                                    className="w-full accent-accent h-1.5 cursor-pointer"
                                                />
                                            </div>

                                            {/* Shrink to fit toggle */}
                                            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/40">
                                                <div className="flex items-center gap-1.5">
                                                    <Minimize2 size={14} className="text-accent" />
                                                    <div>
                                                        <span className="text-xs font-semibold block text-foreground">
                                                            Shrink-to-Fit
                                                        </span>
                                                        <span className="text-[10px] text-secondary">
                                                            Scale down font for long names
                                                        </span>
                                                    </div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedField.shrinkToFit ?? true}
                                                    onChange={(e) =>
                                                        updateField(selectedField.id, {
                                                            shrinkToFit: e.target.checked,
                                                        })
                                                    }
                                                    className="accent-accent w-4 h-4 cursor-pointer"
                                                />
                                            </div>

                                            {/* Multi-line auto-wrapping */}
                                            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/40">
                                                <div className="flex items-center gap-1.5">
                                                    <WrapText size={14} className="text-accent" />
                                                    <div>
                                                        <span className="text-xs font-semibold block text-foreground">
                                                            Auto-Wrap Paragraph
                                                        </span>
                                                        <span className="text-[10px] text-secondary">
                                                            Wrap long sentences into lines
                                                        </span>
                                                    </div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedField.autoWrap ?? false}
                                                    onChange={(e) =>
                                                        updateField(selectedField.id, { autoWrap: e.target.checked })
                                                    }
                                                    className="accent-accent w-4 h-4 cursor-pointer"
                                                />
                                            </div>

                                            {/* Bounding Box Width */}
                                            <div>
                                                <label className="text-[11px] font-medium text-secondary flex justify-between mb-1">
                                                    <span>Container Constraint Width</span>
                                                    <span className="text-foreground font-semibold">
                                                        {selectedField.width || 300}px
                                                    </span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="80"
                                                    max={templateDimensions.width}
                                                    value={selectedField.width || 300}
                                                    onChange={(e) =>
                                                        updateField(selectedField.id, {
                                                            width: Number(e.target.value),
                                                        })
                                                    }
                                                    className="w-full accent-accent h-1.5 cursor-pointer"
                                                />
                                            </div>

                                            {/* Alignment */}
                                            <div>
                                                <label className="text-[11px] font-medium text-secondary block mb-1">
                                                    Alignment
                                                </label>
                                                <div className="flex rounded-lg border border-border/60 p-0.5">
                                                    {(
                                                        [
                                                            { v: 'left', i: AlignLeft },
                                                            { v: 'center', i: AlignCenter },
                                                            { v: 'right', i: AlignRight },
                                                        ] as const
                                                    ).map(({ v, i: Icon }) => (
                                                        <button
                                                            key={v}
                                                            type="button"
                                                            onClick={() => updateField(selectedField.id, { align: v })}
                                                            className={cn(
                                                                'flex-1 py-1.5 flex justify-center rounded-md transition-colors',
                                                                selectedField.align === v
                                                                    ? 'bg-accent text-white'
                                                                    : 'text-secondary hover:bg-muted'
                                                            )}
                                                        >
                                                            <Icon size={14} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Color */}
                                            <div>
                                                <label className="text-[11px] font-medium text-secondary block mb-1.5">
                                                    Color
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {PRESET_COLORS.map((c) => (
                                                        <button
                                                            key={c}
                                                            type="button"
                                                            onClick={() => updateField(selectedField.id, { color: c })}
                                                            className={cn(
                                                                'w-6 h-6 rounded-full border border-border/30 transition-transform',
                                                                selectedField.color === c && 'ring-2 ring-accent ring-offset-1 scale-110'
                                                            )}
                                                            style={{ backgroundColor: c }}
                                                            title={c}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ================= QR CODE SETTINGS ================= */}
                                    {selectedField.type === 'qr' && (
                                        <div className="space-y-4 pt-2 border-t border-border/40">
                                            <div>
                                                <label className="text-[11px] font-medium text-secondary block mb-1">
                                                    QR Size (pixels)
                                                </label>
                                                <input
                                                    type="range"
                                                    min="50"
                                                    max="350"
                                                    value={selectedField.width || 120}
                                                    onChange={(e) =>
                                                        updateField(selectedField.id, {
                                                            width: Number(e.target.value),
                                                            height: Number(e.target.value),
                                                        })
                                                    }
                                                    className="w-full accent-accent h-1.5 cursor-pointer"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-medium text-secondary block mb-1">
                                                    URL / Data Pattern Template:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedField.pattern || ''}
                                                    onChange={(e) =>
                                                        updateField(selectedField.id, { pattern: e.target.value })
                                                    }
                                                    placeholder="https://verify.domain.com/cert/{{ID}}?hash={{HMAC}}"
                                                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-border font-mono focus:ring-1 focus:ring-accent"
                                                />
                                                {/* Token insertion chips */}
                                                <div className="mt-2">
                                                    <p className="text-[10px] text-secondary mb-1 font-medium">Click token to insert:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {csvHeaders.slice(0, 6).map((h) => (
                                                            <button
                                                                key={h}
                                                                type="button"
                                                                onClick={() => {
                                                                    const current = selectedField.pattern || '';
                                                                    updateField(selectedField.id, {
                                                                        pattern: current + `{{${h}}}`,
                                                                    });
                                                                }}
                                                                className="px-1.5 py-0.5 rounded bg-muted/80 hover:bg-accent/10 hover:text-accent text-[10px] font-mono border border-border/60 transition-colors"
                                                            >
                                                                + &#123;&#123;{h}&#125;&#125;
                                                            </button>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const current = selectedField.pattern || '';
                                                                updateField(selectedField.id, {
                                                                    pattern: current + '{{HMAC}}',
                                                                });
                                                            }}
                                                            className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-mono border border-emerald-200 transition-colors"
                                                        >
                                                            + &#123;&#123;HMAC&#125;&#125;
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                                                <div className="flex items-center gap-1.5">
                                                    <ShieldCheck size={16} className="text-emerald-600" />
                                                    <span className="text-xs font-semibold text-emerald-800">
                                                        Cryptographic Hash
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-emerald-700 font-mono">HMAC-SHA256</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* ================= MEDIA / SIGNATURE SETTINGS ================= */}
                                    {(selectedField.type === 'image' || selectedField.type === 'signature') && (
                                        <div className="space-y-4 pt-2 border-t border-border/40">
                                            <div>
                                                <label className="text-[11px] font-medium text-secondary block mb-1.5">
                                                    Avatar Shape Mask
                                                </label>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    {[
                                                        { id: 'none', label: 'Square', desc: 'Original' },
                                                        { id: 'circle', label: 'Circle', desc: 'Avatar mask' },
                                                        { id: 'pill', label: 'Pill', desc: 'Capsule mode' },
                                                        { id: 'rounded', label: 'Rounded', desc: 'Soft corner' },
                                                    ].map((mask) => (
                                                        <button
                                                            key={mask.id}
                                                            type="button"
                                                            onClick={() =>
                                                                updateField(selectedField.id, {
                                                                    shapeMask: mask.id as ShapeMask,
                                                                })
                                                            }
                                                            className={cn(
                                                                'px-2.5 py-1.5 rounded-lg border text-left transition-all',
                                                                (selectedField.shapeMask || 'none') === mask.id
                                                                    ? 'border-accent bg-accent/5 ring-1 ring-accent/30 shadow-xs'
                                                                    : 'border-border/60 hover:border-accent/40 bg-white'
                                                            )}
                                                        >
                                                            <p className="text-xs font-semibold text-foreground">{mask.label}</p>
                                                            <p className="text-[10px] text-secondary">{mask.desc}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-medium text-secondary flex justify-between mb-1">
                                                    <span>Dimensions</span>
                                                    <span className="text-foreground font-semibold">
                                                        {selectedField.width || 140}px
                                                    </span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="50"
                                                    max="500"
                                                    value={selectedField.width || 140}
                                                    onChange={(e) =>
                                                        updateField(selectedField.id, {
                                                            width: Number(e.target.value),
                                                            height: Math.round(Number(e.target.value) * 0.55),
                                                        })
                                                    }
                                                    className="w-full accent-accent h-1.5 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Remove Field Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            removeField(selectedField.id);
                                            setSelectedFieldId(null);
                                        }}
                                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors mt-6"
                                    >
                                        <Trash2 size={13} />
                                        Delete Element
                                    </button>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center px-2 py-8 space-y-3">
                                    <p className="text-xs text-secondary leading-relaxed">
                                        Select any element on the certificate to customize typography, QR verification, or dimensions.
                                    </p>
                                    <div className="pt-4 border-t border-border/40 w-full text-left space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                                            Studio Controls
                                        </p>
                                        <ul className="text-[11px] text-secondary/80 space-y-1 list-disc list-inside">
                                            <li>Click element to configure properties</li>
                                            <li>Shift+Click to multi-select items</li>
                                            <li>Magnetic guidelines snap to centers & margins</li>
                                            <li>Cmd+G to group elements together</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                )}

                {/* Onboarding Guidance */}
                <EditorOnboarding fieldsCount={fields.length} show={showOnboarding} />

                {/* Signature Pad Modal */}
                <SignaturePadModal
                    isOpen={isSignatureModalOpen}
                    onClose={() => setIsSignatureModalOpen(false)}
                    onSaveSignature={handleAddSignatureAsset}
                />

                {/* In-App Data Grid Spreadsheet Modal */}
                <DataGridModal
                    isOpen={isDataGridOpen}
                    onClose={() => setIsDataGridOpen(false)}
                />

                {/* Real-time Certificate Render Preview Modal */}
                <PreviewModal
                    isOpen={isPreviewModalOpen}
                    onClose={() => setIsPreviewModalOpen(false)}
                />
            </div>
        </div>
    );
}
