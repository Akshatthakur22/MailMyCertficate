import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';

export function RecoverySection() {
  return (
    <section
      aria-labelledby="recovery-heading"
      className="relative mt-24 overflow-hidden rounded-3xl border border-border bg-muted/40 px-6 py-12 sm:mt-32 sm:px-12 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative max-w-lg">
        <h2
          id="recovery-heading"
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Still stuck?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-secondary sm:text-base">
          If you followed a link to get here, it&apos;s probably ours to fix.
          Tell us what you were looking for and we&apos;ll sort it out.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className={buttonVariants({
              variant: 'primary',
              size: 'lg',
              className: 'h-12 rounded-xl px-6 text-sm font-semibold',
            })}
          >
            Contact support
          </Link>
          <Link
            href="/guide"
            className={buttonVariants({
              variant: 'ghost',
              size: 'lg',
              className: 'h-12 rounded-xl px-6 text-sm font-semibold',
            })}
          >
            Read the guide
          </Link>
        </div>
      </div>
    </section>
  );
}

export function NotFoundFooterNote() {
  return (
    <p className="mt-16 pb-4 text-center text-xs text-secondary/60">
      MailMyCertificate — sending certificates shouldn&apos;t be this hard.
      This page, apparently, was.
    </p>
  );
}