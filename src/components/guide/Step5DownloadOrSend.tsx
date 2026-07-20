import { Download, Mail, CheckCircle2 } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Step 5: Download or Send
   - One decision: two clear paths
   - Simplified visuals: option cards + preview
   - Explain when to use each
   ———————————————————————————————————————————————————— */
export function Step5DownloadOrSend() {
    return (
        <section className="py-16 md:py-20 border-t border-border/50 bg-muted/5">
            <div className="container-width">
                <div className="max-w-5xl">
                    {/* Step Number + Icon */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-accent">5</span>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                Download or send
                            </h2>
                        </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-lg text-secondary mb-8 max-w-2xl">
                        Choose your delivery method. You can do both now, or pick one — all certificates remain available for later.
                    </p>

                    {/* Two Clear Paths */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Path 1: Download ZIP */}
                        <div className="border border-border/30 rounded-lg p-6 bg-background hover:border-accent/30 hover:shadow-sm transition-all">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <Download size={24} className="text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground text-lg mb-1">Download ZIP</h3>
                                    <p className="text-sm text-secondary">Manual distribution</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <p className="text-sm text-secondary leading-relaxed">
                                    All 50 certificates bundled into one ZIP file. Perfect for:
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm text-secondary">
                                        <span className="text-accent/60 flex-shrink-0">•</span>
                                        <span>Sharing on email manually</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-secondary">
                                        <span className="text-accent/60 flex-shrink-0">•</span>
                                        <span>Uploading to a shared drive</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-secondary">
                                        <span className="text-accent/60 flex-shrink-0">•</span>
                                        <span>Printing & distributing in person</span>
                                    </li>
                                </ul>
                            </div>

                            {/* File Preview */}
                            <div className="bg-muted/10 rounded-lg p-3 border border-border/20">
                                <div className="text-xs font-mono text-secondary/60 mb-1">Example:</div>
                                <div className="text-sm font-medium text-foreground">certificates-2024.zip</div>
                                <div className="text-xs text-secondary/60">50 files • 24.5 MB</div>
                            </div>
                        </div>

                        {/* Path 2: Send Email */}
                        <div className="border border-border/30 rounded-lg p-6 bg-background hover:border-accent/30 hover:shadow-sm transition-all">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <Mail size={24} className="text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground text-lg mb-1">Send by Email</h3>
                                    <p className="text-sm text-secondary">Automated delivery</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <p className="text-sm text-secondary leading-relaxed">
                                    Each participant gets a personalized email with their certificate attached. Perfect for:
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm text-secondary">
                                        <span className="text-accent/60 flex-shrink-0">•</span>
                                        <span>Large batches (100+ recipients)</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-secondary">
                                        <span className="text-accent/60 flex-shrink-0">•</span>
                                        <span>Personalized messages</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-secondary">
                                        <span className="text-accent/60 flex-shrink-0">•</span>
                                        <span>Tracking delivery</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Requirement Note */}
                            <div className="bg-accent/5 rounded-lg p-3 border border-accent/15">
                                <div className="text-xs font-medium text-foreground mb-1">Requires:</div>
                                <div className="text-xs text-secondary">Gmail account connected via OAuth</div>
                            </div>
                        </div>
                    </div>

                    {/* Both Options Available Callout */}
                    <div className="bg-background border border-border/30 rounded-lg p-6 mb-8">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 size={14} className="text-accent" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground text-sm mb-1">Both always available</h4>
                                <p className="text-sm text-secondary">
                                    Your generated certificates stay available in the browser. Download the ZIP now, email later — or vice versa. Switch between methods anytime.
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
                                If you're sending by email, the next step is setting up Gmail. If downloading, you're done — grab your ZIP and distribute.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
