import { Upload, CheckCircle2 } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Step 1: Prepare Your Template
   - One focused concept: upload a design file
   - Simplified screenshot: only upload area, no clutter
   - 3-5 action points
   - Optional gotcha: file format/size
   - Clear next step
   ———————————————————————————————————————————————————— */
export function Step1PrepareTemplate() {
    return (
        <section className="py-16 md:py-20 border-t border-border/50">
            <div className="container-width">
                <div className="max-w-5xl">
                    {/* Step Number + Icon */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-accent">1</span>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                Prepare your template
                            </h2>
                        </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-lg text-secondary mb-8 max-w-2xl">
                        Start with a design file — PNG or JPG. This becomes your certificate background. Everything else gets personalized on top.
                    </p>

                    {/* Main Content: Left (text) + Right (visual) */}
                    <div className="grid md:grid-cols-2 gap-12 mb-12 items-start">
                        {/* Left: Instructions & Points */}
                        <div>
                            <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wider">
                                How it works
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed">
                                        Design in Canva, Figma, or any design tool. Leave some white space where names/dates will go.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed">
                                        Export as PNG or JPG. Most design tools have a direct export option.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed">
                                        Keep file size under 5MB. Canva exports are typically 1–2MB by default.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed">
                                        Use high resolution for crisp printing. 1920×1080 or higher works well.
                                    </p>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="mt-8 pt-8 border-t border-border/30">
                                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    ⚠️ Important
                                </h4>
                                <p className="text-sm text-secondary">
                                    <span className="font-medium text-foreground">Don&apos;t use PDF files.</span> Export your design as PNG or JPG. If you have a PDF, convert it to an image first using any online converter.
                                </p>
                            </div>
                        </div>

                        {/* Right: Simplified Screenshot */}
                        <div>
                            <div className="bg-muted/10 rounded-xl border border-border/30 p-8 space-y-6">
                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-border/40 rounded-lg p-8 text-center bg-background hover:bg-muted/5 hover:border-accent/40 transition-all duration-200">
                                    <Upload size={40} className="text-accent/60 mx-auto mb-4" />
                                    <div className="font-medium text-foreground mb-2">Drag your template here</div>
                                    <div className="text-sm text-secondary mb-2">PNG, JPG up to 5MB</div>
                                    <div className="text-xs text-secondary/60">or click to browse</div>
                                </div>

                                {/* File Preview */}
                                <div className="space-y-2">
                                    <div className="text-xs font-medium text-foreground">Once uploaded:</div>
                                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/20">
                                        <div className="w-12 h-16 bg-muted/20 rounded border border-border/30 flex-shrink-0"></div>
                                        <div className="flex-1 text-sm">
                                            <div className="font-medium text-foreground">certificate-design.png</div>
                                            <div className="text-xs text-secondary/60">1.8 MB • 1920×1080</div>
                                            <div className="text-xs text-accent mt-1">✓ Ready to use</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Time estimate */}
                                <div className="text-xs text-secondary/60 italic pt-4 border-t border-border/20">
                                    Usually takes 1–2 minutes
                                </div>
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
                                After uploading, you&apos;ll see a preview of your template. Next step: add your participant data (names, emails, etc.).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
