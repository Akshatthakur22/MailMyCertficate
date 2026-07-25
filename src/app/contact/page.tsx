import { Github, Mail, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ContactChannelLink } from '@/components/analytics/ContactChannelLink';
import { ProductFooter } from '@/components/product/ProductFooter';
import { buttonVariants } from '@/components/ui/Button';

/* ————————————————————————————————————————————————————
   Section Wrapper — applies scroll-reveal animation
   ———————————————————————————————————————————————————— */
function RevealSection({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
    delay?: string;
}) {
    // Simple reveal animation placeholder
    return <div className={className}>{children}</div>;
}

export default function Contact() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            {/* ======================================
                NAVIGATION
               ====================================== */}
            <nav className="fixed top-0 w-full z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
                <div className="container-width flex flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
                    <Link
                        href="/"
                        className="brand-text hover:opacity-80 transition-opacity"
                    >
                        <span>Mail</span><span>My</span><span>Certificate</span>
                    </Link>

                    <div className="flex items-center justify-between gap-3 flex-wrap sm:justify-end">
                        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-secondary">
                            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
                            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
                            <Link href="/guide" className="hover:text-accent transition-colors">Guide</Link>
                             <Link href="/settings" className="hover:text-accent transition-colors">Settings</Link>
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
                                <span className="text-foreground">Contact</span>
                            </nav>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
                                Get in Touch
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-secondary mb-8 max-w-3xl">
                                I&apos;m Akshat Thakur, the developer behind MailMyCertificate. Questions, ideas, bug reports, or just want to say hi — I&apos;d love to hear from you.
                            </p>
                        </RevealSection>
                    </div>
                </section>
                {/* ======================================
                    CONTACT METHODS
                   ====================================== */}
                <section className="py-16 md:py-24 border-t border-border/50">
                    <div className="container-width">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                            {/* GitHub */}
                            <RevealSection>
                                <div className="h-full p-8 rounded-2xl bg-muted/20 border border-border/50 hover:border-accent/30 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                                        <Github size={24} className="text-accent group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3">GitHub</h3>
                                    <p className="text-secondary mb-6 leading-relaxed">
                                        Best place for bug reports, feature ideas, or technical discussions.
                                    </p>
                                    <ContactChannelLink
                                        href="https://github.com/akshatthakur22/MailMyCertficate/issues"
                                        target="_blank"
                                        channel="github"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                                    >
                                        Open Issue
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </ContactChannelLink>
                                </div>
                            </RevealSection>

                            {/* Twitter */}
                            <RevealSection delay="reveal-delay-1">
                                <div className="h-full p-8 rounded-2xl bg-muted/20 border border-border/50 hover:border-accent/30 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                                        <Twitter size={24} className="text-accent group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3">Twitter / X</h3>
                                    <p className="text-secondary mb-6 leading-relaxed">
                                        Usually the fastest way to reach me for quick questions or feedback.
                                    </p>
                                    <ContactChannelLink
                                        href="https://x.com/akshatt66612958"
                                        target="_blank"
                                        channel="twitter"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                                    >
                                        DM on X
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </ContactChannelLink>
                                </div>
                            </RevealSection>

                            {/* LinkedIn */}
                            <RevealSection delay="reveal-delay-2">
                                <div className="h-full p-8 rounded-2xl bg-muted/20 border border-border/50 hover:border-accent/30 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                                        <Linkedin size={24} className="text-accent group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3">LinkedIn</h3>
                                    <p className="text-secondary mb-6 leading-relaxed">
                                        For collaborations, networking, or professional conversations.
                                    </p>
                                    <ContactChannelLink
                                        href="https://www.linkedin.com/in/akshatthakur22/"
                                        target="_blank"
                                        channel="linkedin"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                                    >
                                        Connect
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </ContactChannelLink>
                                </div>
                            </RevealSection>
                        </div>
                    </div>
                </section>

                {/* ======================================
                    PERSONAL EMAIL
                   ====================================== */}
                <section className="py-16 md:py-24 border-t border-border/50">
                    <div className="container-width">
                        <div className="max-w-4xl mx-auto">
                            <RevealSection>
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">Prefer email?</h2>
                                <p className="text-secondary mb-8 leading-relaxed text-lg">
                                    Sometimes email just feels right.
                                </p>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl bg-muted/20 border border-border">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                            <Mail size={24} className="text-accent" />
                                        </div>
                                        <div className="font-mono font-medium text-accent text-lg">
                                            akshatthakur22@gmail.com
                                        </div>
                                    </div>
                                    <div className="text-sm text-secondary/70">
                                        I usually reply within a day or two.<br />
                                        Sometimes faster if I&apos;m between commits.
                                    </div>
                                </div>
                            </RevealSection>
                        </div>
                    </div>
                </section>

                {/* ======================================
                    OPEN SOURCE
                   ====================================== */}
                <section className="py-16 md:py-24 border-t border-border/50">
                    <div className="container-width">
                        <div className="max-w-4xl mx-auto">
                            <RevealSection>
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">Open Source</h2>
                                <p className="text-secondary mb-8 leading-relaxed text-lg">
                                    MailMyCertificate is open source. If you&apos;d like to contribute, improve performance, or help shape the project — contributions are always welcome.
                                </p>
                                <Link
                                    href="https://github.com/akshatthakur22/MailMyCertficate"
                                    target="_blank"
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors"
                                >
                                    <Github size={18} />
                                    View GitHub
                                    <ArrowRight size={16} />
                                </Link>
                            </RevealSection>
                        </div>
                    </div>
                </section>
            </main>

            <ProductFooter />
        </div>
    );
}