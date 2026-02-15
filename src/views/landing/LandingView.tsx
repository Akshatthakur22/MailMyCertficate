'use client';

import { useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/Button';
import { useReveal } from '@/hooks/useReveal';
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
   Landing Page
   ———————————————————————————————————————————————————— */
export default function LandingView() {
    const [count, setCount] = useState(100);
    const timePerCert = 3; // minutes manually
    const savedTime = Math.round((count * timePerCert) / 60);

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "MailMyCertificate",
                        "url": "https://mailmycertificate.com",
                        "description": "Free, privacy-first bulk certificate generator. Generate 1000+ localized PDFs in minutes entirely in your browser.",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "author": {
                            "@type": "Organization",
                            "name": "MailMyCertificate",
                            "url": "https://github.com/akshatthakur22/MailMyCertficate"
                        }
                    })
                }}
            />

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
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-subtle-pulse" />
                                100% Free & Open Source
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-bold tracking-tight text-foreground leading-[0.95] max-w-5xl mx-auto mb-8 animate-fade-in-up-delay-1 text-gradient">
                            Automate certificates locally
                            <br className="hidden md:block" />
                            with <span className="marker-underline italic font-serif">fast, offline PDF generation.</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up-delay-2">
                            The ultimate certificate generation software for secure, high-speed delivery.
                            Create professional certificates in bulk without your data ever leaving your browser.
                        </p>



                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12 animate-fade-in-up-delay-3">
                            <Link
                                href="/tool"
                                className={buttonVariants({
                                    variant: 'primary',
                                    size: 'lg',
                                    className: 'w-full sm:w-auto text-lg px-10 h-16 shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all',
                                })}
                            >
                                Start Generating Now
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
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
                                Quick Demo
                            </Link>
                        </div>

                        <div className="hidden lg:block absolute left-1/2 -bottom-10 -translate-x-full ml-40">
                            <HandwrittenArrow rotation={120} className="text-accent/30" />
                            <span className="absolute top-12 left-12 text-xs font-serif text-accent/40 -rotate-3 italic">Try it out!</span>
                        </div>

                        <div className="hidden lg:block absolute right-10 top-1/2 -rotate-6 animate-fade-in-up-delay-4">
                            <div className="sticky-note sticky-yellow max-w-[140px]">
                                No signup required. <br /> Just upload and go! ✨
                            </div>
                            <div className="w-px h-12 bg-yellow-200 mx-auto transform -translate-y-1" />
                        </div>
                    </div>

                    <div className="relative container-width pb-16 md:pb-24">
                        <div className="animate-fade-in-up-delay-4">
                            <div className="relative rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-white mx-auto max-w-5xl animate-float">
                                <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="bg-background border border-border rounded-md px-4 py-1 text-xs text-secondary font-mono max-w-xs w-full text-center">
                                            mailmycertificate.com/tool
                                        </div>
                                    </div>
                                    <div className="w-16" />
                                </div>
                                <div className="relative aspect-[16/9]">
                                    <Image
                                        src="/platform-preview.png"
                                        alt="MailMyCertificate Preview"
                                        fill
                                        className="object-cover object-top"
                                        priority
                                    />
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
                                The Story
                            </p>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1] text-gradient">
                                We built this because we were
                                <br className="hidden md:block" />
                                tired of the <span className="marker-underline italic">manual grind.</span>
                            </h2>
                            <div className="text-xl text-secondary leading-relaxed max-w-2xl mx-auto relative cursor-default">
                                Manually editing certificates in Canva and emailing them one-by-one is a soul-crushing waste of time.
                                MailMyCertificate turns that 4-hour job into a <span className="marker-highlight font-bold text-accent">60-second</span> coffee break.
                                <div className="hidden xl:block absolute -right-20 -top-8 sticky-note sticky-blue max-w-[120px] -rotate-6 scale-75 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Trust us, we&apos;ve been there. ☕️
                                </div>
                            </div>
                        </RevealSection>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
                            {[
                                { icon: <Clock size={20} />, title: 'Soul-crushing repetition', desc: 'Opening the same template 200 times. One typo and you starts all over again.' },
                                { icon: <Send size={20} />, title: 'Emailing is the worst part', desc: 'Making sure "John" gets John\'s certificate. One wrong click and it\'s an awkward apology.' },
                                { icon: <Lock size={20} />, title: 'Data is meant to be private', desc: 'Why upload your participant list to a mysterious server? We do everything on your device.' },
                                { icon: <Zap size={20} />, title: 'Paying for utility', desc: 'Most "free" tools stop you at 10 exports. We don\'t care. Export 1,000 if you want.' },
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
                                The Difference
                            </p>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient max-w-2xl mx-auto">
                                Stop wasting your Sundays.
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
                            <RevealSection delay="reveal-delay-1">
                                <div className="h-full p-10 rounded-[2.5rem] border border-red-100 bg-red-50/30">
                                    <div className="text-red-600 font-bold uppercase text-[10px] tracking-widest mb-8 px-4 py-1.5 bg-red-100/50 rounded-full w-fit">
                                        The Low-Tech Nightmare
                                    </div>
                                    <ul className="space-y-6">
                                        {['200 separate browser tabs open', 'Copying names one-by-one into Canva', 'Downloading 200 files manually', 'Attaching files to 200 separate emails', 'Sending "John" the wrong certificate', 'An entire Sunday afternoon gone.'].map((text, i) => (
                                            <li key={i} className="flex items-start gap-3 text-red-900/40 text-sm italic">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-300 shrink-0" />
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </RevealSection>

                            <RevealSection delay="reveal-delay-2">
                                <div className="h-full p-10 rounded-[2.5rem] border border-blue-100 bg-blue-50/30 glass-card">
                                    <div className="text-blue-600 font-bold uppercase text-[10px] tracking-widest mb-8 px-4 py-1.5 bg-blue-100/50 rounded-full w-fit">
                                        The MailMyCertificate Flow
                                    </div>
                                    <ul className="space-y-6">
                                        {['One single template upload', 'CSV columns mapped in seconds', 'Batch generate zipped PDFs', 'Bulk send with Google Workspaces', 'Everything processed locally (Private)', 'Done before your coffee gets cold.'].map((text, i) => (
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
                                    <div className="bg-muted px-6 py-4 rounded-[2rem] rounded-bl-none max-w-md shadow-sm border border-border">
                                        <p className="text-sm text-secondary italic">&quot;Is there any tool to send 300 hackathon certificates without spending my whole weekend manually attaching PDFs?&quot;</p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-accent text-white px-6 py-4 rounded-[2rem] rounded-br-none max-w-sm shadow-lg shadow-accent/20">
                                        <p className="text-sm font-medium">Just use MailMyCertificate. It took me literally 2 minutes for a batch of 500. Life saver. 🙌</p>
                                    </div>
                                </div>
                            </div>
                        </RevealSection>

                        {/* ======================================
                            TIME SAVED CALCULATOR
                           ====================================== */}
                        <RevealSection delay="reveal-delay-4" className="mt-32 max-w-4xl mx-auto p-12 rounded-[3.5rem] bg-accent/5 border border-accent/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Clock size={120} />
                            </div>

                            <div className="relative z-10 text-center max-w-2xl mx-auto">
                                <p className="text-xs font-bold text-accent uppercase tracking-widest mb-4">Savings Calculator</p>
                                <h3 className="text-3xl font-bold mb-6">How much is your Sunday worth?</h3>
                                <p className="text-secondary mb-12">
                                    Number of certificates:
                                    <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-mono font-bold rounded-lg ml-3 text-2xl">{count}</span>
                                </p>

                                <input
                                    type="range"
                                    min="10"
                                    max="1000"
                                    step="10"
                                    value={count}
                                    onChange={(e) => setCount(parseInt(e.target.value))}
                                    className="custom-slider mb-12"
                                />

                                <div className="grid sm:grid-cols-2 gap-8 items-center bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-white">
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-red-500 mb-1">Manual Method</p>
                                        <p className="text-2xl font-bold">~{count * timePerCert} mins</p>
                                        <p className="text-xs text-secondary mt-1 italic">Stress, typos, and headache.</p>
                                    </div>
                                    <div className="text-left border-l border-border pl-8">
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-green-500 mb-1">MailMyCertificate</p>
                                        <p className="text-2xl font-bold">~60 secs</p>
                                        <p className="text-xs text-green-600 font-bold mt-1">Reclaimed {savedTime} hours. 🎉</p>
                                    </div>
                                </div>
                            </div>
                        </RevealSection>
                    </div>
                </section>

                {/* ======================================
                    WORKFLOW SECTION
                   ====================================== */}
                <section className="py-24 md:py-32 bg-muted/20 bg-grain subtle-grid border-y border-border/40">
                    <div className="container-width">
                        <RevealSection className="text-center mb-20">
                            <p className="text-sm font-bold text-accent uppercase tracking-[0.2em] mb-4">
                                The Workflow
                            </p>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gradient">
                                Four steps to freedom.
                            </h2>
                            <p className="text-secondary text-xl max-w-xl mx-auto">
                                No accounts, no configs, no nonsense.
                            </p>
                        </RevealSection>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
                            {[
                                { step: '01', icon: <Upload size={24} />, title: 'Drop your design', desc: 'Upload any JPG or PNG certificate template.' },
                                { step: '02', icon: <TableProperties size={24} />, title: 'Add your list', desc: 'Upload a CSV and map columns to fields.' },
                                { step: '03', icon: <FileDown size={24} />, title: 'Batch Generate', desc: 'Hundreds of personalized PDFs in seconds.' },
                                { step: '04', icon: <Mail size={24} />, title: 'Send it out', desc: 'Connect Google and bulk-send automatically.' },
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
                    PRODUCT DEMO SECTION
                   ====================================== */}
                <section id="demo" className="py-24 md:py-32 scroll-mt-20">
                    <div className="container-width">
                        <RevealSection className="text-center mb-20">
                            <p className="text-sm font-bold text-accent uppercase tracking-[0.2em] mb-4">
                                The Editor
                            </p>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gradient">
                                Simple, but powerful.
                            </h2>
                            <p className="text-secondary text-xl max-w-xl mx-auto">
                                Focus on the design, we&apos;ll handle the delivery.
                            </p>
                        </RevealSection>

                        <RevealSection>
                            <div className="relative max-w-6xl mx-auto">
                                {/* Feature cards */}
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                    {[
                                        { icon: <Zap size={18} />, title: 'Batch Processing', desc: 'Generate 500+ certificates without refreshing the tab.' },
                                        { icon: <Mail size={18} />, title: 'Direct Delivery', desc: 'Avoid the "attachment limit" nightmare with Google API.' },
                                        { icon: <Shield size={18} />, title: 'Local Privacy', desc: 'Files are processed on your RAM, not our servers.' },
                                        { icon: <Github size={18} />, title: 'Hackable', desc: 'Open source. Fork it, change it, make it yours.' },
                                    ].map((feature, i) => (
                                        <div key={i} className="group glass-morphism p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                                            <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                                                {feature.icon}
                                            </div>
                                            <h4 className="font-bold text-base mb-2">{feature.title}</h4>
                                            <p className="text-sm text-secondary leading-relaxed">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Product screenshot */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-accent/0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative rounded-3xl overflow-hidden border border-border shadow-[0_30px_100px_rgba(0,0,0,0.1)] bg-white">
                                        <div className="relative aspect-[16/10]">
                                            <Image src="/platform-preview.png" alt="MailMyCertificate visual editor" fill className="object-cover object-top" />
                                            <div className="absolute top-6 right-6">
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest shadow-xl">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                                    Active Preview
                                                </div>
                                            </div>
                                        </div>
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
                                <p className="text-sm font-bold text-accent uppercase tracking-[0.2em] mb-6">Reassurance</p>
                                <h2 className="text-4xl font-bold tracking-tight mb-8 text-gradient">
                                    Wait, is it <span className="marker-underline italic font-serif">really</span> free?
                                </h2>
                                <div className="space-y-8">
                                    {[
                                        { q: "Wll my data be sold?", a: "Never. Everything happens in your browser's RAM. We don't even have a database for your participants." },
                                        { q: "Is there a limit?", a: "Nope. Browser memory is your only limit." },
                                        { q: "Why is it free?", a: "Because tools for organizers shouldn't be paywalled." }
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
                                        <div key={i} className="p-8 rounded-[2rem] bg-background border border-border shadow-sm hover:border-accent/30 transition-all hover:-translate-y-1">
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
                                            <p className="text-xs text-accent font-bold uppercase tracking-widest mb-1">A note from Akshat</p>
                                            <p className="text-sm italic text-secondary text-balance">&quot;I built this tool because I spent too many nights manually emailing hackathon certificates. I hope it saves you time.&quot;</p>
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

                {/* ======================================
                    FINAL CTA
                   ====================================== */}
                <section className="py-24 md:py-40">
                    <div className="container-width">
                        <RevealSection>
                            <div className="relative rounded-[2.5rem] overflow-hidden bg-foreground text-white px-8 py-20 md:px-16 md:py-32 text-center shadow-3xl">
                                <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

                                <div className="relative z-10">
                                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                                        Ready to reclaim
                                        <br className="hidden md:block" />
                                        your <span className="text-accent">time?</span>
                                    </h2>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                                        <Link
                                            href="/tool"
                                            className={buttonVariants({
                                                variant: 'primary',
                                                size: 'lg',
                                                className: 'h-20 px-12 text-xl bg-white text-foreground hover:bg-gray-100 hover:scale-[1.05] transition-all duration-300',
                                            })}
                                        >
                                            Start Your First Batch
                                            <ArrowRight className="ml-2 w-6 h-6" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </RevealSection>
                    </div>
                </section>
            </main>

            <footer className="border-t border-border py-16 bg-background relative overflow-hidden">
                <div className="absolute inset-0 hero-grid opacity-[0.2] pointer-events-none" />
                <div className="container-width relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <Link href="/" className="brand-text block">
                                <span>Mail</span><span>My</span><span>Certificate</span>
                            </Link>
                            <p className="text-sm text-secondary max-w-sm leading-relaxed font-medium">
                                The world&apos;s most private bulk certificate generator. Engineered for performance, privacy, and organizers who value their time.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Product</h4>
                            <ul className="space-y-4 text-sm font-bold text-secondary">
                                <li><Link href="/tool" className="hover:text-accent transition-colors">Start Generating</Link></li>
                                <li><Link href="/about" className="hover:text-accent transition-colors">About Project</Link></li>
                                <li><Link href="https://github.com/akshatthakur22/MailMyCertficate" target="_blank" className="hover:text-accent transition-colors">Source Code</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Legal & Support</h4>
                            <ul className="space-y-4 text-sm font-bold text-secondary">
                                <li><Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                                <li><Link href="/cookies" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
                                <li><Link href="/disclaimer" className="hover:text-accent transition-colors">Disclaimer</Link></li>
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
