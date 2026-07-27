import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getRelatedPages, type RelatedPagesKey } from '@/data/relatedPages';

type RelatedPagesProps = {
  pageKey: RelatedPagesKey;
  title?: string;
  subtitle?: string;
};

/**
 * In-body contextual internal links with descriptive anchor text.
 *
 * Deliberately not a repeat of the navbar: anchors describe the destination topic
 * so both crawlers and readers understand why the pages relate.
 */
export function RelatedPages({
  pageKey,
  title = 'Keep reading',
  subtitle = 'Related workflows and answers from the rest of the site.',
}: RelatedPagesProps) {
  const links = getRelatedPages(pageKey);

  return (
    <section
      className="py-16 md:py-20 border-t border-border/50 bg-muted/10"
      aria-labelledby="related-pages-heading"
    >
      <div className="container-width max-w-4xl">
        <h2
          id="related-pages-heading"
          className="text-2xl md:text-3xl font-bold tracking-tight mb-2"
        >
          {title}
        </h2>
        <p className="text-secondary mb-8">{subtitle}</p>

        <ul className="grid gap-4 sm:grid-cols-2 list-none pl-0">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-xl border border-border/60 bg-background p-5 transition-colors hover:border-accent/50 hover:bg-accent/5"
              >
                <span className="mb-1 flex items-center gap-2 font-semibold text-foreground group-hover:text-accent">
                  {link.label}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-sm leading-relaxed text-secondary">{link.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
