'use client';

import { useAppStore } from '@/store/useAppStore';
import { StepIndicator } from '@/components/wizard/StepIndicator';
import { UploadTemplate } from '@/components/wizard/UploadTemplate';
import { UploadCSV } from '@/components/wizard/UploadCSV';
import { AdjustPreview } from '@/components/wizard/AdjustPreview';
import { GenerationView } from '@/components/wizard/GenerationView';
import Link from 'next/link';
import { FileText } from 'lucide-react';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { DesktopOnlyGuard } from '@/components/guard/DesktopOnlyGuard';


const STEPS = ["Upload Template", "Upload CSV", "Adjust & Preview", "Generate"];

export default function ToolWizardView() {
    const currentStep = useAppStore((state) => state.currentStep);
    const setCurrentStep = useAppStore((state) => state.setCurrentStep);

    const handleStepClick = (step: number) => {
        // Validation logic can go here (e.g., prevent skipping ahead if not valid)
        // For now, simpler: only allow navigating to steps < currentStep
        if (step < currentStep) {
            setCurrentStep(step);
        }
    };

    const breadcrumbItems = [
        { label: 'Tool', href: '/tool' },
        { label: STEPS[currentStep - 1], isCurrent: true }
    ];

    return (
        <div className="flex flex-col h-screen bg-background font-sans relative overflow-hidden">
            {/* Background elements for continuity */}
            <div className="absolute inset-0 subtle-grid opacity-[0.2] pointer-events-none" />
            <div className="bg-grain fixed inset-0 opacity-[0.03] pointer-events-none" />

            {/* Header - More compact for tool view */}
            <header className="border-b border-border/60 py-3 bg-background/70 backdrop-blur-xl shrink-0 z-50">
                <div className="container-width flex items-center justify-between">
                    <Link href="/" className="brand-text hover:opacity-80 transition-opacity">
                        <span>Mail</span><span>My</span><span>Certificate</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[9px] text-accent font-black uppercase tracking-widest leading-none mb-1">Status</span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] text-secondary font-bold uppercase tracking-tight">Active Session</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col min-h-0 container-width pt-6 pb-6 relative z-10">
                <div className="flex-1 flex flex-col min-h-0 max-w-6xl mx-auto w-full">
                    <div className="mb-6 flex items-center justify-between shrink-0">
                        <Breadcrumbs items={breadcrumbItems} />
                        <div className="px-3 py-1 bg-accent/5 border border-accent/10 rounded-full text-[10px] text-accent font-bold uppercase tracking-widest hidden sm:block">
                            Local & Private
                        </div>
                    </div>

                    <div className="shrink-0 mb-8">
                        <StepIndicator
                            currentStep={currentStep}
                            steps={STEPS}
                            onStepClick={handleStepClick}
                        />
                    </div>

                    <div className="flex-1 min-h-0 flex flex-col relative">
                        <div className="flex-1 min-h-0 glass-card rounded-[2rem] border-white/40 shadow-2xl relative overflow-hidden flex flex-col">
                            {currentStep === 1 && <div className="p-8 md:p-12 overflow-y-auto h-full"><UploadTemplate /></div>}
                            {currentStep === 2 && <div className="p-8 md:p-12 overflow-y-auto h-full"><UploadCSV /></div>}
                            {currentStep === 3 && (
                                <DesktopOnlyGuard>
                                    <AdjustPreview />
                                </DesktopOnlyGuard>
                            )}
                            {currentStep === 4 && <div className="p-8 md:p-12 overflow-y-auto h-full"><GenerationView /></div>}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
