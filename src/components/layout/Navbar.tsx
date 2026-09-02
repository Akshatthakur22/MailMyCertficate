import Link from 'next/link';
import { Github } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { GITHUB_REPO_URL } from '@/config/github';

/**
 * Server Component — Global Navigation
 * Warm, minimal, editorial — matches the unified design identity.
 */
export function Navbar() {
  return (
    <nav
      className="fixed top-0 w-full z-50 border-b border-border bg-background/85 backdrop-blur-sm"
      aria-label="Main navigation"
    >
      <div className="container-width h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground hover:opacity-70 transition-opacity"
          aria-label="MailMyCertificate — Go to homepage"
        >
          MailMyCertificate
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-secondary">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/guide" className="hover:text-foreground transition-colors">Guide</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link href="/settings" className="hover:text-foreground transition-colors">Settings</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={GITHUB_REPO_URL}
              target="_blank"
              className="text-[13px] font-medium text-secondary hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Github size={15} />
              <span className="hidden sm:inline">Star</span>
            </Link>
            <Link
              href="/tool"
              className={buttonVariants({ variant: 'primary', size: 'sm' })}
            >
              Open Tool
            </Link>
          </div>
        </div>

        {/* Mobile nav links — visible only on small screens when needed */}
      </div>
    </nav>
  );
}
