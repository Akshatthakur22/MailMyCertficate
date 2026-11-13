import type { CSVRow } from '@/types/csv';

export type FormulaType =
    | 'concatenate'
    | 'uppercase'
    | 'lowercase'
    | 'titlecase'
    | 'serial_number'
    | 'date_format'
    | 'currency_format';

export interface ComputedColumnConfig {
    newColumnName: string;
    type: FormulaType;
    // For concatenate
    template?: string; // e.g. "{{First_Name}} {{Last_Name}}"
    // For case transforms
    sourceColumn?: string;
    // For serial number
    serialPrefix?: string; // e.g. "CERT-2026-"
    serialStartNumber?: number; // e.g. 1
    serialPadding?: number; // e.g. 4 -> "0001"
    // For date format
    dateStyle?: 'long' | 'medium' | 'short' | 'iso'; // "October 24, 2026", "24/10/2026", etc.
    // For currency
    currencyCode?: string; // "USD", "INR", "EUR", "GBP"
}

function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function formatDate(val: string | number, style: 'long' | 'medium' | 'short' | 'iso'): string {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);

    if (style === 'long') {
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } else if (style === 'medium') {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    } else if (style === 'short') {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${month}/${day}/${year}`;
    }
    return d.toISOString().split('T')[0];
}

function formatCurrency(val: string | number, currencyCode: string = 'USD'): string {
    const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ''));
    if (isNaN(num)) return String(val);

    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        }).format(num);
    } catch {
        return `${currencyCode} ${num.toFixed(2)}`;
    }
}

/**
 * Computes a single column value for a given row and index
 */
export function evaluateComputedValue(
    row: CSVRow,
    rowIndex: number,
    config: ComputedColumnConfig
): string {
    switch (config.type) {
        case 'concatenate': {
            if (!config.template) return '';
            let res = config.template;
            for (const [key, val] of Object.entries(row)) {
                res = res.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(val ?? ''));
            }
            return res;
        }

        case 'uppercase': {
            const val = config.sourceColumn ? row[config.sourceColumn] : '';
            return String(val ?? '').toUpperCase();
        }

        case 'lowercase': {
            const val = config.sourceColumn ? row[config.sourceColumn] : '';
            return String(val ?? '').toLowerCase();
        }

        case 'titlecase': {
            const val = config.sourceColumn ? row[config.sourceColumn] : '';
            return toTitleCase(String(val ?? ''));
        }

        case 'serial_number': {
            const prefix = config.serialPrefix ?? 'CERT-';
            const start = config.serialStartNumber ?? 1;
            const pad = config.serialPadding ?? 4;
            const num = (start + rowIndex).toString().padStart(pad, '0');
            return `${prefix}${num}`;
        }

        case 'date_format': {
            const val = config.sourceColumn ? row[config.sourceColumn] : '';
            return formatDate(val ?? '', config.dateStyle || 'long');
        }

        case 'currency_format': {
            const val = config.sourceColumn ? row[config.sourceColumn] : '';
            return formatCurrency(val ?? '', config.currencyCode || 'USD');
        }

        default:
            return '';
    }
}

/**
 * Applies a computed column configuration across all rows.
 */
export function applyComputedColumn(
    rows: CSVRow[],
    config: ComputedColumnConfig
): CSVRow[] {
    return rows.map((row, index) => {
        const computedVal = evaluateComputedValue(row, index, config);
        return {
            ...row,
            [config.newColumnName]: computedVal,
        };
    });
}
