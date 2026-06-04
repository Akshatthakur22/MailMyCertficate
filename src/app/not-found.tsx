'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center relative overflow-hidden">
            {/* Soft background accents */}
            <div className="absolute inset-0 hero-grid opacity-10 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] bg-accent/5 rounded-full blur-[90px]" />
            </div>

            <main className="relative z-10 w-full max-w-4xl">
                <div className="mx-auto px-4 sm:px-6 lg:px-0">
                    <div className="w-20 h-20 rounded-[1.6rem] bg-accent/10 flex items-center justify-center text-accent mx-auto mb-6 animate-float">
                        <Search size={36} strokeWidth={2.2} />
                    </div>

                    <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-4">
                        We lost this page
                    </h1>

                    <p className="mx-auto text-base sm:text-lg text-secondary max-w-2xl mb-8 leading-relaxed">
                        We searched high and low but couldn\'t find what you\'re looking for. Let\'s find a better place for you to go.
                    </p>

                    <div className="flex items-center justify-center">
                        <Link href="/">
                            <Button size="lg" className="w-full sm:w-auto h-14 sm:h-16 px-8 rounded-2xl text-base sm:text-lg font-black uppercase tracking-widest shadow-xl shadow-accent/20 gap-3 group">
                                <Home size={18} />
                                MailMyCertificate Home
                            </Button>
                        </Link>
                    </div>

                    <figure className="mt-8 sm:mt-12">
                        <svg className="w-56 sm:w-96 md:w-[520px] mx-auto" viewBox="0 0 600 380" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <ellipse cx="300" cy="320" rx="160" ry="30" fill="#0F172A" opacity="0.08" />
                            <path d="M180 270c20-80 60-110 120-110s100 30 120 110" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <path d="M240 130c0 0 12-28 48-28s48 28 48 28" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="#fff" />
                            <path d="M210 200c20-12 40-18 90-18s70 6 90 18" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <path d="M180 270c12 8 32 12 56 12h128c28 0 48-6 60-16" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                    </figure>

                    <div className="mt-8 text-xs sm:text-[11px] font-black uppercase tracking-wider text-secondary/40">
                        MailMyCertificate · Error v1.0
                    </div>
                </div>
            </main>
        </div>
    );
}
