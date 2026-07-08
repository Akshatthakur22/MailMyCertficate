import { ArrowRight, Database, FileText, Mail, Monitor, Server, ShieldCheck } from 'lucide-react';

export function ArchitectureDiagram() {
  const browserItems = ['Template image', 'CSV rows', 'Generated PDFs', 'Email queue'];

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border/60 pb-4">
        <ShieldCheck className="h-5 w-5 text-accent" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">Privacy architecture</h3>
          <p className="text-xs text-secondary">A precise view of what stays local and what leaves only when you choose.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
        <Node
          icon={Monitor}
          title="Your browser"
          tone="accent"
          description="Certificate generation runs locally. Work is recoverable through IndexedDB."
        >
          <div className="mt-3 grid gap-2">
            {browserItems.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs text-secondary">
                <Database className="h-3.5 w-3.5 text-accent" />
                {item}
              </div>
            ))}
          </div>
        </Node>

        <Connector label="Only on send" />

        <Node
          icon={Server}
          title="Gmail relay"
          description="The Flask API receives one email request at a time and does not keep a certificate store."
        />

        <Connector label="Gmail API" />

        <Node
          icon={Mail}
          title="Your Gmail"
          description="Messages are delivered from the account you explicitly connect with Google OAuth."
        >
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs text-secondary">
            <FileText className="h-3.5 w-3.5 text-accent" />
            Attachment sent at delivery time
          </div>
        </Node>
      </div>
    </div>
  );
}

function Node({
  icon: Icon,
  title,
  description,
  children,
  tone = 'default',
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children?: React.ReactNode;
  tone?: 'default' | 'accent';
}) {
  return (
    <div className={`rounded-xl border p-4 ${tone === 'accent' ? 'border-accent/20 bg-accent-light/60' : 'border-border bg-background'}`}>
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-accent ring-1 ring-border">
          <Icon className="h-4 w-4" />
        </span>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      <p className="mt-3 text-sm leading-6 text-secondary">{description}</p>
      {children}
    </div>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider text-secondary lg:flex-col">
      <ArrowRight className="h-4 w-4 rotate-90 text-accent lg:rotate-0" />
      <span>{label}</span>
    </div>
  );
}
