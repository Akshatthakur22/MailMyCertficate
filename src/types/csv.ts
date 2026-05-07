export type CSVRow = Record<string, string | number>;

export interface ParsedCSV {
    headers: string[];
    data: CSVRow[]; // Filtered, max 400
    totalRows: number;
}
