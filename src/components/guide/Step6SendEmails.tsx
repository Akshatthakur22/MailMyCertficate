'use client';

import { Mail } from 'lucide-react';

export function Step6SendEmails() {
  return (
    <section className="py-16 md:py-20 border-t border-border/50">
      <div className="container-width">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-accent md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Step 6: Send Emails</h2>
                <p className="mt-2 text-secondary text-sm md:text-base">
                  Deliver certificates directly to participants' inboxes with personalized messages via Gmail.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
            {/* Left: Visual */}
            <div className="space-y-4 order-2 md:order-1">
              {/* Email Composer Preview */}
              <div className="bg-muted/10 rounded-xl p-4 md:p-6 border border-border/20">
                <div className="flex items-center gap-2 mb-4">
                  <Mail size={16} className="text-accent" />
                  <div className="font-medium text-foreground text-sm">Email Composer</div>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="text-xs text-secondary/60 font-medium">Subject</label>
                    <div className="mt-2 p-3 bg-background rounded-lg border border-border/20">
                      Your Certificate - {'{event}'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-secondary/60 font-medium">Message</label>
                    <div className="mt-2 p-3 bg-background rounded-lg border border-border/20 text-xs leading-relaxed">
                      Hi {'{name}'},<br />
                      <br />
                      Congratulations! 🎉<br />
                      Thank you for participating.
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs text-secondary/60">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Personalization: On</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sending Progress */}
              <div className="bg-muted/5 rounded-xl p-4 md:p-6 border border-border/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <Mail size={16} className="text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">Sending Progress</div>
                      <div className="text-xs text-secondary/60">Via Gmail</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-accent">47/50</div>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 mb-3">
                  <div
                    className="bg-accent h-2.5 rounded-full transition-all duration-500"
                    style={{ width: '94%' }}
                  />
                </div>
                <div className="text-xs text-secondary">~8 seconds remaining</div>
              </div>
            </div>

            {/* Right: Key Points */}
            <div className="order-1 md:order-2 space-y-4">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="text-accent font-bold text-lg flex-shrink-0">1</div>
                  <div>
                    <div className="font-semibold text-foreground">Personalize the message</div>
                    <div className="text-sm text-secondary">Use {'{name}'}, {'{event}'}, or other placeholders for dynamic content</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-accent font-bold text-lg flex-shrink-0">2</div>
                  <div>
                    <div className="font-semibold text-foreground">Enable attachments</div>
                    <div className="text-sm text-secondary">Certificates attach automatically; check the preview before sending</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-accent font-bold text-lg flex-shrink-0">3</div>
                  <div>
                    <div className="font-semibold text-foreground">Monitor delivery</div>
                    <div className="text-sm text-secondary">Track each email in real-time—green checkmarks show successful sends</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-accent font-bold text-lg flex-shrink-0">4</div>
                  <div>
                    <div className="font-semibold text-foreground">Gmail rate limits</div>
                    <div className="text-sm text-secondary">Typically ~400 emails per batch; wait a few hours to send more</div>
                  </div>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="bg-accent/5 rounded-lg p-4 border-l-2 border-accent/30 mt-6">
                <div className="font-semibold text-foreground text-sm mb-1">What happens next</div>
                <div className="text-sm text-secondary">
                  Once sent, certificates land in inboxes within seconds. Participants can download PDFs directly or access them through email links.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
