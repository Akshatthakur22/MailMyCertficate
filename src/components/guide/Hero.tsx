import Link from 'next/link';
import { Users, Shield } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Redesigned Hero Section (Simplified)
   - Pure benefit-driven headline
   - One-line explanation
   - Visual teaser (5 small dots, no labels)
   - Trust statement
   ———————————————————————————————————————————————————— */
export function Hero() {
    return (
        <section className="relative py-16 md:py-20 overflow-hidden">
            <div className="absolute inset-0 hero-grid" />
            <div className="relative container-width">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-foreground">Guide</span>
                </nav>

                {/* Title Section - Benefit Driven */}
                <div className="max-w-3xl mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
                        Create professional certificates in minutes.
                    </h1>
                    <p className="text-lg md:text-xl text-secondary leading-relaxed mb-6">
                        Upload a template, add your participants, drag fields into place, and send.
                    </p>
                    
                    {/* Trust Statement */}
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Shield size={14} className="text-accent" />
                        </div>
                        <p className="text-secondary text-sm">
                            Everything stays on your device. Your data never leaves your browser.
                        </p>
                    </div>
                </div>

                {/* Visual Teaser - 5 Dots (No Labels) */}
                <div className="flex items-center justify-start md:justify-center gap-2 md:gap-3 flex-wrap mb-16">
                    {/* Step 1 */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent/40"></div>
                    </div>
                    {/* Separator */}
                    <div className="w-2 md:w-4 h-px bg-border/30"></div>
                    {/* Step 2 */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent/40"></div>
                    </div>
                    {/* Separator */}
                    <div className="w-2 md:w-4 h-px bg-border/30"></div>
                    {/* Step 3 */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent/40"></div>
                    </div>
                    {/* Separator */}
                    <div className="w-2 md:w-4 h-px bg-border/30"></div>
                    {/* Step 4 */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent/40"></div>
                    </div>
                    {/* Separator */}
                    <div className="w-2 md:w-4 h-px bg-border/30"></div>
                    {/* Step 5 */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent/40"></div>
                    </div>
                </div>

                {/* Subtext - Teaser */}
                <div className="flex items-center gap-2 text-sm text-secondary/60">
                    <Users size={14} className="text-accent" />
                    <span>See how organizers do it in the steps below.</span>
                </div>
            </div>
        </section>
    );
}
