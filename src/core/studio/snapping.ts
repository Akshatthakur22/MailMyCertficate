import type { Field } from '@/types/field';

export interface GuideLine {
    id: string;
    type: 'vertical' | 'horizontal';
    position: number; // In canvas logical coordinates (pixels)
    start?: number;
    end?: number;
    label?: string;
    color?: string;
}

export interface SnapResult {
    snappedX: number;
    snappedY: number;
    guides: GuideLine[];
}

export interface SnappingOptions {
    activeField: Field;
    candidateX: number;
    candidateY: number;
    allFields: Field[];
    canvasWidth: number;
    canvasHeight: number;
    threshold?: number; // Logical pixels
    safeMarginRatio?: number; // e.g. 0.05 (5%)
}

/**
 * Calculates magnetic snapping to page centers, margins, and relative field edges/centers.
 */
export function calculateSnapping({
    activeField,
    candidateX,
    candidateY,
    allFields,
    canvasWidth,
    canvasHeight,
    threshold = 6,
    safeMarginRatio = 0.05,
}: SnappingOptions): SnapResult {
    let snappedX = candidateX;
    let snappedY = candidateY;
    const guides: GuideLine[] = [];

    const fieldWidth = activeField.width || 100;
    const fieldHeight = activeField.fontSize || 30;

    // Helper: calculate field bounding box based on alignment
    const getBounds = (x: number, y: number, w: number, h: number, align = activeField.align) => {
        let left = x;
        if (align === 'center') left = x - w / 2;
        else if (align === 'right') left = x - w;
        return {
            left,
            right: left + w,
            centerX: left + w / 2,
            top: y,
            bottom: y + h,
            centerY: y + h / 2,
        };
    };

    const activeBounds = getBounds(candidateX, candidateY, fieldWidth, fieldHeight);

    // 1. Snapping to Canvas Center & Margins
    const pageCenterX = canvasWidth / 2;
    const pageCenterY = canvasHeight / 2;
    const safeLeft = canvasWidth * safeMarginRatio;
    const safeRight = canvasWidth * (1 - safeMarginRatio);
    const safeTop = canvasHeight * safeMarginRatio;
    const safeBottom = canvasHeight * (1 - safeMarginRatio);

    // X-Snap Targets
    const xTargets: Array<{ target: number; snapDiff: number; guide: GuideLine }> = [];

    // Page Center X
    const diffCenterX = Math.abs(activeBounds.centerX - pageCenterX);
    if (diffCenterX <= threshold) {
        xTargets.push({
            target: activeField.align === 'center' ? pageCenterX : pageCenterX - (activeBounds.centerX - candidateX),
            snapDiff: diffCenterX,
            guide: {
                id: 'canvas-center-x',
                type: 'vertical',
                position: pageCenterX,
                label: 'Center',
                color: '#EC4899', // Pink / Magenta
            },
        });
    }

    // Safe Margins
    const diffLeftMargin = Math.abs(activeBounds.left - safeLeft);
    if (diffLeftMargin <= threshold) {
        xTargets.push({
            target: activeField.align === 'center' ? safeLeft + fieldWidth / 2 : safeLeft,
            snapDiff: diffLeftMargin,
            guide: {
                id: 'canvas-margin-left',
                type: 'vertical',
                position: safeLeft,
                label: 'Margin',
                color: '#06B6D4', // Cyan
            },
        });
    }

    const diffRightMargin = Math.abs(activeBounds.right - safeRight);
    if (diffRightMargin <= threshold) {
        xTargets.push({
            target: activeField.align === 'center' ? safeRight - fieldWidth / 2 : safeRight - fieldWidth,
            snapDiff: diffRightMargin,
            guide: {
                id: 'canvas-margin-right',
                type: 'vertical',
                position: safeRight,
                label: 'Margin',
                color: '#06B6D4',
            },
        });
    }

    // Y-Snap Targets
    const yTargets: Array<{ target: number; snapDiff: number; guide: GuideLine }> = [];

    // Page Center Y
    const diffCenterY = Math.abs(activeBounds.centerY - pageCenterY);
    if (diffCenterY <= threshold) {
        yTargets.push({
            target: pageCenterY - fieldHeight / 2,
            snapDiff: diffCenterY,
            guide: {
                id: 'canvas-center-y',
                type: 'horizontal',
                position: pageCenterY,
                label: 'Center',
                color: '#EC4899',
            },
        });
    }

    // Safe Top / Bottom Margins
    const diffTopMargin = Math.abs(activeBounds.top - safeTop);
    if (diffTopMargin <= threshold) {
        yTargets.push({
            target: safeTop,
            snapDiff: diffTopMargin,
            guide: {
                id: 'canvas-margin-top',
                type: 'horizontal',
                position: safeTop,
                label: 'Margin',
                color: '#06B6D4',
            },
        });
    }

    const diffBottomMargin = Math.abs(activeBounds.bottom - safeBottom);
    if (diffBottomMargin <= threshold) {
        yTargets.push({
            target: safeBottom - fieldHeight,
            snapDiff: diffBottomMargin,
            guide: {
                id: 'canvas-margin-bottom',
                type: 'horizontal',
                position: safeBottom,
                label: 'Margin',
                color: '#06B6D4',
            },
        });
    }

    // 2. Relative Snapping to Other Fields
    const otherFields = allFields.filter((f) => f.id !== activeField.id);

    for (const other of otherFields) {
        const otherW = other.width || 100;
        const otherH = other.fontSize || 30;
        const otherBounds = getBounds(other.x, other.y, otherW, otherH, other.align);

        // --- X alignments ---
        // Center-X match
        const dCenterX = Math.abs(activeBounds.centerX - otherBounds.centerX);
        if (dCenterX <= threshold) {
            xTargets.push({
                target: activeField.align === 'center' ? otherBounds.centerX : otherBounds.centerX - fieldWidth / 2,
                snapDiff: dCenterX,
                guide: {
                    id: `field-${other.id}-center-x`,
                    type: 'vertical',
                    position: otherBounds.centerX,
                    label: 'Align Center',
                    color: '#EC4899',
                },
            });
        }

        // Left-Left match
        const dLeft = Math.abs(activeBounds.left - otherBounds.left);
        if (dLeft <= threshold) {
            xTargets.push({
                target: activeField.align === 'center' ? otherBounds.left + fieldWidth / 2 : otherBounds.left,
                snapDiff: dLeft,
                guide: {
                    id: `field-${other.id}-left`,
                    type: 'vertical',
                    position: otherBounds.left,
                    label: 'Align Left',
                    color: '#06B6D4',
                },
            });
        }

        // Right-Right match
        const dRight = Math.abs(activeBounds.right - otherBounds.right);
        if (dRight <= threshold) {
            xTargets.push({
                target: activeField.align === 'center' ? otherBounds.right - fieldWidth / 2 : otherBounds.right - fieldWidth,
                snapDiff: dRight,
                guide: {
                    id: `field-${other.id}-right`,
                    type: 'vertical',
                    position: otherBounds.right,
                    label: 'Align Right',
                    color: '#06B6D4',
                },
            });
        }

        // --- Y alignments ---
        // Center-Y match
        const dCenterY = Math.abs(activeBounds.centerY - otherBounds.centerY);
        if (dCenterY <= threshold) {
            yTargets.push({
                target: otherBounds.centerY - fieldHeight / 2,
                snapDiff: dCenterY,
                guide: {
                    id: `field-${other.id}-center-y`,
                    type: 'horizontal',
                    position: otherBounds.centerY,
                    label: 'Align Middle',
                    color: '#EC4899',
                },
            });
        }

        // Top-Top match
        const dTop = Math.abs(activeBounds.top - otherBounds.top);
        if (dTop <= threshold) {
            yTargets.push({
                target: otherBounds.top,
                snapDiff: dTop,
                guide: {
                    id: `field-${other.id}-top`,
                    type: 'horizontal',
                    position: otherBounds.top,
                    label: 'Align Top',
                    color: '#06B6D4',
                },
            });
        }

        // Bottom-Bottom match
        const dBottom = Math.abs(activeBounds.bottom - otherBounds.bottom);
        if (dBottom <= threshold) {
            yTargets.push({
                target: otherBounds.bottom - fieldHeight,
                snapDiff: dBottom,
                guide: {
                    id: `field-${other.id}-bottom`,
                    type: 'horizontal',
                    position: otherBounds.bottom,
                    label: 'Align Bottom',
                    color: '#06B6D4',
                },
            });
        }
    }

    // Pick best X snap
    if (xTargets.length > 0) {
        xTargets.sort((a, b) => a.snapDiff - b.snapDiff);
        snappedX = xTargets[0].target;
        guides.push(xTargets[0].guide);
    }

    // Pick best Y snap
    if (yTargets.length > 0) {
        yTargets.sort((a, b) => a.snapDiff - b.snapDiff);
        snappedY = yTargets[0].target;
        guides.push(yTargets[0].guide);
    }

    return {
        snappedX,
        snappedY,
        guides,
    };
}
