import { PDFDocument, rgb } from 'pdf-lib';
import type { Field } from '@/types/field';
import { getOrEmbedFont } from './fontManager';
import { calculateShrinkToFitFontSize, wrapTextLines } from './typography';
import { interpolateFieldPattern, renderVectorQRToPdfPage, generateBarcodeDataUrl } from '../studio/qrBarcode';
import { inscribePDFMetadata } from '../studio/verification';

export interface GenerationOptions {
    template: Blob | ArrayBuffer | Uint8Array | string; // Handle Blob, ArrayBuffer, Uint8Array, or Base64/URL
    fields: Field[];
    data: Record<string, string | number>;
    metadata?: {
        title?: string;
        author?: string;
        subject?: string;
    };
}

function sanitizeTextForWinAnsi(input: string): string {
    return input
        .replace(/[\u2018\u2019]/g, "'") // smart single quotes
        .replace(/[\u201C\u201D]/g, '"') // smart double quotes
        .replace(/[\u2013\u2014]/g, '-') // en-dash, em-dash
        .replace(/\u2026/g, '...')       // ellipsis
        .replace(/\u00A0/g, ' ')         // non-breaking space
        .replace(/[\u2022\u2023\u25E6]/g, '*'); // bullets
}

export const renderSingleCertificate = async ({
    template,
    fields,
    data,
    metadata,
}: GenerationOptions): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create();

    // Inscribe security & author metadata
    inscribePDFMetadata(pdfDoc, {
        title: metadata?.title || 'Certificate of Achievement',
        author: metadata?.author || 'MailMyCertificate Document Studio',
        subject: metadata?.subject,
    });

    // Embed Image Background
    let image;
    let imageArrayBuffer: ArrayBuffer;

    if (template instanceof ArrayBuffer) {
        imageArrayBuffer = template;
    } else if (template instanceof Uint8Array) {
        imageArrayBuffer = template.buffer.slice(template.byteOffset, template.byteOffset + template.byteLength) as ArrayBuffer;
    } else if (template instanceof Blob || (template && typeof (template as any).arrayBuffer === 'function')) {
        imageArrayBuffer = await (template as Blob).arrayBuffer();
    } else if (typeof template === 'string' && template.startsWith('data:')) {
        const base64Data = template.split(',')[1];
        imageArrayBuffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0)).buffer;
    } else if (typeof template === 'string' && (template.startsWith('http') || template.startsWith('/'))) {
        const res = await fetch(template);
        imageArrayBuffer = await res.arrayBuffer();
    } else {
        throw new Error('Invalid template format. Expected Blob, ArrayBuffer, Data URI, or URL.');
    }

    // Try to embed as PNG, fallback to JPG
    try {
        image = await pdfDoc.embedPng(imageArrayBuffer);
    } catch {
        try {
            image = await pdfDoc.embedJpg(imageArrayBuffer);
        } catch {
            throw new Error('Failed to decode certificate template image as PNG or JPEG.');
        }
    }

    const { width, height } = image;
    const page = pdfDoc.addPage([width, height]);

    // Draw Background Template
    page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
    });

    // Parse Hex Color helper
    const parseRgb = (hex: string = '#000000') => {
        const clean = hex.replace('#', '');
        return rgb(
            parseInt(clean.slice(0, 2), 16) / 255,
            parseInt(clean.slice(2, 4), 16) / 255,
            parseInt(clean.slice(4, 6), 16) / 255
        );
    };

    // Draw Fields
    for (const field of fields) {
        const fieldType = field.type || 'text';

        // 1. DYNAMIC VECTOR QR CODE
        if (fieldType === 'qr') {
            const rawPayload = await interpolateFieldPattern({
                pattern: field.pattern,
                columnName: field.columnName,
                data,
                secretKey: field.verificationSecret,
            });

            if (!rawPayload) continue;

            const qrSize = field.width || 120;
            // PDF origin is bottom-left
            const qrX = field.align === 'center' ? field.x - qrSize / 2 : field.align === 'right' ? field.x - qrSize : field.x;
            const qrY = height - field.y - qrSize;

            await renderVectorQRToPdfPage({
                page,
                text: rawPayload,
                x: qrX,
                y: qrY,
                size: qrSize,
                fgColor: field.fgColor || field.color || '#000000',
                bgColor: field.bgColor || '#FFFFFF',
                errorCorrectionLevel: field.errorCorrectionLevel || 'M',
            });
            continue;
        }

        // 2. DYNAMIC BARCODE
        if (fieldType === 'barcode') {
            const barcodeVal = await interpolateFieldPattern({
                pattern: field.pattern,
                columnName: field.columnName,
                data,
            });

            if (!barcodeVal) continue;

            const barcodeWidth = field.width || 180;
            const barcodeHeight = field.height || 60;
            const barcodeDataUrl = generateBarcodeDataUrl(barcodeVal, {
                format: field.barcodeFormat || 'CODE128',
                lineColor: field.color || '#000000',
                height: barcodeHeight,
            });

            if (barcodeDataUrl) {
                try {
                    const barcodeBase64 = barcodeDataUrl.split(',')[1];
                    const barcodeBytes = Uint8Array.from(atob(barcodeBase64), (c) => c.charCodeAt(0)).buffer;
                    const barcodeImg = await pdfDoc.embedPng(barcodeBytes);

                    const barcodeX = field.align === 'center' ? field.x - barcodeWidth / 2 : field.align === 'right' ? field.x - barcodeWidth : field.x;
                    const barcodeY = height - field.y - barcodeHeight;

                    page.drawImage(barcodeImg, {
                        x: barcodeX,
                        y: barcodeY,
                        width: barcodeWidth,
                        height: barcodeHeight,
                    });
                } catch (bErr) {
                    console.warn('Failed to embed barcode in PDF:', bErr);
                }
            }
            continue;
        }

        // 3. DYNAMIC MEDIA (Photo / Scanned Signature)
        if (fieldType === 'image' || fieldType === 'signature') {
            const imageSrc = field.signatureDataUrl || String(data[field.columnName] || field.fallbackImage || '');
            if (!imageSrc) continue;

            try {
                let imgBuffer: ArrayBuffer | null = null;

                if (imageSrc.startsWith('data:')) {
                    const base64Data = imageSrc.split(',')[1];
                    imgBuffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0)).buffer;
                } else if (imageSrc.startsWith('http')) {
                    const res = await fetch(imageSrc);
                    if (res.ok) imgBuffer = await res.arrayBuffer();
                }

                if (imgBuffer) {
                    let embeddedMedia;
                    try {
                        embeddedMedia = await pdfDoc.embedPng(imgBuffer);
                    } catch {
                        embeddedMedia = await pdfDoc.embedJpg(imgBuffer);
                    }

                    const mediaW = field.width || 120;
                    const mediaH = field.height || (field.width ? (field.width * embeddedMedia.height) / embeddedMedia.width : 120);

                    const mediaX = field.align === 'center' ? field.x - mediaW / 2 : field.align === 'right' ? field.x - mediaW : field.x;
                    const mediaY = height - field.y - mediaH;

                    page.drawImage(embeddedMedia, {
                        x: mediaX,
                        y: mediaY,
                        width: mediaW,
                        height: mediaH,
                    });
                }
            } catch (mediaErr) {
                console.warn(`Failed to render media field ${field.id}:`, mediaErr);
            }
            continue;
        }

        // 4. TYPOGRAPHY & TEXT FIELD
        let text = '';
        if (field.pattern && field.pattern.trim() !== '') {
            text = await interpolateFieldPattern({
                pattern: field.pattern,
                columnName: field.columnName,
                data,
            });
        } else if (data[field.columnName] !== undefined && data[field.columnName] !== null) {
            text = String(data[field.columnName]);
        } else {
            // Case-insensitive column match fallback
            const targetLower = (field.columnName || '').trim().toLowerCase();
            const matchedKey = Object.keys(data).find(
                (k) => k.trim().toLowerCase() === targetLower
            );
            if (matchedKey && data[matchedKey] !== undefined && data[matchedKey] !== null) {
                text = String(data[matchedKey]);
            } else if (field.columnName && !field.columnName.startsWith('{{')) {
                // Treat as static text
                text = field.columnName;
            }
        }

        if (!text) continue;

        // Embed font (standard or fontkit TTF)
        const font = await getOrEmbedFont(pdfDoc, field.fontFamily);
        const isStandard = !field.fontFamily || ['helvetica', 'times', 'courier', 'sans-serif', 'arial'].some((f) => (field.fontFamily || '').toLowerCase().includes(f));
        if (isStandard) {
            text = sanitizeTextForWinAnsi(text);
        }

        const fontAscent = font.heightAtSize(1, { descender: false });
        const fontHeight = font.heightAtSize(1);
        const fontColor = parseRgb(field.color);

        // Check Shrink-to-Fit Font Scaling
        let actualFontSize = field.fontSize;
        const boxWidth = field.width || 400;

        if (field.shrinkToFit && !field.autoWrap) {
            actualFontSize = calculateShrinkToFitFontSize({
                text,
                font,
                targetFontSize: field.fontSize,
                boxWidth,
                maxFontSize: field.maxFontSize || field.fontSize,
            });
        }

        // Base Y position (PDF bottom-left origin)
        const baseY = height - field.y - actualFontSize * (0.5 + fontAscent - fontHeight / 2);

        // Check Multi-line Auto-wrapping
        if (field.autoWrap) {
            const wrappedLines = wrapTextLines({
                text,
                font,
                fontSize: actualFontSize,
                boxWidth,
                startX: field.x,
                startY: baseY,
                align: field.align,
                lineHeight: field.lineHeight || 1.2,
            });

            for (const line of wrappedLines) {
                page.drawText(line.text, {
                    x: line.x,
                    y: line.y,
                    size: actualFontSize,
                    font,
                    color: fontColor,
                });
            }
        } else {
            // Single-line text
            const textWidth = font.widthOfTextAtSize(text, actualFontSize);
            let x = field.x;
            if (field.align === 'center') {
                x = field.x - textWidth / 2;
            } else if (field.align === 'right') {
                x = field.x - textWidth;
            }

            page.drawText(text, {
                x,
                y: baseY,
                size: actualFontSize,
                font,
                color: fontColor,
            });
        }
    }

    return await pdfDoc.save();
};
