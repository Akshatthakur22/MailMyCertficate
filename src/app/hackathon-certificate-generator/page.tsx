import Link from 'next/link';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
import { ArrowRight, Check, X } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
import { buttonVariants } from '@/components/ui/Button';
import {
  HACKATHON_HOW_TO_STEPS,
  HACKATHON_PAGE_FAQS,
} from '@/data/hackathonPageContent';

export default function HackathonCertificateGeneratorPage() {
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
              <span className="text-foreground">Hackathon Certificate Generator</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Hackathon Certificate Generator
            </h1>

            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> Use MailMyCertificate to generate personalized hackathon
              certificates in bulk — import participants from Devfolio, Unstop, Google Forms, or any
              CSV export, upload your template, and create hundreds of PDFs locally in seconds.
              Send via Gmail or download as ZIP.
            </p>

            <p className="text-secondary leading-relaxed mb-8">
              Built for organizers who run hackathons, coding competitions, and tech events
              and need fast certificate delivery without uploading participant data to third-party services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta
                href="/tool"
                entryPoint="hackathon_page_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
              >
                Generate Hackathon Certificates
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link
                href="/guide"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                Full visual guide
              </Link>
            </div>

            <LastUpdated path="/hackathon-certificate-generator" />
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="hackathon-howto">
          <div className="container-width max-w-4xl">
            <h2 id="hackathon-howto" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How do I generate certificates for my hackathon?
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              Whether you have 50 or 500 participants, the workflow is the same.
              Import → Design → Generate → Send.
            </p>
            <ol className="space-y-6 list-none pl-0">
              {HACKATHON_HOW_TO_STEPS.map((step, index) => (
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

        {/* Use cases */}
        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="hackathon-usecases">
          <div className="container-width max-w-4xl">
            <h2 id="hackathon-usecases" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Works for all types of tech events
            </h2>
            <ul className="space-y-3 text-secondary list-disc pl-6">
              <li><strong className="text-foreground">24-hour hackathons</strong> — Generate winner, runner-up, and participation certificates in one session.</li>
              <li><strong className="text-foreground">Coding competitions</strong> — Import results from HackerRank, LeetCode, or custom judge exports.</li>
              <li><strong className="text-foreground">Multi-day tech fests</strong> — Run separate batches for each event track.</li>
              <li><strong className="text-foreground">Online hackathons</strong> — Deliver certificates directly via Gmail to remote participants.</li>
              <li><strong className="text-foreground">College club events</strong> — Free tool with no budget needed for student organizations.</li>
            </ul>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="hackathon-comparison">
          <div className="container-width max-w-5xl">
            <h2 id="hackathon-comparison" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How MailMyCertificate compares for hackathon organizers
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">Comparison of hackathon certificate approaches</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold text-foreground">Approach</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">Bulk generation</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">Privacy</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">Cost</th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  <tr className="border-b border-border/50 bg-accent/5">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">MailMyCertificate</th>
                    <td className="p-4"><Check size={16} className="inline text-green-700" aria-hidden="true" /> Unlimited, local</td>
                    <td className="p-4">Browser-only, no uploads</td>
                    <td className="p-4">Free (MIT)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">Manual Canva editing</th>
                    <td className="p-4"><X size={16} className="inline" aria-hidden="true" /> One at a time</td>
                    <td className="p-4">Local but hours of work</td>
                    <td className="p-4">Free tier limits</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">SaaS platforms (Certifier, etc.)</th>
                    <td className="p-4"><Check size={16} className="inline text-green-700" aria-hidden="true" /> Bulk via cloud</td>
                    <td className="p-4">Data uploaded to vendor</td>
                    <td className="p-4">Paid tiers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Operational advice specific to hackathons */}
        <section
          className="py-16 md:py-20 border-b border-border/50"
          aria-labelledby="hackathon-timing"
        >
          <div className="container-width max-w-4xl">
            <h2 id="hackathon-timing" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              When should you send hackathon certificates?
            </h2>
            <p className="text-secondary leading-relaxed mb-6" data-speakable>
              Within 48 hours of closing ceremony, while the event is still fresh enough that people
              will actually post about it. Certificates that arrive three weeks later get archived
              unread, and the goodwill you were trying to generate goes with them.
            </p>
            <p className="text-secondary leading-relaxed mb-6">
              That deadline is easier to hit if you prepare during the event rather than after it.
              A few things worth doing while the hackathon is still running:
            </p>
            <ul className="space-y-3 text-secondary list-disc pl-6 mb-8">
              <li>
                <strong className="text-foreground">Export the roster before judging ends.</strong>{' '}
                Registration data is already final; only the results column is outstanding, so the
                import and field placement can be done in advance.
              </li>
              <li>
                <strong className="text-foreground">Add a role column from the start.</strong> Values
                such as Winner, Runner-up, Finalist, Participant and Mentor let you filter the same
                sheet into separate batches instead of maintaining several files.
              </li>
              <li>
                <strong className="text-foreground">Design templates before the weekend.</strong>{' '}
                Sponsor logos and signatures rarely change at the last minute; participant names do.
              </li>
              <li>
                <strong className="text-foreground">Verify the email column early.</strong> Typos in
                addresses collected at registration are the single most common reason a certificate
                never arrives, and they are easier to chase while people are still on site.
              </li>
              <li>
                <strong className="text-foreground">Decide who sends.</strong> Delivery comes from
                one organizer&apos;s Gmail account, so agree in advance whose address participants
                should see and reply to.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3">
              Running multiple certificate types
            </h3>
            <p className="text-secondary leading-relaxed">
              Most hackathons need at least three variants: participation for everyone, placement for
              the top teams, and recognition for mentors and judges. Keep one spreadsheet as the
              source of truth, filter it by role, and run a batch per template. Because generation is
              local and unlimited, running four small batches costs nothing beyond the few minutes of
              repeating the field placement step. Mentors and judges are worth remembering — they are
              usually the people you will want to invite back next year.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection
          faqs={[...HACKATHON_PAGE_FAQS]}
          title="Hackathon certificate FAQ"
          subtitle="Common questions from event organizers"
        />

        {/* CTA */}
        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Hackathon over? Ship certificates before participants forget.
            </h2>
            <TrackToolCta
              href="/tool"
              entryPoint="hackathon_page_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
            >
              Open certificate tool
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>
        <RelatedPages pageKey="hackathon" />

      </main>

      <ProductFooter />
    </div>
  );
}
