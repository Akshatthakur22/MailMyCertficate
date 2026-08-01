import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
import { buttonVariants } from '@/components/ui/Button';
import { WORKSHOP_PAGE_FAQS, WORKSHOP_HOW_TO_STEPS } from '@/data/workshopPageContent';

export default function WorkshopCertificateGeneratorPage() {
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
              <span className="text-foreground">Workshop Certificate Generator</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Workshop Certificate Generator
            </h1>
            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> Use MailMyCertificate to generate personalized workshop
              participation certificates in bulk — import attendees from CSV or Google Sheets, upload
              your certificate template, build PDFs locally in your browser, and send them via Gmail.
              Free, no account required, no limit on certificates.
            </p>
            <p className="text-secondary leading-relaxed mb-8">
              Built for workshop organizers who need to issue certificates to 10 or 1,000 attendees
              quickly, without uploading participant data to a third-party service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta href="/tool" entryPoint="workshop_page_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
                Generate workshop certificates
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link href="/guide" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
                Full guide
              </Link>
            </div>
            <LastUpdated path="/workshop-certificate-generator" />
          </div>
        </section>

        {/* How-to steps */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="howto-heading">
          <div className="container-width max-w-4xl">
            <h2 id="howto-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How do I generate certificates for my workshop?
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              The entire workflow — from importing attendees to emailing certificates — takes under
              10 minutes for most workshops.
            </p>
            <ol className="space-y-6 list-none pl-0">
              {WORKSHOP_HOW_TO_STEPS.map((step, index) => (
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

        {/* Workshop types */}
        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="types-heading">
          <div className="container-width max-w-4xl">
            <h2 id="types-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Works for all workshop types
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { title: 'Online workshops', desc: 'Zoom, Google Meet, or Teams — import your attendance sheet and email certificates directly.' },
                { title: 'Offline training sessions', desc: 'Upload your sign-in sheet as CSV and generate participation certificates in bulk.' },
                { title: 'Multi-day bootcamps', desc: 'Run separate batches per day or module using the same template with different data.' },
                { title: 'College tech workshops', desc: 'Perfect for student clubs and CSE departments — free tool with no institutional purchase needed.' },
                { title: 'NGO capacity-building', desc: 'Privacy-first: beneficiary data never leaves your browser, meeting data protection requirements.' },
                { title: 'Corporate training', desc: 'Generate completion certificates for internal training programmes from your HR spreadsheet.' },
              ].map(({ title, desc }) => (
                <div key={title} className="rounded-xl border border-border/60 p-5">
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy section */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="privacy-heading">
          <div className="container-width max-w-4xl">
            <h2 id="privacy-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Where does my workshop attendee data go?
            </h2>
            <p className="text-secondary leading-relaxed mb-6" data-speakable>
              Nowhere outside your browser. MailMyCertificate generates certificate PDFs using
              pdf-lib inside a Web Worker on your device. Attendee names and emails are stored
              in IndexedDB — browser storage that stays on your machine. Nothing is uploaded to
              a MailMyCertificate server during the generation process.
            </p>
            <div className="space-y-3">
              {[
                'PDF generation runs locally via Web Worker (no server)',
                'Attendee data stored in IndexedDB on your device',
                'Zero external API calls during certificate creation',
                'Gmail send uses your own OAuth account — we never see your credentials',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm">
                  <Check size={16} className="text-green-600 mt-0.5 shrink-0" />
                  <span className="text-secondary">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-secondary">
              Read the full details in our{' '}
              <Link href="/privacy-policy" className="text-accent hover:underline font-medium">privacy policy</Link>
              {' '}or inspect the{' '}
              <Link href="https://github.com/akshatthakur22/MailMyCertficate" target="_blank" rel="noopener noreferrer"
                className="text-accent hover:underline font-medium">open-source code</Link>.
            </p>
          </div>
        </section>

        <FAQSection
          faqs={[...WORKSHOP_PAGE_FAQS]}
          title="Workshop certificate FAQ"
          subtitle="Common questions from workshop organizers"
        />

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Workshop done? Ship certificates today.
            </h2>
            <p className="text-secondary mb-8">
              Import your attendee list, upload a template, and generate every certificate in under 2 minutes.
            </p>
            <TrackToolCta href="/tool" entryPoint="workshop_page_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
              Open certificate tool — free
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
