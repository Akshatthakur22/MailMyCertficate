import type { ParsedCSV, CSVRow } from '@/types/csv';

/**
 * Extract Google Sheets ID and optional gid from a URL.
 * Supports formats:
 *   https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0
 *   https://docs.google.com/spreadsheets/d/SHEET_ID/
 *   https://docs.google.com/spreadsheets/d/SHEET_ID
 */
export function parseSheetUrl(url: string): { sheetId: string; gid?: string } | null {
    const trimmed = url.trim();
    const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) return null;

    const sheetId = match[1];
    const gidMatch = trimmed.match(/[#&?]gid=(\d+)/);

    return {
        sheetId,
        gid: gidMatch ? gidMatch[1] : undefined,
    };
}

/**
 * Validate if a string looks like a Google Sheets URL.
 */
export function isValidSheetUrl(url: string): boolean {
    return parseSheetUrl(url) !== null;
}

/**
 * Import data from a Google Sheet via the backend proxy.
 * Returns data in the same ParsedCSV format as CSV uploads.
 */
export async function importFromGoogleSheets(url: string): Promise<ParsedCSV & { sheetId: string }> {
    const response = await fetch('/api/sheets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to import from Google Sheets');
    }

    return {
        headers: data.headers,
        data: data.data as CSVRow[],
        totalRows: data.totalRows,
        sheetId: data.sheetId,
    };
}

/**
 * Generate a deterministic fingerprint for a row based on its content.
 * Used for detecting changes in existing rows.
 * Excludes __rowIndex from the fingerprint to keep content-based identity clean.
 */
export function generateRowFingerprint(row: CSVRow): string {
    const keys = Object.keys(row)
        .filter(k => k !== '__rowIndex')
        .sort();
    return keys.map(k => `${k}:${String(row[k] || '').trim()}`).join('|');
}

/**
 * Detect changes by comparing imported data against existing data.
 * Returns an object with new rows to add and updated rows to refresh.
 */
export function detectSyncChanges(
    importedData: CSVRow[],
    existingRows: { id: number; data: CSVRow }[]
): { 
    newRows: CSVRow[]; 
    updatedRows: { id: number; data: CSVRow }[];
    totalChanges: number;
} {
    const newRows: CSVRow[] = [];
    const updatedRows: { id: number; data: CSVRow }[] = [];

    // Map existing rows by their rowIndex if available, otherwise fallback to fingerprinting
    const existingByIndex = new Map<number, { id: number; data: CSVRow }>();
    const existingByFingerprint = new Map<string, { id: number; data: CSVRow }>();

    existingRows.forEach(row => {
        const rowIndex = (row.data as any).__rowIndex;
        if (typeof rowIndex === 'number') {
            existingByIndex.set(rowIndex, row);
        }
        existingByFingerprint.set(generateRowFingerprint(row.data), row);
    });

    importedData.forEach((row, index) => {
        const importedRowWithIndex = { ...row, __rowIndex: index };
        const importedFingerprint = generateRowFingerprint(row);

        // Check if we have this row by index
        const existing = existingByIndex.get(index);

        if (existing) {
            // Check if content changed
            const existingFingerprint = generateRowFingerprint(existing.data);
            if (importedFingerprint !== existingFingerprint) {
                updatedRows.push({ id: existing.id, data: importedRowWithIndex });
            }
        } else {
            // If not found by index, check if the content exists elsewhere (content shift)
            if (!existingByFingerprint.has(importedFingerprint)) {
                newRows.push(importedRowWithIndex);
            }
        }
    });

    return {
        newRows,
        updatedRows,
        totalChanges: newRows.length + updatedRows.length
    };
}
