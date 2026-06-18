import { ChevronDown } from 'lucide-react';

interface TroubleshootingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  solution: string;
}

function TroubleshootingCard({ icon, title, description, solution }: TroubleshootingCardProps) {
  const cardId = `trouble-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <details className="bg-background border border-border/40 rounded-xl overflow-hidden hover:shadow-sm transition-shadow duration-200 group">
      <summary className="w-full p-4 flex items-start gap-3 hover:bg-muted/20 transition-colors text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="w-8 h-8 rounded-lg bg-accent/5 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-secondary/70">{description}</p>
        </div>
        <ChevronDown
          size={16}
          className="text-secondary transition-transform duration-200 flex-shrink-0 mt-1 group-open:rotate-180"
        />
      </summary>

      <div id={cardId} className="px-4 pb-4 pt-0">
        <div className="ml-11 p-3 bg-accent/5 rounded-lg border border-accent/10">
          <p className="text-sm text-secondary">
            <span className="font-medium text-foreground">Solution:</span> {solution}
          </p>
        </div>
      </div>
    </details>
  );
}

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
  title = 'Quick Troubleshooting',
  subtitle = 'Common issues and fast solutions',
}: TroubleshootingSectionProps) {
  return (
    <section
      className="py-8 md:py-12 border-t border-border/50 bg-muted/5"
      aria-labelledby="troubleshooting-heading"
    >
      <div className="container-width">
        <div className="max-w-5xl">
          <div className="text-center mb-6">
            <h2 id="troubleshooting-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              {title}
            </h2>
            <p className="text-secondary">{subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item) => (
              <TroubleshootingCard
                key={item.title}
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
