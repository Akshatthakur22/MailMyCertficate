import { Palette, CheckCircle2, Move } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Step 3: Customize Field Placement
   - One focused concept: drag fields onto template
   - SIMPLIFIED screenshot: ONE field being dragged (not 10 UI elements)
   - Numbered callouts (1, 2, 3) for clarity
   - 3-4 action points
   - Clear next step
   ———————————————————————————————————————————————————— */
export function Step3CustomizeFields() {
    return (
        <section className="py-16 md:py-20 border-t border-border/50 bg-muted/5">
            <div className="container-width">
                <div className="max-w-5xl">
                    {/* Step Number + Icon */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-accent">3</span>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                Customize field placement
                            </h2>
                        </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-lg text-secondary mb-8 max-w-2xl">
                        Position your name, email, date, and any other fields exactly where you want them on the certificate.
                    </p>

                    {/* Main Content: Full width visual + below text */}
                    <div className="space-y-10">
                        {/* Simplified Screenshot: ONE FIELD BEING DRAGGED */}
                        <div className="bg-background rounded-xl border border-border/30 overflow-hidden">
                            {/* Canvas Area */}
                            <div className="aspect-video bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center relative overflow-hidden">
                                {/* Certificate Template Background (simplified) */}
                                <div className="absolute inset-0 bg-muted/5">
                                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center opacity-40">
                                        <div className="text-2xl font-bold text-secondary">Certificate of Achievement</div>
                                    </div>
                                    <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-32 h-px bg-border/20"></div>
                                </div>

                                {/* SINGLE FIELD: Name being dragged */}
                                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 group">
                                    {/* Field Box */}
                                    <div className="bg-accent/10 border-2 border-accent/60 rounded-lg px-6 py-3 shadow-lg group-hover:shadow-xl transition-shadow">
                                        <div className="font-mono text-sm font-medium text-accent">{'{name}'}</div>
                                    </div>

                                    {/* Drag Handle Indicator (top) */}
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                                        <div className="bg-accent text-white rounded-full p-1.5 shadow-md">
                                            <Move size={14} />
                                        </div>
                                    </div>

                                    {/* Numbered Callout: Step 1 */}
                                    <div className="absolute -left-16 top-0 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">1</div>
                                        <span className="text-xs font-medium text-secondary whitespace-nowrap">Select field</span>
                                    </div>
                                </div>

                                {/* Numbered Callout: Step 2 - Arrow showing drag */}
                                <div className="absolute top-1/2 right-12 pointer-events-none">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">2</div>
                                        <span className="text-xs font-medium text-secondary">Drag</span>
                                        <div className="w-0.5 h-8 bg-accent/40"></div>
                                    </div>
                                </div>

                                {/* Numbered Callout: Step 3 - Destination preview */}
                                <div className="absolute bottom-1/4 right-16 opacity-60 pointer-events-none">
                                    <div className="bg-accent/5 border border-dashed border-accent/40 rounded-lg px-4 py-2">
                                        <div className="font-mono text-xs font-medium text-accent/60">{'{name}'}</div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2">
                                        <div className="w-5 h-5 rounded-full bg-accent/20 text-white flex items-center justify-center text-xs font-bold">3</div>
                                        <span className="text-xs font-medium text-secondary">Position</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom info bar */}
                            <div className="bg-muted/10 border-t border-border/20 px-6 py-3 flex items-center justify-between text-xs">
                                <span className="text-secondary">Live preview</span>
                                <span className="text-accent font-medium">Auto-saved</span>
                            </div>
                        </div>

                        {/* Action Points Below */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wider">
                                    How it works
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                        <p className="text-secondary leading-relaxed text-sm">
                                            Click any field ({'{name}'}, {'{email}'}, {'{date}'}, etc.) to select it.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                        <p className="text-secondary leading-relaxed text-sm">
                                            Drag it to exactly where it should appear on the certificate.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                        <p className="text-secondary leading-relaxed text-sm">
                                            Preview updates in real-time. See exactly how names and dates will look.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                        <p className="text-secondary leading-relaxed text-sm">
                                            Undo/redo works. Press Ctrl+Z (or Cmd+Z) to revert placement mistakes.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wider">
                                    Tip
                                </h3>
                                <p className="text-secondary leading-relaxed text-sm mb-4">
                                    Zoom in/out for precise placement. Use the zoom controls in the editor toolbar to get a closer look at where fields should go.
                                </p>
                                <p className="text-secondary leading-relaxed text-sm">
                                    Only {'{name}'} is required. Email, date, and position are optional—just don't place them if you don't need them on your certificate.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What Happens Next */}
                    <div className="mt-10 bg-accent/5 border border-accent/15 rounded-lg p-6 flex items-start gap-4">
                        <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 size={14} className="text-accent" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">What happens next</h4>
                            <p className="text-sm text-secondary">
                                After positioning fields, you'll generate all certificates at once. We'll take your template and participant data, then create personalized PDFs in your browser.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
