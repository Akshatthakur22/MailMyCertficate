import Link from 'next/link';
import { ArrowRight, Mail, Shield, Zap } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { buttonVariants } from '@/components/ui/Button';
import {
  GMAIL_BULK_HOW_TO_STEPS,
  GMAIL_BULK_PAGE_FAQS,
} from '@/data/gmailBulkPageContent';

export default function SendCertificatesGmailBulkPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Navbar />

      <main className="flex-1 w-full pt-16">
        <section className="relative py-16 md:py-24 border-b border-border/50">
          <div className="absolute inset-0 hero-grid" />
          <div className="relative container-width max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground">Send Certificates via Gmail Bulk</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Send Certificates via Gmail in Bulk
            </h1>

            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> After generating certificates in MailMyCertificate, connect
              your Gmail account with OAuth, compose a personalized subject and body using column
              variables, and send each participant their PDF attachment — from your inbox, with live
              delivery tracking.
            </p>

            <p className="text-secondary leading-relaxed mb-8">
              No shared SMTP pool. No BCC chaos. One certificate per recipient, automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta
                href="/email"
                entryPoint="gmail_bulk_page_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
              >
                Open email delivery
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <TrackToolCta
                href="/tool"
                entryPoint="gmail_bulk_page_generate_first"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                Generate certificates first
              </TrackToolCta>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="gmail-howto">
          <div className="container-width max-w-4xl">
            <h2 id="gmail-howto" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How do I bulk send certificates through Gmail?
            </h2>
            <ol className="space-y-6 list-none pl-0">
              {GMAIL_BULK_HOW_TO_STEPS.map((step, index) => (
                <li key={step.name} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent border border-accent/20">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{step.name}</h3>
                    <p className="text-secondary text-sm leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="gmail-features">
          <div className="container-width max-w-4xl">
            <h2 id="gmail-features" className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Why organizers use Gmail delivery
            </h2>
            <ul className="grid md:grid-cols-3 gap-6 list-none pl-0">
              <li className="p-6 rounded-xl border border-border bg-background">
                <Mail className="text-accent mb-3" size={24} aria-hidden="true" />
                <h3 className="font-semibold text-foreground mb-2">Your sender identity</h3>
                <p className="text-sm text-secondary">
                  Recipients see mail from your organizer address, not a generic noreply@ vendor domain.
                </p>
              </li>
              <li className="p-6 rounded-xl border border-border bg-background">
                <Zap className="text-accent mb-3" size={24} aria-hidden="true" />
                <h3 className="font-semibold text-foreground mb-2">Personalized at scale</h3>
                <p className="text-sm text-secondary">
                  Use {'{{name}}'} and other column placeholders in subject and body for each row.
                </p>
              </li>
              <li className="p-6 rounded-xl border border-border bg-background">
                <Shield className="text-accent mb-3" size={24} aria-hidden="true" />
                <h3 className="font-semibold text-foreground mb-2">Official OAuth</h3>
                <p className="text-sm text-secondary">
                  Google OAuth with gmail.send scope — we never handle your Google password.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="gmail-example">
          <div className="container-width max-w-4xl">
            <h2 id="gmail-example" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Example email template
            </h2>
            <div className="rounded-xl border border-border bg-muted/20 p-6 font-mono text-sm text-secondary space-y-3">
              <p><strong className="text-foreground">Subject:</strong> Your certificate — {'{{event}}'}</p>
              <p className="text-foreground font-sans font-normal leading-relaxed">
                Hi {'{{name}}'},<br /><br />
                Congratulations! Your certificate is attached.<br />
                Thank you for participating in {'{{event}}'}.<br /><br />
                — The organizing team
              </p>
            </div>
            <p className="text-secondary text-sm mt-4">
              Detailed OAuth steps are in the{' '}
              <Link href="/guide" className="text-accent hover:underline font-medium">user guide</Link>.
            </p>
          </div>
        </section>

        <FAQSection
          faqs={[...GMAIL_BULK_PAGE_FAQS]}
          title="Gmail bulk send FAQ"
          subtitle="Delivery, limits, and privacy"
        />

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Certificates generated? Send them now.
            </h2>
            <TrackToolCta
              href="/email"
              entryPoint="gmail_bulk_page_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
            >
              Connect Gmail &amp; send
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 bg-background">
        <div className="container-width text-center text-sm text-secondary">
          <p>
            Related:{' '}
            <Link href="/google-sheets-certificate-generator" className="text-accent hover:underline">Google Sheets</Link>
            {' · '}
            <Link href="/guide" className="text-accent hover:underline">OAuth guide</Link>
            {' · '}
            <Link href="/privacy-policy" className="text-accent hover:underline">Privacy</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
