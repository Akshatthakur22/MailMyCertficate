import { FileSpreadsheet, CheckCircle2, Layers } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Step 2: Organize Your Participants
   - One focused concept: import participant data
   - Simplified screenshot: import options + preview table
   - 3-5 action points
   - Optional gotcha: sheet visibility, column names
   - Clear next step
   ———————————————————————————————————————————————————— */
export function Step2OrganizeParticipants() {
    return (
        <section className="py-16 md:py-20 border-t border-border/50 bg-muted/5">
            <div className="container-width">
                <div className="max-w-5xl">
                    {/* Step Number + Icon */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-accent">2</span>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                Organize your participants
                            </h2>
                        </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-lg text-secondary mb-8 max-w-2xl">
                        Bring your participant list as CSV or Google Sheets. This data gets personalized into each certificate.
                    </p>

                    {/* Main Content: Left (visual) + Right (text) */}
                    <div className="grid md:grid-cols-2 gap-12 mb-12 items-start">
                        {/* Left: Simplified Screenshot */}
                        <div>
                            <div className="bg-background rounded-xl border border-border/30 p-6 space-y-4">
                                {/* Import Options */}
                                <div>
                                    <div className="text-xs font-medium text-foreground mb-3">Choose your source:</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="border border-border/30 rounded-lg p-4 bg-muted/10 hover:bg-muted/20 hover:border-accent/40 transition-all cursor-pointer">
                                            <FileSpreadsheet size={20} className="text-accent mb-2" />
                                            <div className="font-medium text-foreground text-sm">CSV File</div>
                                            <div className="text-xs text-secondary">Drag & drop</div>
                                        </div>
                                        <div className="border border-border/30 rounded-lg p-4 bg-muted/10 hover:bg-muted/20 hover:border-accent/40 transition-all cursor-pointer">
                                            <Layers size={20} className="text-secondary mb-2" />
                                            <div className="font-medium text-foreground text-sm">Google Sheets</div>
                                            <div className="text-xs text-secondary">Paste URL</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Preview Table */}
                                <div className="pt-4">
                                    <div className="text-xs font-medium text-foreground mb-3">Data preview:</div>
                                    <div className="bg-muted/10 rounded-lg overflow-hidden border border-border/20">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-border/20 bg-muted/20">
                                                    <th className="px-3 py-2 text-left font-medium text-secondary/60">Name</th>
                                                    <th className="px-3 py-2 text-left font-medium text-secondary/60">Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-border/10">
                                                    <td className="px-3 py-2 text-foreground">Alice Johnson</td>
                                                    <td className="px-3 py-2 text-secondary">alice@example.com</td>
                                                </tr>
                                                <tr className="border-b border-border/10">
                                                    <td className="px-3 py-2 text-foreground">Bob Smith</td>
                                                    <td className="px-3 py-2 text-secondary">bob@example.com</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-3 py-2 text-foreground">Carol Davis</td>
                                                    <td className="px-3 py-2 text-secondary">carol@example.com</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="text-xs text-accent/60 mt-2">50 participants found</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Instructions & Points */}
                        <div>
                            <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wider">
                                How it works
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed">
                                        Use CSV: Download your data as a CSV file and drag it in. We&apos;ll auto-detect your headers.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed">
                                        Use Google Sheets: Paste a public sheet URL. We&apos;ll fetch the latest data each time.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed">
                                        Popular workflow: Google Forms → Sheets → MailMyCertificate. Forms responses auto-populate Sheets.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed">
                                        Required columns: You need at least a name column. Email is optional but recommended for sending.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                    <p className="text-secondary leading-relaxed">
                                        Extra columns are okay. Only the fields you place in the editor will appear on certificates.
                                    </p>
                                </div>
                            </div>

                            {/* Gotcha */}
                            <div className="mt-8 pt-8 border-t border-border/30">
                                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    ⚠️ Common issue
                                </h4>
                                <p className="text-sm text-secondary">
                                    <span className="font-medium text-foreground">Google Sheets must be public.</span> Right-click the sheet → Share → Change to &quot;Anyone with the link can view&quot; → Copy the URL and paste it here.
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
                                After importing, you&apos;ll see a preview of your data. Next: drag your name and email fields onto the template to position them exactly where you want them.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
