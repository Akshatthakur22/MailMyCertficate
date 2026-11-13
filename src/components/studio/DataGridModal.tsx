'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { db } from '@/core/db/schema';
import type { CSVRow } from '@/types/csv';
import { Button } from '@/components/ui/Button';
import {
    Table,
    Plus,
    Trash2,
    Copy,
    Search,
    X,
    Calculator,
    Check,
    Save,
    Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
    applyComputedColumn,
    type ComputedColumnConfig,
    type FormulaType,
} from '@/core/studio/computedColumns';

interface DataGridModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DataGridModal({ isOpen, onClose }: DataGridModalProps) {
    const sessionId = useAppStore((state) => state.sessionId);
    const csvData = useAppStore((state) => state.csvData);
    const csvHeaders = useAppStore((state) => state.csvHeaders);
    const setCsvData = useAppStore((state) => state.setCsvData);
    const setCsvHeaders = useAppStore((state) => state.setCsvHeaders);

    const [rows, setRows] = useState<CSVRow[]>(csvData);
    const [headers, setHeaders] = useState<string[]>(csvHeaders);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Formula dialog state
    const [showFormulaModal, setShowFormulaModal] = useState(false);
    const [formulaType, setFormulaType] = useState<FormulaType>('serial_number');
    const [newColName, setNewColName] = useState('Certificate_ID');
    const [templateStr, setTemplateStr] = useState('{{First_Name}} {{Last_Name}}');
    const [sourceCol, setSourceCol] = useState(csvHeaders[0] || '');
    const [serialPrefix, setSerialPrefix] = useState('CERT-2026-');

    // Update local state if store changes while open
    useMemo(() => {
        setRows(csvData);
        setHeaders(csvHeaders);
    }, [csvData, csvHeaders]);

    // Cell edit handler
    const handleCellChange = (rowIndex: number, header: string, value: string) => {
        setRows((prev) => {
            const copy = [...prev];
            copy[rowIndex] = { ...copy[rowIndex], [header]: value };
            return copy;
        });
    };

    // Add new row
    const handleAddRow = () => {
        const newRow: CSVRow = {};
        headers.forEach((h) => {
            newRow[h] = '';
        });
        setRows((prev) => [...prev, newRow]);
    };

    // Duplicate row
    const handleDuplicateRow = (index: number) => {
        setRows((prev) => {
            const target = prev[index];
            const duplicate = { ...target };
            const next = [...prev];
            next.splice(index + 1, 0, duplicate);
            return next;
        });
    };

    // Delete row
    const handleDeleteRow = (index: number) => {
        setRows((prev) => prev.filter((_, i) => i !== index));
    };

    // Apply Computed Column
    const handleCreateComputedColumn = () => {
        if (!newColName.trim()) return;

        const config: ComputedColumnConfig = {
            newColumnName: newColName.trim(),
            type: formulaType,
            template: templateStr,
            sourceColumn: sourceCol,
            serialPrefix: serialPrefix,
            serialStartNumber: 1,
            serialPadding: 4,
            dateStyle: 'long',
            currencyCode: 'USD',
        };

        const updatedRows = applyComputedColumn(rows, config);
        const updatedHeaders = headers.includes(config.newColumnName)
            ? headers
            : [...headers, config.newColumnName];

        setRows(updatedRows);
        setHeaders(updatedHeaders);
        setShowFormulaModal(false);
    };

    // Save changes to IndexedDB and Store
    const handleSaveAndClose = async () => {
        setIsSaving(true);
        try {
            // Update store
            setCsvData(rows);
            setCsvHeaders(headers);

            // Re-write to IndexedDB
            await db.rows.where({ sessionId }).delete();
            const idbRows = rows.map((r, i) => ({
                id: i + 1,
                sessionId,
                data: r,
            }));
            await db.rows.bulkAdd(idbRows);

            onClose();
        } catch (err) {
            console.error('Failed to save grid changes:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // Filter rows by search
    const filteredRows = useMemo(() => {
        if (!searchQuery.trim()) return rows;
        const q = searchQuery.toLowerCase();
        return rows.filter((row) =>
            Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(q))
        );
    }, [rows, searchQuery]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <Table size={20} className="text-accent" />
                        <div>
                            <h3 className="font-semibold text-foreground text-base">In-App Recipient Spreadsheet</h3>
                            <p className="text-xs text-secondary">
                                {rows.length} rows · {headers.length} columns · Edit cells directly
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-secondary hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-border/60 bg-muted/20 shrink-0">
                    <div className="flex items-center gap-2">
                        {/* Search input */}
                        <div className="relative">
                            <Search size={14} className="absolute left-2.5 top-2.5 text-secondary" />
                            <input
                                type="text"
                                placeholder="Search recipients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border/80 bg-white focus:outline-none focus:ring-1 focus:ring-accent w-48"
                            />
                        </div>

                        <Button size="sm" variant="outline" onClick={handleAddRow} className="text-xs h-8">
                            <Plus size={14} className="mr-1" />
                            Add Recipient
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowFormulaModal(true)}
                            className="text-xs h-8 text-accent border-accent/30 hover:bg-accent/5"
                        >
                            <Calculator size={14} className="mr-1" />
                            Formula / Computed Column
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-xs h-8">
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSaveAndClose}
                            disabled={isSaving}
                            className="text-xs h-8"
                        >
                            <Save size={14} className="mr-1" />
                            {isSaving ? 'Saving...' : 'Apply & Save'}
                        </Button>
                    </div>
                </div>

                {/* Spreadsheet Grid Body */}
                <div className="flex-1 overflow-auto bg-slate-50">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead className="sticky top-0 bg-white shadow-sm z-10 border-b border-border">
                            <tr>
                                <th className="p-2.5 w-12 text-center text-secondary font-medium border-r border-border/60 bg-slate-50">
                                    #
                                </th>
                                {headers.map((h) => (
                                    <th
                                        key={h}
                                        className="p-2.5 font-semibold text-foreground border-r border-border/60 min-w-[140px]"
                                    >
                                        {h}
                                    </th>
                                ))}
                                <th className="p-2.5 w-20 text-center text-secondary font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 bg-white">
                            {filteredRows.map((row, rIndex) => (
                                <tr key={rIndex} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-2 text-center font-mono text-[11px] text-secondary border-r border-border/60 bg-slate-50/50">
                                        {rIndex + 1}
                                    </td>
                                    {headers.map((h) => (
                                        <td key={h} className="p-1 border-r border-border/60">
                                            <input
                                                type="text"
                                                value={String(row[h] ?? '')}
                                                onChange={(e) => handleCellChange(rIndex, h, e.target.value)}
                                                className="w-full px-2 py-1 text-xs bg-transparent border-0 rounded focus:ring-1 focus:ring-accent focus:bg-white"
                                            />
                                        </td>
                                    ))}
                                    <td className="p-1 text-center">
                                        <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => handleDuplicateRow(rIndex)}
                                                className="p-1 text-secondary hover:text-accent rounded"
                                                title="Duplicate row"
                                            >
                                                <Copy size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteRow(rIndex)}
                                                className="p-1 text-secondary hover:text-red-500 rounded"
                                                title="Delete row"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sub-modal: Formula / Computed Column */}
                {showFormulaModal && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="bg-white rounded-xl shadow-xl border border-border p-6 w-full max-w-md space-y-4 animate-in fade-in">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                                    <Sparkles size={16} className="text-accent" />
                                    Create Computed Column
                                </h4>
                                <button
                                    onClick={() => setShowFormulaModal(false)}
                                    className="text-secondary hover:text-foreground"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* New Column Name */}
                            <div>
                                <label className="block text-xs font-medium text-secondary mb-1">
                                    New Column Header Name:
                                </label>
                                <input
                                    type="text"
                                    value={newColName}
                                    onChange={(e) => setNewColName(e.target.value)}
                                    className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:ring-1 focus:ring-accent"
                                    placeholder="e.g. Full_Name or Certificate_ID"
                                />
                            </div>

                            {/* Formula Type */}
                            <div>
                                <label className="block text-xs font-medium text-secondary mb-1">
                                    Formula Operation:
                                </label>
                                <select
                                    value={formulaType}
                                    onChange={(e) => setFormulaType(e.target.value as FormulaType)}
                                    className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:ring-1 focus:ring-accent bg-white"
                                >
                                    <option value="serial_number">Auto-Increment Serial ID (CERT-2026-0001)</option>
                                    <option value="concatenate">String Concatenation (First + Last Name)</option>
                                    <option value="uppercase">UPPERCASE Transform</option>
                                    <option value="titlecase">Title Case Transform</option>
                                    <option value="date_format">Date Formatter (Month DD, YYYY)</option>
                                    <option value="currency_format">Currency Formatter ($1,250.00)</option>
                                </select>
                            </div>

                            {/* Options based on type */}
                            {formulaType === 'serial_number' && (
                                <div>
                                    <label className="block text-xs font-medium text-secondary mb-1">Prefix:</label>
                                    <input
                                        type="text"
                                        value={serialPrefix}
                                        onChange={(e) => setSerialPrefix(e.target.value)}
                                        className="w-full text-xs px-3 py-2 rounded-lg border border-border"
                                        placeholder="e.g. CERT-2026-"
                                    />
                                </div>
                            )}

                            {formulaType === 'concatenate' && (
                                <div>
                                    <label className="block text-xs font-medium text-secondary mb-1">
                                        Template Pattern:
                                    </label>
                                    <input
                                        type="text"
                                        value={templateStr}
                                        onChange={(e) => setTemplateStr(e.target.value)}
                                        className="w-full text-xs px-3 py-2 rounded-lg border border-border font-mono"
                                        placeholder="{{First_Name}} {{Last_Name}}"
                                    />
                                </div>
                            )}

                            {['uppercase', 'titlecase', 'date_format', 'currency_format'].includes(formulaType) && (
                                <div>
                                    <label className="block text-xs font-medium text-secondary mb-1">
                                        Source Column:
                                    </label>
                                    <select
                                        value={sourceCol}
                                        onChange={(e) => setSourceCol(e.target.value)}
                                        className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-white"
                                    >
                                        {headers.map((h) => (
                                            <option key={h} value={h}>
                                                {h}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFormulaModal(false)}
                                    className="text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleCreateComputedColumn} className="text-xs">
                                    <Check size={14} className="mr-1" />
                                    Generate Column
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
