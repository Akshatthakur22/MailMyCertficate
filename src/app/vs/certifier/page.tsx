import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
import { buttonVariants } from '@/components/ui/Button';
import {
  CERTIFIER_COMPARISON_HOW_TO_STEPS,
  CERTIFIER_COMPARISON_FAQS,
} from '@/data/certifierComparisonPageContent';

export default function VsCertifierPage() {
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
              <span className="text-foreground">MailMyCertificate vs Certifier</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              MailMyCertificate vs Certifier
            </h1>

            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> Choose MailMyCertificate for free, open-source, local-first bulk
              PDF generation and Gmail delivery without uploading rosters to a SaaS. Choose Certifier
              when you need hosted verification, recipient analytics, and enterprise credential
              infrastructure.
            </p>

            <p className="text-secondary leading-relaxed mb-8">
              This is an honest comparison for event organizers — not a sponsored review.
            </p>

            <TrackToolCta
              href="/tool"
              entryPoint="vs_certifier_hero"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
            >
              Try MailMyCertificate free
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="comparison-table">
          <div className="container-width max-w-5xl">
            <h2 id="comparison-table" className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Feature comparison
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">MailMyCertificate vs Certifier feature comparison</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold">Capability</th>
                    <th scope="col" className="p-4 font-semibold">MailMyCertificate</th>
                    <th scope="col" className="p-4 font-semibold">Certifier (typical)</th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  <tr className="border-b border-border/50 bg-accent/5">
                    <th scope="row" className="p-4 font-medium text-foreground">Bulk PDF from CSV/Sheets</th>
                    <td className="p-4">Yes — local browser</td>
                    <td className="p-4">Yes — cloud</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-medium text-foreground">Email delivery</th>
                    <td className="p-4">Your Gmail (OAuth)</td>
                    <td className="p-4">Hosted / branded email</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-medium text-foreground">Participant data location</th>
                    <td className="p-4">Your device (IndexedDB)</td>
                    <td className="p-4">Vendor cloud</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-medium text-foreground">QR / public verification</th>
                    <td className="p-4">Not yet</td>
                    <td className="p-4">Yes</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-medium text-foreground">Open source</th>
                    <td className="p-4">MIT — auditable</td>
                    <td className="p-4">Proprietary</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-4 font-medium text-foreground">Pricing</th>
                    <td className="p-4">Free, no export caps</td>
                    <td className="p-4">Freemium / paid tiers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="choose-howto">
          <div className="container-width max-w-4xl">
            <h2 id="choose-howto" className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              How to decide in five steps
            </h2>
            <ol className="space-y-6 list-none pl-0">
              {CERTIFIER_COMPARISON_HOW_TO_STEPS.map((step, index) => (
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

        <FAQSection
          faqs={[...CERTIFIER_COMPARISON_FAQS]}
          title="MailMyCertificate vs Certifier FAQ"
          subtitle="Privacy, pricing, and verification"
        />

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl font-bold mb-4">Need local-first bulk send?</h2>
            <TrackToolCta
              href="/tool"
              entryPoint="vs_certifier_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
            >
              Start without an account
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>
      </main>

      <ProductFooter />
    </div>
  );
}
