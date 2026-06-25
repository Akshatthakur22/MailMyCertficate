'use client';

import { useState, useEffect, useRef } from 'react';
import { Field } from '@/types/field';
import { cn } from '@/utils/cn';
import { Trash2 } from 'lucide-react';

interface DraggableFieldProps {
    field: Field;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Field>) => void;
    onRemove: (id: string) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    scale: number;
}

export function DraggableField({
    field,
    isSelected,
    onSelect,
    onUpdate,
    onRemove,
    containerRef,
    scale,
}: DraggableFieldProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();

            // Accurate coordinate calculation: Mouse distance from canvas edge divided by zoom scale
            let newX = (e.clientX - containerRect.left) / scale - dragOffset.current.x;
            let newY = (e.clientY - containerRect.top) / scale - dragOffset.current.y;

            // --- Magnetic Snapping ---
            const SNAP_THRESHOLD = 5; // Pixels
            const containerWidth = containerRect.width / scale;
            const containerHeight = containerRect.height / scale;

            // Snap to Horizontal Center
            if (Math.abs(newX - containerWidth / 2) < SNAP_THRESHOLD) {
                newX = containerWidth / 2;
            }
            // Snap to Vertical Center
            if (Math.abs(newY - containerHeight / 2) < SNAP_THRESHOLD) {
                newY = containerHeight / 2;
            }
            // Snap to edges
            if (Math.abs(newX) < SNAP_THRESHOLD) newX = 0;
            if (Math.abs(newY) < SNAP_THRESHOLD) newY = 0;
            if (Math.abs(newX - containerWidth) < SNAP_THRESHOLD) newX = containerWidth;
            if (Math.abs(newY - containerHeight) < SNAP_THRESHOLD) newY = containerHeight;

            onUpdate(field.id, { x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = 'default';
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
    }, [isDragging, scale, onUpdate, field.id, containerRef]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(field.id);
        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            // Store offset in logical pixels for absolute accuracy
            dragOffset.current = {
                x: (e.clientX - containerRect.left) / scale - field.x,
                y: (e.clientY - containerRect.top) / scale - field.y
            };
            setIsDragging(true);
        }
    };

    const style: React.CSSProperties = {
        left: `${field.x}px`,
        top: `${field.y}px`,
        fontSize: `${field.fontSize}px`,
        lineHeight: '1',
        color: field.color,
        fontFamily: field.fontFamily || '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: 500,
        position: 'absolute',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        // Horizontal centering via translate - top-anchored for vertical stability
        transform: field.align === 'center' ? 'translateX(-50%)' : field.align === 'right' ? 'translateX(-100%)' : 'none',
        zIndex: isSelected ? 50 : 10,
        padding: 0,
        margin: 0,
        overflow: 'visible',
    };

    return (
        <div
            ref={elementRef}
            style={style}
            onMouseDown={handleMouseDown}
            className={cn(
                'group rounded-sm',
                isSelected
                    ? 'z-50 ring-2 ring-accent bg-accent/5'
                    : 'hover:bg-accent/5 ring-1 ring-transparent hover:ring-accent/30',
            )}
        >
            <span className={cn(
                "pointer-events-none font-bold tracking-tight px-1",
                isSelected ? "text-accent" : ""
            )} style={{ lineHeight: '1', padding: 0, margin: 0 }}>
                {`{${field.columnName}}`}
            </span>

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
