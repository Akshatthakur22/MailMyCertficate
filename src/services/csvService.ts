import Papa from 'papaparse';
import type { ParsedCSV, CSVRow } from '@/types/csv';

/**
 * Sanitize header strings to prevent PDF generation issues.
 * Trims whitespace and replaces problematic characters with underscores.
 */
export const sanitizeHeader = (header: string): string => {
    return header
        .trim()
        .replace(/[^\w\s-]/gi, '') // Remove most special chars except letters, numbers, spaces, underscores, and dashes
        .replace(/\s+/g, ' '); // Normalize multiple spaces
};

export const parseCSV = (file: File): Promise<ParsedCSV> => {
    return new Promise((resolve, reject) => {
        Papa.parse<CSVRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    // You might want to be more specific here in production
                    reject(new Error(`CSV Parsing Error: ${results.errors[0].message}`));
                    return;
                }

                const rawHeaders = results.meta.fields || [];
                const headers = rawHeaders.map(sanitizeHeader);
                
                // Map data to sanitized headers
                const data = results.data.map(row => {
                    const sanitizedRow: CSVRow = {};
                    rawHeaders.forEach((rawHeader, idx) => {
                        sanitizedRow[headers[idx]] = row[rawHeader];
                    });
                    return sanitizedRow;
                });

                if (data.length === 0) {
                    reject(new Error("The CSV file appears to be empty."));
                    return;
                }

                if (headers.length === 0) {
                    reject(new Error("Could not detect headers. Please ensure the first row contains column names."));
                    return;
                }

                // Strict limit checks
                if (data.length > 400) {
                    reject(new Error(`File too large. Maximum 400 rows allowed (detected ${data.length}).`));
                    return;
                }

                resolve({
                    headers,
                    data,
                    totalRows: data.length,
                });
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};
