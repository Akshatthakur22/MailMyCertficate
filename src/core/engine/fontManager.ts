import { PDFDocument, StandardFonts, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export interface FontDefinition {
    name: string;
    family: string;
    category: 'standard' | 'google' | 'custom';
    url?: string;
    scriptSupport?: string; // 'Latin' | 'Devanagari' | 'Arabic' | 'CJK'
}

export const POPULAR_GOOGLE_FONTS: FontDefinition[] = [
    { name: 'Helvetica', family: 'Helvetica', category: 'standard', scriptSupport: 'Latin' },
    { name: 'Times Roman', family: 'TimesRoman', category: 'standard', scriptSupport: 'Latin' },
    { name: 'Courier', family: 'Courier', category: 'standard', scriptSupport: 'Latin' },
    { name: 'Inter', family: 'Inter', category: 'google', url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2', scriptSupport: 'Latin' },
    { name: 'Cinzel (Diploma/Formal)', family: 'Cinzel', category: 'google', url: 'https://fonts.gstatic.com/s/cinzel/v23/8vIJ7ww63mVu7gt79Wr7xFE.ttf', scriptSupport: 'Latin' },
    { name: 'Great Vibes (Script/Calligraphy)', family: 'Great Vibes', category: 'google', url: 'https://fonts.gstatic.com/s/greatvibes/v19/RWmMoKWR9v4ksMfaWd_JN9XFiaQ.ttf', scriptSupport: 'Latin' },
    { name: 'Montserrat', family: 'Montserrat', category: 'google', url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf', scriptSupport: 'Latin' },
    { name: 'Playfair Display', family: 'Playfair Display', category: 'google', url: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.ttf', scriptSupport: 'Latin' },
    { name: 'Noto Sans Devanagari (Hindi)', family: 'Noto Sans Devanagari', category: 'google', url: 'https://fonts.gstatic.com/s/notosansdevanagari/v25/5aU69_a8oxmIdGl4BAxOAN1KKhCIPrlP25U.ttf', scriptSupport: 'Devanagari' },
    { name: 'Noto Sans Arabic', family: 'Noto Sans Arabic', category: 'google', url: 'https://fonts.gstatic.com/s/notosansarabic/v24/nwpTtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHP-0K0.ttf', scriptSupport: 'Arabic' },
];

// In-memory cache for downloaded/uploaded font ArrayBuffers
const fontBytesCache = new Map<string, ArrayBuffer>();

/**
 * Stores custom TTF/OTF bytes in cache
 */
export function registerCustomFontBytes(fontFamily: string, bytes: ArrayBuffer): void {
    fontBytesCache.set(fontFamily.toLowerCase(), bytes);
}

/**
 * Embeds a font into the PDFDocument.
 * If font is standard (Helvetica, TimesRoman, Courier), embeds standard font.
 * If custom/Google TTF, registers fontkit and embeds TTF font bytes.
 */
export async function getOrEmbedFont(
    pdfDoc: PDFDocument,
    fontFamily: string = 'Helvetica'
): Promise<PDFFont> {
    const normalized = (fontFamily || 'Helvetica').trim().toLowerCase();

    // Standard Font Fallback
    if (normalized.includes('times')) {
        return await pdfDoc.embedFont(StandardFonts.TimesRoman);
    }
    if (normalized.includes('courier')) {
        return await pdfDoc.embedFont(StandardFonts.Courier);
    }
    if (normalized === 'helvetica' || normalized === 'sans-serif' || normalized === 'arial') {
        return await pdfDoc.embedFont(StandardFonts.Helvetica);
    }

    // Check if custom font bytes exist in cache
    let bytes = fontBytesCache.get(normalized);

    // If not in cache and has URL in Google Fonts registry, fetch it
    if (!bytes) {
        const found = POPULAR_GOOGLE_FONTS.find((f) => f.family.toLowerCase() === normalized || f.name.toLowerCase() === normalized);
        if (found && found.url && typeof fetch !== 'undefined') {
            try {
                const res = await fetch(found.url);
                if (res.ok) {
                    bytes = await res.arrayBuffer();
                    fontBytesCache.set(normalized, bytes);
                }
            } catch (err) {
                console.warn(`Could not fetch font ${fontFamily}:`, err);
            }
        }
    }

    if (bytes) {
        try {
            pdfDoc.registerFontkit(fontkit);
            return await pdfDoc.embedFont(bytes);
        } catch (embedErr) {
            console.warn(`Fontkit embedding failed for ${fontFamily}, falling back to Helvetica:`, embedErr);
        }
    }

    // Default Fallback
    return await pdfDoc.embedFont(StandardFonts.Helvetica);
}
