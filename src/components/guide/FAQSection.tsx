import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const itemId = `faq-${question.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <details className="border-b border-border/20 last:border-0 group">
      <summary className="w-full py-4 flex items-start gap-3 hover:text-accent transition-colors text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{question}</h3>
        </div>
        <ChevronDown
          size={16}
          className="text-secondary transition-transform duration-200 flex-shrink-0 mt-1 group-open:rotate-180"
        />
      </summary>
      <div id={itemId} className="pb-4">
        <p className="text-secondary text-sm leading-relaxed">{answer}</p>
      </div>
    </details>
  );
}

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
  title = 'Quick FAQ',
  subtitle = 'Essential questions answered',
}: FAQSectionProps) {
  return (
    <section className="py-8 md:py-12 border-t border-border/50" aria-labelledby="faq-heading">
      <div className="container-width">
        <div className="max-w-4xl">
          <div className="text-center mb-6">
            <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              {title}
            </h2>
            <p className="text-secondary">{subtitle}</p>
          </div>

          <div className="space-y-1 bg-background/50 backdrop-blur rounded-xl border border-border/30">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
