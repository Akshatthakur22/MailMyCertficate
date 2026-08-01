import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
import { buttonVariants } from '@/components/ui/Button';
import { WEBINAR_PAGE_FAQS, WEBINAR_HOW_TO_STEPS } from '@/data/webinarPageContent';

export default function WebinarCertificateGeneratorPage() {
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
              <span className="text-foreground">Webinar Certificate Generator</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Webinar Certificate Generator
            </h1>
            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> Export your webinar attendee list from Zoom, Google Meet, or
              your registration form as CSV, import it into MailMyCertificate, and generate
              personalized attendance certificates for every participant locally in your browser —
              then send via Gmail in bulk. Free, no account required.
            </p>
            <p className="text-secondary leading-relaxed mb-8">
              Works for online workshops, live webinars, recorded sessions, and any event where
              you collect attendees in a spreadsheet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta href="/tool" entryPoint="webinar_page_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
                Generate webinar certificates
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link href="/send-certificates-gmail-bulk"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
                Gmail bulk send guide
              </Link>
            </div>
            <LastUpdated path="/webinar-certificate-generator" />
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="steps-heading">
          <div className="container-width max-w-4xl">
            <h2 id="steps-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How to generate webinar certificates in bulk
            </h2>
            <ol className="space-y-6 list-none pl-0">
              {WEBINAR_HOW_TO_STEPS.map((step, index) => (
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

        {/* Platform support */}
        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="platforms-heading">
          <div className="container-width max-w-4xl">
            <h2 id="platforms-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Works with your webinar platform
            </h2>
            <p className="text-secondary mb-8" data-speakable>
              Any platform that exports attendee data as CSV or connects to Google Sheets works with
              MailMyCertificate.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Zoom Webinars', desc: 'Reports → Usage → Webinars → Export CSV. Map "Name" and "Email" columns.' },
                { title: 'Google Meet', desc: 'Export attendance from Google Classroom or use a linked registration form → Sheets.' },
                { title: 'Google Forms registration', desc: 'Link form to Sheets, make sheet public, paste the URL directly into MailMyCertificate.' },
                { title: 'Eventbrite / Lu.ma', desc: 'Export attendee list as CSV from your event dashboard.' },
                { title: 'Any registration platform', desc: 'If it exports CSV with a name and email column, it works.' },
                { title: 'Manual spreadsheet', desc: 'Build your attendee list in Google Sheets or Excel, export CSV.' },
              ].map(({ title, desc }) => (
                <div key={title} className="rounded-xl border border-border/60 p-5">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Check size={15} className="text-green-600 shrink-0" />{title}
                  </h3>
                  <p className="text-sm text-secondary leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQSection
          faqs={[...WEBINAR_PAGE_FAQS]}
          title="Webinar certificate FAQ"
          subtitle="Common questions from webinar organizers"
        />

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Webinar wrapped? Send certificates now.
            </h2>
            <TrackToolCta href="/tool" entryPoint="webinar_page_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
              Open free certificate tool
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
