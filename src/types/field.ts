export type Alignment = 'left' | 'center' | 'right';

export type FieldType = 'text' | 'qr' | 'barcode' | 'image' | 'signature';

export type ShapeMask = 'none' | 'circle' | 'pill' | 'rounded';

export type BarcodeFormat = 'CODE128' | 'CODE39' | 'EAN13';

export type QRErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface Field {
    id: string; // Unique ID (e.g., column name or generated)
    columnName: string; // From CSV or static value
    x: number; // Absolute pixels (image dimensions)
    y: number; // Absolute pixels (image dimensions)
    width: number; // Constraints (width)
    height?: number; // Height constraint (for QR, barcode, image)
    fontSize: number;
    fontFamily: string; // 'Helvetica' | 'TimesRoman' | Google Font name | Custom TTF
    color: string; // Hex
    align: Alignment;

    // Advanced Studio Capabilities
    type?: FieldType; // Defaults to 'text'

    // Typography
    shrinkToFit?: boolean; // Auto-shrink font size to fit width constraint
    autoWrap?: boolean; // Multi-line paragraph wrapping
    lineHeight?: number; // Line height ratio (e.g., 1.2)
    maxFontSize?: number; // Ceiling for shrink-to-fit
    customFontUrl?: string; // Optional custom TTF font URL or IDB key

    // QR & Barcode
    pattern?: string; // Dynamic template (e.g., "https://verify.domain.com/cert/{{Certificate_ID}}")
    errorCorrectionLevel?: QRErrorCorrectionLevel;
    fgColor?: string;
    bgColor?: string;
    barcodeFormat?: BarcodeFormat;
    includeVerificationHash?: boolean;
    verificationSecret?: string;

    // Dynamic Media & Signatures
    shapeMask?: ShapeMask;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    fallbackImage?: string; // Fallback image URL or data URI
    signatureDataUrl?: string; // Saved signature ink data
    paperBackgroundRemoved?: boolean;

    // Grouping
    groupId?: string;
}

