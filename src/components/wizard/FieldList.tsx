'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Tag, User, Mail, Hash, Calendar, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FieldListProps {
  headers: string[];
  onAddField: (header: string) => void;
  fieldsCount: number;
  disabledState?: boolean;
}

function getColumnBadge(header: string) {
  const lower = header.toLowerCase();
  if (lower.includes('name') || lower.includes('student') || lower.includes('recipient')) {
    return { label: 'Name', icon: User, color: 'text-blue-700 bg-blue-50 border-blue-200/60' };
  }
  if (lower.includes('email') || lower.includes('mail')) {
    return { label: 'Email', icon: Mail, color: 'text-amber-700 bg-amber-50 border-amber-200/60' };
  }
  if (lower.includes('id') || lower.includes('serial') || lower.includes('number') || lower.includes('code')) {
    return { label: 'ID', icon: Hash, color: 'text-purple-700 bg-purple-50 border-purple-200/60' };
  }
  if (lower.includes('date') || lower.includes('time') || lower.includes('issued')) {
    return { label: 'Date', icon: Calendar, color: 'text-emerald-700 bg-emerald-50 border-emerald-200/60' };
  }
  if (lower.includes('photo') || lower.includes('image') || lower.includes('avatar') || lower.includes('pic')) {
    return { label: 'Photo', icon: ImageIcon, color: 'text-rose-700 bg-rose-50 border-rose-200/60' };
  }
  return { label: 'Column', icon: Tag, color: 'text-secondary/80 bg-muted/70 border-border/60' };
}

/**
 * FieldList — Left sidebar showing available fields to add
 * Highlights first recommended field when no fields exist yet
 */
export function FieldList({
  headers,
  onAddField,
  fieldsCount,
  disabledState = false,
}: FieldListProps) {
  const [search, setSearch] = useState('');

  const filteredHeaders = useMemo(() => {
    if (!search.trim()) return headers;
    return headers.filter((h) => h.toLowerCase().includes(search.toLowerCase().trim()));
  }, [headers, search]);

  if (headers.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-secondary/60 leading-relaxed">
        No columns found. Go back to upload a CSV.
      </div>
    );
  }

  return (
    <div className="space-y-2.5 p-3">
      {/* Search Filter if multiple columns */}
      {headers.length > 5 && (
        <div className="relative mb-2">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search columns…"
            className="w-full text-xs pl-7 pr-2.5 py-1.5 rounded-lg border border-border/80 bg-white placeholder:text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      )}

      <div className="space-y-1.5">
        {filteredHeaders.map((header, index) => {
          const isFirstField = index === 0 && fieldsCount === 0;
          const badge = getColumnBadge(header);
          const Icon = badge.icon;

          return (
            <button
              key={header}
              onClick={() => onAddField(header)}
              disabled={disabledState}
              className={cn(
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border transition-all text-left group',
                isFirstField
                  ? 'border-accent bg-accent/5 hover:bg-accent/10 shadow-xs ring-1 ring-accent/20'
                  : 'border-border/60 bg-white hover:border-accent hover:bg-muted/30 hover:shadow-xs',
                disabledState && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center h-6 w-6 rounded-md text-xs font-semibold shrink-0 transition-colors',
                  isFirstField
                    ? 'bg-accent text-white'
                    : 'bg-muted/80 text-secondary group-hover:bg-accent group-hover:text-white'
                )}
              >
                <Plus size={13} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-xs font-medium truncate',
                    isFirstField ? 'text-accent font-semibold' : 'text-foreground'
                  )}
                >
                  {header}
                </p>
              </div>

              {/* Tag / Category Badge */}
              <div className={cn('text-[9px] font-semibold px-1.5 py-0.5 rounded border shrink-0 flex items-center gap-1', badge.color)}>
                <Icon size={10} />
                <span>{badge.label}</span>
              </div>
            </button>
          );
        })}

        {filteredHeaders.length === 0 && (
          <p className="text-xs text-secondary/60 text-center py-4">No matching columns found.</p>
        )}
      </div>

      {fieldsCount === 0 && (
        <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/60 text-[11px] text-emerald-900 leading-relaxed">
          <p className="font-semibold flex items-center gap-1">✨ Quick Tip</p>
          <p className="mt-0.5 text-emerald-800/90">
            Click any column above to place it on your certificate, then drag to align.
          </p>
        </div>
      )}
    </div>
  );
}
