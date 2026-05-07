'use client';

import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';
import { buttonVariants } from '@/components/ui/Button';
import {
    ArrowRight,
    Github,
    Shield,
    Lock,
    Users,
    Zap,
    Code,
    Terminal,
    Mail,
} from 'lucide-react';

/* ————————————————————————————————————————————————————
   Section Wrapper — applies scroll-reveal animation
   ———————————————————————————————————————————————————— */
function RevealSection({
    children,
    className = '',
    delay = '',
}: {
    children: React.ReactNode;
    className?: string;
    delay?: string;
}) {
    const ref = useReveal<HTMLDivElement>();
    return (
        <div ref={ref} className={`reveal ${delay} ${className}`}>
            {children}
        </div>
    );
}

/* ————————————————————————————————————————————————————
   About Page
   ———————————————————————————————————————————————————— */
export default function About() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            {/* ======================================
                NAVIGATION
               ====================================== */}
            <nav className="fixed top-0 w-full z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
                <div className="container-width flex justify-between items-center h-16">
                    <Link
                        href="/"
                        className="brand-text hover:opacity-80 transition-opacity"
                    >
                        <span>Mail</span><span>My</span><span>Certificate</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-secondary">
                            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
                            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
                            <Link href="/guide" className="hover:text-accent transition-colors">Guide</Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="https://github.com/akshatthakur22/MailMyCertficate"
                                target="_blank"
                                className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
                            >
                                <Github size={16} />
                                <span className="hidden sm:inline">GitHub</span>
                            </Link>
                            <Link
                                href="/tool"
                                className={buttonVariants({ variant: 'primary', size: 'sm', className: 'shadow-sm' })}
                            >
                                Open Tool
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 w-full pt-16">
                {/* ======================================
                    HERO SECTION
                   ====================================== */}
                <section className="relative py-16 md:py-24">
                    <div className="absolute inset-0 hero-grid" />
                    <div className="relative container-width">
                        <RevealSection className="max-w-4xl">
                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-2 text-sm text-secondary mb-8">
                                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                                <span>/</span>
                                <span className="text-foreground">About</span>
                            </nav>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
                                About MailMyCertificate
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-secondary mb-4 max-w-3xl">
                                Built from a real organizer workflow — not a startup pitch.
                            </p>

                            {/* Supporting text */}
                            <p className="text-sm text-secondary/70 max-w-2xl">
                                Started as a Python automation script during a college event.
                                <br />
                                Built because I genuinely needed it.
                            </p>
                        </RevealSection>
                    </div>
                </section>

                {/* ======================================
                    THE REAL STORY
                   ====================================== */}
                <section className="py-16 md:py-24 border-t border-border/50">
                    <div className="container-width">
                        <div className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-5xl mx-auto">
                            {/* Story Text */}
                            <RevealSection className="space-y-6">
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                                    The Real Story
                                </h2>
                                
                                <div className="space-y-4 text-secondary leading-relaxed">
                                    <p>
                                        I was Technical Lead for a GeeksForGeeks college club event. We had 300+ participants who needed certificates.
                                    </p>
                                    
                                    <p>
                                        Google Forms gave us messy spreadsheet data. Names, emails, timestamps — plus plenty of unnecessary fields.
                                    </p>
                                    
                                    <p>
                                        Existing tools felt frustrating. Canva was too manual. Most tools required uploading participant data or charged per certificate.
                                    </p>
                                    
                                    <p>
                                        So I built a Python script overnight. It uploaded blank certificate templates, let me position text with X/Y coordinates, and imported CSV files.
                                    </p>
                                    
                                    <p>
                                        Generated PDFs locally. Then learned SMTP automation to send emails with Gmail app passwords.
                                    </p>
                                    
                                    <p>
                                        Realized every organizer faces this same problem. That eventually became MailMyCertificate.
                                    </p>
                                </div>
                            </RevealSection>

                            {/* Visual Card */}
                            <RevealSection delay="reveal-delay-1">
                                <div className="bg-muted/30 rounded-2xl p-8 border border-border/50">
                                    <div className="space-y-6">
                                        {/* CSV Snippet */}
                                        <div className="bg-background rounded-lg p-4 border border-border">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Code size={16} className="text-accent" />
                                                <span className="text-sm font-mono text-secondary">participants.csv</span>
                                            </div>
                                            <pre className="text-xs font-mono text-secondary/70">
{`name,email,timestamp
John Doe,john@email.com,2024-03-15
Jane Smith,jane@email.com,2024-03-15
...`}
                                            </pre>
                                        </div>

                                        {/* Certificate Preview */}
                                        <div className="bg-background rounded-lg p-4 border border-border">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Terminal size={16} className="text-accent" />
                                                <span className="text-sm font-mono text-secondary">certificate.py</span>
                                            </div>
                                            <pre className="text-xs font-mono text-secondary/70">
{`# Position text at X,Y coordinates
draw_text("John Doe", x=150, y=200)
draw_text("Participation", x=150, y=250)
save_pdf("john_certificate.pdf")`}
                                            </pre>
                                        </div>

                                        {/* SMTP Visual */}
                                        <div className="bg-background rounded-lg p-4 border border-border">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Mail size={16} className="text-accent" />
                                                <span className="text-sm font-mono text-secondary">smtp.py</span>
                                            </div>
                                            <pre className="text-xs font-mono text-secondary/70">
{`# Send via Gmail SMTP
server.login(email, password)
server.sendmail(email, recipient, msg)
attach_pdf("john_certificate.pdf")`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </RevealSection>
                        </div>
                    </div>
                </section>

                {/* ======================================
                    WHILE REBUILDING IT, I KEPT A FEW THINGS NON-NEGOTIABLE
                   ====================================== */}
                <section className="py-16 md:py-24 border-t border-border/50">
                    <div className="container-width">
                        <RevealSection className="max-w-5xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12">
                                While rebuilding it, I kept a few things non-negotiable.
                            </h2>

                            <div className="space-y-6 max-w-4xl">
                                {/* Note 1 */}
                                <div className="group bg-muted/20 rounded-lg p-6 border border-border/50 hover:border-border transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Lock size={16} className="text-accent" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-foreground">
                                                No participant uploads
                                            </h3>
                                            <p className="text-secondary leading-relaxed">
                                                I didn't want organizers uploading participant data to random servers just to send certificates.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Note 2 */}
                                <div className="group bg-muted/20 rounded-lg p-6 border border-border/50 hover:border-border transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Zap size={16} className="text-accent" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-foreground">
                                                Runs locally
                                            </h3>
                                            <p className="text-secondary leading-relaxed">
                                                Everything runs inside the browser so generation stays fast and private.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Note 3 */}
                                <div className="group bg-muted/20 rounded-lg p-6 border border-border/50 hover:border-border transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Users size={16} className="text-accent" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-foreground">
                                                Built from a real workflow
                                            </h3>
                                            <p className="text-secondary leading-relaxed">
                                                The tool follows the same workflow I originally used during college events and hackathons.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Note 4 */}
                                <div className="group bg-muted/20 rounded-lg p-6 border border-border/50 hover:border-border transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Shield size={16} className="text-accent" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-foreground">
                                                Less setup, more shipping
                                            </h3>
                                            <p className="text-secondary leading-relaxed">
                                                No accounts, no dashboards, no unnecessary setup. Upload, generate, send.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RevealSection>
                    </div>
                </section>

                {/* ======================================
                    OPEN SOURCE
                   ====================================== */}
                <section className="py-16 md:py-24 border-t border-border/50">
                    <div className="container-width">
                        <RevealSection className="max-w-4xl mx-auto text-center">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                                Open Source
                            </h2>
                            
                            <p className="text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
                                Tools that handle participant data should be transparent. Every line of code is publicly available — inspect how we handle data, verify our privacy claims, or host your own version.
                            </p>

                            <Link
                                href="https://github.com/akshatthakur22/MailMyCertficate"
                                target="_blank"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors"
                            >
                                <Github size={18} />
                                View on GitHub
                                <ArrowRight size={16} />
                            </Link>
                        </RevealSection>
                    </div>
                </section>

                {/* ======================================
                    SMALL ENDING
                   ====================================== */}
                <section className="py-16 md:py-24 border-t border-border/50">
                    <div className="container-width">
                        <RevealSection className="max-w-3xl mx-auto text-center">
                            <blockquote className="text-xl md:text-2xl font-serif text-foreground/90 italic leading-relaxed">
                                "I already solved this problem for myself…
                                <br className="hidden md:block" />
                                then rebuilt it properly for everyone else."
                            </blockquote>
                        </RevealSection>
                    </div>
                </section>
            </main>
        </div>
    );
}
