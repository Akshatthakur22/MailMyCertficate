'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { db } from '@/core/db/schema';

const PRESET_COLORS = ['#000000', '#1F4ED8', '#DC2626', '#16A34A', '#FFFFFF'];

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

    const { undo, redo, pastStates, futureStates } = useStore(useAppStore.temporal, (state) => state);

    const containerRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<HTMLDivElement>(null);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [scale, setScale] = useState(0.5);
    const [isFit, setIsFit] = useState(true);
    const [isPanning, setIsPanning] = useState(false);
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [rightPanelOpen, setRightPanelOpen] = useState(true);
    const [showOnboarding] = useState(true);

    useEffect(() => {
        const fitToScreen = () => {
            if (workspaceRef.current && templateDimensions && isFit) {
                const rect = workspaceRef.current.getBoundingClientRect();
                const padding = 32;
                const scaleX = (rect.width - padding) / templateDimensions.width;
                const scaleY = (rect.height - padding) / templateDimensions.height;
                setScale(Math.min(scaleX, scaleY, 1));
            }
        };

        window.addEventListener('resize', fitToScreen);
        fitToScreen();
        const resizeObserver = new ResizeObserver(fitToScreen);
        if (workspaceRef.current) resizeObserver.observe(workspaceRef.current);

        return () => {
            window.removeEventListener('resize', fitToScreen);
            resizeObserver.disconnect();
        };
    }, [templateDimensions, isFit]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) redo();
                else undo();
                e.preventDefault();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                redo();
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    useEffect(() => {
        const handleSpaceDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
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
        setScale((prev) => Math.min(prev + 0.1, 2));
        setIsFit(false);
    };
    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.1, 0.2));
        setIsFit(false);
    };
    const handleFit = () => setIsFit(true);

    const handleAddField = (header: string) => {
        if (!templateDimensions) return;
        const newField = {
            id: `${header}-${generateId()}`,
            columnName: header,
            x: templateDimensions.width / 2,
            y: templateDimensions.height / 2,
            width: 200,
            fontSize: 48,
            fontFamily: 'Helvetica',
            color: '#000000',
            align: 'center' as const,
        };
        addField(newField);
        setSelectedFieldId(newField.id);
        setRightPanelOpen(true);
    };

    const selectedField = useMemo(
        () => fields.find((f) => f.id === selectedFieldId),
        [fields, selectedFieldId],
    );

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setScale((prev) => Math.min(Math.max(prev - e.deltaY * 0.001, 0.1), 3));
            setIsFit(false);
        }
    };

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
        } else if (e.target === e.currentTarget) {
            setSelectedFieldId(null);
        }
    };

    if (!template || !templateDimensions) return null;

    return (
        <div className="flex flex-col h-full min-h-0 bg-white">
            {/* Sticky action bar — Generate is always visible */}
            <div className="shrink-0 flex items-center gap-3 px-4 py-2.5 border-b border-border/60 bg-white">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(2)}
                    className="shrink-0 rounded-lg px-2"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Back
                </Button>

                <div className="hidden sm:block h-5 w-px bg-border/60" />

                <div className="flex items-center gap-0.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => undo()}
                        disabled={pastStates.length === 0}
                        className="p-2 rounded-lg text-secondary hover:bg-muted disabled:opacity-30"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => redo()}
                        disabled={futureStates.length === 0}
                        className="p-2 rounded-lg text-secondary hover:bg-muted disabled:opacity-30"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 size={15} />
                    </button>
                </div>

                <div className="flex items-center gap-0.5 rounded-lg border border-border/60 bg-muted/30 p-0.5 shrink-0">
                    <button
                        type="button"
                        onClick={handleZoomOut}
                        className="p-1.5 rounded-md hover:bg-white text-secondary"
                        title="Zoom out"
                    >
                        <ZoomOut size={15} />
                    </button>
                    <span className="px-2 text-xs font-medium tabular-nums min-w-[3rem] text-center">
                        {(scale * 100).toFixed(0)}%
                    </span>
                    <button
                        type="button"
                        onClick={handleZoomIn}
                        className="p-1.5 rounded-md hover:bg-white text-secondary"
                        title="Zoom in"
                    >
                        <ZoomIn size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={handleFit}
                        className={cn(
                            'px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors',
                            isFit ? 'bg-accent text-white' : 'hover:bg-white text-secondary',
                        )}
                    >
                        Fit
                    </button>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => setLeftPanelOpen((v) => !v)}
                        className={cn(
                            'p-2 rounded-lg transition-colors',
                            leftPanelOpen ? 'bg-accent/10 text-accent' : 'text-secondary hover:bg-muted',
                        )}
                        title="Toggle fields panel"
                    >
                        <PanelLeft size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setRightPanelOpen((v) => !v)}
                        className={cn(
                            'p-2 rounded-lg transition-colors',
                            rightPanelOpen ? 'bg-accent/10 text-accent' : 'text-secondary hover:bg-muted',
                        )}
                        title="Toggle settings panel"
                    >
                        <PanelRight size={15} />
                    </button>
                </div>

                <p className="hidden lg:block flex-1 text-xs text-secondary truncate">
                    Click a field to add it, then drag on the certificate to position
                </p>

                <div className="flex items-center gap-2 shrink-0 ml-auto">
                    {fields.length === 0 && (
                        <span className="hidden md:inline text-xs text-secondary">Add a field first</span>
                    )}
                    <Button
                        size="sm"
                        onClick={() => setCurrentStep(4)}
                        disabled={fields.length === 0}
                        className="rounded-lg whitespace-nowrap"
                    >
                        Generate
                        <ArrowRight size={15} className="ml-1.5" />
                    </Button>
                </div>
            </div>

            {/* Editor body */}
            <div className="flex-1 min-h-0 flex">
                {/* Left — add & manage fields */}
                {leftPanelOpen && (
                    <aside className="w-52 shrink-0 border-r border-border/60 flex flex-col bg-muted/20">
                        <div className="p-3 border-b border-border/40">
                            <p className="text-xs font-medium text-foreground">Build your certificate</p>
                            <p className="text-[11px] text-secondary mt-0.5">
                                {fields.length === 0 ? 'Add fields from your CSV' : 'Add or manage fields'}
                            </p>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <FieldList
                                headers={csvHeaders}
                                onAddField={handleAddField}
                                fieldsCount={fields.length}
                            />
                        </div>

                        {fields.length > 0 && (
                            <div className="border-t border-border/40 p-3 max-h-40 overflow-y-auto">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-2">
                                  On certificate
                                </p>
                                <div className="space-y-1.5">
                                    {fields.map((field) => (
                                        <button
                                            key={field.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedFieldId(field.id);
                                                setRightPanelOpen(true);
                                            }}
                                            className={cn(
                                                'w-full text-left px-3 py-2 rounded-lg text-xs font-medium truncate transition-all border',
                                                selectedFieldId === field.id
                                                    ? 'bg-accent text-white border-accent shadow-sm'
                                                    : 'border-border/40 text-foreground hover:border-accent/40 hover:bg-white',
                                            )}
                                            title={field.columnName}
                                        >
                                            {field.columnName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                )}

                {/* Canvas */}
                <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#f4f4f5]">
                    <div
                        ref={workspaceRef}
                        className={cn(
                            'flex-1 overflow-auto flex items-center justify-center p-6 md:p-10',
                            isPanning && 'cursor-grab active:cursor-grabbing',
                        )}
                        onWheel={handleWheel}
                        onMouseDown={handleCanvasMouseDown}
                    >
                        <div
                            className="relative bg-white shadow-lg ring-1 ring-black/5"
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
                                <img src={template} alt="Template" className="w-full h-full pointer-events-none select-none" />
                                
                                {/* Empty State — shown when no fields placed yet */}
                                {fields.length === 0 && (
                                  <EditorEmptyState templateDimensions={templateDimensions} />
                                )}
                                
                                {/* Fields */}
                                {fields.map((field) => (
                                    <DraggableField
                                        key={field.id}
                                        field={field}
                                        isSelected={selectedFieldId === field.id}
                                        onSelect={(id) => {
                                            setSelectedFieldId(id);
                                            setRightPanelOpen(true);
                                        }}
                                        onUpdate={(id, updates) => updateField(id, updates)}
                                        onRemove={(id) => {
                                            removeField(id);
                                            if (selectedFieldId === id) setSelectedFieldId(null);
                                        }}
                                        containerRef={containerRef}
                                        scale={scale}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 px-4 py-1.5 border-t border-border/40 bg-white/80 text-[11px] text-secondary text-center">
                        Drag to move · Space + drag to pan · Ctrl + scroll to zoom
                    </div>
                </div>

                {/* Right — field settings */}
                {rightPanelOpen && (
                    <aside className="w-64 shrink-0 border-l border-border/60 flex flex-col bg-white">
                        <div className="p-3 border-b border-border/40 shrink-0">
                            <p className="text-xs font-medium text-foreground">Field settings</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {selectedField ? (
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[11px] font-medium text-secondary block mb-1.5">
                                            Column
                                        </label>
                                        <div className="px-3 py-2 rounded-lg bg-muted/50 text-sm font-medium truncate">
                                            {selectedField.columnName}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-medium text-secondary flex justify-between mb-1.5">
                                            <span>Font size</span>
                                            <span className="text-foreground">{selectedField.fontSize}px</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="12"
                                            max="200"
                                            value={selectedField.fontSize}
                                            onChange={(e) =>
                                                updateField(selectedField.id, { fontSize: Number(e.target.value) })
                                            }
                                            className="w-full accent-accent h-1.5 cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-medium text-secondary block mb-1.5">
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
                                                        'flex-1 py-2 flex justify-center rounded-md transition-colors',
                                                        selectedField.align === v
                                                            ? 'bg-accent text-white'
                                                            : 'text-secondary hover:bg-muted',
                                                    )}
                                                >
                                                    <Icon size={14} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-medium text-secondary block mb-2">
                                            Color
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {PRESET_COLORS.map((c) => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => updateField(selectedField.id, { color: c })}
                                                    className={cn(
                                                        'w-7 h-7 rounded-full border border-border/30',
                                                        selectedField.color === c && 'ring-2 ring-accent ring-offset-1',
                                                    )}
                                                    style={{ backgroundColor: c }}
                                                    title={c}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            removeField(selectedField.id);
                                            setSelectedFieldId(null);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 border border-red-100 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Remove field
                                    </button>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center px-2 py-8 space-y-4">
                                    <p className="text-sm text-secondary leading-relaxed">
                                        {fields.length === 0
                                            ? 'Add a field from the left panel to get started.'
                                            : 'Click a field on the certificate to edit its style.'}
                                    </p>
                                    
                                    {/* Tips section */}
                                    <div className="mt-6 pt-6 border-t border-border/40 w-full text-left space-y-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">💡 Tips</p>
                                        <ul className="text-[11px] text-secondary/70 space-y-2 list-disc list-inside">
                                            <li>Drag fields to move them on the certificate</li>
                                            <li>Resize by dragging the corner handles</li>
                                            <li>Use Ctrl+Z to undo changes</li>
                                            <li>Leave space between fields so text doesn't overlap</li>
                                            <li>Preview before generating to catch positioning issues</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                )}

                {/* Onboarding Overlay — First-time user guidance */}
                <EditorOnboarding
                  fieldsCount={fields.length}
                  show={showOnboarding}
                />
            </div>
        </div>
    );
}
