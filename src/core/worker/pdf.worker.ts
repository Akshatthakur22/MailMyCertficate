/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderSingleCertificate } from '../engine/pdfRenderer';

let cachedTemplate: Blob | null = null;
let cachedFields: any[] = [];

self.onmessage = async (e: MessageEvent) => {
    const { type, template, fields, rowData, rowId } = e.data;

    // Handle Initialization (Cache template & fields)
    if (type === 'INIT') {
        cachedTemplate = template;
        cachedFields = fields;
        (self as any).postMessage({ status: 'ready' });
        return;
    }

    // Handle Processing
    if (type === 'PROCESS') {
        if (!cachedTemplate) {
            (self as any).postMessage({ rowId, status: 'error', error: 'Worker not initialized' });
            return;
        }

        try {
            const pdfBytes = await renderSingleCertificate({
                template: cachedTemplate,
                fields: cachedFields,
                data: rowData
            });

            (self as any).postMessage(
                { rowId, pdfBytes, status: 'success' },
                [pdfBytes.buffer]
            );
        } catch (error: any) {
            (self as any).postMessage({
                rowId,
                status: 'error',
                error: error.message || 'Rendering failed'
            });
        }
    }
};
