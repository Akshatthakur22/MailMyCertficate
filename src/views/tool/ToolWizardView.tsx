'use client';

import { useAppStore } from '@/store/useAppStore';
import { StepIndicator } from '@/components/wizard/StepIndicator';
import { UploadTemplate } from '@/components/wizard/UploadTemplate';
import { UploadCSV } from '@/components/wizard/UploadCSV';
import { AdjustPreview } from '@/components/wizard/AdjustPreview';
import { GenerationView } from '@/components/wizard/GenerationView';
import Link from 'next/link';

import { cn } from '@/utils/cn';
import { DesktopOnlyGuard } from '@/components/guard/DesktopOnlyGuard';
import { PrivacyNotice } from '@/components/session/PrivacyNotice';
import { ManageLocalDataMenu } from '@/components/session/ManageLocalDataMenu';

const STEPS = ['Upload Template', 'Upload CSV', 'Adjust & Preview', 'Generate'];

export default function ToolWizardView() {
    const currentStep = useAppStore((state) => state.currentStep);
    const setCurrentStep = useAppStore((state) => state.setCurrentStep);

    const handleStepClick = (step: number) => {
        if (step < currentStep) {
            setCurrentStep(step);
        }
    };

    const isEditorStep = currentStep === 3;
    const contentMaxWidth = currentStep === 2 ? 'max-w-3xl' : 'max-w-2xl';

    return (
        <div
            className={cn(
                'flex flex-col bg-[#fafafa] font-sans relative',
                isEditorStep ? 'h-screen overflow-hidden' : 'min-h-screen',
            )}
        >
            <header className="border-b border-border/50 py-3.5 bg-white/80 backdrop-blur-md shrink-0 z-50 sticky top-0">
                <div className="container-width flex items-center justify-between">
                    <Link href="/" className="brand-text hover:opacity-80 transition-opacity">
                        <span>Mail</span><span>My</span><span>Certificate</span>
                    </Link>
                    <ManageLocalDataMenu variant="header" />
                </div>
            </header>

            <main
                className={cn(
                    'container-width relative z-10 mx-auto w-full',
                    isEditorStep
                        ? 'flex-1 min-h-0 flex flex-col py-4'
                        : 'py-8 md:py-12',
                    !isEditorStep && contentMaxWidth,
                )}
            >
                {isEditorStep ? (
                    <div className="flex-1 min-h-0 flex flex-col max-w-7xl mx-auto w-full py-2 gap-2">
                        <div className="shrink-0 px-1">
                            <StepIndicator
                                currentStep={currentStep}
                                steps={STEPS}
                                onStepClick={handleStepClick}
                                variant="inline"
                            />
                        </div>
                        <div className="flex-1 min-h-0 rounded-xl border border-border/60 bg-white overflow-hidden shadow-sm">
                            <DesktopOnlyGuard>
                                <AdjustPreview />
                            </DesktopOnlyGuard>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-border/60 bg-white shadow-sm">
                        <div className="px-6 md:px-8 pt-6 md:pt-8 pb-5 border-b border-border/40">
                            <StepIndicator
                                currentStep={currentStep}
                                steps={STEPS}
                                onStepClick={handleStepClick}
                            />
                        </div>

                        <div className="px-6 md:px-8 py-8 md:py-10">
                            {currentStep === 1 && <UploadTemplate />}
                            {currentStep === 2 && <UploadCSV />}
                            {currentStep === 4 && <GenerationView />}
                        </div>

                        <div className="px-6 md:px-8 py-3.5 border-t border-border/40 bg-muted/20">
                            <PrivacyNotice
                                compact
                                className="text-center text-secondary/60 text-[11px] leading-relaxed"
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
