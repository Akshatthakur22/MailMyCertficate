import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { quickLinks } from '../lib/not-found-data';

export function QuickLinksSection() {
  return (
    <section aria-labelledby="quick-links-heading" className="mt-28 sm:mt-36">
      <h2
        id="quick-links-heading"
        className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary"
      >
        Popular destinations
      </h2>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map(({ label, description, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                </div>
                <p className="mt-4 text-base font-semibold text-foreground">
                  {label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-secondary">
                  {description}
                </p>
              </div>

              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="mt-4 text-secondary transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}