'use client';

import { useState, useRef, type DragEvent, type ChangeEvent, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { parseCSV } from '@/services/csvService';
import { importFromGoogleSheets, isValidSheetUrl, detectSyncChanges } from '@/services/googleSheetsService';
import { Button } from '@/components/ui/Button';
import { FileSpreadsheet, AlertCircle, AlertTriangle, ArrowRight, Trash2, Link2, Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { db } from '@/core/db/schema';
import { touchActivity, updateSession } from '@/core/session/sessionManager';
import type { CSVRow } from '@/types/csv';
import { trackEvent } from '@/lib/analytics';

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

            const rowRecords = data.map((row, index) => ({
                sessionId,
                data: { ...row, __rowIndex: startIndex + index }
            }));
            await db.rows.bulkAdd(rowRecords as any);

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
        } catch (err: any) {
            setError(err.message || 'Failed to import data.');
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
            const rowRecords = data.map((row, index) => ({
                sessionId,
                data: { ...row, __rowIndex: index }
            }));
            await db.rows.bulkAdd(rowRecords as any);

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
            const { newRows, updatedRows } = detectSyncChanges(importedData, existingRows as any);

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
                    const newRecords = newRows.map(row => ({ sessionId, data: row }));
                    await db.rows.bulkAdd(newRecords as any);
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
        return (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Review Your Data</h2>
                        <p className="text-secondary text-sm mt-1">We found <span className="text-accent font-bold">{(rowCount).toLocaleString()}</span> recipients in your {importSource === 'sheets' ? 'sheet' : 'file'}.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {importSource === 'sheets' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSyncSheets}
                                disabled={isSyncing}
                                className="text-accent hover:text-accent/80 hover:bg-accent/5 rounded-xl px-4"
                            >
                                {isSyncing ? (
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                ) : (
                                    <RefreshCw size={16} className="mr-2" />
                                )}
                                {isSyncing ? 'Syncing...' : 'Sync Latest'}
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-4">
                            <Trash2 size={16} className="mr-2" />
                            Replace File
                        </Button>
                    </div>
                </div>

                {syncResult && (
                    <div className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border mb-6 animate-in fade-in slide-in-from-top-4 duration-500",
                        syncResult.newRows > 0
                            ? "bg-green-50 text-green-800 border-green-100"
                            : "bg-blue-50 text-blue-800 border-blue-100"
                    )}>
                        <CheckCircle size={20} />
                        <span className="text-sm font-bold tracking-tight">
                            {syncResult.newRows > 0 || syncResult.updatedRows > 0
                                ? `${syncResult.newRows > 0 ? `${syncResult.newRows} new row${syncResult.newRows !== 1 ? 's' : ''}` : ''}${syncResult.newRows > 0 && syncResult.updatedRows > 0 ? ' and ' : ''}${syncResult.updatedRows > 0 ? `${syncResult.updatedRows} row${syncResult.updatedRows !== 1 ? 's' : ''}` : ''} updated!`
                                : 'Already up to date — no new rows found.'
                            }
                        </span>
                    </div>
                )}

                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[2rem] p-8 mb-10 shadow-lg shadow-black/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <FileSpreadsheet size={100} />
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase font-bold tracking-widest text-secondary/60 mb-6 pb-6 border-b border-black/5">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {rowCount} Valid Rows
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {csvHeaders.length} Columns
                        </div>
                        {importSource === 'sheets' && (
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                Google Sheets
                            </div>
                        )}
                    </div>

                    {showWarning && (
                        <div className="flex items-start gap-4 bg-yellow-50 text-yellow-800 p-5 rounded-2xl border border-yellow-100 mb-6">
                            <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold text-sm tracking-tight">Large dataset detected</h4>
                                <p className="text-xs mt-1 opacity-90 leading-relaxed font-medium">Processing {rowCount} certificates may take a bit longer. We suggest doing a quick preview first.</p>
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden border border-black/5 rounded-2xl shadow-inner bg-white/30">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="text-[10px] text-secondary/60 uppercase tracking-widest bg-black/5">
                                    <tr>
                                        <th className="px-6 py-4 w-16 border-r border-black/5">#</th>
                                        {csvHeaders.map((header) => (
                                            <th key={header} className="px-6 py-4 font-bold">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewRows.map((row, idx) => (
                                        <tr key={idx} className="border-b border-black/5 last:border-0 hover:bg-white/40 transition-colors">
                                            <td className="px-6 py-4 text-secondary/40 font-mono text-xs border-r border-black/5">{idx + 1}</td>
                                            {csvHeaders.map((header) => (
                                                <td key={`${idx}-${header}`} className="px-6 py-4 font-medium text-foreground/80 max-w-[200px] truncate whitespace-pre-wrap">
                                                    {row[header]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {rowCount > 5 && (
                            <div className="bg-black/5 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-center text-secondary/60">
                                ...and {rowCount - 5} more recipients
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="flex items-center justify-center gap-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 mb-6 animate-shake">
                        <AlertCircle size={20} />
                        <span className="text-sm font-bold tracking-tight">{error}</span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-secondary italic font-medium">
                        Everything looks good? Let&apos;s map these fields to your design.
                    </p>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 sm:flex-none h-12 rounded-xl">Back</Button>
                        <Button onClick={() => setCurrentStep(3)} className="bg-accent hover:bg-accent/90 text-white flex-1 sm:flex-none h-12 rounded-xl px-8 shadow-lg shadow-accent/20">
                            Confirm & Continue
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // ————————————————————————————————————————
    // UNPARSED STATE
    // ————————————————————————————————————————
    return (
        <div className="max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-10">
                <h2 className="text-3xl font-bold tracking-tight mb-3">Who is the lucky one?</h2>
                <p className="text-secondary text-sm max-w-md mx-auto">
                    Upload a CSV file or import directly from Google Sheets.<br />
                    We&apos;ll match the data to your design in the next step.
                </p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8">
                <button
                    onClick={() => { setImportMode('csv'); setError(null); }}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-all duration-300",
                        importMode === 'csv'
                            ? "bg-accent text-white shadow-lg shadow-accent/20"
                            : "bg-white/50 text-secondary hover:bg-white hover:text-foreground border border-border/40"
                    )}
                >
                    <FileSpreadsheet size={16} />
                    CSV File
                </button>
                <button
                    onClick={() => { setImportMode('sheets'); setError(null); }}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-all duration-300",
                        importMode === 'sheets'
                            ? "bg-accent text-white shadow-lg shadow-accent/20"
                            : "bg-white/50 text-secondary hover:bg-white hover:text-foreground border border-border/40"
                    )}
                >
                    <Link2 size={16} />
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
                            'border-2 border-dashed rounded-[2rem] p-16 transition-all duration-500 cursor-pointer bg-white/50 hover:bg-white hover:shadow-2xl hover:shadow-accent/5 group relative overflow-hidden',
                            dragging
                                ? 'border-accent bg-accent/5 scale-[1.02]'
                                : 'border-border/60',
                            error ? 'border-red-500 bg-red-50' : ''
                        )}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".csv, text/csv"
                            className="hidden"
                            onChange={onFileChange}
                        />

                        <div className="flex flex-col items-center justify-center gap-6 relative z-10">
                            <div className={cn(
                                "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm",
                                dragging ? "bg-accent text-white scale-110 -rotate-3" : "bg-accent/5 text-accent group-hover:bg-accent group-hover:text-white group-hover:-rotate-3"
                            )}>
                                <FileSpreadsheet size={40} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2">
                                <p className="font-bold text-xl tracking-tight">
                                    {dragging ? 'Drop it right here' : 'Drop your CSV here'}
                                </p>
                                <p className="text-sm text-secondary font-medium">
                                    or click to find it on your computer
                                </p>
                            </div>

                            <div className="pt-4 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-1 rounded-md uppercase tracking-widest">Supports Headers</span>
                                <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-1 rounded-md uppercase tracking-widest">UTF-8 Encoded</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                        <Button variant="outline" onClick={() => setCurrentStep(1)} className="h-12 rounded-xl px-8">Go Back</Button>
                        <Button onClick={() => inputRef.current?.click()} variant="secondary" className="h-12 rounded-xl px-8">
                            Choose CSV File
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className="border-2 border-dashed border-border/60 rounded-[2rem] p-10 sm:p-16 bg-white/50 relative overflow-hidden transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-accent/5">
                        <div className="flex flex-col items-center gap-8 relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-accent/5 text-accent flex items-center justify-center shadow-sm">
                                <Link2 size={40} strokeWidth={1.5} />
                            </div>

                            <div className="space-y-2 text-center">
                                <p className="font-bold text-xl tracking-tight">Paste your Google Sheet link</p>
                                <p className="text-sm text-secondary font-medium max-w-sm mx-auto">
                                    The sheet must be shared as <span className="text-accent font-bold">&quot;Anyone with the link&quot;</span>
                                </p>
                            </div>

                            <div className="w-full max-w-lg">
                                <div className={cn(
                                    "flex items-center gap-3 border-2 rounded-xl px-4 py-3 bg-white transition-all duration-300 focus-within:border-accent focus-within:shadow-lg focus-within:shadow-accent/10",
                                    isValidSheetUrl(sheetUrl) ? "border-green-300" : sheetUrl.length > 0 ? "border-amber-300" : "border-border/60"
                                )}>
                                    <Link2 size={18} className="text-secondary/40 shrink-0" />
                                    <input
                                        type="url"
                                        value={sheetUrl}
                                        onChange={(e) => setSheetUrl(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSheetImport(); }}
                                        placeholder="https://docs.google.com/spreadsheets/d/..."
                                        className="w-full bg-transparent outline-none text-sm font-medium text-foreground placeholder:text-secondary/30"
                                        disabled={isImporting}
                                    />
                                    {isValidSheetUrl(sheetUrl) && (
                                        <CheckCircle size={18} className="text-green-500 shrink-0 animate-in fade-in duration-300" />
                                    )}
                                </div>
                            </div>

                            <Button
                                onClick={handleSheetImport}
                                disabled={isImporting || !sheetUrl.trim()}
                                className="h-12 rounded-xl px-10 shadow-lg shadow-accent/20"
                            >
                                {isImporting ? (
                                    <>
                                        <Loader2 size={18} className="mr-2 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <ArrowRight size={18} className="mr-2" />
                                        Import Sheet
                                    </>
                                )}
                            </Button>

                            <div className="pt-2 flex items-center gap-2 opacity-50">
                                <span className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-1 rounded-md uppercase tracking-widest">Read Only</span>
                                <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-1 rounded-md uppercase tracking-widest">Public Sheets</span>
                            </div>
                        </div>
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

            <div className="mt-12 flex justify-center">
                        <Button variant="outline" onClick={() => setCurrentStep(1)} className="h-12 rounded-xl px-8">Go Back</Button>
                    </div>
                </>
            )}

            {error && (
                <div className="mt-8 flex items-center justify-center gap-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 animate-shake">
                    <AlertCircle size={20} />
                    <span className="text-sm font-bold tracking-tight">{error}</span>
                </div>
            )}

            <div className="mt-12 p-5 rounded-2xl border border-dashed border-border flex items-center justify-center gap-8 opacity-40">
                <div className="flex flex-col items-center gap-1">
                    <div className="text-xl font-bold">400</div>
                    <div className="text-[8px] uppercase tracking-widest font-black">Max Rows</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex flex-col items-center gap-1">
                    <div className="text-xl font-bold">100%</div>
                    <div className="text-[8px] uppercase tracking-widest font-black">Private</div>
                </div>
            </div>
        </div>
    );
}
