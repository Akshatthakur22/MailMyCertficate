import type { CSVRow } from '@/types/csv';

export interface PhotoAsset {
    id: string;
    fileName: string;
    baseName: string; // File name without extension
    file: File;
    dataUrl: string;
}

export interface MatchResult {
    matchedCount: number;
    unmatchedCount: number;
    rowMatches: Map<number, PhotoAsset>; // rowId -> PhotoAsset
    assetMatches: Map<string, number>; // assetId -> rowId
}

/**
 * Normalizes a string for fuzzy matching (stripping punctuation, lowercase, spaces)
 */
function normalizeString(str: string): string {
    return str
        .toLowerCase()
        .replace(/[-_.]+/g, ' ')
        .replace(/[^a-z0-9 ]/g, '')
        .trim();
}

/**
 * Matches bulk uploaded photo assets to spreadsheet rows based on column values.
 * Compares filename (e.g. "101.jpg", "john_doe.png", "student_42.png") against row columns.
 */
export function matchPhotosToRows(
    photos: PhotoAsset[],
    rows: Array<{ id: number; data: CSVRow }>,
    targetColumns: string[] = []
): MatchResult {
    const rowMatches = new Map<number, PhotoAsset>();
    const assetMatches = new Map<string, number>();

    const usedAssetIds = new Set<string>();

    for (const row of rows) {
        // Collect candidate values from this row
        const candidateValues: string[] = [];

        // Check user-specified priority columns or all columns
        const colsToCheck = targetColumns.length > 0 ? targetColumns : Object.keys(row.data);

        for (const col of colsToCheck) {
            const val = row.data[col];
            if (val !== undefined && val !== null && String(val).trim() !== '') {
                candidateValues.push(String(val).trim());
            }
        }

        // Try exact & normalized matches against photos
        for (const photo of photos) {
            if (usedAssetIds.has(photo.id)) continue;

            const baseNormalized = normalizeString(photo.baseName);

            const isMatch = candidateValues.some((candidate) => {
                const candNormalized = normalizeString(candidate);
                // Exact base match or normalized match
                return (
                    photo.baseName.toLowerCase() === candidate.toLowerCase() ||
                    baseNormalized === candNormalized ||
                    (baseNormalized.length > 3 && candNormalized.includes(baseNormalized)) ||
                    (candNormalized.length > 3 && baseNormalized.includes(candNormalized))
                );
            });

            if (isMatch) {
                rowMatches.set(row.id, photo);
                assetMatches.set(photo.id, row.id);
                usedAssetIds.add(photo.id);
                break;
            }
        }
    }

    return {
        matchedCount: rowMatches.size,
        unmatchedCount: photos.length - rowMatches.size,
        rowMatches,
        assetMatches,
    };
}
