'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import type { ContactChannel } from '@/lib/analytics';

type ContactChannelLinkProps = ComponentProps<typeof Link> & {
  channel: ContactChannel;
};

/**
 * Tracks contact engagement (no form on site — maps to contact_form_submitted).
 */
export function ContactChannelLink({ channel, onClick, ...props }: ContactChannelLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(
          { event: 'contact_form_submitted', contact_channel: channel },
          { dedupeKey: `contact-${channel}` }
        );
        onClick?.(e);
      }}
    />
  );
}
