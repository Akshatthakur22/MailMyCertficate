'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Mail, AlertCircle } from 'lucide-react';

export function DesktopOnlyGuard({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
    const [forcedOverride, setForcedOverride] = useState(false);

    useEffect(() => {
        const checkSize = () => {
            // 768px breakpoint allows iPad support
            setIsMobile(window.innerWidth < 768);
        };
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    if (isMobile && !forcedOverride) {
        return (
            <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-background to-background/50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-accent/10 rounded-[2rem] flex items-center justify-center text-accent mb-8">
                    <Smartphone size={40} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-foreground">Field Placement Works Best on Desktop</h2>
                <p className="text-secondary text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                    Drag-and-drop field placement is optimized for mouse and larger screens, but you can try on this device if you prefer.
                </p>
                
                <div className="bg-accent/5 border border-accent/10 rounded-lg p-4 mb-8 max-w-sm">
                    <div className="flex items-start gap-3 text-left">
                        <Mail size={18} className="text-accent mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-foreground mb-1">💡 Tip:</p>
                            <p className="text-xs text-secondary leading-relaxed">
                                Your progress is saved locally. Switch to desktop, or return to this exact step by visiting the tool again on this device.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-sm">
                    <button
                        onClick={() => setForcedOverride(true)}
                        className="px-4 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <AlertCircle size={16} />
                        Try on this device
                    </button>
                    <p className="text-xs text-secondary">Use two fingers to pan, pinch to zoom</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-secondary/50 mt-6">
                    <Monitor size={14} />
                    <span>Recommended: 1024px+ width</span>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
