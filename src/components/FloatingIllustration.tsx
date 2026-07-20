'use client';

import { useState } from 'react';
import { NotFoundIllustration } from './NotFoundIllustration';

const CAPTIONS = [
  'Still airborne, wrong airport.',
  'Recalculating the route…',
  'This one never made it to the mailbox.',
] as const;

export function FloatingIllustration() {
  const [captionIndex, setCaptionIndex] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-md mx-auto lg:max-w-none select-none">
      <button
        type="button"
        onClick={() =>
          setCaptionIndex((prev) =>
            prev === null ? 0 : (prev + 1) % CAPTIONS.length,
          )
        }
        aria-label="Nudge the lost certificate"
        className="block w-full rounded-3xl transition-transform duration-500 ease-out hover:-translate-y-1 hover:rotate-[0.5deg] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background animate-float"
      >
        <NotFoundIllustration />
      </button>

      <p
        aria-live="polite"
        className={`mt-4 text-center text-xs font-medium tracking-wide text-secondary transition-opacity duration-300 ${
          captionIndex === null ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {captionIndex !== null ? CAPTIONS[captionIndex] : '\u00A0'}
      </p>
    </div>
  );
}