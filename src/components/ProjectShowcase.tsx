import { ArrowUpRight } from 'lucide-react';
import { otherProjects } from '@/lib/not-found-data';

export function ProjectShowcase() {
  return (
    <section aria-labelledby="projects-heading" className="mt-20 sm:mt-24">
      <div className="max-w-xl">
        <h2
          id="projects-heading"
          className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary"
        >
          More from the same maker
        </h2>
        <p className="mt-2 text-sm text-secondary">
          MailMyCertificate is one of a few things being built. Here are the
          others.
        </p>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {otherProjects.map(({ name, url, description, initials }) => (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-muted/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-background hover:shadow-xl hover:shadow-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-sm font-bold text-foreground">
                  {initials}
                </span>
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="text-secondary transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
              </div>

              <div className="mt-6">
                <p className="text-base font-semibold text-foreground">
                  {name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-secondary">
                  {description}
                </p>
              </div>

              <span className="mt-4 truncate text-xs font-medium text-secondary/70">
                {url.replace('https://', '')}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}