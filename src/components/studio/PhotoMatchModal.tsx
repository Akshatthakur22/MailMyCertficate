'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { db } from '@/core/db/schema';
import { Button } from '@/components/ui/Button';
import { Upload, CheckCircle, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { matchPhotosToRows, type PhotoAsset } from '@/core/studio/photoMatcher';

interface PhotoMatchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PhotoMatchModal({ isOpen, onClose }: PhotoMatchModalProps) {
    const sessionId = useAppStore((state) => state.sessionId);
    const csvData = useAppStore((state) => state.csvData);
    const csvHeaders = useAppStore((state) => state.csvHeaders);
    const setCsvData = useAppStore((state) => state.setCsvData);
    const setCsvHeaders = useAppStore((state) => state.setCsvHeaders);

    const [photos, setPhotos] = useState<PhotoAsset[]>([]);
    const [matchingSummary, setMatchingSummary] = useState<{
        matched: number;
        unmatched: number;
    } | null>(null);
    const [isApplying, setIsApplying] = useState(false);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const assetList: PhotoAsset[] = [];
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) return;

            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const dataUrl = URL.createObjectURL(file);

            assetList.push({
                id: `asset-${Math.random().toString(36).substring(2, 9)}`,
                fileName: file.name,
                baseName,
                file,
                dataUrl,
            });
        });

        setPhotos(assetList);

        // Run auto-matching against current rows
        const rowObjects = csvData.map((d, index) => ({ id: index + 1, data: d }));
        const matchResult = matchPhotosToRows(assetList, rowObjects);

        setMatchingSummary({
            matched: matchResult.matchedCount,
            unmatched: matchResult.unmatchedCount,
        });
    };

    const handleApplyMatches = async () => {
        if (photos.length === 0) return;
        setIsApplying(true);

        try {
            const rowObjects = csvData.map((d, index) => ({ id: index + 1, data: d }));
            const matchResult = matchPhotosToRows(photos, rowObjects);

            // Convert photo files into data URLs for persistent rendering
            const photoDataUrlMap = new Map<string, string>();
            for (const photo of photos) {
                const reader = new FileReader();
                const dataUrlPromise = new Promise<string>((resolve) => {
                    reader.onload = (e) => resolve(e.target?.result as string);
                });
                reader.readAsDataURL(photo.file);
                const dataUrl = await dataUrlPromise;
                photoDataUrlMap.set(photo.id, dataUrl);
            }

            // Update CSV Rows with new "Photo" column
            const photoColName = csvHeaders.includes('Photo') ? 'Photo_Asset' : 'Photo';

            const updatedData = csvData.map((row, index) => {
                const rowId = index + 1;
                const matchedAsset = matchResult.rowMatches.get(rowId);
                const photoSrc = matchedAsset ? photoDataUrlMap.get(matchedAsset.id) || '' : '';
                return {
                    ...row,
                    [photoColName]: photoSrc,
                };
            });

            const updatedHeaders = [...csvHeaders, photoColName];

            setCsvData(updatedData);
            setCsvHeaders(updatedHeaders);

            // Update IndexedDB
            await db.rows.where({ sessionId }).delete();
            await db.rows.bulkAdd(
                updatedData.map((d, i) => ({
                    id: i + 1,
                    sessionId,
                    data: d,
                }))
            );

            onClose();
        } catch (err) {
            console.error('Failed to apply photos:', err);
        } finally {
            setIsApplying(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-lg p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                        <ImageIcon size={18} className="text-accent" />
                        <h3 className="font-semibold text-foreground text-base">Bulk Photo Auto-Matcher</h3>
                    </div>
                    <button onClick={onClose} className="text-secondary hover:text-foreground">
                        <X size={18} />
                    </button>
                </div>

                <p className="text-xs text-secondary leading-relaxed">
                    Upload recipient portraits, IDs, or avatar badges. The engine automatically matches photos to
                    spreadsheet rows by filename (e.g.{' '}
                    <code className="bg-muted px-1 py-0.5 rounded text-[11px]">101.jpg</code> or{' '}
                    <code className="bg-muted px-1 py-0.5 rounded text-[11px]">john_doe.png</code>).
                </p>

                {/* Upload Zone */}
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border hover:border-accent rounded-xl cursor-pointer bg-slate-50/50 transition-colors">
                    <Upload size={24} className="text-secondary mb-2" />
                    <span className="text-xs font-semibold text-foreground">
                        {photos.length > 0 ? `${photos.length} photos selected` : 'Select or drop bulk photos'}
                    </span>
                    <span className="text-[11px] text-secondary mt-0.5">JPG, PNG, WebP (select multiple files)</span>
                    <input
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => handleFiles(e.target.files)}
                        className="hidden"
                    />
                </label>

                {/* Matching Summary */}
                {matchingSummary && (
                    <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-secondary flex items-center gap-1.5">
                                <CheckCircle size={14} className="text-emerald-500" />
                                Automatically Matched:
                            </span>
                            <span className="font-semibold text-emerald-600">{matchingSummary.matched} rows</span>
                        </div>
                        {matchingSummary.unmatched > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-secondary flex items-center gap-1.5">
                                    <AlertCircle size={14} className="text-amber-500" />
                                    Unmatched Photos:
                                </span>
                                <span className="font-semibold text-amber-600">{matchingSummary.unmatched} files</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                    <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        disabled={photos.length === 0 || isApplying}
                        onClick={handleApplyMatches}
                        className="text-xs"
                    >
                        {isApplying ? 'Applying...' : 'Apply Photos to Recipients'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
