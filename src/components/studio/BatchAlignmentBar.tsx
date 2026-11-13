'use client';

import { useAppStore } from '@/store/useAppStore';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignStartVertical,
    AlignCenterVertical,
    AlignEndVertical,
    AlignHorizontalDistributeCenter,
    AlignVerticalDistributeCenter,
    Group,
    Ungroup,
    Trash2,
} from 'lucide-react';

export function BatchAlignmentBar() {
    const selectedFieldIds = useAppStore((state) => state.selectedFieldIds);
    const alignSelectedFields = useAppStore((state) => state.alignSelectedFields);
    const distributeSelectedFields = useAppStore((state) => state.distributeSelectedFields);
    const groupSelectedFields = useAppStore((state) => state.groupSelectedFields);
    const ungroupSelectedFields = useAppStore((state) => state.ungroupSelectedFields);
    const removeMultipleFields = useAppStore((state) => state.removeMultipleFields);

    if (selectedFieldIds.length < 2) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/80 px-3 py-2 flex items-center gap-1.5 animate-in slide-in-from-bottom-3 duration-200">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent tabular-nums mr-1">
                {selectedFieldIds.length} selected
            </span>

            <div className="h-4 w-px bg-border/60 mx-1" />

            {/* Horizontal Alignment */}
            <div className="flex items-center gap-0.5">
                <button
                    type="button"
                    onClick={() => alignSelectedFields('left')}
                    className="p-1.5 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    title="Align Left"
                >
                    <AlignLeft size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => alignSelectedFields('center')}
                    className="p-1.5 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    title="Align Center"
                >
                    <AlignCenter size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => alignSelectedFields('right')}
                    className="p-1.5 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    title="Align Right"
                >
                    <AlignRight size={16} />
                </button>
            </div>

            <div className="h-4 w-px bg-border/60 mx-1" />

            {/* Vertical Alignment */}
            <div className="flex items-center gap-0.5">
                <button
                    type="button"
                    onClick={() => alignSelectedFields('top')}
                    className="p-1.5 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    title="Align Top"
                >
                    <AlignStartVertical size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => alignSelectedFields('middle')}
                    className="p-1.5 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    title="Align Middle"
                >
                    <AlignCenterVertical size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => alignSelectedFields('bottom')}
                    className="p-1.5 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    title="Align Bottom"
                >
                    <AlignEndVertical size={16} />
                </button>
            </div>

            <div className="h-4 w-px bg-border/60 mx-1" />

            {/* Distribution */}
            <div className="flex items-center gap-0.5">
                <button
                    type="button"
                    onClick={() => distributeSelectedFields('horizontal')}
                    className="p-1.5 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    title="Distribute Horizontally"
                >
                    <AlignHorizontalDistributeCenter size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => distributeSelectedFields('vertical')}
                    className="p-1.5 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    title="Distribute Vertically"
                >
                    <AlignVerticalDistributeCenter size={16} />
                </button>
            </div>

            <div className="h-4 w-px bg-border/60 mx-1" />

            {/* Group / Ungroup & Delete */}
            <div className="flex items-center gap-0.5">
                <button
                    type="button"
                    onClick={groupSelectedFields}
                    className="p-1.5 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    title="Group elements (Ctrl+G)"
                >
                    <Group size={16} />
                </button>
                <button
                    type="button"
                    onClick={ungroupSelectedFields}
                    className="p-1.5 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    title="Ungroup elements"
                >
                    <Ungroup size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => removeMultipleFields(selectedFieldIds)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors ml-1"
                    title="Delete selected fields"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
