/* ————————————————————————————————————————————————————
   Visual Workflow Step
   Refined version with subtle animations and premium feel
   ———————————————————————————————————————————————————— */
interface VisualWorkflowStepProps {
    number: number;
    title: string;
    shortDescription: string;
    icon: React.ReactNode;
    visualContent: React.ReactNode;
    isReverse?: boolean;
    tips?: string[];
}

export function VisualWorkflowStep({
    number,
    title,
    shortDescription,
    icon,
    visualContent,
    isReverse = false,
    tips,
}: VisualWorkflowStepProps) {
    return (
        <div className="group relative">
            <div className={`flex flex-col lg:flex-row gap-12 items-center ${isReverse ? 'lg:flex-row-reverse' : ''}`}>
                {/* Visual Content */}
                <div className="flex-1">
                    <div className="relative">
                        <div className="absolute inset-0 bg-muted/20 rounded-2xl transform rotate-1"></div>
                        <div className="relative bg-background border border-border/40 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                    <span className="text-accent font-bold text-lg">{number}</span>
                                </div>
                                <div className="flex-1 h-px bg-border/30"></div>
                            </div>
                            {visualContent}
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/10">
                            {icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
                            <p className="text-secondary leading-relaxed mb-6 text-lg">{shortDescription}</p>
                            
                            {tips && tips.length > 0 && (
                                <div className="space-y-3">
                                    {tips.map((tip, index) => (
                                        <div key={index} className="flex items-start gap-3 text-sm text-secondary/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2 flex-shrink-0"></div>
                                            <span>{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
