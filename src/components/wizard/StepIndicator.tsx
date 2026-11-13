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
            <div className="flex items-center justify-between gap-3 select-none w-full py-0.5" aria-label="Progress">
                {/* Clickable Step Breadcrumbs */}
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
                    {steps.map((label, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = stepNumber < currentStep;
                        const isActive = stepNumber === currentStep;
                        const isClickable = stepNumber < currentStep;

                        return (
                            <div key={label} className="flex items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => isClickable && onStepClick?.(stepNumber)}
                                    disabled={!isClickable}
                                    className={cn(
                                        'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                                        isActive && 'bg-accent/10 text-accent ring-1 ring-accent/30 font-semibold shadow-xs',
                                        isCompleted && 'text-foreground/80 hover:bg-muted/80 cursor-pointer',
                                        !isActive && !isCompleted && 'text-secondary/50 cursor-not-allowed',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                                            isActive && 'bg-accent text-white',
                                            isCompleted && 'bg-emerald-600 text-white',
                                            !isActive && !isCompleted && 'bg-muted-foreground/20 text-secondary/60',
                                        )}
                                    >
                                        {isCompleted ? <Check size={10} strokeWidth={3} /> : stepNumber}
                                    </span>
                                    <span>{label}</span>
                                </button>
                                {index < steps.length - 1 && (
                                    <span className="text-secondary/40 text-[11px] font-mono">/</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Status indicator pill */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-medium text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Studio Ready · Auto-Saved
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full select-none" aria-label="Progress">
            <div className="flex items-center justify-between gap-4 mb-5">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[11px] font-semibold tracking-wide uppercase">
                            Step {currentStep} of {steps.length}
                        </span>
                        <span className="text-xs text-secondary/70">· In-browser workflow</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight truncate">
                        {currentLabel}
                    </h1>
                    {/* Context subtitle based on step */}
                    <p className="text-xs sm:text-sm text-secondary mt-1">
                        {currentStep === 1 && "Upload your certificate design (PNG or JPEG, up to 5 MB)"}
                        {currentStep === 2 && "Upload your participant list or connect to Google Sheets"}
                        {currentStep === 3 && "Drag and configure dynamic names, QR codes, signatures, and photos"}
                        {currentStep === 4 && "Batch generate and download print-ready PDFs with verification"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-xl border border-border/40">
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
                                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all w-full justify-start',
                                    isActive && 'bg-white text-accent font-semibold shadow-xs ring-1 ring-border/60',
                                    isCompleted && 'text-foreground hover:bg-white/60 cursor-pointer',
                                    !isActive && !isCompleted && 'text-secondary/50',
                                )}
                            >
                                <span
                                    className={cn(
                                        'shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                                        isActive && 'bg-accent text-white ring-2 ring-accent/20',
                                        isCompleted && 'bg-emerald-600 text-white',
                                        !isActive && !isCompleted && 'bg-muted-foreground/20 text-secondary/60',
                                    )}
                                >
                                    {isCompleted ? <Check size={11} strokeWidth={2.5} /> : stepNumber}
                                </span>
                                <span className="hidden md:inline truncate">{label}</span>
                            </button>
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'h-0.5 w-2 sm:w-3 shrink-0 mx-0.5 rounded-full',
                                        stepNumber < currentStep ? 'bg-emerald-500' : 'bg-border/60',
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
