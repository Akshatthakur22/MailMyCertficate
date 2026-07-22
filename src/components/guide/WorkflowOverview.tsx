import { Upload, FileSpreadsheet, Palette, Zap, Mail, ArrowRight } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Complete Workflow Overview
   - Single, comprehensive visual explanation
   - 5 steps with labels and descriptions
   - This is THE ONLY place that shows all steps at once
   ———————————————————————————————————————————————————— */
export function WorkflowOverview() {
    const steps = [
        {
            icon: Upload,
            title: 'Upload',
            description: 'Your certificate template (PNG/JPG)',
        },
        {
            icon: FileSpreadsheet,
            title: 'Import',
            description: 'Participant list (CSV or Google Sheets)',
        },
        {
            icon: Palette,
            title: 'Customize',
            description: 'Drag fields to the right positions',
        },
        {
            icon: Zap,
            title: 'Generate',
            description: '50+ certificates in your browser',
        },
        {
            icon: Mail,
            title: 'Send',
            description: 'Download ZIP or email directly',
        },
    ];

    return (
        <section className="py-12 md:py-16 border-t border-border/50 bg-muted/5">
            <div className="container-width">
                <div className="max-w-5xl">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                            Here&apos;s how it works
                        </h2>
                        <p className="text-secondary">
                            Five simple steps. Most organizers finish in under 10 minutes.
                        </p>
                    </div>

                    {/* Workflow Timeline */}
                    <div className="relative">
                        {/* Desktop: Horizontal Flow */}
                        <div className="hidden md:block">
                            <div className="flex items-stretch gap-3">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isLast = index === steps.length - 1;

                                    return (
                                        <div key={index} className="flex items-stretch flex-1 gap-3">
                                            {/* Step Card */}
                                            <div className="flex-1 border border-border/30 rounded-lg p-5 bg-background hover:border-accent/40 hover:bg-muted/10 transition-all duration-200 flex flex-col">
                                                {/* Step Number */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-bold text-accent">{index + 1}</span>
                                                    </div>
                                                    <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
                                                        <Icon size={16} className="text-accent" />
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <h3 className="font-semibold text-foreground mb-2 text-sm">
                                                    {step.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="text-xs text-secondary leading-relaxed flex-1">
                                                    {step.description}
                                                </p>

                                                {/* Time Estimate */}
                                                <div className="mt-3 text-xs text-accent/60 font-medium">
                                                    {index === 0 && '1–2 min'}
                                                    {index === 1 && '1 min'}
                                                    {index === 2 && '2–5 min'}
                                                    {index === 3 && '1–2 min'}
                                                    {index === 4 && '2–3 min'}
                                                </div>
                                            </div>

                                            {/* Arrow Between Steps */}
                                            {!isLast && (
                                                <div className="flex items-center justify-center -mx-1.5 z-10">
                                                    <div className="w-6 h-6 rounded-full bg-background border border-border/30 flex items-center justify-center">
                                                        <ArrowRight size={14} className="text-border/60" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mobile: Vertical Stack */}
                        <div className="md:hidden space-y-3">
                            {steps.map((step, index) => {
                                const Icon = step.icon;

                                return (
                                    <div key={index}>
                                        <div className="border border-border/30 rounded-lg p-5 bg-background">
                                            {/* Step Number + Icon */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-bold text-accent">{index + 1}</span>
                                                </div>
                                                <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
                                                    <Icon size={16} className="text-accent" />
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-semibold text-foreground mb-2 text-sm">
                                                {step.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-xs text-secondary mb-2">
                                                {step.description}
                                            </p>

                                            {/* Time */}
                                            <div className="text-xs text-accent/60 font-medium">
                                                {index === 0 && '1–2 min'}
                                                {index === 1 && '1 min'}
                                                {index === 2 && '2–5 min'}
                                                {index === 3 && '1–2 min'}
                                                {index === 4 && '2–3 min'}
                                            </div>
                                        </div>

                                        {/* Mobile Arrow */}
                                        {index < steps.length - 1 && (
                                            <div className="flex justify-center py-2">
                                                <div className="w-px h-4 bg-border/30"></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Total Time */}
                    <div className="mt-10 text-center text-sm text-secondary/60">
                        <span className="inline-flex items-center gap-2">
                            Total time: <span className="font-medium text-foreground">5–15 minutes</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
