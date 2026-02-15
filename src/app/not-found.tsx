'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
            {/* Background Decor */}
            <div className="absolute inset-0 hero-grid opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="w-24 h-24 rounded-[2rem] bg-accent/10 flex items-center justify-center text-accent mx-auto mb-8 animate-float">
                    <Search size={40} strokeWidth={2.5} />
                </div>

                <h1 className="text-8xl font-black tracking-tighter mb-4 text-gradient">404</h1>
                <h2 className="text-3xl font-bold tracking-tight mb-6">Lost in the process?</h2>
                <p className="text-secondary text-lg max-w-md mx-auto mb-12 font-medium">
                    We couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
                </p>

                <Link href="/">
                    <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-accent/20 gap-3 group">
                        <Home size={20} />
                        Back to Safety
                    </Button>
                </Link>
            </div>

            <div className="mt-20 text-[10px] font-black uppercase tracking-[0.3em] text-secondary/30">
                MailMyCertificate · Error Logic v1.0
            </div>
        </div>
    );
}
