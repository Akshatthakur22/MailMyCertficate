'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/* ————————————————————————————————————————————————————
   FAQ Accordion Item with proper accessibility
   ———————————————————————————————————————————————————— */
interface FAQItemProps {
    question: string;
    answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const itemId = `faq-${question.replace(/\s+/g, '-').toLowerCase()}`;
    
    return (
        <div className="border-b border-border/20 last:border-0">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-4 flex items-start gap-3 hover:text-accent transition-colors text-left"
                aria-expanded={isExpanded}
                aria-controls={itemId}
                type="button"
            >
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{question}</h3>
                </div>
                <ChevronDown 
                    size={16} 
                    className={`text-secondary transition-transform duration-200 flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>
            
            {isExpanded && (
                <div 
                    id={itemId}
                    className="pb-4"
                    role="region"
                    aria-labelledby={`${itemId}-button`}
                >
                    <p className="text-secondary text-sm leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
}

/* ————————————————————————————————————————————————————
   FAQ Section Container
   ———————————————————————————————————————————————————— */
interface FAQSectionProps {
    faqs: Array<{
        question: string;
        answer: string;
    }>;
    title?: string;
    subtitle?: string;
}

export function FAQSection({ 
    faqs, 
    title = "Quick FAQ", 
    subtitle = "Essential questions answered" 
}: FAQSectionProps) {
    return (
        <section className="py-8 md:py-12 border-t border-border/50">
            <div className="container-width">
                <div className="max-w-4xl">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                            {title}
                        </h2>
                        <p className="text-secondary">{subtitle}</p>
                    </div>
                    
                    <div className="space-y-1 bg-background/50 backdrop-blur rounded-xl border border-border/30">
                        {faqs.map((faq, index) => (
                            <FAQItem 
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
