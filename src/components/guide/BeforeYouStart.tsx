import { Monitor, Upload, FileSpreadsheet, Shield, Clock, AlertCircle } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Before You Start Section
   - 3 essential requirements
   - Time expectation
   - Privacy statement (reinforced)
   ———————————————————————————————————————————————————— */
export function BeforeYouStart() {
    return (
        <section className="py-12 md:py-16 border-t border-border/50">
            <div className="container-width">
                <div className="max-w-4xl">
                    {/* Section Header */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/15 mb-4">
                            <Clock size={14} className="text-accent" />
                            <span className="text-sm font-medium text-accent">5–30 minutes</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                            What you&apos;ll need
                        </h2>
                        <p className="text-secondary">
                            Three things. That&apos;s it.
                        </p>
                    </div>

                    {/* 3 Essential Requirements */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        {/* Requirement 1 */}
                        <div className="border border-border/30 rounded-lg p-5 bg-background hover:border-accent/30 hover:bg-muted/5 transition-all duration-200">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                                <Monitor size={20} className="text-accent" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Desktop browser</h3>
                            <p className="text-sm text-secondary">Chrome or Safari on Mac/Windows. Mobile works for downloading only.</p>
                        </div>

                        {/* Requirement 2 */}
                        <div className="border border-border/30 rounded-lg p-5 bg-background hover:border-accent/30 hover:bg-muted/5 transition-all duration-200">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                                <Upload size={20} className="text-accent" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Certificate template</h3>
                            <p className="text-sm text-secondary">PNG or JPG file under 5MB. Design in Canva or Figma first.</p>
                        </div>

                        {/* Requirement 3 */}
                        <div className="border border-border/30 rounded-lg p-5 bg-background hover:border-accent/30 hover:bg-muted/5 transition-all duration-200">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                                <FileSpreadsheet size={20} className="text-accent" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Participant data</h3>
                            <p className="text-sm text-secondary">CSV file or Google Sheets URL with names and emails.</p>
                        </div>
                    </div>

                    {/* Privacy and Trust - Reinforced */}
                    <div className="bg-accent/5 border border-accent/15 rounded-lg p-5 flex items-start gap-4">
                        <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Shield size={14} className="text-accent" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1 text-sm">Your data stays private</h3>
                            <p className="text-sm text-secondary">
                                All certificate generation happens in your browser. Templates and participant data never leave your device. No servers involved in the core workflow.
                            </p>
                        </div>
                    </div>

                    {/* Common Gotchas */}
                    <div className="mt-8 pt-8 border-t border-border/30">
                        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                            <AlertCircle size={16} className="text-yellow-500" />
                            One thing to watch for
                        </h3>
                        <div className="bg-yellow-50/20 border border-yellow-200/30 rounded-lg p-4">
                            <p className="text-sm text-secondary">
                                <span className="font-medium text-foreground">PDF templates don&apos;t work.</span> Convert them to PNG/JPG first. Canva exports directly as PNG — use that.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
