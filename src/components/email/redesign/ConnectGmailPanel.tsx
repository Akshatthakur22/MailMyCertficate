'use client';

import { Mail, Lock, Eye, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Globe, Github, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface ConnectGmailPanelProps {
  recipientCount: number;
  certificateCount: number;
  authenticating: boolean;
  onLogin: () => void;
  authenticated?: boolean;
  userEmail?: string | null;
  onLogout?: () => void;
}

export function ConnectGmailPanel({
  recipientCount,
  certificateCount,
  authenticating,
  onLogin,
  authenticated = false,
  userEmail = null,
  onLogout,
}: ConnectGmailPanelProps) {
  const trustPoints = [
    {
      icon: ShieldCheck,
      title: 'Your Gmail account sends',
      body: 'Emails come from you, not a third party. You stay in complete control of what goes out.',
    },
    {
      icon: Lock,
      title: 'We only send—nothing else',
      body: 'We cannot read your inbox, modify settings, or access any Gmail data. Sending only.',
    },
    {
      icon: Eye,
      title: 'Review before committing',
      body: 'You will see all recipients, your message, and a preview. Nothing sends without your approval.',
    },
  ];

  const privacyGuarantees = [
    { check: true, text: 'We never read your inbox.' },
    { check: true, text: 'We only request permission to send emails you approve.' },
    { check: true, text: 'No Gmail password is ever shared with us.' },
    { check: true, text: 'You can revoke access anytime from your Google Account.' },
  ];

  const securityFeatures = [
    { icon: Shield, label: 'Google OAuth', detail: 'Industry-standard authentication' },
    { icon: Globe, label: 'HTTPS Encrypted', detail: 'All data in transit secured' },
    { icon: CheckCircle2, label: 'Open Source', detail: 'Auditable, MIT licensed code' },
  ];

  return (
    <div className="space-y-5">
      {/* Main card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 lg:p-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              You&apos;re ready to send
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-secondary">
              {certificateCount} {certificateCount === 1 ? 'certificate' : 'certificates'} for {' '}
              {recipientCount} {recipientCount === 1 ? 'person' : 'people'}. Connect your Gmail account and we&apos;ll deliver them as personalized emails from you.
            </p>

            {/* Privacy-first section */}
            <div className="mt-7 rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-900 mb-3">Your privacy comes first</p>
              <ul className="space-y-2.5">
                {privacyGuarantees.map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-green-900">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Google verification notice */}
            <div className="mt-5 rounded-lg bg-blue-50 border border-blue-200 p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-900">Verification in progress</p>
                <p className="mt-1 text-xs leading-5 text-blue-800">
                  Google verification is currently under review. You may see an "App hasn't been verified" warning during sign-in. This is expected and temporary.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-7">
              {authenticated ? (
                <div className="space-y-3">
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-green-900">Connected as</p>
                      <p className="text-sm font-medium text-green-900 truncate">{userEmail}</p>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    disabled={authenticating}
                    className="w-full inline-flex items-center justify-center gap-2.5 rounded-lg px-5 py-3 font-medium transition-all border-2 border-gray-200 text-foreground hover:border-red-300 hover:bg-red-50 active:bg-red-100"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect Gmail</span>
                  </button>
                  <p className="text-xs text-secondary text-center">
                    Your access will be revoked. You can reconnect anytime.
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={onLogin}
                    disabled={authenticating}
                    className={`w-full inline-flex items-center justify-center gap-2.5 rounded-lg px-5 py-3 font-medium transition-all ${
                      authenticating
                        ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                        : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100'
                    }`}
                  >
                    {authenticating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Connecting…</span>
                      </>
                    ) : (
                      <>
                        {/* Google icon as SVG */}
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        <span>Sign in with Google</span>
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-xs text-secondary text-center">
                    You can disconnect anytime from your Google Account settings.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right panel - How it works */}
          <div className="border-t border-border bg-muted p-8 lg:border-l lg:border-t-0 lg:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">How it works</p>
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

      {/* Security & Trust section */}
      <div className="rounded-2xl border border-border bg-white p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-4">Security & Trust</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {securityFeatures.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="rounded-lg border border-border/50 bg-muted/40 p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-border">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="mt-1 text-xs text-secondary">{detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-3 justify-center text-xs">
          <Link href="/privacy-policy" className="text-secondary hover:text-foreground transition-colors underline">
            Privacy Policy
          </Link>
          <span className="text-border/50">•</span>
          <Link href="/contact" className="text-secondary hover:text-foreground transition-colors underline">
            Contact Support
          </Link>
          <span className="text-border/50">•</span>
          <a href="https://github.com/akshatthakur22/MailMyCertficate" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-foreground transition-colors underline flex items-center gap-1">
            <Github className="h-3 w-3" />
            GitHub
          </a>
        </div>
      </div>

      {/* Footer message */}
      <div className="rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/[0.02] border border-border/50 p-4 text-center">
        <p className="text-xs text-secondary leading-5">
          <span className="font-medium text-foreground">Your data stays under your control.</span>{' '}
          MailMyCertificate only sends emails after your explicit confirmation. All processing happens securely on Google's infrastructure using your credentials.
        </p>
      </div>
    </div>
  );
}

export default ConnectGmailPanel;
