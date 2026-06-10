'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

type TrackToolCtaProps = ComponentProps<typeof Link> & {
  entryPoint: string;
};

/**
 * Wraps "Open Tool" CTAs to fire sign_up_started before navigation.
 */
export function TrackToolCta({ entryPoint, onClick, href, ...props }: TrackToolCtaProps) {
  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        trackEvent(
          { event: 'sign_up_started', entry_point: entryPoint },
          { dedupeKey: entryPoint }
        );
        onClick?.(e);
      }}
    />
  );
}
