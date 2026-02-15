import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Field } from '@/types/field';

export interface GenerationOptions {
    template: Blob | string; // Handle both Blob (Worker) and Base64 (Preview/Fallback)
    fields: Field[];
    data: Record<string, string>;
}

export const renderSingleCertificate = async ({ template, fields, data }: GenerationOptions): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Embed Image
    let image;
    let imageArrayBuffer: ArrayBuffer;

    if (template instanceof Blob) {
        imageArrayBuffer = await template.arrayBuffer();
    } else if (typeof template === 'string' && template.startsWith('data:')) {
        const base64Data = template.split(',')[1];
        imageArrayBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)).buffer;
    } else {
        throw new Error("Invalid template format. Expected Blob or Data URI.");
    }

    // Try to embed as PNG, fallback to JPG
    try {
        image = await pdfDoc.embedPng(imageArrayBuffer);
    } catch {
        image = await pdfDoc.embedJpg(imageArrayBuffer);
    }

    const { width, height } = image;
    const page = pdfDoc.addPage([width, height]);

    // Draw Background
    page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
    });

    const fontAscent = font.heightAtSize(1, { descender: false });
    const fontHeight = font.heightAtSize(1);

    // Draw Fields
    for (const field of fields) {
        const text = data[field.columnName] || '';
        if (!text) continue;

        const fontSize = field.fontSize;
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x = field.x;
        if (field.align === 'center') {
            x = field.x - textWidth / 2;
        } else if (field.align === 'right') {
            x = field.x - textWidth;
        }

        // Accurate Y-coordinate conversion (Origin: Bottom-Left)
        const y = height - field.y - fontSize * (0.5 + fontAscent - fontHeight / 2);

        // Parse Color
        const r = parseInt(field.color.slice(1, 3), 16) / 255;
        const g = parseInt(field.color.slice(3, 5), 16) / 255;
        const b = parseInt(field.color.slice(5, 7), 16) / 255;

        page.drawText(text, {
            x,
            y,
            size: fontSize,
            font: font,
            color: rgb(r, g, b),
        });
    }

    return await pdfDoc.save();
};
