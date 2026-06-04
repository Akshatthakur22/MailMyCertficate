'use client';

import { Shield } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PrivacyNoticeProps {
  className?: string;
  compact?: boolean;
}

export function PrivacyNotice({ className, compact = false }: PrivacyNoticeProps) {
  if (compact) {
    return (
      <p className={cn('text-xs text-secondary leading-relaxed', className)}>
        All certificates and recipient data stay in your browser. Nothing is permanently stored on our servers.
      </p>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900',
        className
      )}
    >
      <Shield className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
      <div>
        <h4 className="text-sm font-semibold text-blue-900">Privacy notice</h4>
        <p className="mt-1 text-xs leading-relaxed text-blue-800">
          All certificates, recipient data, and generated files are stored locally in your browser. No
          certificate data is permanently stored by Mail My Certificate. You can clear session data at any
          time from Settings.
        </p>
      </div>
    </div>
  );
}
