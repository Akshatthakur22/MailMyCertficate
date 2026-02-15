import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StepIndicatorProps {
    currentStep: number;
    steps: string[];
    onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, steps, onStepClick }: StepIndicatorProps) {
    return (
        <div className="w-full max-w-2xl mx-auto mb-10 select-none">
            <div className="flex items-center justify-between relative">
                {/* Background Line */}
                <div className="absolute left-6 right-6 top-5 h-[2px] bg-border/40 -z-10" />

                {/* Progress Line */}
                <div
                    className="absolute left-6 top-5 h-[2px] bg-accent -z-10 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
                    style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 48px)` }}
                />

                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;
                    const isClickable = stepNumber < currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center relative">
                            <button
                                onClick={() => isClickable && onStepClick?.(stepNumber)}
                                disabled={!isClickable}
                                className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 relative z-10",
                                    isActive ? "border-accent bg-accent text-white scale-125 shadow-xl shadow-accent/20 rotate-3" :
                                        isCompleted ? "border-accent/30 bg-accent text-white cursor-pointer hover:scale-105" :
                                            "border-border/60 bg-white text-secondary/40 cursor-default"
                                )}
                            >
                                {isCompleted ? <Check size={14} strokeWidth={3} /> : stepNumber}
                            </button>
                            <div className="absolute top-12 flex flex-col items-center whitespace-nowrap">
                                <span
                                    className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest transition-all duration-500",
                                        isActive ? "text-accent" :
                                            isCompleted ? "text-secondary" :
                                                "text-secondary/30"
                                    )}
                                >
                                    Step {stepNumber}
                                </span>
                                <span
                                    className={cn(
                                        "text-xs font-semibold transition-all duration-500",
                                        isActive ? "text-foreground opacity-100" :
                                            isCompleted ? "text-secondary opacity-70" :
                                                "text-secondary/20"
                                    )}
                                >
                                    {label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
