import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Database,
  Download,
  HardDrive,
  Mail,
  Play,
  RotateCcw,
  Settings,
  Shield,
  Trash2,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';

/* ————————————————————————————————————————————————————
   Local data management — guide section
   ———————————————————————————————————————————————————— */
export function LocalDataManagementSection() {
  return (
    <section className="py-16 md:py-20 border-t border-border/50 bg-muted/5" id="local-data">
      <div className="container-width">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/15 mb-4">
              <Database size={14} className="text-accent" />
              <span className="text-sm font-medium text-accent">Your browser, your data</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Managing local data
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
              Templates, participant lists, and generated certificates stay on your device — not on our
              servers. Here is how to continue a batch, start fresh, or clear everything when you are done.
            </p>
          </div>

          <div className="bg-background rounded-2xl border border-border/40 shadow-md overflow-hidden mb-8">
            <div className="p-6 md:p-8 border-b border-border/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center shrink-0">
                  <HardDrive size={22} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">What stays in your browser</h3>
                  <p className="text-sm text-secondary leading-relaxed">
                    Each certificate batch is saved as a local session. That includes your template image,
                    CSV or Sheets import, field positions, generated PDFs, and email delivery progress.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-border/30">
              {[
                'Certificate template (PNG/JPG)',
                'Participant rows (CSV / Sheets)',
                'Generated PDF certificates',
                'Wizard step & field layout',
                'Email queue & delivery reports',
              ].map((item) => (
                <div key={item} className="bg-background px-5 py-4 flex items-center gap-2 text-sm">
                  <CheckCircle size={14} className="text-accent shrink-0" />
                  <span className="text-secondary">{item}</span>
                </div>
              ))}
              <div className="bg-background px-5 py-4 flex items-center gap-2 text-sm sm:col-span-2 md:col-span-1">
                <Shield size={14} className="text-accent shrink-0" />
                <span className="text-secondary">Nothing uploaded for storage</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-foreground mb-2 text-center md:text-left">
              Where to manage your data
            </h3>
            <p className="text-sm text-secondary mb-6 text-center md:text-left">
              You do not need to dig through browser settings. Use these built-in controls anytime.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <LocationCard
                title="Your local data"
                badge="Tool & Email"
                description='Click the "Your local data" button in the top bar while using the tool or email pages.'
                mock={
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium shadow-sm">
                    <Database size={12} className="text-accent" />
                    Your local data
                  </div>
                }
              />
              <LocationCard
                title="Session & privacy"
                badge="Full control"
                description="Open settings for session details, start a new batch, or delete all local app data."
                mock={
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 text-xs font-medium text-accent hover:underline"
                  >
                    <Settings size={12} />
                    /settings
                  </Link>
                }
              />
              <LocationCard
                title="Return visit"
                badge="Automatic"
                description='When you reopen the site, you may see "Previous session found" — continue or start new from there.'
                mock={
                  <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-[10px] text-secondary text-left w-full">
                    Previous session found
                    <div className="mt-1 flex gap-1">
                      <span className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">Continue</span>
                      <span className="rounded bg-muted px-1.5 py-0.5">Start new</span>
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border/40 shadow-md overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-border/30 bg-muted/10">
              <h3 className="font-semibold text-foreground">Choose the right action</h3>
              <p className="text-xs text-secondary mt-1">
                Each option does something different — pick what matches your goal.
              </p>
            </div>
            <div className="divide-y divide-border/30">
              <ActionExplain
                icon={Play}
                title="Continue this batch"
                when="You closed the tab and want to pick up where you left off."
                result="Keeps template, CSV, certificates, and progress. Restores your wizard step."
                tone="accent"
              />
              <ActionExplain
                icon={RotateCcw}
                title="Delete data & start fresh"
                when="This event is done and you are preparing a new workshop or cohort."
                result="Removes the current batch from this browser and opens a blank workflow (step 1)."
                tone="default"
              />
              <ActionExplain
                icon={Trash2}
                title="Delete all local data"
                when="You want a completely clean slate in this browser (settings page only)."
                result="Clears every batch and wizard state. Gmail sign-in may be kept so you do not reconnect."
                tone="danger"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <TipCard
              icon={<Download size={16} className="text-accent" />}
              title="After downloading ZIP"
              body="Your certificates stay saved locally. You can re-download, regenerate, or start a new batch from the success panel — we never auto-delete after ZIP."
            />
            <TipCard
              icon={<Mail size={16} className="text-accent" />}
              title="After sending all emails"
              body="You may see an optional 60-second countdown to clear the session. Tap Keep session to retain data, or Clear now to remove it immediately."
            />
            <TipCard
              icon={<Clock size={16} className="text-accent" />}
              title="Automatic expiry"
              body="Sessions older than 7 days are removed on their own so old certificate data does not pile up in your browser."
              className="md:col-span-2"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/settings" className={buttonVariants({ variant: 'primary', size: 'md', className: 'gap-2' })}>
              <Settings size={16} />
              Open session settings
            </Link>
            <Link href="/tool" className={buttonVariants({ variant: 'outline', size: 'md', className: 'gap-2' })}>
              Open tool
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function LocationCard({
  title,
  badge,
  description,
  mock,
}: {
  title: string;
  badge: string;
  description: string;
  mock: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-background p-5 shadow-sm hover:border-accent/20 transition-colors">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
        <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/5 border border-accent/15 px-2 py-0.5 rounded-full shrink-0">
          {badge}
        </span>
      </div>
      <div className="mb-4 min-h-[2.5rem] flex items-center">{mock}</div>
      <p className="text-xs text-secondary leading-relaxed">{description}</p>
    </div>
  );
}

function ActionExplain({
  icon: Icon,
  title,
  when,
  result,
  tone,
}: {
  icon: typeof Play;
  title: string;
  when: string;
  result: string;
  tone: 'accent' | 'default' | 'danger';
}) {
  const iconClass =
    tone === 'danger'
      ? 'text-rose-500 bg-rose-50 border-rose-200'
      : tone === 'accent'
        ? 'text-accent bg-accent/5 border-accent/20'
        : 'text-secondary bg-muted border-border';

  return (
    <div className="flex gap-4 p-5 md:p-6">
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${iconClass}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <h4 className="font-semibold text-foreground text-sm mb-1">{title}</h4>
        <p className="text-xs text-secondary mb-2">
          <span className="font-medium text-foreground/80">When: </span>
          {when}
        </p>
        <p className="text-xs text-secondary">
          <span className="font-medium text-foreground/80">Result: </span>
          {result}
        </p>
      </div>
    </div>
  );
}

function TipCard({
  icon,
  title,
  body,
  className = '',
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border/30 bg-background p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      </div>
      <p className="text-xs text-secondary leading-relaxed">{body}</p>
    </div>
  );
}
