'use client';

import { Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SessionSafetyNoticeProps {
    variant?: 'warning' | 'info';
    className?: string;
    compact?: boolean;
}

export function SessionSafetyNotice({ variant = 'warning', className, compact = false }: SessionSafetyNoticeProps) {
    if (compact) {
        return (
            <div className={cn(
                "flex items-center gap-2 p-3 rounded-xl border",
                variant === 'warning' 
                    ? "bg-amber-50 border-amber-200 text-amber-800" 
                    : "bg-blue-50 border-blue-200 text-blue-800",
                className
            )}>
                {variant === 'warning' ? (
                    <AlertTriangle size={16} className="shrink-0" />
                ) : (
                    <Shield size={16} className="shrink-0" />
                )}
                <span className="text-xs font-medium">
                    {variant === 'warning' 
                        ? "Keep this tab open during generation" 
                        : "Everything stays safely on your device"
                    }
                </span>
            </div>
        );
    }

    return (
        <div className={cn(
            "flex items-start gap-4 p-6 rounded-2xl border",
            variant === 'warning' 
                ? "bg-amber-50 border-amber-200 text-amber-800" 
                : "bg-blue-50 border-blue-200 text-blue-800",
            className
        )}>
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                variant === 'warning' 
                    ? "bg-amber-100 text-amber-600" 
                    : "bg-blue-100 text-blue-600"
            )}>
                {variant === 'warning' ? (
                    <AlertTriangle size={16} />
                ) : (
                    <Shield size={16} />
                )}
            </div>
            <div>
                <h4 className={cn(
                    "text-sm font-bold mb-1",
                    variant === 'warning' ? "text-amber-800" : "text-blue-800"
                )}>
                    {variant === 'warning' ? "Please keep this tab open" : "Local & Private Processing"}
                </h4>
                <p className={cn(
                    "text-xs leading-relaxed",
                    variant === 'warning' ? "text-amber-700" : "text-blue-700"
                )}>
                    {variant === 'warning' 
                        ? "Avoid refreshing or navigating away until completion. Progress is being saved locally on your device."
                        : "Everything stays safely on your device. No data is uploaded to servers. All processing happens securely in your browser."
                    }
                </p>
            </div>
        </div>
    );
}
