import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Field } from '@/types/field';
import type { CSVRow } from '@/types/csv';

export interface GenerationOptions {
    template: string; // Base64
    fields: Field[];
    data: CSVRow;
}

export const renderSingleCertificate = async ({ template, fields, data }: GenerationOptions): Promise<Uint8Array> => {
    try {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Embed Image
        let image;
        // Strip data prefix if present (pdf-lib might handle it, but safer to strip or just pass the string if it's purely base64?)
        // Actually pdf-lib `embedPng` handles data URI implementation internally often, or needs pure base64. 
        // Docs say "base64 string". Let's handle both.

        let base64Data = template;
        const pngPrefix = 'data:image/png;base64,';
        const jpgPrefix = 'data:image/jpeg;base64,';

        if (template.startsWith(pngPrefix)) {
            base64Data = template.slice(pngPrefix.length);
            image = await pdfDoc.embedPng(base64Data);
        } else if (template.startsWith(jpgPrefix)) {
            base64Data = template.slice(jpgPrefix.length);
            image = await pdfDoc.embedJpg(base64Data);
        } else {
            // Assume no prefix or try to guess. Default to JPG if unknown? Or try PNG.
            // If it's raw base64, we don't know type easily without header.
            // But our loader adds prefix. So this else might be fallback.
            try {
                image = await pdfDoc.embedJpg(template);
            } catch {
                image = await pdfDoc.embedPng(template);
            }
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

        // Get font metrics for accurate baseline positioning.
        // In a Type1 font the ascent + |descent| ≈ 1000 units (design space).
        // Helvetica: ascent ≈ 718, descent ≈ -207
        const fontAscent = font.heightAtSize(1, { descender: false }); // ascent ratio
        const fontHeight = font.heightAtSize(1); // full height ratio (ascent + |descent|)

        // Draw Fields
        for (const field of fields) {
            const text = data[field.columnName] || '';
            if (!text) continue;

            const fontSize = field.fontSize;

            // Calculate Width for Alignment
            const textWidth = font.widthOfTextAtSize(text, fontSize);

            let x = field.x;
            // Adjust X based on alignment
            if (field.align === 'center') {
                x = field.x - textWidth / 2;
            } else if (field.align === 'right') {
                x = field.x - textWidth;
            }

            // --- Accurate Y-coordinate conversion ---
            // In the HTML preview:
            //   - field.y = top of the flex container (origin: top-left)
            //   - Container height = fontSize (because line-height: 1)
            //   - Text is vertically centred inside the container via flexbox
            //
            // With line-height: 1, the browser renders the text so that:
            //   - The total line box = fontSize
            //   - The visual centre of the text = field.y + fontSize / 2
            //
            // In the PDF (origin: bottom-left):
            //   - drawText places text at its baseline
            //   - Font ascent above baseline = fontAscent * fontSize
            //   - Font descent below baseline = fontDescentRatio * fontSize
            //   - Visual centre of glyph = baseline + (ascent - descent) / 2 - descent... 
            //     simplified: baseline + fontAscent * fontSize - (fontHeight * fontSize) / 2
            //     = baseline + fontSize * (fontAscent - fontHeight / 2)
            //
            // We want:
            //   height - (field.y + fontSize / 2) = baseline + fontSize * (fontAscent - fontHeight / 2)
            //
            // Solving for baseline:
            //   baseline = height - field.y - fontSize / 2 - fontSize * (fontAscent - fontHeight / 2)
            //   baseline = height - field.y - fontSize * (0.5 + fontAscent - fontHeight / 2)

            const y = height - field.y - fontSize * (0.5 + fontAscent - fontHeight / 2);

            // Parse Color (Hex to RGB)
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
    } catch (error) {
        console.error("Certificate Generation Error:", error);
        throw error;
    }
};
