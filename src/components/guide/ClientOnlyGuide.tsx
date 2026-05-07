'use client';

import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { ChevronDown } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Section Wrapper — applies scroll-reveal animation
   ———————————————————————————————————————————————————— */
export function RevealSection({
    children,
    className = '',
    delay = '',
}: {
    children: React.ReactNode;
    className?: string;
    delay?: string;
}) {
    const ref = useReveal<HTMLDivElement>();
    return (
        <div ref={ref} className={`reveal ${delay} ${className}`}>
            {children}
        </div>
    );
}

/* ————————————————————————————————————————————————————
   FAQ Accordion Item
   ———————————————————————————————————————————————————— */
export function FAQItem({
    question,
    answer,
}: {
    question: string;
    answer: string;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div className="border-b border-border/30 last:border-0">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-4 flex items-start gap-3 hover:text-accent transition-colors text-left"
            >
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{question}</h3>
                </div>
                <ChevronDown 
                    size={16} 
                    className={`text-secondary transition-transform flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>
            
            {isExpanded && (
                <div className="pb-4">
                    <p className="text-secondary text-sm leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
}

/* ————————————————————————————————————————————————————
   Collapsible Troubleshooting Card
   ———————————————————————————————————————————————————— */
export function TroubleshootingCard({
    icon,
    title,
    description,
    solution,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    solution: string;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div className="bg-background border border-border/50 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors text-left"
            >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {icon}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{title}</h4>
                    <p className="text-sm text-secondary/80">{description}</p>
                </div>
                <ChevronDown 
                    size={16} 
                    className={`text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>
            
            {isExpanded && (
                <div className="px-4 pb-4 pt-0">
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
