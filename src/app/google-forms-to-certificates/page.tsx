import Link from 'next/link';
import { ArrowRight, Check, X } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
import { buttonVariants } from '@/components/ui/Button';
import {
  GOOGLE_FORMS_HOW_TO_STEPS,
  GOOGLE_FORMS_PAGE_FAQS,
} from '@/data/googleFormsPageContent';

export default function GoogleFormsToCertificatesPage() {
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
              <span className="text-foreground">Google Forms to Certificates</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Google Forms to Certificates
            </h1>

            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> Link your Google Form to a spreadsheet, make the sheet
              publicly viewable, import it in MailMyCertificate, and generate personalized
              certificate PDFs locally — then send them from your Gmail account without a paid
              add-on or cloud upload of your roster.
            </p>

            <p className="text-secondary leading-relaxed mb-8">
              Built for workshops, webinars, bootcamps, and club events that already collect
              registrations through Google Forms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta
                href="/tool"
                entryPoint="google_forms_page_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
              >
                Start from your form data
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link
                href="/google-sheets-certificate-generator"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                Google Sheets guide
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="forms-howto">
          <div className="container-width max-w-4xl">
            <h2 id="forms-howto" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How do I turn Google Form responses into certificates?
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              You do not need a marketplace add-on inside Google Forms. The sheet linked to your
              form becomes your mail-merge data source.
            </p>
            <ol className="space-y-6 list-none pl-0">
              {GOOGLE_FORMS_HOW_TO_STEPS.map((step, index) => (
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

        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="forms-vs-addon">
          <div className="container-width max-w-5xl">
            <h2 id="forms-vs-addon" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              MailMyCertificate vs Google Forms add-ons
            </h2>
            <p className="text-secondary leading-relaxed mb-8 max-w-3xl">
              Add-ons like Certify&apos;em live inside Forms. MailMyCertificate is a standalone,
              open-source tool with a different architecture.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">Google Forms certificate tool comparison</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold">Feature</th>
                    <th scope="col" className="p-4 font-semibold">MailMyCertificate</th>
                    <th scope="col" className="p-4 font-semibold">Typical Forms add-on</th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-medium text-foreground">Install inside Forms</th>
                    <td className="p-4">No — uses linked Sheet URL</td>
                    <td className="p-4">Yes — Workspace marketplace</td>
                  </tr>
                  <tr className="border-b border-border/50 bg-accent/5">
                    <th scope="row" className="p-4 font-medium text-foreground">PDF generation location</th>
                    <td className="p-4">Your browser (local)</td>
                    <td className="p-4">Vendor cloud</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-medium text-foreground">Open source</th>
                    <td className="p-4"><Check className="inline text-green-700" size={16} aria-label="Yes" /></td>
                    <td className="p-4"><X className="inline" size={16} aria-label="No" /></td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-4 font-medium text-foreground">Export limits</th>
                    <td className="p-4">No artificial caps</td>
                    <td className="p-4">Often freemium tiers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="forms-privacy">
          <div className="container-width max-w-4xl">
            <h2 id="forms-privacy" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Where does my Google Form data go?
            </h2>
            <p className="text-secondary leading-relaxed">
              Form responses stay in your Google Sheet. MailMyCertificate reads the public sheet to
              fill a local browser session, generates PDFs on your device, and only contacts Google
              again when you choose Gmail delivery. See our{' '}
              <Link href="/privacy-policy" className="text-accent hover:underline font-medium">privacy policy</Link>
              {' '}and the{' '}
              <Link href="/guide" className="text-accent hover:underline font-medium">full guide</Link>.
            </p>
          </div>
        </section>

        <FAQSection
          faqs={[...GOOGLE_FORMS_PAGE_FAQS]}
          title="Google Forms certificate FAQ"
          subtitle="Registration → certificate delivery"
        />

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Form responses waiting? Ship certificates today.
            </h2>
            <TrackToolCta
              href="/tool"
              entryPoint="google_forms_page_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
            >
              Open certificate tool
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>
      </main>

      <ProductFooter />
    </div>
  );
}
