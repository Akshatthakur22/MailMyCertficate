'use client';

import { ChevronDown, Lightbulb } from 'lucide-react';

interface HelpItem {
  question: string;
  answer: string;
  icon?: React.ReactNode;
  type: 'troubleshooting' | 'faq';
}

interface HelpAnswersSectionProps {
  items: HelpItem[];
  title?: string;
  subtitle?: string;
}

function HelpCard({ question, answer, icon }: HelpItem) {
  const cardId = `help-${question.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <details className="bg-background border border-border/40 rounded-lg overflow-hidden hover:shadow-sm transition-shadow duration-200 group">
      <summary className="w-full p-4 flex items-start gap-3 hover:bg-muted/20 transition-colors text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-accent/5 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1 text-sm">{question}</h3>
        </div>
        <ChevronDown
          size={16}
          className="text-secondary transition-transform duration-200 flex-shrink-0 mt-0.5 group-open:rotate-180"
        />
      </summary>

      <div id={cardId} className="px-4 pb-4 pt-2 border-t border-border/10">
        <div className="text-secondary text-sm leading-relaxed">{answer}</div>
      </div>
    </details>
  );
}

export function HelpAnswersSection({
  items,
  title = 'Help & Answers',
  subtitle = 'Solutions and FAQs in one place',
}: HelpAnswersSectionProps) {
  // Separate troubleshooting and FAQ items
  const troubleshootingItems = items.filter((item) => item.type === 'troubleshooting');
  const faqItems = items.filter((item) => item.type === 'faq');

  return (
    <section className="py-16 md:py-20 border-t border-border/50" aria-labelledby="help-heading">
      <div className="container-width">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <Lightbulb size={20} className="text-accent md:w-6 md:h-6" />
              </div>
              <div>
                <h2 id="help-heading" className="text-2xl md:text-3xl font-bold text-foreground">
                  {title}
                </h2>
                <p className="mt-2 text-secondary text-sm md:text-base">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Troubleshooting Section */}
          {troubleshootingItems.length > 0 && (
            <div className="mb-12">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Common Issues</h3>
                <p className="text-sm text-secondary">
                  Quick solutions for problems you might encounter.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {troubleshootingItems.map((item) => (
                  <HelpCard key={item.question} {...item} />
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {faqItems.length > 0 && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Frequently Asked Questions</h3>
                <p className="text-sm text-secondary">
                  Answers to questions about features, privacy, and limits.
                </p>
              </div>
              <div className="space-y-2">
                {faqItems.map((item) => (
                  <HelpCard key={item.question} {...item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
