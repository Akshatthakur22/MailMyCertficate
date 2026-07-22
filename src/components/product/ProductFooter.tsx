import Link from 'next/link';
import { Github, Shield } from 'lucide-react';
import { CreatorProfile } from '@/components/product/CreatorProfile';
import { GITHUB_REPO_URL } from '@/config/github';

export function ProductFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="container-width py-12">
        {/* Main Footer Grid */}
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-foreground hover:opacity-70 transition-opacity">
              MailMyCertificate
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-secondary">
              The browser-first certificate platform for organizers who need fast generation,
              transparent privacy, and reliable Gmail delivery.
            </p>
            <Link
              href={GITHUB_REPO_URL}
              target="_blank"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent"
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

        {/* Privacy & Other Projects */}
        <div className="mt-10 pt-10 border-t border-border/60 space-y-4">
          {/* Data Privacy */}
          <div className="flex items-start gap-3 text-xs text-secondary">
            <Shield size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="leading-relaxed">
                Data from Google Workspace APIs is processed locally in your browser and{' '}
                <Link href="/privacy-policy" className="text-accent hover:underline font-medium">
                  never used for AI training or sold.
                </Link>
              </p>
            </div>
          </div>

          {/* Other Projects */}
          <div className="text-xs text-secondary/60">
            Other projects:{' '}
            <Link href="https://safexam.in" target="_blank" className="text-accent hover:underline">
              SafeExam
            </Link>
            {' '}&middot;{' '}
            <Link href="https://calcuzy.app" target="_blank" className="text-accent hover:underline">
              Calcuzy
            </Link>
            {' '}&middot;{' '}
            <Link href="https://priyasarvutthan.org" target="_blank" className="text-accent hover:underline">
              Priya Sarv Utthan
            </Link>
          </div>
        </div>

        {/* Creator */}
        <div className="mt-10 pt-10 border-t border-border/60 flex justify-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-4">
              Created by
            </p>
            <CreatorProfile variant="compact" showLinks={true} />
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
