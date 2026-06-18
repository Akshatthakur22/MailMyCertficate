import Link from 'next/link';
import Image from 'next/image';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { buttonVariants } from '@/components/ui/Button';
import { RevealSection } from '@/components/layout/RevealSection';
import { TimeCalculator } from '@/components/landing/TimeCalculator';
import { PRODUCTION_APP_URL } from '@/config/site';
import {
    ArrowRight,
    Upload,
    TableProperties,
    FileDown,
    Check,
    Github,
    Shield,
    Globe,
    Zap,
    Clock,
    Lock,
    FileText,
    Play,
    Mail,
    Send,
} from 'lucide-react';

/* ————————————————————————————————————————————————————
   Handwritten Arrow Component
   ———————————————————————————————————————————————————— */
function HandwrittenArrow({ className = '', rotation = 0 }: { className?: string; rotation?: number }) {
    return (
        <svg
            width="120"
            height="50"
            viewBox="0 0 120 50"
            fill="none"
            className={`animate-draw ${className}`}
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            <path
                d="M5 25C25 10 50 10 65 25C80 40 100 40 115 25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="200"
                strokeDashoffset="200"
            />
            <path
                d="M105 15L115 25L105 35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="50"
                strokeDashoffset="50"
            />
        </svg>
    );
}

export default function LandingPage() {
    const publicAppHost = PRODUCTION_APP_URL.replace(/^https?:\/\//, '');

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans overflow-x-hidden">
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

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-secondary">
                            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
                            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
                            <Link href="/guide" className="hover:text-accent transition-colors">Guide</Link>
                            <Link href="/settings" className="hover:text-accent transition-colors">Your data</Link>
                        </div>
                        <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
                            <Link
                                href="https://github.com/akshatthakur22/MailMyCertficate"
                                target="_blank"
                                className="flex flex-1 items-center justify-center gap-2 text-sm font-medium text-secondary hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted sm:flex-none"
                            >
                                <Github size={16} />
                                <span className="hidden sm:inline">GitHub</span>
                            </Link>
                            <TrackToolCta
                                href="/tool"
                                entryPoint="navbar"
                                className={buttonVariants({ variant: 'primary', size: 'sm', className: 'w-full shadow-sm sm:w-auto' })}
                            >
                                Open Tool
                            </TrackToolCta>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-secondary md:hidden">
                            <Link href="/about" className="rounded-full border border-border bg-white px-3 py-1.5 hover:border-accent hover:text-accent transition-colors">About</Link>
                            <Link href="/guide" className="rounded-full border border-border bg-white px-3 py-1.5 hover:border-accent hover:text-accent transition-colors">Guide</Link>
                            <Link href="/contact" className="rounded-full border border-border bg-white px-3 py-1.5 hover:border-accent hover:text-accent transition-colors">Contact</Link>
                        </div>
                    </div>

                </div>
            </nav>

            <main className="flex-1 w-full">
                {/* ======================================
                    HERO SECTION
                   ====================================== */}
                <section className="relative pt-16">
                    <div className="absolute inset-0 hero-grid hero-gradient" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

                    <div className="relative container-width pt-20 pb-8 md:pt-32 md:pb-12 text-center">
                        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-accent/10 rounded-full blob-background animate-float" />
                        <div className="absolute -top-12 -right-12 w-96 h-96 bg-accent/5 rounded-full blob-background animate-float" style={{ animationDelay: '-3s' }} />

                        <div className="flex justify-center mb-8 animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-background/80 backdrop-blur-sm text-sm font-medium text-secondary shadow-sm hover:border-accent/40 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-subtle-pulse" />
                                🔒 100% Private • Free Forever • Open Source
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-bold tracking-tight text-foreground leading-[0.95] max-w-5xl mx-auto mb-8 animate-fade-in-up-delay-1 text-gradient">
                            Send hundreds of certificates in minutes
                            <br className="hidden md:block" />
                            — <span className="marker-underline italic font-serif">not weekends.</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto mb-6 leading-relaxed animate-fade-in-up-delay-2">
                            From Google Forms → Google Sheets → Personalized PDFs → Bulk Email.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in-up-delay-2">
                            {['Hackathons', 'Workshops', 'Bootcamps', 'Webinars', 'College Events'].map((tag, i) => (
                                <span key={i} className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent hover:bg-accent/20 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <p className="text-md md:text-lg text-secondary/90 max-w-3xl mx-auto mb-6 leading-relaxed animate-fade-in-up-delay-2">
                            <strong>Answer:</strong> MailMyCertificate generates personalized PDF certificates locally in your browser from a template plus CSV or Google Sheets, then optionally sends them through your own Gmail account. No signup and no upload of participant data to our servers.
                        </p>

                        <p className="text-md md:text-lg text-secondary/90 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up-delay-2">
                            Everything runs locally in your browser — no signup, no external storage, no participant data uploaded to random servers.
                        </p>



                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8 animate-fade-in-up-delay-3">
                            <TrackToolCta
                                href="/tool"
                                entryPoint="hero_cta"
                                className={buttonVariants({
                                    variant: 'primary',
                                    size: 'lg',
                                    className: 'w-full sm:w-auto text-lg px-10 h-16 shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all',
                                })}
                            >
                                Generate Your First Batch
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </TrackToolCta>
                            <Link
                                href="#demo"
                                className={buttonVariants({
                                    variant: 'secondary',
                                    size: 'lg',
                                    className: 'w-full sm:w-auto text-lg px-10 h-16 gap-3 group px-8',
                                })}
                            >
                                <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                                    <Play size={14} fill="currentColor" />
                                </div>
                                Watch 2-Minute Demo
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up-delay-3">
                            {[
                                { icon: <Shield size={14} />, text: 'No signup required' },
                                { icon: <Lock size={14} />, text: 'Runs locally' },
                                { icon: <Github size={14} />, text: 'Open source' },
                                { icon: <Zap size={14} />, text: 'Free forever' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 text-sm font-medium text-secondary hover:border-accent/40 transition-colors">
                                    {item.icon}
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        <div className="hidden lg:block absolute left-1/2 -bottom-10 -translate-x-full ml-40">
                            <HandwrittenArrow rotation={120} className="text-accent/30" />
                            <span className="absolute top-12 left-12 text-xs font-serif text-accent/40 -rotate-3 italic">Try it out!</span>
                        </div>

                        <div className="hidden lg:block absolute right-10 top-1/2 -rotate-6 animate-fade-in-up-delay-4">
                            <div className="sticky-note sticky-yellow max-w-[140px]">
                                Your Sunday just got saved ☕
                            </div>
                            <div className="w-px h-12 bg-yellow-200 mx-auto transform -translate-y-1" />
                        </div>
                    </div>

                    <div className="relative container-width pb-16 md:pb-24">
                        <div id="demo" className="animate-fade-in-up-delay-4">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4">See the actual tool in action</h2>
                                <p className="text-secondary">Real screen recording of generating 127 certificates in 1:47</p>
                            </div>
                            
                            <div className="relative rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-white mx-auto max-w-5xl group">
                                <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="bg-background border border-border rounded-md px-4 py-1 text-xs text-secondary font-mono max-w-xs w-full text-center">
                                            {publicAppHost}/tool
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-secondary">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span>Live demo</span>
                                    </div>
                                </div>
                                
                                <div className="relative aspect-[16/9] bg-black">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center mb-4 mx-auto hover:bg-white transition-colors cursor-pointer group">
                                                <Play size={32} className="text-accent ml-1 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <p className="text-white/80 text-sm mb-2">Watch real certificate generation</p>
                                            <p className="text-white/60 text-xs">No staging, no mockups — actual tool usage</p>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                        <div className="text-white/60 text-xs font-mono">1:47</div>
                                        <div className="text-white/60 text-xs">127 certificates generated</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </section>

                {/* ======================================
                    STORY SECTION
                   ====================================== */}
                <section className="py-20 md:py-28 border-t border-border/50">
                    <div className="container-width">
                        <RevealSection className="max-w-4xl mx-auto text-center mb-16 group">
                            <p className="text-sm font-bold text-accent uppercase tracking-[0.2em] mb-4">
                                THE STORY
                            </p>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1] text-gradient">
                                We built this because manual certificate work
                                <br className="hidden md:block" />
                                is <span className="marker-underline italic">painful.</span>
                            </h2>
                            <div className="text-xl text-secondary leading-relaxed max-w-2xl mx-auto relative cursor-default">
                                If you've ever manually edited certificates in Canva, downloaded hundreds of PDFs, and attached them to emails one-by-one — you already know the pain.
                                <br className="hidden sm:block" />
                                <br className="hidden sm:block" />
                                MailMyCertificate turns a stressful 4-hour task into a 2-minute workflow.
                                <br className="hidden sm:block" />
                                <br className="hidden sm:block" />
                                No repetitive editing.
                                No attachment chaos.
                                No wrong-certificate disasters.
                                <div className="hidden xl:block absolute -right-20 -top-8 sticky-note sticky-blue max-w-[120px] -rotate-6 scale-75 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Trust us, we&apos;ve been there. ☕️
                                </div>
                            </div>
                        </RevealSection>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
                            {[
                                { icon: <Clock size={20} />, title: 'Manual editing burnout', desc: 'Opening the same template 200 times destroys both time and sanity.' },
                                { icon: <Send size={20} />, title: 'Email mistakes happen', desc: 'One wrong attachment and suddenly you&apos;re apologizing to participants at midnight.' },
                                { icon: <Lock size={20} />, title: 'Privacy matters', desc: 'Participant lists should stay on your device — not on unknown third-party servers.' },
                                { icon: <Zap size={20} />, title: 'Fake free tools', desc: 'Most &quot;free&quot; tools stop working after 10 exports or hide everything behind a paywall.' },
                            ].map((item, i) => (
                                <RevealSection key={i} delay={`reveal-delay-${i + 1}`}>
                                    <div className="group h-full p-8 rounded-2xl border border-border bg-background hover:border-accent/40 hover:shadow-[0_20px_50px_rgba(31,78,216,0.05)] glow-on-hover transition-all duration-500">
                                        <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center text-accent mb-6 group-hover:rotate-6 transition-transform duration-300">
                                            {item.icon}
                                        </div>
                                        <h3 className="font-bold text-lg mb-3 leading-tight">{item.title}</h3>
                                        <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
                                    </div>
                                </RevealSection>
                            ))}
                        </div>

                        <div className="section-divider mb-20" />

                        {/* ======================================
                            CONTRAST SECTION
                           ====================================== */}
                        <div className="text-center mb-16">
                            <p className="text-sm font-bold text-accent uppercase tracking-[0.2em] mb-4">
                                THE DIFFERENCE
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient max-w-2xl mx-auto">
                                Stop wasting hours on certificate work.
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
                            <RevealSection delay="reveal-delay-1">
                                <div className="h-full p-10 rounded-2xl border border-red-100 bg-red-50/30">
                                    <div className="text-red-600 font-bold uppercase text-[10px] tracking-widest mb-8 px-4 py-1.5 bg-red-100/50 rounded-full w-fit">
                                        THE OLD WAY
                                    </div>
                                    <ul className="space-y-6">
                                        {['Editing names manually in Canva', 'Downloading certificates one-by-one', 'Attaching files manually to emails', 'Double-checking every recipient', 'Accidentally sending wrong certificates', 'Losing entire weekends doing repetitive work'].map((text, i) => (
                                            <li key={i} className="flex items-start gap-3 text-red-900/40 text-sm italic">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-300 shrink-0" />
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </RevealSection>

                            <RevealSection delay="reveal-delay-2">
                                <div className="h-full p-10 rounded-2xl border border-blue-100 bg-blue-50/30 glass-card">
                                    <div className="text-blue-600 font-bold uppercase text-[10px] tracking-widest mb-8 px-4 py-1.5 bg-blue-100/50 rounded-full w-fit">
                                        THE MAILMYCERTIFICATE WAY
                                    </div>
                                    <ul className="space-y-6">
                                        {['Upload one template', 'Import CSV or Google Sheets', 'Generate personalized PDFs instantly', 'Send bulk emails through Gmail', 'Everything processed locally', 'Done before your coffee gets cold ☕'].map((text, i) => (
                                            <li key={i} className="flex items-start gap-3 text-blue-900 text-sm font-semibold">
                                                <Check size={18} className="text-blue-500 shrink-0" />
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </RevealSection>
                        </div>

                        {/* ======================================
                            CHAT TESTIMONIAL (Social Proof)
                           ====================================== */}
                        <RevealSection delay="reveal-delay-3" className="mt-24 max-w-3xl mx-auto">
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-start">
                                    <div className="bg-muted px-6 py-4 rounded-2xl rounded-bl-none max-w-md shadow-sm border border-border">
                                        <p className="text-sm text-secondary italic">&quot;We still have 280 certificates left to send 😭&quot;</p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-accent text-white px-6 py-4 rounded-2xl rounded-br-none max-w-sm shadow-lg shadow-accent/20">
                                        <p className="text-sm font-medium">Just imported the Google Sheet, generated all PDFs, and sent everything in under 10 minutes.</p>
                                    </div>
                                </div>
                            </div>
                        </RevealSection>

                        {/* ======================================
                            TIME SAVED CALCULATOR
                           ====================================== */}
                        <TimeCalculator />
                    </div>
                </section>

                {/* ======================================
                    WORKFLOW SECTION
                   ====================================== */}
                <section className="py-24 md:py-32 bg-muted/20 bg-grain subtle-grid border-y border-border/40">
                    <div className="container-width">
                        <RevealSection className="text-center mb-20">
                            <p className="text-sm font-bold text-accent uppercase tracking-[0.2em] mb-4">
                                WORKFLOW
                            </p>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gradient">
                                Four simple steps.
                            </h2>
                            <p className="text-secondary text-xl max-w-xl mx-auto">
                                No accounts. No complicated setup. No learning curve.
                            </p>
                        </RevealSection>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-6xl mx-auto">
                            {[
                                { step: '01', icon: <Upload size={24} />, title: 'Upload your template', desc: 'Use any PNG or JPG certificate design as your base.' },
                                { step: '02', icon: <TableProperties size={24} />, title: 'Import participants', desc: 'Connect Google Sheets or upload CSV with recipient data.' },
                                { step: '03', icon: <FileDown size={24} />, title: 'Preview personalized PDFs', desc: 'Create hundreds of individualized certificates instantly.' },
                                { step: '04', icon: <Mail size={24} />, title: 'Send personalized emails', desc: 'Deliver certificates automatically through Gmail.' },
                            ].map((item, i) => (
                                <RevealSection key={i} delay={`reveal-delay-${i + 1}`} className={i % 2 !== 0 ? 'md:mt-12' : ''}>
                                    <div className="flex flex-col items-center text-center group">
                                        <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mb-8 relative z-10 shadow-sm group-hover:bg-accent group-hover:text-white group-hover:-translate-y-2 transition-all duration-500">
                                            {item.icon}
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent-light text-accent text-[10px] font-bold flex items-center justify-center border border-accent/20">
                                                {item.step}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                                        <p className="text-sm text-secondary leading-relaxed px-4">{item.desc}</p>
                                    </div>
                                </RevealSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ======================================
                    LOCAL PROCESSING REASSURANCE
                   ====================================== */}
                <section className="py-20 md:py-28 border-t border-border/50">
                    <div className="container-width">
                        <RevealSection className="text-center mb-16">
                            <p className="text-sm font-bold text-accent uppercase tracking-[0.2em] mb-4">
                                PRIVACY FIRST
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-gradient">
                                Everything runs locally in your browser.
                            </h2>
                            <p className="text-secondary text-xl max-w-2xl mx-auto">
                                Your participant data never leaves your device.
                            </p>
                        </RevealSection>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                { icon: <Lock size={24} />, title: 'Local Processing', desc: 'All certificate generation happens in your browser. No uploads to external servers.' },
                                { icon: <Shield size={24} />, title: 'Data Privacy', desc: 'Participant information stays on your device. We never see or store your data.' },
                                { icon: <Zap size={24} />, title: 'Instant Results', desc: 'No waiting for cloud processing. Generate hundreds of PDFs in seconds.' }
                            ].map((item, i) => (
                                <RevealSection key={i} delay={`reveal-delay-${i + 1}`}>
                                    <div className="h-full p-8 rounded-2xl border border-border bg-background hover:border-accent/40 hover:shadow-[0_20px_50px_rgba(31,78,216,0.05)] glow-on-hover transition-all duration-500">
                                        <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center text-accent mb-6 group-hover:rotate-6 transition-transform duration-300">
                                            {item.icon}
                                        </div>
                                        <h3 className="font-bold text-lg mb-3 leading-tight">{item.title}</h3>
                                        <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
                                    </div>
                                </RevealSection>
                            ))}
                        </div>

                        <RevealSection delay="reveal-delay-4" className="mt-16 max-w-3xl mx-auto">
                            <div className="p-8 rounded-2xl bg-accent/5 border border-accent/10 relative">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center text-accent">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Browser-First Architecture</h4>
                                        <p className="text-sm text-secondary">No accounts. No cloud storage. No data collection.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-secondary">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span>Participant data stays local</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span>No external processing</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span>Privacy-first workflow</span>
                                    </div>
                                </div>
                            </div>
                        </RevealSection>
                    </div>
                </section>

 {/* ======================================
                    REASSURANCE SECTION
                   ====================================== */}
                <section className="py-24 md:py-32 border-y border-border/50 bg-muted/20">
                    <div className="container-width">
                        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
                            <RevealSection>
                                <p className="text-sm font-bold text-accent uppercase tracking-[0.2em] mb-6">TRUST & PRIVACY</p>
                                <h2 className="text-4xl font-bold tracking-tight mb-8 text-gradient">
                                    Yes, it's actually <span className="marker-underline italic font-serif">free.</span>
                                </h2>
                                <div className="space-y-8">
                                    {[
                                        { q: "Does my data leave my browser?", a: "No. Participant data and certificate generation stay on your device." },
                                        { q: "Is there a certificate limit?", a: "No artificial export limits." },
                                        { q: "Why is this free?", a: "Because event organizers already deal with enough chaos." }
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <h4 className="font-bold text-foreground">{item.q}</h4>
                                            <p className="text-secondary text-sm leading-relaxed">{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </RevealSection>

                            <RevealSection delay="reveal-delay-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['Privacy First', 'Open Source', 'No Accounts', 'Lightning Fast'].map((label, i) => (
                                        <div key={i} className="p-8 rounded-xl bg-background border border-border shadow-sm hover:border-accent/30 transition-all hover:-translate-y-1">
                                            <div className="font-bold text-lg mb-2">{label}</div>
                                            <div className="text-xs text-secondary leading-relaxed tracking-wide">Built for results.</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-6 rounded-3xl bg-accent/5 border border-accent/10 relative">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 grayscale hover:grayscale-0 transition-all duration-700">
                                            <Image src="https://github.com/akshatthakur22.png" alt="Creator" width={48} height={48} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-accent font-bold uppercase tracking-widest mb-1">Why I built this →</p>
                                            <p className="text-sm italic text-secondary text-balance">&quot;I already solved this problem for myself…
then rebuilt it properly for everyone else.&quot;</p>
                                            <p className="text-xs text-secondary mt-2 font-medium">— Akshat ☕</p>
                                        </div>
                                    </div>
                                    <div className="hidden lg:block absolute -right-4 -bottom-4 sticky-note sticky-pink scale-75 rotate-12">
                                        Made with 💙
                                    </div>
                                </div>
                            </RevealSection>
                        </div>
                    </div>
                </section>
            </main>

            {/* ======================================
                FINAL CTA SECTION
               ====================================== */}
            <section className="py-24 md:py-32 bg-muted/20">
                <div className="container-width">
                    <RevealSection className="text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-gradient">
                            Stop wasting hours on certificate distribution.
                        </h2>
                        <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto">
                            Generate and send certificates in minutes — not entire weekends.
                        </p>
                        <TrackToolCta
                            href="/tool"
                            entryPoint="footer_cta"
                            className={buttonVariants({
                                variant: 'primary',
                                size: 'lg',
                                className: 'text-lg px-12 h-16 shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all',
                            })}
                        >
                            Start Generating Certificates
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </TrackToolCta>
                    </RevealSection>
                </div>
            </section>

            <footer className="border-t border-border py-16 bg-background relative overflow-hidden">
                <div className="absolute inset-0 hero-grid opacity-[0.2] pointer-events-none" />
                <div className="container-width relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <Link href="/" className="brand-text block">
                                <span>Mail</span><span>My</span><span>Certificate</span>
                            </Link>
                            <p className="text-sm text-secondary max-w-sm leading-relaxed font-medium">
                                The privacy-first bulk certificate generator for hackathons, workshops, webinars, bootcamps, and events.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Product</h4>
                            <ul className="space-y-4 text-sm font-bold text-secondary">
                                <li><Link href="/tool" className="hover:text-accent transition-colors">Start Generating</Link></li>
                                <li><Link href="/about" className="hover:text-accent transition-colors">About Project</Link></li>
                                <li><Link href="/guide" className="hover:text-accent transition-colors">User Guide</Link></li>
                                <li><Link href="/google-sheets-certificate-generator" className="hover:text-accent transition-colors">Google Sheets</Link></li>
                                <li><Link href="/google-forms-to-certificates" className="hover:text-accent transition-colors">Google Forms</Link></li>
                                <li><Link href="/send-certificates-gmail-bulk" className="hover:text-accent transition-colors">Gmail Bulk Send</Link></li>
                                <li><Link href="/hackathon-certificate-generator" className="hover:text-accent transition-colors">Hackathons</Link></li>
                                <li><Link href="/canva-certificate-alternative" className="hover:text-accent transition-colors">Canva Alternative</Link></li>
                                <li><Link href="/vs/certifier" className="hover:text-accent transition-colors">vs Certifier</Link></li>
                                <li><Link href="/llms.txt" className="hover:text-accent transition-colors">LLM Overview</Link></li>
                                <li><Link href="https://github.com/akshatthakur22/MailMyCertficate" target="_blank" className="hover:text-accent transition-colors">Source Code</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Legal & Support</h4>
                            <ul className="space-y-4 text-sm font-bold text-secondary">
                                <li><Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                                <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col items-center md:items-start gap-1">
                            <p className="text-xs text-secondary font-medium">
                                Built with 💙 by <Link href="https://www.linkedin.com/in/akshatthakur22/" className="hover:text-accent underline underline-offset-4 decoration-accent/30 font-bold">Akshat Thakur</Link>
                            </p>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">
                            © {new Date().getFullYear()} · MIT License · Production v1.0
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
