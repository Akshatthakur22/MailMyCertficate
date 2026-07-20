import Link from 'next/link';
import { ArrowRight, LifeBuoy } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/Button';

export function HeroContent() {
  return (
    <div className="max-w-xl">
      <p className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
        Error 404
      </p>

      <p
        aria-hidden="true"
        className="mt-6 font-serif text-[5.5rem] leading-[0.85] font-bold tracking-tight text-foreground sm:text-[7.5rem] lg:text-[8.5rem]"
      >
        404
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        This certificate got lost in the mail.
      </h1>

      <p className="mt-5 text-base leading-relaxed text-secondary sm:text-lg">
        The page you were looking for was moved, renamed, or never existed
        in the first place. Nothing on our end is broken — let&apos;s get
        you back on route.
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Link href="/">
          <Button size="lg" className="h-12 rounded-xl px-6 text-sm font-semibold shadow-lg shadow-accent/15">
            Return home
          </Button>
        </Link>

        <Link
          href="/tool"
          className={buttonVariants({
            variant: 'secondary',
            size: 'lg',
            className: 'h-12 gap-2 rounded-xl px-6 text-sm font-semibold',
          })}
        >
          Open tool
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/contact"
          className="inline-flex h-12 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-secondary transition-colors hover:text-foreground"
        >
          <LifeBuoy size={16} />
          Contact support
        </Link>
      </div>

      <div className="mt-8 space-y-1.5 text-sm text-secondary">
        <p>
          Trying to send certificates?{' '}
          <Link href="/tool" className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-accent">
            Open the tool
          </Link>
          .
        </p>
        <p>
          Looking for documentation?{' '}
          <Link href="/guide" className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-accent">
            Visit the guide
          </Link>
          .
        </p>
      </div>
    </div>
  );
}