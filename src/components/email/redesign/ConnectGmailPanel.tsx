'use client';

import { Mail, Lock, Eye, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConnectGmailPanelProps {
  recipientCount: number;
  certificateCount: number;
  authenticating: boolean;
  onLogin: () => void;
}

export function ConnectGmailPanel({
  recipientCount,
  certificateCount,
  authenticating,
  onLogin,
}: ConnectGmailPanelProps) {
  const trustPoints = [
    {
      icon: Lock,
      title: 'Only send—never read or store',
      body: 'We only send emails. We never read your inbox, store emails, or access Gmail data after sending.',
    },
    {
      icon: Eye,
      title: 'Review everything before sending',
      body: 'You will see recipients, the message, and a live preview before a single email goes out.',
    },
    {
      icon: ShieldCheck,
      title: 'Your Gmail account sends it',
      body: 'Emails appear from you, not from a third party. Complete control over what goes out.',
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-8 lg:p-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light">
            <Mail className="h-6 w-6 text-accent" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
            Connect Gmail to send your certificates
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-secondary">
            You have {certificateCount} {certificateCount === 1 ? 'certificate' : 'certificates'} ready for{' '}
            {recipientCount} {recipientCount === 1 ? 'recipient' : 'recipients'}. Connect your Gmail account to
            deliver them as personalized emails.
          </p>

          <div className="mt-7">
            <Button
              variant="primary"
              size="md"
              onClick={onLogin}
              disabled={authenticating}
              className="inline-flex items-center gap-2"
            >
              {authenticating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Connect Gmail
                </>
              )}
            </Button>
            <p className="mt-3 text-xs text-secondary">Secure sign-in via Google OAuth.</p>
          </div>
        </div>

        <div className="border-t border-border bg-muted p-8 lg:border-l lg:border-t-0 lg:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Why this is safe</p>
          <ul className="mt-4 space-y-5">
            {trustPoints.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-accent shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-secondary">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ConnectGmailPanel;
