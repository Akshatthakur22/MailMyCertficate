import Link from 'next/link';
import { Github, Shield } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/config/github';

export function ProductFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="container-width py-12">

        {/* Main Footer Grid — 5 columns */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-foreground hover:opacity-70 transition-opacity">
              MailMyCertificate
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-secondary">
              Free, open-source bulk certificate generator. Create personalized PDF certificates
              from CSV or Google Sheets and send them via Gmail. Runs entirely in your browser.
            </p>
            <Link href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent">
              <Github size={15} />
              View source on GitHub
            </Link>
          </div>

          {/* Use Cases column — keyword-anchored links */}
          <FooterColumn
            title="Use Cases"
            links={[
              ['Hackathon certificates', '/hackathon-certificate-generator'],
              ['Workshop certificates', '/workshop-certificate-generator'],
              ['Webinar certificates', '/webinar-certificate-generator'],
              ['Google Sheets → PDF', '/google-sheets-certificate-generator'],
              ['Google Forms → Certs', '/google-forms-to-certificates'],
              ['Send via Gmail bulk', '/send-certificates-gmail-bulk'],
            ]}
          />

          {/* Compare column */}
          <FooterColumn
            title="Compare"
            links={[
              ['vs Certifier', '/vs/certifier'],
              ['vs Canva', '/vs/canva'],
              ['vs Certify\'em', '/vs/certifyem'],
              ['From Excel / CSV', '/certificate-generator-from-excel'],
              ['Free templates', '/free-certificate-templates'],
            ]}
          />

          {/* Learn column */}
          <FooterColumn
            title="Learn"
            links={[
              ['Step-by-step guide', '/guide'],
              ['Blog', '/blog'],
              ['How to send certs', '/blog/how-to-send-certificates-to-participants'],
              ['Best cert generators', '/blog/best-free-certificate-generators'],
              ['About this project', '/about'],
              ['Contact', '/contact'],
            ]}
          />

          {/* Trust column */}
          <FooterColumn
            title="Trust"
            links={[
              ['Privacy policy', '/privacy-policy'],
              ['Terms of service', '/terms-of-service'],
              ['Open source code', GITHUB_REPO_URL],
              ['Report a bug', `${GITHUB_REPO_URL}/issues`],
              ['Request a feature', `${GITHUB_REPO_URL}/issues/new`],
            ]}
          />
        </div>

        {/* Bottom strip */}
        <div className="mt-10 pt-8 border-t border-border/60 space-y-4">

          {/* Data Privacy notice — Google mandated */}
          <div className="flex items-start gap-3 text-xs text-secondary">
            <Shield size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              Data from Google Workspace APIs is processed locally in your browser and{' '}
              <Link href="/privacy-policy" className="text-accent hover:underline font-medium">
                never used for AI training or sold to third parties.
              </Link>
            </p>
          </div>

          {/* Creator attribution + other projects */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-secondary/60">
            <p>
              Built by{' '}
              <Link href="https://github.com/akshatthakur22" target="_blank" rel="noopener noreferrer"
                className="text-accent hover:underline">
                Akshat Thakur
              </Link>
              {' '}· MIT licence · Free forever
            </p>
            <p>
              Other projects:{' '}
              <Link href="https://safexam.in" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">SafeExam</Link>
              {' '}&middot;{' '}
              <Link href="https://calcuzy.app" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Calcuzy</Link>
              {' '}&middot;{' '}
              <Link href="https://priyasarvutthan.org" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Priya Sarv Utthan</Link>
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
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
