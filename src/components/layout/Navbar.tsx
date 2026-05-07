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
      <div className="container-width flex justify-between items-center h-16">
        <Link
          href="/"
          className="brand-text hover:opacity-80 transition-opacity"
          aria-label="MailMyCertificate — Go to homepage"
        >
          <span>Mail</span><span>My</span><span>Certificate</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-secondary">
            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
            <Link href="/guide" className="hover:text-accent transition-colors">Guide</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tool"
              className={buttonVariants({ variant: 'primary', size: 'sm', className: 'shadow-sm' })}
            >
              Open Tool
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
