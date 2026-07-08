'use client';

import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils/cn';

interface SessionStatusProps {
  variant?: 'compact' | 'inline';
  className?: string;
}

/**
 * SessionStatus — Shows what's been completed in current batch
 * Provides confidence that work is persistent and guides user position
 */
export function SessionStatus({ variant = 'compact', className = '' }: SessionStatusProps) {
  const template = useAppStore((state) => state.template);
  const templateDimensions = useAppStore((state) => state.templateDimensions);
  const csvHeaders = useAppStore((state) => state.csvHeaders);
  const fields = useAppStore((state) => state.fields);
  const currentStep = useAppStore((state) => state.currentStep);

  // Determine completion state
  const certificateReady = template && templateDimensions;
  const participantsReady = csvHeaders.length > 0;
  const designReady = fields.length > 0;

  const steps = [
    { name: 'Cert', done: certificateReady, step: 1 },
    { name: 'Data', done: participantsReady, step: 2 },
    { name: 'Design', done: designReady, step: 3 },
    { name: 'Create', done: false, step: 4 },
  ];

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1.5 text-xs', className)}>
        {steps.map((step, idx) => (
          <div key={step.name} className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium transition-colors',
                step.done
                  ? 'bg-green-100 text-green-700'
                  : currentStep === step.step
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-secondary/50'
              )}
            >
              {step.done ? '✓' : step.name}
            </span>
            {idx < steps.length - 1 && (
              <span className="text-secondary/20">·</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Inline variant
  return (
    <div className={cn('text-xs text-secondary', className)}>
      <div className="flex items-center gap-1 flex-wrap">
        {steps.map((step, idx) => (
          <div key={step.name} className="flex items-center gap-1">
            <span
              className={cn(
                'transition-colors',
                step.done
                  ? 'text-green-600'
                  : currentStep === step.step
                    ? 'text-accent'
                    : 'text-secondary/50'
              )}
            >
              {step.done ? '✓' : '○'} {step.name}
            </span>
            {idx < steps.length - 1 && <span className="text-secondary/30">•</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
