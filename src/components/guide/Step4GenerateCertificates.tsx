import { Zap, CheckCircle2, Shield } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Step 4: Generate Certificates
   - One concept: batch generation in browser
   - Simplified visual: progress bar only
   - Emphasize privacy
   - 3-4 points
   ———————————————————————————————————————————————————— */
export function Step4GenerateCertificates() {
    return (
        <section className="py-16 md:py-20 border-t border-border/50">
            <div className="container-width">
                <div className="max-w-5xl">
                    {/* Step Number + Icon */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-accent">4</span>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                Generate certificates
                            </h2>
                        </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-lg text-secondary mb-8 max-w-2xl">
                        Click generate and watch all your personalized PDFs appear in seconds — entirely in your browser, completely private.
                    </p>

                    {/* Main Content: Left (visual) + Right (text) */}
                    <div className="grid md:grid-cols-2 gap-12 mb-12 items-start">
                        {/* Left: Progress Visual */}
                        <div>
                            <div className="bg-background rounded-xl border border-border/30 p-8 space-y-6">
                                {/* Generation In Progress */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                                                <Zap size={16} className="text-accent" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground text-sm">Generating Certificates</div>
                                                <div className="text-xs text-secondary/60">Local processing</div>
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-accent">42/50</div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                        <div className="bg-accent h-3 rounded-full transition-all duration-500" style={{ width: '84%' }}></div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-secondary">
                                        <span>Processing Alice Johnson...</span>
                                        <span>~15 seconds remaining</span>
                                    </div>
                                </div>

                                {/* Success State */}
                                <div className="border-t border-border/30 pt-4">
                                    <div className="flex items-center gap-3 text-sm mb-3">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle2 size={14} className="text-green-600" />
                                        </div>
                                        <span className="text-foreground font-medium">50 certificates ready</span>
                                    </div>
                                    <p className="text-xs text-secondary">All PDFs are stored in your browser. Next: download as ZIP or send by email.</p>
                                </div>

                                {/* Privacy Badge */}
                                <div className="bg-accent/5 border border-accent/15 rounded-lg p-3 flex items-start gap-3">
                                    <Shield size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                    <div className="text-xs text-secondary">
                                        <span className="font-medium text-foreground">100% Private.</span> No data uploaded. All processing happens here.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Instructions */}
                        <div>
                            <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wider">
                                How it works
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed text-sm">
                                        Click the &quot;Generate&quot; button and MailMyCertificate springs into action.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed text-sm">
                                        We combine your template with each participant&apos;s data (name, email, etc.) to create personalized PDFs.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed text-sm">
                                        Processing happens entirely in your browser using Web Workers—no server involvement at all.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed text-sm">
                                        Usually takes 10–30 seconds depending on participant count and your internet speed.
                                    </p>
                                </div>
                            </div>

                            {/* Tip */}
                            <div className="mt-8 pt-6 border-t border-border/30">
                                <h4 className="text-sm font-semibold text-foreground mb-2">💡 Pro tip</h4>
                                <p className="text-sm text-secondary">
                                    You can refresh the page or close your browser. Your progress is saved in local storage and you can resume generation later.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What Happens Next */}
                    <div className="bg-accent/5 border border-accent/15 rounded-lg p-6 flex items-start gap-4">
                        <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 size={14} className="text-accent" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">What happens next</h4>
                            <p className="text-sm text-secondary">
                                Once generation completes, you&apos;ll see your certificates ready to download as a ZIP or send via email. Both options are always available.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
