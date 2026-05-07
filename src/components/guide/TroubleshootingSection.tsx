'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Troubleshooting Card with proper accessibility
   ———————————————————————————————————————————————————— */
interface TroubleshootingCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    solution: string;
}

function TroubleshootingCard({
    icon,
    title,
    description,
    solution,
}: TroubleshootingCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardId = `trouble-${title.replace(/\s+/g, '-').toLowerCase()}`;
    
    return (
        <div className="bg-background border border-border/40 rounded-xl overflow-hidden hover:shadow-sm transition-shadow duration-200">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-start gap-3 hover:bg-muted/20 transition-colors text-left"
                aria-expanded={isExpanded}
                aria-controls={cardId}
                type="button"
            >
                <div className="w-8 h-8 rounded-lg bg-accent/5 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {icon}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{title}</h4>
                    <p className="text-sm text-secondary/70">{description}</p>
                </div>
                <ChevronDown 
                    size={16} 
                    className={`text-secondary transition-transform duration-200 flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>
            
            {isExpanded && (
                <div 
                    id={cardId}
                    className="px-4 pb-4 pt-0"
                    role="region"
                    aria-labelledby={`${cardId}-button`}
                >
                    <div className="ml-11 p-3 bg-accent/5 rounded-lg border border-accent/10">
                        <p className="text-sm text-secondary">
                            <span className="font-medium text-foreground">Solution:</span> {solution}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ————————————————————————————————————————————————————
   Troubleshooting Section Container
   ———————————————————————————————————————————————————— */
interface TroubleshootingSectionProps {
    items: Array<{
        icon: React.ReactNode;
        title: string;
        description: string;
        solution: string;
    }>;
    title?: string;
    subtitle?: string;
}

export function TroubleshootingSection({ 
    items, 
    title = "Quick Troubleshooting", 
    subtitle = "Common issues and fast solutions" 
}: TroubleshootingSectionProps) {
    return (
        <section className="py-8 md:py-12 border-t border-border/50 bg-muted/5">
            <div className="container-width">
                <div className="max-w-5xl">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                            {title}
                        </h2>
                        <p className="text-secondary">{subtitle}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {items.map((item, index) => (
                            <TroubleshootingCard
                                key={index}
                                icon={item.icon}
                                title={item.title}
                                description={item.description}
                                solution={item.solution}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
