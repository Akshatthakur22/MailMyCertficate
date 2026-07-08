import Link from 'next/link';
import { Github, ShieldCheck } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { buttonVariants } from '@/components/ui/Button';
import { GITHUB_REPO_URL } from '@/config/github';

interface ProductNavProps {
  active?: 'home' | 'about' | 'guide' | 'contact' | 'settings';
  compact?: boolean;
}

const navItems = [
  { href: '/about', label: 'About', key: 'about' },
  { href: '/guide', label: 'Guide', key: 'guide' },
  { href: '/settings', label: 'Local data', key: 'settings' },
  { href: '/contact', label: 'Contact', key: 'contact' },
] as const;

export function ProductNav({ active, compact = false }: ProductNavProps) {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="container-width flex flex-col gap-3 py-3 sm:min-h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <Link href="/" className="brand-text hover:opacity-80 transition-opacity" aria-label="MailMyCertificate home">
          <span>Mail</span><span>My</span><span>Certificate</span>
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {!compact && (
            <div className="hidden items-center gap-5 text-sm font-medium text-secondary md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors hover:text-foreground ${active === item.key ? 'text-foreground' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Link
              href={GITHUB_REPO_URL}
              target="_blank"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-medium text-secondary transition-colors hover:text-foreground"
            >
              <Github size={15} />
              <span className="hidden sm:inline">Source</span>
            </Link>
            <TrackToolCta
              href="/tool"
              entryPoint="navbar"
              className={buttonVariants({ variant: 'primary', size: 'sm', className: 'shadow-sm' })}
            >
              Open Tool
            </TrackToolCta>
          </div>

          {!compact && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-secondary md:hidden">
              {navItems.slice(0, 3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-border bg-white px-3 py-1.5 transition-colors hover:border-accent hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
