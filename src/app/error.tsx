'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-red-50 flex items-center justify-center text-red-500 mb-8 border border-red-100">
                <AlertCircle size={40} />
            </div>

            <h2 className="text-3xl font-black tracking-tight mb-4">Something went wrong</h2>
            <p className="text-secondary mb-12 max-w-md mx-auto font-medium">
                An unexpected error occurred in the application. We&apos;ve been notified and are looking into it.
            </p>

            <Button
                onClick={() => reset()}
                variant="secondary"
                size="lg"
                className="h-16 px-10 rounded-2xl text-lg font-black uppercase tracking-widest gap-3"
            >
                <RefreshCcw size={20} />
                Try Again
            </Button>
        </div>
    );
}
