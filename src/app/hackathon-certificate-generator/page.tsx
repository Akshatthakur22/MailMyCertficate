import Link from 'next/link';
import { ArrowRight, Clock, Trophy, Users } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
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
              <strong>Answer:</strong> Import your hackathon roster from CSV or Google Sheets,
              generate winner and participant certificates locally in your browser, and bulk email
              PDFs from your Gmail — free, with no per-team export limits and no upload of hacker
              data to a third-party SaaS.
            </p>

            <p className="text-secondary leading-relaxed mb-8">
              Built by an organizer who shipped 300+ club event certificates overnight. Designed for
              the gap between judging ends and your closing ceremony.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta
                href="/tool"
                entryPoint="hackathon_page_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
              >
                Generate hackathon certificates
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link
                href="/send-certificates-gmail-bulk"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                Bulk Gmail send
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="hackathon-howto">
          <div className="container-width max-w-4xl">
            <h2 id="hackathon-howto" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How do I send hackathon certificates after judging?
            </h2>
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

        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="hackathon-use-cases">
          <div className="container-width max-w-4xl">
            <h2 id="hackathon-use-cases" className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Common hackathon certificate batches
            </h2>
            <ul className="space-y-4 list-none pl-0">
              <li className="flex gap-4 p-5 rounded-xl border border-border bg-background">
                <Trophy className="text-accent shrink-0 mt-0.5" size={22} aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-foreground">Winners &amp; track prizes</h3>
                  <p className="text-sm text-secondary mt-1">
                    Filter your judging sheet to winners only, use a gold template, generate, send.
                    Repeat for each track with a different design.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 p-5 rounded-xl border border-border bg-background">
                <Users className="text-accent shrink-0 mt-0.5" size={22} aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-foreground">All participants</h3>
                  <p className="text-sm text-secondary mt-1">
                    Import the full registration export — every hacker who checked in gets a
                    participation certificate.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 p-5 rounded-xl border border-border bg-background">
                <Clock className="text-accent shrink-0 mt-0.5" size={22} aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-foreground">Mentors &amp; volunteers</h3>
                  <p className="text-sm text-secondary mt-1">
                    Separate CSV with mentor emails. Thank-you certificates before sponsors leave the
                    venue.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="hackathon-privacy">
          <div className="container-width max-w-4xl">
            <h2 id="hackathon-privacy" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Is hacker data safe on a hackathon floor?
            </h2>
            <p className="text-secondary leading-relaxed mb-4">
              MailMyCertificate keeps rosters and PDFs in the organizer&apos;s browser (IndexedDB).
              That matters when you are on venue Wi‑Fi and do not want attendee emails on an unknown
              vendor server.
            </p>
            <p className="text-secondary leading-relaxed">
              Read how we built this after a real college club event on the{' '}
              <Link href="/about" className="text-accent hover:underline font-medium">about page</Link>.
            </p>
          </div>
        </section>

        <FAQSection
          faqs={[...HACKATHON_PAGE_FAQS]}
          title="Hackathon certificate FAQ"
          subtitle="Judging day → inbox delivery"
        />

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Judging done? Ship certificates before the livestream ends.
            </h2>
            <TrackToolCta
              href="/tool"
              entryPoint="hackathon_page_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
            >
              Start your hackathon batch
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 bg-background">
        <div className="container-width text-center text-sm text-secondary">
          <p>
            Related:{' '}
            <Link href="/google-forms-to-certificates" className="text-accent hover:underline">Google Forms</Link>
            {' · '}
            <Link href="/google-sheets-certificate-generator" className="text-accent hover:underline">Google Sheets</Link>
            {' · '}
            <Link href="/send-certificates-gmail-bulk" className="text-accent hover:underline">Gmail bulk send</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
