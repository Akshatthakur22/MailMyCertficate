import Link from 'next/link';
import { ArrowRight, Check, X } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
import { buttonVariants } from '@/components/ui/Button';
import {
  CERTIFYEM_COMPARISON_FAQS,
  CERTIFYEM_COMPARISON_FEATURES,
  CERTIFYEM_HOW_TO_STEPS,
} from '@/data/certifyemComparisonContent';

export default function CertifyemComparisonPage() {
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
              <span className="text-foreground">vs Certify&apos;em</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              MailMyCertificate vs Certify&apos;em
            </h1>
            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> MailMyCertificate is a free, open-source, standalone alternative
              to Certify&apos;em. No Google Workspace Marketplace installation required, no certificate
              export limits, and all PDF generation happens locally in your browser — participant data
              never reaches a third-party server.
            </p>
            <p className="text-secondary leading-relaxed mb-8">
              Built for organizers who use Google Forms but don&apos;t want to install a Workspace add-on,
              pay per certificate, or upload participant rosters to external cloud services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta href="/tool" entryPoint="certifyem_comparison_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
                Try the free alternative
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link href="/google-forms-to-certificates"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
                Google Forms workflow guide
              </Link>
            </div>
            <LastUpdated path="/vs/certifyem" />
          </div>
        </section>

        {/* Feature comparison */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="comparison-heading">
          <div className="container-width max-w-5xl">
            <h2 id="comparison-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              MailMyCertificate vs Certify&apos;em — feature comparison
            </h2>
            <p className="text-secondary mb-8 max-w-3xl" data-speakable>
              The core difference: Certify&apos;em is a Google Forms add-on that runs inside Google&apos;s
              infrastructure. MailMyCertificate is a standalone browser tool with no installation and
              no cloud processing of participant data.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">MailMyCertificate vs Certify&apos;em comparison</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold text-foreground">Feature</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">MailMyCertificate</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">Certify&apos;em</th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  {CERTIFYEM_COMPARISON_FEATURES.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-accent/5' : ''}`}>
                      <th scope="row" className="p-4 font-medium text-foreground text-left">{row.feature}</th>
                      <td className="p-4">{row.mailMyCertificate}</td>
                      <td className="p-4">{row.certifyem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How to switch */}
        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="switch-heading">
          <div className="container-width max-w-4xl">
            <h2 id="switch-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How to switch from Certify&apos;em to MailMyCertificate
            </h2>
            <ol className="space-y-6 list-none pl-0">
              {CERTIFYEM_HOW_TO_STEPS.map((step, index) => (
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

        {/* When to choose */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="when-heading">
          <div className="container-width max-w-5xl">
            <h2 id="when-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              When to use each
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border/60 bg-accent/5 p-6">
                <h3 className="font-bold text-foreground text-lg mb-4">Choose MailMyCertificate when:</h3>
                <ul className="space-y-3">
                  {[
                    'No Google Workspace account or add-on budget',
                    'Privacy matters — participant data must stay local',
                    'You need unlimited certificate exports for free',
                    'You already have data in CSV or any spreadsheet',
                    'You want an open-source, auditable tool',
                    'You prefer sending from your own Gmail account',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-secondary">
                      <Check size={16} className="text-green-600 mt-0.5 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border/60 p-6">
                <h3 className="font-bold text-foreground text-lg mb-4">Consider Certify&apos;em when:</h3>
                <ul className="space-y-3">
                  {[
                    'You want certificates triggered automatically on form submit',
                    'Google Slides template integration is important',
                    'Your team already uses Workspace heavily',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-secondary">
                      <X size={16} className="text-muted-foreground mt-0.5 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <FAQSection
          faqs={[...CERTIFYEM_COMPARISON_FAQS]}
          title="Certify'em vs MailMyCertificate FAQ"
          subtitle="Common questions about switching or choosing"
        />

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              No add-on. No limits. Just open and generate.
            </h2>
            <TrackToolCta href="/tool" entryPoint="certifyem_comparison_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
              Open free certificate tool
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>

        <RelatedPages pageKey="googleForms" />
      </main>
      <ProductFooter />
    </div>
  );
}
