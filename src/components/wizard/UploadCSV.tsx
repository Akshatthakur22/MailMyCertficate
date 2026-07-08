'use client';

import { useState, useRef, type DragEvent, type ChangeEvent, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { parseCSV } from '@/services/csvService';
import { importFromGoogleSheets, isValidSheetUrl, detectSyncChanges } from '@/services/googleSheetsService';
import { Button } from '@/components/ui/Button';
import { FileSpreadsheet, AlertCircle, AlertTriangle, ArrowRight, Trash2, Link2, Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { db, type CSVRowData } from '@/core/db/schema';
import { touchActivity, updateSession } from '@/core/session/sessionManager';
import type { CSVRow } from '@/types/csv';
import { trackEvent } from '@/lib/analytics';
import { TrustBoundaryNotice } from '@/components/product/TrustBoundaryNotice';
import { detectEmailColumn, detectNameColumn } from '@/utils/recipientColumn';

type ImportSource = 'csv' | 'sheets';
type ImportMode = 'csv' | 'sheets';

export function UploadCSV() {
    const sessionId = useAppStore((state) => state.sessionId);
    const setCsvHeaders = useAppStore((state) => state.setCsvHeaders);
    const setCsvData = useAppStore((state) => state.setCsvData);
    const setCurrentStep = useAppStore((state) => state.setCurrentStep);
    const csvData = useAppStore((state) => state.csvData);
    const csvHeaders = useAppStore((state) => state.csvHeaders);

    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsed, setParsed] = useState(csvHeaders.length > 0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Google Sheets state
    const [importMode, setImportMode] = useState<ImportMode>('csv');
    const [sheetUrl, setSheetUrl] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('mmc-sheet-url') || '';
        }
        return '';
    });
    const [isImporting, setIsImporting] = useState(false);
    const [importSource, setImportSource] = useState<ImportSource | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('mmc-import-source') as ImportSource | null;
        }
        return null;
    });

    // Sync state
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<{ newRows: number; updatedRows: number } | null>(null);
    const [pendingImport, setPendingImport] = useState<{ data: CSVRow[]; headers: string[]; file?: File } | null>(null);

    // ————————————————————————
    // CSV Upload Handler
    // ————————————————————————
    const handleFile = async (file: File) => {
        try {
            setError(null);
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                setError('Please upload a valid CSV file.');
                return;
            }

            const { data, headers } = await parseCSV(file);

            if (csvData.length > 0) {
                setPendingImport({ data, headers, file });
                return;
            }

            await finalizeImport(data, headers, file);
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message || 'Failed to parse CSV.');
            } else {
                setError('Failed to parse CSV.');
            }
        }
    };

    const finalizeImport = async (data: CSVRow[], headers: string[], file?: File, isAppend = false) => {
        try {
            setError(null);
            
            const existingRows = isAppend ? await db.rows.where({ sessionId }).toArray() : [];
            const startIndex = existingRows.length;

            if (startIndex + data.length > 400) {
                throw new Error(`Adding ${data.length} more rows would exceed the 400 row limit (current: ${startIndex}).`);
            }

            // 1. Store CSV metadata in IDB if it's a file
            if (file) {
                await db.files.put({
                    id: `${sessionId}-csv`,
                    sessionId,
                    type: 'csv-raw',
                    blob: file
                });
            }

            // 2. Store individual rows in IDB
            if (!isAppend) {
                await db.rows.where({ sessionId }).delete();
                await db.certificates.where({ sessionId }).delete();
            }

            const rowRecords: Array<Omit<CSVRowData, 'id'>> = data.map((row, index) => ({
                sessionId,
                data: { ...row, __rowIndex: startIndex + index }
            }));
            await db.rows.bulkAdd(rowRecords as unknown as CSVRowData[]);

            // 3. Update Zustand
            const allHeaders = Array.from(new Set([...csvHeaders, ...headers]));
            const allData = isAppend ? [...csvData, ...data] : data;

            setCsvHeaders(allHeaders);
            setCsvData(allData);
            setParsed(true);
            setPendingImport(null);

            // Track source
            setImportSource('csv');
            localStorage.setItem('mmc-import-source', 'csv');
            localStorage.removeItem('mmc-sheet-url');

            await updateSession(sessionId, { workflowStage: 'UPLOAD', currentStep: 2 });
            await touchActivity(sessionId);

            trackEvent(
                {
                    event: 'csv_uploaded',
                    row_count: allData.length,
                    column_count: allHeaders.length,
                    import_source: 'csv',
                },
                { dedupeKey: `${sessionId}-csv-${allData.length}` }
            );
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to import data.');
        }
    };

    // ————————————————————————
    // Google Sheets Import Handler
    // ————————————————————————
    const handleSheetImport = async () => {
        if (!isValidSheetUrl(sheetUrl)) {
            setError('Please enter a valid Google Sheets URL (e.g. docs.google.com/spreadsheets/d/...)');
            return;
        }

        setIsImporting(true);
        setError(null);

        try {
            const { data, headers } = await importFromGoogleSheets(sheetUrl);

            // Wipe existing rows and certificates for this session
            await db.rows.where({ sessionId }).delete();
            await db.certificates.where({ sessionId }).delete();

            // Store new data
            const rowRecords: Array<Omit<CSVRowData, 'id'>> = data.map((row, index) => ({
                sessionId,
                data: { ...row, __rowIndex: index }
            }));
            await db.rows.bulkAdd(rowRecords as unknown as CSVRowData[]);

            // Update Zustand
            setCsvHeaders(headers);
            setCsvData(data);
            setParsed(true);

            // Track source
            setImportSource('sheets');
            localStorage.setItem('mmc-import-source', 'sheets');
            localStorage.setItem('mmc-sheet-url', sheetUrl);

            trackEvent(
                {
                    event: 'csv_uploaded',
                    row_count: data.length,
                    column_count: headers.length,
                    import_source: 'google_sheets',
                },
                { dedupeKey: `${sessionId}-sheets-${data.length}` }
            );
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to import from Google Sheets.');
            }
        } finally {
            setIsImporting(false);
        }
    };

    // ————————————————————————
    // Sync Latest Rows (Sheets only)
    // ————————————————————————
    const handleSyncSheets = async () => {
        const storedUrl = localStorage.getItem('mmc-sheet-url');
        if (!storedUrl) {
            setError('No sheet URL saved. Please re-import.');
            return;
        }

        setIsSyncing(true);
        setSyncResult(null);
        setError(null);

        try {
            const { data: importedData, headers } = await importFromGoogleSheets(storedUrl);

            // Get existing rows from IDB
            const existingRows = await db.rows.where({ sessionId }).toArray();

            // Detect new and updated rows via sync intelligence
            const { newRows, updatedRows } = detectSyncChanges(importedData, existingRows);

            if (newRows.length > 0 || updatedRows.length > 0) {
                // Validate total count
                if (existingRows.length + newRows.length > 400) {
                    setError(`Adding ${newRows.length} new rows would exceed the 400 row limit (current: ${existingRows.length}).`);
                    return;
                }

                // Handle updates: Update data and clear certificates for those rows
                if (updatedRows.length > 0) {
                    for (const row of updatedRows) {
                        await db.rows.update(row.id, { data: row.data });
                        // Clear certificate for this specific row since data changed
                        await db.certificates.where({ sessionId, rowId: row.id }).delete();
                    }
                }

                // Handle new rows
                if (newRows.length > 0) {
                    const newRecords: Array<Omit<CSVRowData, 'id'>> = newRows.map(row => ({ sessionId, data: row }));
                    await db.rows.bulkAdd(newRecords as unknown as CSVRowData[]);
                }

                // Update Zustand with latest snapshot from IDB
                const allRows = await db.rows.where({ sessionId }).toArray();
                const allData = allRows.map(r => r.data);
                
                setCsvHeaders(headers);
                setCsvData(allData);
                setSyncResult({ newRows: newRows.length, updatedRows: updatedRows.length });
            } else {
                setSyncResult({ newRows: 0, updatedRows: 0 });
            }
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to sync from Google Sheets.');
            }
        } finally {
            setIsSyncing(false);
        }
    };

    // ————————————————————————
    // Drag & Drop Handlers
    // ————————————————————————
    const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const onDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleReset = async () => {
        setCsvHeaders([]);
        setCsvData([]);
        setParsed(false);
        setError(null);
        setImportSource(null);
        setSyncResult(null);
        localStorage.removeItem('mmc-import-source');
        localStorage.removeItem('mmc-sheet-url');

        // Clear IDB rows and certificates for this session
        try {
            await db.rows.where({ sessionId }).delete();
            await db.certificates.where({ sessionId }).delete();
        } catch (err) {
            console.error('Failed to clear data on reset:', err);
        }
    };

    const previewRows = useMemo(() => csvData.slice(0, 5), [csvData]);
    const rowCount = csvData.length;
    const showWarning = rowCount > 300 && rowCount <= 400;

    // ————————————————————————————————————————
    // PARSED STATE — Data Preview
    // ————————————————————————————————————————
    if (parsed) {
        const emailDetection = detectEmailColumn(csvHeaders, csvData);
        const emailColumn = emailDetection.column;
        const nameColumn = detectNameColumn(csvHeaders);
        
        return (
            <div className="space-y-5">
                    {/* Summary header */}
                    <div className="pb-4 border-b border-border/40">
                        <p className="text-sm font-semibold text-foreground mb-3">
                            <span className="text-accent font-bold">{rowCount}</span> recipients · <span className="text-accent font-bold">{csvHeaders.length}</span> columns
                        </p>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-wrap gap-1.5">
                                {nameColumn && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                        ✓ Name
                                    </span>
                                )}
                                {emailColumn && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                        ✓ Email
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {importSource === 'sheets' && (
                                    <button
                                        onClick={handleSyncSheets}
                                        disabled={isSyncing}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium border border-border hover:bg-muted/50 transition-colors disabled:opacity-50"
                                    >
                                        {isSyncing ? (
                                            <Loader2 size={13} className="animate-spin" />
                                        ) : (
                                            <RefreshCw size={13} />
                                        )}
                                        Sync
                                    </button>
                                )}
                                <button
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-red-600 hover:bg-red-50/50 transition-colors"
                                >
                                    <Trash2 size={12} />
                                    Replace
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview table */}
                    {rowCount > 0 && (
                        <div className="rounded-lg border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-xs text-secondary uppercase tracking-wide bg-muted/40 border-b border-border">
                                        <tr>
                                            <th className="px-3 py-2 w-8 font-medium text-left">#</th>
                                            {csvHeaders.slice(0, 4).map((header) => (
                                                <th 
                                                    key={header} 
                                                    className={cn(
                                                        'px-3 py-2 font-medium text-left',
                                                        (header === nameColumn || header === emailColumn) && 'bg-accent/5'
                                                    )}
                                                >
                                                    {header.length > 12 ? header.slice(0, 10) + '…' : header}
                                                </th>
                                            ))}
                                            {csvHeaders.length > 4 && (
                                                <th className="px-3 py-2 font-medium text-secondary/50">+{csvHeaders.length - 4}</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewRows.slice(0, 3).map((row, idx) => (
                                            <tr key={idx} className="border-b border-border/50 last:border-0 text-sm">
                                                <td className="px-3 py-2 text-secondary/40 font-mono text-xs">{idx + 1}</td>
                                                {csvHeaders.slice(0, 4).map((header) => (
                                                    <td 
                                                        key={`${idx}-${header}`} 
                                                        className={cn(
                                                            'px-3 py-2 max-w-[120px] truncate',
                                                            (header === nameColumn || header === emailColumn) && 'bg-accent/3 font-medium'
                                                        )}
                                                    >
                                                        {String(row[header]).slice(0, 20)}
                                                    </td>
                                                ))}
                                                {csvHeaders.length > 4 && (
                                                    <td className="px-3 py-2 text-secondary/30">…</td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {rowCount > 3 && (
                                <div className="px-3 py-2 text-xs text-secondary/50 bg-muted/20 border-t border-border/50">
                                    + {rowCount - 3} more
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sync result */}
                    {syncResult && (
                        <div
                            className={cn(
                                'flex items-center gap-2 px-3 py-2.5 rounded text-xs',
                                syncResult.newRows > 0
                                    ? 'bg-green-50 text-green-800 border border-green-100'
                                    : 'bg-blue-50 text-blue-800 border border-blue-100',
                            )}
                        >
                            <CheckCircle size={16} className="shrink-0" />
                            <span>
                                {syncResult.newRows > 0 || syncResult.updatedRows > 0
                                    ? `${syncResult.newRows > 0 ? `${syncResult.newRows} new` : ''}${syncResult.newRows > 0 && syncResult.updatedRows > 0 ? ' + ' : ''}${syncResult.updatedRows > 0 ? `${syncResult.updatedRows} updated` : ''}`
                                    : 'Up to date'}
                            </span>
                        </div>
                    )}

                    {/* Large row warning */}
                    {showWarning && (
                        <div className="flex items-start gap-2.5 bg-amber-50 text-amber-900 px-3 py-2.5 rounded border border-amber-100 text-xs">
                            <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                            <p>Large batch may take longer.</p>
                        </div>
                    )}

                    {/* Trust signal */}
                    <div className="text-xs text-green-700 bg-green-50 border border-green-100/60 rounded px-3 py-2.5">
                        🛡 Saved locally • Ready to design
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2.5 rounded border border-red-100 text-xs">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-2 pt-2">
                        <button 
                            onClick={() => setCurrentStep(1)} 
                            className="flex-1 px-4 py-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                        >
                            Back
                        </button>
                        <button 
                            onClick={() => setCurrentStep(3)} 
                            className="flex-1 px-4 py-3 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-1.5"
                        >
                            Design
                            <ArrowRight size={16} />
                        </button>
                    </div>
            </div>
        );
    }

    // ————————————————————————————————————————
    // UNPARSED STATE
    // ————————————————————————————————————————
    return (
        <div className="text-center">
            <p className="text-secondary text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                Upload your participant data. Names, emails, and other details will be personalized into each certificate.
            </p>

            <div className="mb-6 text-left">
                <TrustBoundaryNotice variant="csv" />
            </div>

            <div className="inline-flex p-1 rounded-lg bg-muted/60 border border-border/50 mb-6">
                <button
                    onClick={() => { setImportMode('csv'); setError(null); }}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                        importMode === 'csv'
                            ? 'bg-white text-foreground shadow-sm'
                            : 'text-secondary hover:text-foreground',
                    )}
                >
                    <FileSpreadsheet size={15} />
                    CSV
                </button>
                <button
                    onClick={() => { setImportMode('sheets'); setError(null); }}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                        importMode === 'sheets'
                            ? 'bg-white text-foreground shadow-sm'
                            : 'text-secondary hover:text-foreground',
                    )}
                >
                    <Link2 size={15} />
                    Google Sheets
                </button>
            </div>

            {importMode === 'csv' ? (
                <>
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                            'border-2 border-dashed rounded-xl p-10 md:p-12 transition-colors cursor-pointer group',
                            dragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40 hover:bg-muted/30',
                            error && 'border-red-300 bg-red-50/50',
                        )}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".csv, text/csv"
                            className="hidden"
                            onChange={onFileChange}
                        />

                        <div className="flex flex-col items-center gap-4">
                            <div
                                className={cn(
                                    'w-14 h-14 rounded-xl flex items-center justify-center transition-colors',
                                    dragging ? 'bg-accent text-white' : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white',
                                )}
                            >
                                <FileSpreadsheet size={28} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">
                                    {dragging ? 'Drop to upload' : 'Drop your participant list here'}
                                </p>
                                <p className="text-sm text-secondary mt-1">or click to browse</p>
                            </div>
                            <p className="text-xs text-secondary/70">Headers supported · UTF-8 · max 400 rows</p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                        <Button variant="outline" onClick={() => setCurrentStep(1)} className="rounded-lg">
                            Back
                        </Button>
                        <Button onClick={() => inputRef.current?.click()} variant="secondary" className="rounded-lg">
                            Choose file
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className="border border-border rounded-xl p-6 md:p-8 bg-muted/20 text-left">
                        <p className="text-sm text-secondary mb-4 text-center">
                            Paste a public Google Sheets link
                        </p>

                        <div
                            className={cn(
                                'flex items-center gap-3 border rounded-lg px-3 py-2.5 bg-white transition-colors focus-within:border-accent',
                                isValidSheetUrl(sheetUrl) ? 'border-green-300' : sheetUrl.length > 0 ? 'border-amber-300' : 'border-border',
                            )}
                        >
                            <Link2 size={16} className="text-secondary/40 shrink-0" />
                            <input
                                type="url"
                                value={sheetUrl}
                                onChange={(e) => setSheetUrl(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSheetImport(); }}
                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                className="w-full bg-transparent outline-none text-sm placeholder:text-secondary/40"
                                disabled={isImporting}
                            />
                            {isValidSheetUrl(sheetUrl) && (
                                <CheckCircle size={16} className="text-green-500 shrink-0" />
                            )}
                        </div>

                        <Button
                            onClick={handleSheetImport}
                            disabled={isImporting || !sheetUrl.trim()}
                            className="w-full mt-4 rounded-lg"
                        >
                            {isImporting ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                    Importing…
                                </>
                            ) : (
                                <>
                                    Import sheet
                                    <ArrowRight size={16} className="ml-2" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Append/Replace Modal */}
            {pendingImport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="flex flex-col items-center text-center gap-6">
                            <div className="w-20 h-20 rounded-[2rem] bg-amber-50 text-amber-500 flex items-center justify-center">
                                <AlertTriangle size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold tracking-tight">Merge or Replace?</h3>
                                <p className="text-secondary text-sm leading-relaxed">
                                    You already have <span className="text-foreground font-bold">{csvData.length}</span> recipients loaded. Would you like to add these new <span className="text-accent font-bold">{pendingImport.data.length}</span> ones to the list, or replace everything?
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => finalizeImport(pendingImport.data, pendingImport.headers, pendingImport.file, false)}
                                    className="h-14 rounded-2xl border-2 font-bold"
                                >
                                    Replace All
                                </Button>
                                <Button 
                                    onClick={() => finalizeImport(pendingImport.data, pendingImport.headers, pendingImport.file, true)}
                                    className="h-14 rounded-2xl bg-accent hover:bg-accent/90 text-white font-bold shadow-lg shadow-accent/20"
                                >
                                    Append New
                                </Button>
                            </div>
                            <button 
                                onClick={() => setPendingImport(null)}
                                className="text-xs font-bold text-secondary/60 hover:text-secondary uppercase tracking-widest pt-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 flex justify-center">
                        <Button variant="outline" onClick={() => setCurrentStep(1)} className="rounded-lg">
                            Back
                        </Button>
                    </div>
                </>
            )}

            {error && (
                <div className="mt-4 flex items-center justify-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100 text-sm">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
