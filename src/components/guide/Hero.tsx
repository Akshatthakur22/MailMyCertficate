import Link from 'next/link';
import { Users, Monitor, HardDrive, Shield, Upload, FileSpreadsheet, Palette, Zap, Mail, ArrowRight } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Hero Section with refined animations and premium feel
   ———————————————————————————————————————————————————— */
export function Hero() {
    return (
        <section className="relative py-16 md:py-20 overflow-hidden">
            <div className="absolute inset-0 hero-grid" />
            <div className="relative container-width">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-secondary mb-6" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-foreground">Guide</span>
                </nav>

                {/* Title Section */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
                        Visual Workflow Tour
                    </h1>
                    <p className="text-xl text-secondary max-w-3xl">
                        See exactly how certificate generation works — from template to inbox.
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm text-secondary/60 mt-3">
                        <Users size={14} className="text-accent" />
                        Built from real organizer workflows, not enterprise documentation.
                    </div>
                </div>

                {/* Workflow Showcase */}
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-muted/10 rounded-3xl transform -rotate-1"></div>
                    <div className="relative bg-background/80 backdrop-blur-sm rounded-3xl border border-border/40 shadow-lg overflow-hidden">
                        <div className="p-6 sm:p-8">
                            {/* Floating Certificate Stack - simplified */}
                            <div className="absolute -right-4 -top-4 w-32 h-40 bg-muted/30 rounded-lg shadow-md transform rotate-12 border border-border/20">
                                <div className="absolute inset-4 bg-background/50 rounded border border-border/20"></div>
                            </div>
                            
                            {/* Interactive Workflow Preview */}
                            <div className="relative z-10">
                                <div className="flex items-center justify-center sm:justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3 group cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-200">
                                            <Upload size={20} className="text-accent" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground text-sm">Upload</div>
                                            <div className="text-xs text-secondary/60">Template</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} className="hidden sm:block text-border/30" />
                                    <div className="flex items-center gap-3 group cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-200">
                                            <FileSpreadsheet size={20} className="text-accent" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground text-sm">Import</div>
                                            <div className="text-xs text-secondary/60">Data</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} className="hidden sm:block text-border/30" />
                                    <div className="flex items-center gap-3 group cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-200">
                                            <Palette size={20} className="text-accent" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground text-sm">Customize</div>
                                            <div className="text-xs text-secondary/60">Fields</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} className="hidden sm:block text-border/30" />
                                    <div className="flex items-center gap-3 group cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-200">
                                            <Zap size={20} className="text-accent" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground text-sm">Generate</div>
                                            <div className="text-xs text-secondary/60">Certificates</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} className="hidden sm:block text-border/30" />
                                    <div className="flex items-center gap-3 group cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-200">
                                            <Mail size={20} className="text-accent" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground text-sm">Send</div>
                                            <div className="text-xs text-secondary/60">Emails</div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Subtle progress line */}
                                <div className="mt-6 relative">
                                    <div className="h-px bg-border/30"></div>
                                    <div className="absolute top-0 left-0 h-px bg-accent/40 w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/10 border border-border/30 hover:bg-muted/20 transition-colors">
                        <Monitor size={16} className="text-accent" />
                        <span className="text-secondary">Browser-first</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/10 border border-border/30 hover:bg-muted/20 transition-colors">
                        <HardDrive size={16} className="text-accent" />
                        <span className="text-secondary">Local generation</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/10 border border-border/30 hover:bg-muted/20 transition-colors">
                        <Shield size={16} className="text-accent" />
                        <span className="text-secondary">Google OAuth</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
