'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

export function DesktopOnlyGuard({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-accent/5 rounded-[2rem] flex items-center justify-center text-accent mb-8">
                    <Smartphone size={40} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Studio Mode Requires Desktop</h2>
                <p className="text-secondary text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                    Our professional design studio is optimized for large screens. Please switch to a desktop or laptop to precisely position your fields.
                </p>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-secondary/40">
                    <Monitor size={14} />
                    <span>Works best on 1200px+ width</span>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
