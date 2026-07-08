import Link from 'next/link';
import { Github } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/config/github';

export function ProductFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-width py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="brand-text">
              <span>Mail</span><span>My</span><span>Certificate</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-secondary">
              The browser-first certificate platform for organizers who need fast generation,
              transparent privacy, and reliable Gmail delivery.
            </p>
            <Link
              href={GITHUB_REPO_URL}
              target="_blank"
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent"
            >
              <Github size={15} />
              View source on GitHub
            </Link>
          </div>

          <FooterColumn
            title="Product"
            links={[
              ['Open Tool', '/tool'],
              ['Guide', '/guide'],
              ['Gmail bulk send', '/send-certificates-gmail-bulk'],
              ['Google Sheets', '/google-sheets-certificate-generator'],
            ]}
          />
          <FooterColumn
            title="Trust"
            links={[
              ['Local data', '/settings'],
              ['Privacy policy', '/privacy-policy'],
              ['Terms', '/terms-of-service'],
              ['About', '/about'],
            ]}
          />
          <FooterColumn
            title="Open source"
            links={[
              ['GitHub', GITHUB_REPO_URL],
              ['Report issue', `${GITHUB_REPO_URL}/issues`],
              ['Request feature', `${GITHUB_REPO_URL}/issues/new`],
              ['Contact', '/contact'],
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>Built by Akshat Thakur for real certificate workflows.</p>
          <p>Generate locally. Send intentionally. Own your data.</p>
        </div>

        {/* Data & AI Compliance */}
        <div className="mt-8 pt-8 border-t border-border/40">
          <div className="text-xs text-secondary/70 space-y-2">
            <p className="font-medium text-foreground text-xs">Data & AI Compliance</p>
            <p>
              Data from Google Workspace APIs is processed locally in your browser and never used for AI training or sold.
              <Link href="/privacy-policy" className="text-accent hover:underline ml-1">Learn more</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-secondary">
        {links.map(([label, href]) => (
          <li key={`${title}-${label}`}>
            <Link
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              className="transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
