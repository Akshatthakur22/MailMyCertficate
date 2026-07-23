import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { NotFoundIllustration } from '../components/NotFoundIllustration';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 — Page not found | MailMyCertificate',
  description:
    "The page you're looking for doesn't exist. Head back to MailMyCertificate to send certificates in bulk.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container-width px-4 sm:px-6 pt-24 sm:pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Illustration */}
          <div className="mb-12 sm:mb-16">
            <NotFoundIllustration />
          </div>

          {/* Content — editorial, warm */}
          <div className="text-center max-w-lg mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary mb-4">
              Page Not Found
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight mb-4">
              This certificate got
              <br />
              <span className="font-serif italic font-normal text-secondary">lost in transit.</span>
            </h1>
            <p className="text-base sm:text-lg text-secondary leading-relaxed mb-10">
              The page you&apos;re looking for doesn&apos;t exist. Maybe it was moved,
              or maybe it never existed. Either way, let&apos;s get you back on track.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Back to Home
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/tool"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
              >
                Open the Tool
              </Link>
            </div>

            {/* Helpful links */}
            <div className="border-t border-border pt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-4">
                Or try one of these
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { label: 'Guide', href: '/guide' },
                  { label: 'About', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Settings', href: '/settings' },
                ].map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-secondary hover:text-foreground hover:border-accent transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
