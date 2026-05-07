'use client';

import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

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
   Time Calculator Component
   ———————————————————————————————————————————————————— */
function TimeCalculator() {
    const [count, setCount] = useState(100);
    const timePerCert = 3; // minutes manually
    const savedTime = Math.round((count * timePerCert) / 60);

    return (
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
    );
}

export { RevealSection, HandwrittenArrow, TimeCalculator };
