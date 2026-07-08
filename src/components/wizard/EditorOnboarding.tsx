'use client';

import { useEffect, useState, useRef } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

interface EditorOnboardingProps {
  fieldsCount: number;
  show: boolean;
}

/**
 * EditorOnboarding — Guided first-time experience for Step 3
 * Shows intelligent onboarding based on user progress
 */
export function EditorOnboarding({ fieldsCount, show }: EditorOnboardingProps) {
  const [dismissed, setDismissed] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (fieldsCount > 0 && !dismissedRef.current) {
      dismissedRef.current = true;
      setDismissed(true);
    }
  }, [fieldsCount]);

  if (!show || dismissed) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-40 rounded-xl">
      <div className="bg-white rounded-2xl border border-border shadow-xl p-8 max-w-md mx-4 space-y-6 animate-fade-in-up">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-xl bg-accent-light flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-accent" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Build your certificate
          </h2>
          <p className="text-sm text-secondary leading-relaxed">
            Drag fields from the left to position them on your certificate. It's just like Figma or Canva.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {[
            { num: 1, text: 'Select a field from the left sidebar' },
            { num: 2, text: 'Drag it onto the certificate' },
            { num: 3, text: 'Move, resize, and style it' },
            { num: 4, text: 'Repeat for all fields' },
          ].map((step, idx) => (
            <div key={step.num} className="flex gap-3 items-start">
              <div className="h-7 w-7 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold shrink-0">
                {step.num}
              </div>
              <p className="text-sm text-foreground leading-relaxed pt-0.5">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="flex gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
          <Zap className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900">
            <strong>Pro tip:</strong> Use Ctrl+Z to undo, Space to pan around
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => setDismissed(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          Let's go
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Dismiss hint */}
        <p className="text-xs text-secondary/60 text-center">
          This will hide after you add your first field
        </p>
      </div>
    </div>
  );
}
