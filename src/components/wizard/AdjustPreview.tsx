'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from 'zustand';
import { useAppStore } from '@/store/useAppStore';
import { DraggableField } from '@/components/wizard/DraggableField';
import { Button } from '@/components/ui/Button';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Plus,
    Trash2,
    ZoomIn,
    ZoomOut,
    ArrowRight,
    MousePointer2,
    LayoutTemplate,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Layers,
    Undo2,
    Redo2
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { db } from '@/core/db/schema';

const PRESET_COLORS = [
    '#000000', // Black
    '#1F4ED8', // Accent Blue
    '#DC2626', // Red
    '#16A34A', // Green
    '#FFFFFF', // White
];

// Helper for ID generation outside component to satisfy purity rules
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

    // Undo/Redo Store
    const { undo, redo, pastStates, futureStates } = useStore(useAppStore.temporal, (state) => state);

    const containerRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<HTMLDivElement>(null);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [scale, setScale] = useState(0.5);
    const [isFit, setIsFit] = useState(true);
    const [isPanning, setIsPanning] = useState(false);
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [rightPanelOpen, setRightPanelOpen] = useState(true);

    // Initial "Fit to Screen" logic
    useEffect(() => {
        const fitToScreen = () => {
            if (workspaceRef.current && templateDimensions && isFit) {
                const rect = workspaceRef.current.getBoundingClientRect();
                const workspaceWidth = rect.width;
                const workspaceHeight = rect.height;

                const padding = 40;
                const availableWidth = workspaceWidth - padding;
                const availableHeight = workspaceHeight - padding;

                const scaleX = availableWidth / templateDimensions.width;
                const scaleY = availableHeight / templateDimensions.height;

                const newScale = Math.min(scaleX, scaleY, 1);
                setScale(newScale);
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

    // Keyboard Shortcuts for Undo/Redo
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

    // Spacebar panning handlers
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

    // Load from IDB if missing
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

    const handleZoomIn = () => { setScale(prev => Math.min(prev + 0.1, 2.0)); setIsFit(false); };
    const handleZoomOut = () => { setScale(prev => Math.max(prev - 0.1, 0.2)); setIsFit(false); };
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
    };

    const selectedField = useMemo(() => fields.find((f) => f.id === selectedFieldId), [fields, selectedFieldId]);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY;
            const zoomSpeed = 0.001;
            setScale(prev => Math.min(Math.max(prev - delta * zoomSpeed, 0.1), 3));
            setIsFit(false);
        }
    };

    if (!template || !templateDimensions) return null;

    return (
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row bg-white relative animate-in fade-in zoom-in-95 duration-500">
            {/* LEFT SIDEBAR */}
            <div className={cn("bg-white border-r border-border/50 flex flex-col shrink-0 transition-all duration-500 relative z-30 shadow-xl", leftPanelOpen ? "w-72" : "w-0 opacity-0 overflow-hidden")}>
                <div className="p-6 border-b border-border/40 shrink-0">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-4">Data Fields</h3>
                    <p className="text-xs text-secondary font-medium leading-relaxed">Tap a field to place it on your design.</p>
                </div>
                <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-2">
                    {csvHeaders.map((header) => (
                        <button key={header} onClick={() => handleAddField(header)} className="w-full flex items-center justify-between p-4 rounded-2xl text-sm border border-border/60 hover:border-accent hover:bg-accent/5 hover:text-accent transition-all bg-white shadow-sm">
                            <span className="truncate font-bold tracking-tight">{header}</span>
                            <Plus size={12} strokeWidth={3} />
                        </button>
                    ))}
                </div>
            </div>

            {/* TOGGLE LEFT */}
            <button onClick={() => setLeftPanelOpen(!leftPanelOpen)} className={cn("absolute top-1/2 -translate-y-1/2 w-6 h-16 bg-white border border-border/50 rounded-full shadow-2xl z-40 flex items-center justify-center text-secondary hover:text-accent transition-all", leftPanelOpen ? "left-[276px]" : "left-4")}>
                {leftPanelOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            {/* MIDDLE: Workspace */}
            <div className="flex-1 flex flex-col relative bg-[#F8F9FA] overflow-hidden group/canvas">
                <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

                {/* TOOLBAR */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-1.5 flex items-center gap-1 z-40">
                    <div className="flex items-center p-1 bg-secondary/5 rounded-xl">
                        <button onClick={() => undo()} disabled={pastStates.length === 0} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-secondary disabled:opacity-30" title="Undo (Ctrl+Z)"><Undo2 size={16} /></button>
                        <button onClick={() => redo()} disabled={futureStates.length === 0} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-secondary disabled:opacity-30" title="Redo (Ctrl+Y)"><Redo2 size={16} /></button>
                    </div>
                    <div className="w-px h-6 bg-border/40 mx-1" />
                    <div className="flex items-center p-1 bg-secondary/5 rounded-xl">
                        <button onClick={handleZoomOut} className="p-2 hover:bg-white rounded-lg text-secondary"><ZoomOut size={16} /></button>
                        <div className="px-3 min-w-[60px] text-center text-[11px] font-black tabular-nums">{(scale * 100).toFixed(0)}%</div>
                        <button onClick={handleZoomIn} className="p-2 hover:bg-white rounded-lg text-secondary"><ZoomIn size={16} /></button>
                    </div>
                    <div className="w-px h-6 bg-border/40 mx-1" />
                    <button onClick={handleFit} className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all", isFit ? "bg-accent text-white shadow-lg shadow-accent/20" : "hover:bg-secondary/10 text-secondary")}>Auto Fit</button>
                    <div className="w-px h-6 bg-border/40 mx-1" />
                    <button onClick={() => { setLeftPanelOpen(!leftPanelOpen || !rightPanelOpen); setRightPanelOpen(!leftPanelOpen || !rightPanelOpen); }} className={cn("p-2 rounded-xl", !leftPanelOpen && !rightPanelOpen ? "bg-accent/10 text-accent" : "text-secondary")} title="Toggle Studio Mode"><Layers size={18} /></button>
                </div>

                {/* CANVAS */}
                <div ref={workspaceRef} className={cn("flex-1 overflow-auto flex items-center justify-center p-20 custom-scrollbar relative", isPanning ? "cursor-grab active:cursor-grabbing" : "")} onWheel={handleWheel} onMouseDown={(e) => { if (isPanning) { const startX = e.clientX; const startY = e.clientY; const scrollLeft = workspaceRef.current!.scrollLeft; const scrollTop = workspaceRef.current!.scrollTop; const onMouseMove = (m: MouseEvent) => { if (workspaceRef.current) { workspaceRef.current.scrollLeft = scrollLeft - (m.clientX - startX); workspaceRef.current.scrollTop = scrollTop - (m.clientY - startY); } }; const onMouseUp = () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); }; window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', onMouseUp); } else if (e.target === e.currentTarget) setSelectedFieldId(null); }}>
                    <div className="relative bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]" style={{ width: templateDimensions.width * scale, height: templateDimensions.height * scale }}>
                        <div ref={containerRef} className="absolute top-0 left-0 origin-top-left overflow-hidden" style={{ width: templateDimensions.width, height: templateDimensions.height, transform: `scale(${scale})` }}>
                            <img src={template} alt="Template" className="w-full h-full pointer-events-none" />
                            {fields.map((field) => (
                                <DraggableField key={field.id} field={field} isSelected={selectedFieldId === field.id} onSelect={setSelectedFieldId} onUpdate={(id, updates) => updateField(id, updates)} onRemove={(id) => { removeField(id); if (selectedFieldId === id) setSelectedFieldId(null); }} containerRef={containerRef} scale={scale} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* TOGGLE RIGHT */}
            <button onClick={() => setRightPanelOpen(!rightPanelOpen)} className={cn("absolute top-1/2 -translate-y-1/2 w-6 h-16 bg-white border border-border/50 rounded-full shadow-2xl z-40 flex items-center justify-center text-secondary hover:text-accent transition-all", rightPanelOpen ? "right-[316px]" : "right-4")}>
                {rightPanelOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* RIGHT SIDEBAR */}
            <div className={cn("bg-white border-l border-border/50 flex flex-col shrink-0 transition-all duration-500 relative z-30 shadow-xl", rightPanelOpen ? "w-80" : "w-0 opacity-0 overflow-hidden")}>
                <div className="p-6 border-b border-border/40 shrink-0"><h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Field Settings</h3></div>
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {selectedField ? (
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-secondary/40 uppercase mb-3 block tracking-widest">Field Source</label>
                                <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-xs">{selectedField.columnName.charAt(0)}</div>
                                    <div className="text-sm font-black truncate">{selectedField.columnName}</div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-secondary/40 uppercase flex justify-between mb-3 tracking-widest"><span>Font Size</span><span className="text-accent">{selectedField.fontSize}px</span></label>
                                    <input type="range" min="12" max="200" value={selectedField.fontSize} onChange={(e) => updateField(selectedField.id, { fontSize: Number(e.target.value) })} className="w-full accent-accent h-1.5 bg-secondary/10 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-secondary/40 uppercase mb-3 tracking-widest block">Alignment</label>
                                    <div className="flex bg-secondary/5 p-1 rounded-xl">
                                        {[{ v: 'left', i: <AlignLeft size={14} /> }, { v: 'center', i: <AlignCenter size={14} /> }, { v: 'right', i: <AlignRight size={14} /> }].map(o => (
                                            <button key={o.v} onClick={() => updateField(selectedField.id, { align: o.v as any })} className={cn("flex-1 py-2 flex justify-center rounded-lg", selectedField.align === o.v ? "bg-white shadow-md text-accent" : "text-secondary")}>{o.i}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-secondary/40 uppercase mb-3 tracking-widest block">Color</label>
                                    <div className="grid grid-cols-6 gap-3">
                                        {PRESET_COLORS.map(c => (
                                            <button key={c} onClick={() => updateField(selectedField.id, { color: c })} className={cn("w-8 h-8 rounded-full border border-border/20 transition-all", selectedField.color === c ? "ring-2 ring-offset-2 ring-accent scale-110" : "")} style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-8 border-t border-border/40">
                                <button onClick={() => { removeField(selectedField.id); setSelectedFieldId(null); }} className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"><Trash2 size={14} /> Remove Field</button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-secondary/5 rounded-[2rem] border border-dashed border-border/40">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-secondary/20 mb-6"><MousePointer2 size={32} /></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">Selection Required</p>
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-border/40 bg-white">
                    <Button onClick={() => setCurrentStep(4)} className="w-full h-14 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-accent/20 group" disabled={fields.length === 0}>
                        Generate Now
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
