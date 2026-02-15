'use client';

import { useState, useRef, type DragEvent, type ChangeEvent, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { parseCSV } from '@/services/csvService';
import { Button } from '@/components/ui/Button';
import { FileSpreadsheet, AlertCircle, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { db } from '@/core/db/schema';

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

    const handleFile = async (file: File) => {
        try {
            setError(null);
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                setError('Please upload a valid CSV file.');
                return;
            }

            const { data, headers } = await parseCSV(file);

            // 1. Store CSV metadata in IDB
            await db.files.put({
                id: `${sessionId}-csv`,
                sessionId,
                type: 'csv-raw',
                blob: file
            });

            // 2. Store individual rows in IDB (Zero UI blocking)
            await db.rows.where({ sessionId }).delete(); // Clear old rows
            const rowRecords = data.map((row) => ({
                sessionId,
                data: row
            }));
            await db.rows.bulkAdd(rowRecords as any);

            // 3. Update Zustand
            setCsvHeaders(headers);
            setCsvData(data); // Kept in memory only for preview on this step
            setParsed(true);
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message || 'Failed to parse CSV.');
            } else {
                setError('Failed to parse CSV.');
            }
        }
    };

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

    const handleReset = () => {
        setCsvHeaders([]);
        setCsvData([]);
        setParsed(false);
        setError(null);
    };

    const previewRows = useMemo(() => csvData.slice(0, 5), [csvData]);
    const rowCount = csvData.length;
    const showWarning = rowCount > 300 && rowCount <= 400;

    if (parsed) {
        return (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Review Your Data</h2>
                        <p className="text-secondary text-sm mt-1">We found <span className="text-accent font-bold">{(rowCount).toLocaleString()}</span> recipients in your file.</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-4">
                        <Trash2 size={16} className="mr-2" />
                        Replace File
                    </Button>
                </div>

                {/* Stats & Warnings */}
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

                    {/* Table Preview */}
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
                                                <td key={`${idx}-${header}`} className="px-6 py-4 font-medium text-foreground/80 max-w-[200px] truncate">
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

    return (
        <div className="max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-10">
                <h2 className="text-3xl font-bold tracking-tight mb-3">Who is the lucky one?</h2>
                <p className="text-secondary text-sm max-w-md mx-auto">
                    Upload your CSV file with names, dates, or custom fields. <br />
                    We&apos;ll match them to your design in the next step.
                </p>
            </div>

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

            {error && (
                <div className="mt-8 flex items-center justify-center gap-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 animate-shake">
                    <AlertCircle size={20} />
                    <span className="text-sm font-bold tracking-tight">{error}</span>
                </div>
            )}

            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="h-12 rounded-xl px-8">Go Back</Button>
                <Button onClick={() => inputRef.current?.click()} variant="secondary" className="h-12 rounded-xl px-8">
                    Choose CSV File
                </Button>
            </div>

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
