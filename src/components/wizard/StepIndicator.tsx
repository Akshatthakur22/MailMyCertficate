import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StepIndicatorProps {
    currentStep: number;
    steps: string[];
    onStepClick?: (step: number) => void;
    /** Minimal single-line progress for the editor step */
    variant?: 'default' | 'inline';
}

export function StepIndicator({ currentStep, steps, onStepClick, variant = 'default' }: StepIndicatorProps) {
    const currentLabel = steps[currentStep - 1];

    if (variant === 'inline') {
        return (
            <div className="flex items-center gap-3 select-none" aria-label="Progress">
                <p className="text-sm font-medium text-foreground shrink-0">
                    Step {currentStep} · {currentLabel}
                </p>
                <div className="flex items-center gap-1 flex-1 min-w-0 max-w-xs">
                    {steps.map((label, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = stepNumber < currentStep;
                        const isActive = stepNumber === currentStep;

                        return (
                            <div key={label} className="flex items-center flex-1 last:flex-none">
                                <div
                                    className={cn(
                                        'h-1.5 flex-1 rounded-full min-w-[0.5rem]',
                                        isCompleted || isActive ? 'bg-accent' : 'bg-border',
                                        isActive && 'opacity-100',
                                        !isActive && !isCompleted && 'opacity-60',
                                    )}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full select-none" aria-label="Progress">
            <div className="flex items-center justify-between gap-4 mb-5">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-secondary">
                        Step {currentStep} of {steps.length}
                    </p>
                    <h1 className="text-xl font-semibold text-foreground tracking-tight truncate">
                        {currentLabel}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-1">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;
                    const isClickable = stepNumber < currentStep;

                    return (
                        <div key={label} className="flex items-center flex-1 last:flex-none min-w-0">
                            <button
                                type="button"
                                aria-label={label}
                                aria-current={isActive ? 'step' : undefined}
                                onClick={() => isClickable && onStepClick?.(stepNumber)}
                                disabled={!isClickable}
                                title={label}
                                className={cn(
                                    'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                                    isActive && 'bg-accent text-white ring-4 ring-accent/10',
                                    isCompleted && 'bg-accent text-white cursor-pointer hover:opacity-90',
                                    !isActive && !isCompleted && 'bg-muted text-secondary/50',
                                )}
                            >
                                {isCompleted ? <Check size={12} strokeWidth={2.5} /> : stepNumber}
                            </button>
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'h-0.5 flex-1 mx-1 rounded-full',
                                        stepNumber < currentStep ? 'bg-accent' : 'bg-border',
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
