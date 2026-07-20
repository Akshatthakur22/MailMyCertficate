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
   Local data management — enhanced guide section
   Simplified, focused, matches Steps 1-6 pattern
   ———————————————————————————————————————————————————— */
export function LocalDataManagementSection() {
  return (
    <section className="py-16 md:py-20 border-t border-border/50" id="local-data">
      <div className="container-width">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <HardDrive size={20} className="text-accent md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Managing Local Data</h2>
                <p className="mt-2 text-secondary text-sm md:text-base">
                  Everything stays in your browser — templates, participant lists, and certificates are never uploaded.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
            {/* Left: Visual Interface Preview */}
            <div className="space-y-4 order-2 md:order-1">
              {/* Data Status Card */}
              <div className="bg-muted/10 rounded-xl p-4 md:p-6 border border-border/20">
                <div className="flex items-center gap-2 mb-4">
                  <Database size={16} className="text-accent" />
                  <div className="font-medium text-foreground text-sm">Local Session Status</div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/20">
                    <span className="text-secondary">Template Image</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-accent font-medium">Saved</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/20">
                    <span className="text-secondary">Participant Data (CSV)</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-accent font-medium">250 rows</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/20">
                    <span className="text-secondary">Generated PDFs</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-accent font-medium">250 files</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Access Points Card */}
              <div className="bg-muted/5 rounded-xl p-4 md:p-6 border border-border/20">
                <div className="flex items-center gap-2 mb-4">
                  <Settings size={16} className="text-accent" />
                  <div className="font-medium text-foreground text-sm">Where to Find Controls</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-background rounded-lg border border-border/20">
                    <div className="text-secondary mb-1">Tool header</div>
                    <div className="text-xs text-accent/70">Click "Your local data" anytime</div>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-border/20">
                    <div className="text-secondary mb-1">/settings page</div>
                    <div className="text-xs text-accent/70">Full session & data controls</div>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-border/20">
                    <div className="text-secondary mb-1">Return visit modal</div>
                    <div className="text-xs text-accent/70">"Previous session found" prompt</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Key Points & Actions */}
            <div className="order-1 md:order-2 space-y-6">
              {/* What's Stored */}
              <div className="space-y-3">
                <div className="font-semibold text-foreground mb-4">What stays in your browser</div>

                <div className="flex gap-3">
                  <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-secondary">
                    <div className="font-medium text-foreground">Certificate template (PNG/JPG)</div>
                    <div className="text-xs mt-0.5">Your design image</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-secondary">
                    <div className="font-medium text-foreground">Participant data (CSV or Sheets)</div>
                    <div className="text-xs mt-0.5">Names, emails, all rows</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-secondary">
                    <div className="font-medium text-foreground">Generated certificates (PDFs)</div>
                    <div className="text-xs mt-0.5">All personalized files</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-secondary">
                    <div className="font-medium text-foreground">Wizard progress & field positions</div>
                    <div className="text-xs mt-0.5">Your current step and layout</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-border/20">
                <div className="font-semibold text-foreground mb-4">Actions you can take</div>

                <div className="space-y-2">
                  <div className="flex gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <Play size={14} className="text-accent flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-medium text-foreground">Continue this batch</div>
                      <div className="text-secondary mt-0.5">Restore where you left off</div>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg bg-muted/50 border border-border/20">
                    <RotateCcw size={14} className="text-secondary flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-medium text-foreground">Start fresh</div>
                      <div className="text-secondary mt-0.5">Delete current batch, begin new event</div>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg bg-rose-50 border border-rose-200">
                    <Trash2 size={14} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-medium text-foreground">Delete everything</div>
                      <div className="text-secondary mt-0.5">Clear all batches (settings page)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Info */}
              <div className="bg-accent/5 rounded-lg p-4 border-l-2 border-accent/30 mt-6">
                <div className="flex gap-2 mb-2">
                  <Shield size={16} className="text-accent flex-shrink-0" />
                  <div className="font-semibold text-foreground text-sm">Never uploaded</div>
                </div>
                <div className="text-sm text-secondary">
                  Your data stays on your device. We only touch Gmail API if you choose email delivery.
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid md:grid-cols-3 gap-4">
            <TipCard
              icon={<Clock size={16} className="text-accent" />}
              title="Auto-expires after 7 days"
              body="Old sessions clean up automatically so data doesn't pile up in your browser."
            />
            <TipCard
              icon={<Download size={16} className="text-accent" />}
              title="Download doesn't delete"
              body="After downloading ZIP, certificates stay saved. Re-download or regenerate anytime."
            />
            <TipCard
              icon={<Mail size={16} className="text-accent" />}
              title="After email delivery"
              body="Optional 60-second prompt to clear session. Keep or remove data as you prefer."
            />
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12 pt-8 border-t border-border/20">
            <Link href="/settings" className={buttonVariants({ variant: 'primary', size: 'md', className: 'gap-2' })}>
              <Settings size={16} />
              Session Settings
            </Link>
            <Link href="/tool" className={buttonVariants({ variant: 'outline', size: 'md', className: 'gap-2' })}>
              Open Tool
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TipCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border/30 bg-background p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      </div>
      <p className="text-xs text-secondary leading-relaxed">{body}</p>
    </div>
  );
}
