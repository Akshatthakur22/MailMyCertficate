'use client';

import { useState, useEffect, useRef } from 'react';
import type { Field } from '@/types/field';
import { cn } from '@/utils/cn';
import { Trash2, QrCode, Barcode, Image as ImageIcon, PenTool } from 'lucide-react';
import { calculateSnapping, type GuideLine } from '@/core/studio/snapping';
import { useAppStore } from '@/store/useAppStore';

interface DraggableFieldProps {
    field: Field;
    isSelected: boolean;
    onSelect: (id: string, isShift?: boolean) => void;
    onUpdate: (id: string, updates: Partial<Field>) => void;
    onRemove: (id: string) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    scale: number;
    allFields: Field[];
    canvasWidth: number;
    canvasHeight: number;
    onGuidesChange?: (guides: GuideLine[]) => void;
}

export function DraggableField({
    field,
    isSelected,
    onSelect,
    onUpdate,
    onRemove,
    containerRef,
    scale,
    allFields,
    canvasWidth,
    canvasHeight,
    onGuidesChange,
}: DraggableFieldProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const initialPositions = useRef<Map<string, { x: number; y: number }>>(new Map());

    const selectedFieldIds = useAppStore((state) => state.selectedFieldIds);
    const updateMultipleFields = useAppStore((state) => state.updateMultipleFields);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();

            // Accurate coordinate calculation: Mouse distance from canvas edge divided by zoom scale
            const rawX = (e.clientX - containerRect.left) / scale - dragOffset.current.x;
            const rawY = (e.clientY - containerRect.top) / scale - dragOffset.current.y;

            // --- Magnetic Smart Snapping (Figma-Style) ---
            const snapResult = calculateSnapping({
                activeField: field,
                candidateX: rawX,
                candidateY: rawY,
                allFields,
                canvasWidth,
                canvasHeight,
                threshold: 6,
                safeMarginRatio: 0.05,
            });

            const newX = snapResult.snappedX;
            const newY = snapResult.snappedY;

            if (onGuidesChange) {
                onGuidesChange(snapResult.guides);
            }

            // If multi-selected, move all selected fields synchronously preserving relative offsets
            if (selectedFieldIds.length > 1 && selectedFieldIds.includes(field.id)) {
                const initialActive = initialPositions.current.get(field.id);
                if (initialActive) {
                    const deltaX = newX - initialActive.x;
                    const deltaY = newY - initialActive.y;

                    updateMultipleFields(selectedFieldIds, (target) => {
                        const initPos = initialPositions.current.get(target.id);
                        if (!initPos) return {};
                        return {
                            x: initPos.x + deltaX,
                            y: initPos.y + deltaY,
                        };
                    });
                }
            } else {
                onUpdate(field.id, { x: newX, y: newY });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = 'default';
            if (onGuidesChange) {
                onGuidesChange([]);
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'grabbing';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, [
        isDragging,
        scale,
        onUpdate,
        field,
        containerRef,
        allFields,
        canvasWidth,
        canvasHeight,
        onGuidesChange,
        selectedFieldIds,
        updateMultipleFields,
    ]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();

        const isShift = e.shiftKey;
        onSelect(field.id, isShift);

        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            dragOffset.current = {
                x: (e.clientX - containerRect.left) / scale - field.x,
                y: (e.clientY - containerRect.top) / scale - field.y,
            };

            // Snapshot initial positions for batch dragging
            const posMap = new Map<string, { x: number; y: number }>();
            for (const f of allFields) {
                posMap.set(f.id, { x: f.x, y: f.y });
            }
            initialPositions.current = posMap;

            setIsDragging(true);
        }
    };

    const fieldType = field.type || 'text';

    const style: React.CSSProperties = {
        left: `${field.x}px`,
        top: `${field.y}px`,
        fontSize: `${field.fontSize}px`,
        lineHeight: field.lineHeight || 1.1,
        color: field.color,
        fontFamily: field.fontFamily || '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: 500,
        position: 'absolute',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        whiteSpace: field.autoWrap ? 'normal' : 'nowrap',
        width: field.width ? `${field.width}px` : 'auto',
        transform:
            field.align === 'center'
                ? 'translateX(-50%)'
                : field.align === 'right'
                ? 'translateX(-100%)'
                : 'none',
        zIndex: isSelected ? 50 : 10,
        padding: 0,
        margin: 0,
    };

    return (
        <div
            ref={elementRef}
            style={style}
            onMouseDown={handleMouseDown}
            className={cn(
                'group rounded-sm transition-shadow',
                isSelected
                    ? 'z-50 ring-2 ring-accent bg-accent/10 shadow-sm'
                    : 'hover:bg-accent/5 ring-1 ring-transparent hover:ring-accent/30'
            )}
        >
            {/* Field Type Specific Rendering */}
            {fieldType === 'text' && (
                <span
                    className={cn(
                        'pointer-events-none font-bold tracking-tight px-1 block',
                        isSelected ? 'text-accent' : ''
                    )}
                    style={{ textAlign: field.align }}
                >
                    {`{${field.columnName}}`}
                    {field.shrinkToFit && (
                        <span className="ml-1 text-[9px] uppercase tracking-wider text-accent/80 font-normal">
                            [fit]
                        </span>
                    )}
                </span>
            )}

            {fieldType === 'qr' && (
                <div
                    style={{
                        width: `${field.width || 120}px`,
                        height: `${field.width || 120}px`,
                        backgroundColor: field.bgColor || '#FFFFFF',
                    }}
                    className="border-2 border-dashed border-accent/60 rounded flex flex-col items-center justify-center p-2 text-center shadow-sm"
                >
                    <QrCode size={Math.min(48, (field.width || 120) * 0.45)} style={{ color: field.color || '#000000' }} />
                    <span className="text-[10px] font-semibold text-secondary mt-1 truncate max-w-full px-1">
                        QR: {field.pattern ? 'Custom URL' : field.columnName}
                    </span>
                </div>
            )}

            {fieldType === 'barcode' && (
                <div
                    style={{
                        width: `${field.width || 180}px`,
                        height: `${field.height || 60}px`,
                    }}
                    className="bg-white border-2 border-dashed border-accent/60 rounded flex flex-col items-center justify-center p-1 text-center shadow-sm"
                >
                    <Barcode size={Math.min(36, (field.height || 60) * 0.6)} style={{ color: field.color || '#000000' }} />
                    <span className="text-[9px] font-mono text-secondary">
                        {field.columnName}
                    </span>
                </div>
            )}

            {(fieldType === 'signature' || fieldType === 'image') && (
                <div
                    style={{
                        width: `${field.width || 140}px`,
                        height: `${field.height || 70}px`,
                    }}
                    className={cn(
                        'border-2 border-dashed border-accent/60 flex items-center justify-center bg-white/70 overflow-hidden shadow-sm',
                        field.shapeMask === 'circle'
                            ? 'rounded-full aspect-square'
                            : field.shapeMask === 'pill'
                            ? 'rounded-full'
                            : 'rounded-lg'
                    )}
                >
                    {field.signatureDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={field.signatureDataUrl}
                            alt="Signature"
                            className="w-full h-full object-contain pointer-events-none"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-accent/80 text-[10px]">
                            {fieldType === 'signature' ? <PenTool size={20} /> : <ImageIcon size={20} />}
                            <span className="mt-1 font-medium">{field.columnName}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Group Badge Indicator */}
            {field.groupId && (
                <span className="absolute -bottom-4 left-0 text-[8px] bg-slate-700 text-white px-1 rounded font-mono">
                    Grouped
                </span>
            )}

            {/* Delete button when selected */}
            {isSelected && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(field.id);
                    }}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 transition-transform hover:scale-110 shadow-lg border border-white z-[60]"
                    title="Remove field"
                >
                    <Trash2 size={10} strokeWidth={3} />
                </button>
            )}
        </div>
    );
}
