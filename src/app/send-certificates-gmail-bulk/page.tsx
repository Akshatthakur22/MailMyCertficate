import Link from 'next/link';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
import { ArrowRight, Check, Shield } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
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
        {/* Hero */}
        <section className="relative py-16 md:py-24 border-b border-border/50">
          <div className="absolute inset-0 hero-grid" />
          <div className="relative container-width max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground">Send Certificates via Gmail</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Send Certificates by Gmail in Bulk
            </h1>

            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> Generate personalized PDF certificates locally in your browser,
              connect your Gmail account via OAuth, compose a message, and send hundreds of certificates
              as email attachments — all without a third-party email service or uploading participant data.
            </p>

            <p className="text-secondary leading-relaxed mb-8">
              Built for hackathon organizers, workshop hosts, and educators who want delivery from
              their own inbox with full control and privacy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta
                href="/tool"
                entryPoint="gmail_bulk_page_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
              >
                Open Certificate Tool
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link
                href="/guide"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                Full visual guide
              </Link>
            </div>

            <LastUpdated path="/send-certificates-gmail-bulk" />
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="gmail-howto">
          <div className="container-width max-w-4xl">
            <h2 id="gmail-howto" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How do I send certificates by email using Gmail?
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              No SMTP configuration, no third-party mailer. MailMyCertificate uses official Google
              OAuth so emails come from your real Gmail address.
            </p>
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

        {/* Privacy section */}
        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="gmail-privacy">
          <div className="container-width max-w-4xl">
            <h2 id="gmail-privacy" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How does Gmail OAuth work here?
            </h2>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                When you click &quot;Connect Gmail,&quot; you authorize directly with Google — not with
                MailMyCertificate. We receive a temporary access token stored in your browser session
                (never on our servers).
              </p>
              <p>
                Emails are sent through the Gmail API from your own account. Recipients see your name
                and email as the sender. We never access your inbox, contacts, or other Gmail data.
              </p>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background">
                <Shield size={20} className="text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  MailMyCertificate requests only the <code className="text-xs bg-muted px-1 py-0.5 rounded">gmail.send</code> scope
                  — the minimum permission needed to send emails. No read access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="gmail-comparison">
          <div className="container-width max-w-5xl">
            <h2 id="gmail-comparison" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              MailMyCertificate vs other bulk email approaches
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">Comparison of certificate email delivery methods</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold text-foreground">Approach</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">Sender identity</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">Data upload</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">Cost</th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  <tr className="border-b border-border/50 bg-accent/5">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">MailMyCertificate + Gmail</th>
                    <td className="p-4"><Check size={16} className="inline text-green-700" aria-hidden="true" /> Your Gmail address</td>
                    <td className="p-4">None — local browser</td>
                    <td className="p-4">Free</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">SaaS certificate platforms</th>
                    <td className="p-4">Platform email or custom domain</td>
                    <td className="p-4">Full roster uploaded to vendor</td>
                    <td className="p-4">Per-certificate or subscription</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">Manual Gmail + attachments</th>
                    <td className="p-4"><Check size={16} className="inline text-green-700" aria-hidden="true" /> Your Gmail address</td>
                    <td className="p-4">None — but hours of manual labor</td>
                    <td className="p-4">Free (your time is not)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Sending limits — the question that actually blocks people */}
        <section
          className="py-16 md:py-20 border-b border-border/50 bg-muted/10"
          aria-labelledby="gmail-limits"
        >
          <div className="container-width max-w-4xl">
            <h2 id="gmail-limits" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How many certificates can I send in one day?
            </h2>
            <p className="text-secondary leading-relaxed mb-6" data-speakable>
              Your ceiling is Gmail&apos;s own daily sending limit, not anything MailMyCertificate
              imposes. Because messages go through your account, Google&apos;s quota applies exactly as
              it would if you sent them by hand. A free personal Gmail account has a noticeably lower
              daily allowance than a paid Google Workspace account, so a large batch may need to be
              split across two days on a personal address.
            </p>
            <p className="text-secondary leading-relaxed mb-6">
              Google publishes the current figures and adjusts them periodically, so check{' '}
              <Link
                href="https://support.google.com/mail/answer/22839"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-accent hover:underline"
              >
                Google&apos;s sending limits documentation
              </Link>{' '}
              rather than trusting a number quoted on a third-party page. Two practical
              consequences worth planning around:
            </p>
            <ul className="space-y-3 text-secondary list-disc pl-6 mb-6">
              <li>
                <strong className="text-foreground">Hitting the limit is not data loss.</strong> Your
                generated PDFs remain in the browser session, so you can resume sending the remainder
                once the quota resets.
              </li>
              <li>
                <strong className="text-foreground">Attachment size counts.</strong> A heavy template
                image produces heavy PDFs. Keeping certificates to a couple of megabytes each makes
                delivery faster and reduces the chance of a bounce.
              </li>
              <li>
                <strong className="text-foreground">Send a test to yourself first.</strong> One
                message confirms the subject line, body text and attachment name render the way you
                expect before several hundred people receive them.
              </li>
              <li>
                <strong className="text-foreground">
                  Download the ZIP if the roster is very large.
                </strong>{' '}
                Distributing through Discord, Slack or your LMS sidesteps email quotas entirely.
              </li>
            </ul>
            <p className="text-secondary leading-relaxed">
              If a message fails, the failure is reported per recipient so you can retry only the
              affected rows rather than resending the whole batch. For the full walkthrough of the
              send step, see the{' '}
              <Link href="/guide" className="text-accent hover:underline">
                step-by-step guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection
          faqs={[...GMAIL_BULK_PAGE_FAQS]}
          title="Gmail bulk certificate delivery FAQ"
          subtitle="Sending, limits, and privacy"
        />

        {/* CTA */}
        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Ready to send? Certificates + Gmail in minutes.
            </h2>
            <TrackToolCta
              href="/tool"
              entryPoint="gmail_bulk_page_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
            >
              Open certificate tool
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>
        <RelatedPages pageKey="gmailBulk" />

      </main>

      <ProductFooter />
    </div>
  );
}
