import QRCode from 'qrcode';
import type { PDFPage } from 'pdf-lib';
import { rgb } from 'pdf-lib';
import type { Field } from '@/types/field';
import { computeVerificationHash } from './verification';

export interface InterpolatePatternOptions {
    pattern?: string;
    columnName: string;
    data: Record<string, string | number>;
    secretKey?: string;
}

/**
 * Replaces {{ColumnName}} tokens and optional {{HMAC}} token with actual row data values.
 */
export async function interpolateFieldPattern({
    pattern,
    columnName,
    data,
    secretKey,
}: InterpolatePatternOptions): Promise<string> {
    if (!pattern || pattern.trim() === '') {
        return String(data[columnName] ?? '');
    }

    let result = pattern;
    // Replace all {{Column}} tokens
    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(regex, String(value ?? ''));
    }

    // Support {{HMAC}} verification token
    if (result.includes('{{HMAC}}')) {
        const payload = Object.values(data).join('|');
        const hash = await computeVerificationHash(payload, secretKey);
        result = result.replace(/\{\{HMAC\}\}/g, hash);
    }

    return result;
}

/**
 * Generates an in-memory QR matrix and data URL.
 */
export async function generateQRDataUrl(
    text: string,
    options: {
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
        fgColor?: string;
        bgColor?: string;
        width?: number;
    } = {}
): Promise<string> {
    const {
        errorCorrectionLevel = 'M',
        fgColor = '#000000',
        bgColor = '#FFFFFF',
        width = 256,
    } = options;

    return await QRCode.toDataURL(text || 'SAMPLE', {
        errorCorrectionLevel,
        margin: 1,
        width,
        color: {
            dark: fgColor,
            light: bgColor,
        },
    });
}

/**
 * Renders a 100% Crisp Vector QR code directly on a pdf-lib PDFPage
 * Avoids any blurriness or compression artifacts at high print resolutions.
 */
export async function renderVectorQRToPdfPage({
    page,
    text,
    x,
    y,
    size,
    fgColor = '#000000',
    bgColor = '#FFFFFF',
    errorCorrectionLevel = 'M',
}: {
    page: PDFPage;
    text: string;
    x: number;
    y: number;
    size: number;
    fgColor?: string;
    bgColor?: string;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}): Promise<void> {
    if (!text) return;

    const qrData = QRCode.create(text, {
        errorCorrectionLevel,
    });

    const modules = qrData.modules;
    const moduleCount = modules.size;
    const moduleSize = size / moduleCount;

    // Parse Colors
    const parseRgb = (hex: string) => {
        const clean = hex.replace('#', '');
        return rgb(
            parseInt(clean.slice(0, 2), 16) / 255,
            parseInt(clean.slice(2, 4), 16) / 255,
            parseInt(clean.slice(4, 6), 16) / 255
        );
    };

    const fgRgb = parseRgb(fgColor);
    const bgRgb = parseRgb(bgColor);

    // Optional background rectangle
    if (bgColor !== 'transparent' && bgColor !== '#FFFFFF00') {
        page.drawRectangle({
            x,
            y,
            width: size,
            height: size,
            color: bgRgb,
        });
    }

    // Draw vector dark modules
    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (modules.get(row, col)) {
                // PDF-lib Y-axis starts from bottom-left
                const moduleX = x + col * moduleSize;
                const moduleY = y + (moduleCount - 1 - row) * moduleSize;

                page.drawRectangle({
                    x: moduleX,
                    y: moduleY,
                    width: moduleSize,
                    height: moduleSize,
                    color: fgRgb,
                });
            }
        }
    }
}

/**
 * Generates Barcode Data URL using JsBarcode
 */
export function generateBarcodeDataUrl(
    text: string,
    options: {
        format?: string;
        lineColor?: string;
        width?: number;
        height?: number;
    } = {}
): string {
    if (typeof window === 'undefined') return '';

    try {
        const canvas = document.createElement('canvas');
        // Lazy require/import to prevent SSR issues
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const JsBarcode = require('jsbarcode');
        JsBarcode(canvas, text || '00000000', {
            format: options.format || 'CODE128',
            lineColor: options.lineColor || '#000000',
            width: 2,
            height: options.height || 50,
            displayValue: true,
            fontSize: 14,
            margin: 5,
        });
        return canvas.toDataURL('image/png');
    } catch (e) {
        console.warn('Barcode generation error:', e);
        return '';
    }
}
