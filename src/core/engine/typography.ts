import type { PDFFont } from 'pdf-lib';
import type { Alignment } from '@/types/field';

export interface WrappedLine {
    text: string;
    width: number;
    x: number;
    y: number;
}

export interface WrapTextOptions {
    text: string;
    font: PDFFont;
    fontSize: number;
    boxWidth: number;
    startX: number;
    startY: number; // Top baseline
    align: Alignment;
    lineHeight?: number; // Ratio, default 1.2
}

/**
 * Calculates shrink-to-fit font size based on bounding box width constraint:
 * ActualFontSize = min(MaxFontSize, BoxWidth * (FontSize / MeasuredTextWidth))
 */
export function calculateShrinkToFitFontSize({
    text,
    font,
    targetFontSize,
    boxWidth,
    maxFontSize,
    minFontSize = 10,
}: {
    text: string;
    font: PDFFont;
    targetFontSize: number;
    boxWidth: number;
    maxFontSize?: number;
    minFontSize?: number;
}): number {
    if (!text || boxWidth <= 0) return targetFontSize;

    const measuredWidth = font.widthOfTextAtSize(text, targetFontSize);
    if (measuredWidth <= boxWidth) {
        return maxFontSize ? Math.min(targetFontSize, maxFontSize) : targetFontSize;
    }

    const calculatedSize = boxWidth * (targetFontSize / measuredWidth);
    const clampedSize = Math.max(minFontSize, calculatedSize);

    return maxFontSize ? Math.min(clampedSize, maxFontSize) : clampedSize;
}

/**
 * Word-wraps text into multiple lines within a bounding box width.
 */
export function wrapTextLines({
    text,
    font,
    fontSize,
    boxWidth,
    startX,
    startY,
    align,
    lineHeight = 1.2,
}: WrapTextOptions): WrappedLine[] {
    if (!text) return [];

    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth > boxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    const lineAdvance = fontSize * lineHeight;
    const result: WrappedLine[] = [];

    lines.forEach((lineText, index) => {
        const lineWidth = font.widthOfTextAtSize(lineText, fontSize);
        let x = startX;

        if (align === 'center') {
            x = startX - lineWidth / 2;
        } else if (align === 'right') {
            x = startX - lineWidth;
        }

        // Advance downward for successive lines (subtract in PDF coordinate system)
        const y = startY - index * lineAdvance;

        result.push({
            text: lineText,
            width: lineWidth,
            x,
            y,
        });
    });

    return result;
}
