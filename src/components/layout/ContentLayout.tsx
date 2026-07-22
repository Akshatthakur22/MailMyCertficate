'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';

interface ContentLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}

export function ContentLayout({ title, subtitle, children, className }: ContentLayoutProps) {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background Grid & Blobs */}
            <div className="absolute inset-0 hero-grid opacity-[0.4] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float pointer-events-none" />
            <div className="absolute top-1/2 -right-24 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '-2s' }} />

            {/* Navigation */}
            <nav className="h-20 flex items-center border-b border-border/40 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container-width flex justify-center items-center">
                    <Link href="/" className="brand-text hover:opacity-80 transition-opacity">
                        <span>Mail</span><span>My</span><span>Certificate</span>
                    </Link>
                </div>
            </nav>


            {/* Content Container */}
            <main className="flex-1 py-12 px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
                        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 hover:text-accent transition-colors">Home</Link>
                        <div className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{title}</span>
                    </nav>

                    {/* Header */}
                    <header className="mb-20 text-left animate-in fade-in slide-in-from-top-4 duration-700">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-gradient">{title}</h1>
                        {subtitle && <p className="text-lg text-secondary/80 max-w-2xl font-medium">{subtitle}</p>}
                    </header>


                    {/* Content Paper */}
                    <article className={cn(
                        "glass-morphism rounded-[2.5rem] p-8 md:p-16 animate-in fade-in slide-in-from-bottom-8 duration-1000",
                        "prose prose-slate prose-lg max-w-none shadow-2xl shadow-accent/5",
                        "prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground",
                        "prose-p:text-secondary prose-p:leading-relaxed prose-p:font-medium",
                        "prose-li:text-secondary prose-li:font-medium",
                        "prose-strong:text-foreground prose-strong:font-black",
                        "prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border/40",
                        className
                    )}>
                        {children}
                    </article>

                    {/* Footer for Legal Pages */}
                    <div className="mt-20 text-center text-xs font-black uppercase tracking-[0.2em] text-secondary/30">
                        © {new Date().getFullYear()} MailMyCertificate · Local Workstation v1.0
                    </div>
                </div>
            </main>
        </div>
    );
}
