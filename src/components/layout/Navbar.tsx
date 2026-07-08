import Link from 'next/link';
import { Github, Star } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';

/**
 * Server Component — Global Navigation
 */
export function Navbar() {
  return (
    <nav
      className="fixed top-0 w-full z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="container-width flex flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <Link
          href="/"
          className="brand-text hover:opacity-80 transition-opacity"
          aria-label="MailMyCertificate — Go to homepage"
        >
          <span>Mail</span><span>My</span><span>Certificate</span>
        </Link>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end sm:justify-end">
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-secondary">
            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
            <Link href="/guide" className="hover:text-accent transition-colors">Guide</Link>
             <Link href="/settings" className="hover:text-accent transition-colors">Settings</Link>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
            <Link
              href="/tool"
              className={buttonVariants({ variant: 'primary', size: 'sm', className: 'w-full shadow-sm sm:w-auto' })}
            >
              Open Tool
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-secondary md:hidden">
            <Link href="/about" className="rounded-full border border-border bg-white px-3 py-1.5 hover:border-accent hover:text-accent transition-colors">About</Link>
            <Link href="/guide" className="rounded-full border border-border bg-white px-3 py-1.5 hover:border-accent hover:text-accent transition-colors">Guide</Link>
            <Link href="/contact" className="rounded-full border border-border bg-white px-3 py-1.5 hover:border-accent hover:text-accent transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
