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
  CANVA_COMPARISON_FAQS,
  CANVA_COMPARISON_FEATURES,
  CANVA_HOW_TO_STEPS,
} from '@/data/canvaComparisonContent';

export default function CanvaComparisonPage() {
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
              <span className="text-foreground">vs Canva</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              MailMyCertificate vs Canva
            </h1>
            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> Canva is the best tool for <em>designing</em> one beautiful
              certificate. MailMyCertificate is the tool for <em>automating</em> hundreds of them.
              They work best together — design in Canva, export as PNG, then bulk generate and email
              in MailMyCertificate. Free, local, no cloud upload of participant data.
            </p>
            <p className="text-secondary leading-relaxed mb-8">
              The common frustration: you finish your Canva design and then realise you have 300 names
              to fill in manually, one by one. That Sunday-afternoon task takes 4+ hours. This page
              explains why and what you can do instead.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta href="/tool" entryPoint="canva_comparison_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
                Generate from your Canva design
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link href="/guide" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
                See how it works
              </Link>
            </div>
            <LastUpdated path="/vs/canva" />
          </div>
        </section>

        {/* Feature comparison table */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="comparison-table-heading">
          <div className="container-width max-w-5xl">
            <h2 id="comparison-table-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Feature-by-feature comparison
            </h2>
            <p className="text-secondary leading-relaxed mb-8 max-w-3xl" data-speakable>
              Canva and MailMyCertificate solve different problems. Canva wins on design flexibility.
              MailMyCertificate wins on bulk automation and privacy.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">MailMyCertificate vs Canva feature comparison</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold text-foreground">Feature</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">MailMyCertificate</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">Canva</th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  {CANVA_COMPARISON_FEATURES.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-accent/5' : ''}`}>
                      <th scope="row" className="p-4 font-medium text-foreground text-left">{row.feature}</th>
                      <td className="p-4">{row.mailMyCertificate}</td>
                      <td className="p-4">{row.canva}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How to use together */}
        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="how-to-heading">
          <div className="container-width max-w-4xl">
            <h2 id="how-to-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How to use Canva and MailMyCertificate together
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              The best workflow uses both tools for what each does well.
            </p>
            <ol className="space-y-6 list-none pl-0">
              {CANVA_HOW_TO_STEPS.map((step, index) => (
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

        {/* When to choose each */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="when-to-choose">
          <div className="container-width max-w-5xl">
            <h2 id="when-to-choose" className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              When to use each tool
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border/60 bg-accent/5 p-6">
                <h3 className="font-bold text-foreground text-lg mb-4">Choose MailMyCertificate when:</h3>
                <ul className="space-y-3">
                  {[
                    'You have 10+ certificates to generate',
                    'You need to email certificates to each participant',
                    'Privacy matters — no data upload to vendors',
                    'Budget is zero',
                    'You already have a certificate design (from Canva or elsewhere)',
                    'You want to import from CSV or Google Sheets',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-secondary">
                      <Check size={16} className="text-green-600 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border/60 p-6">
                <h3 className="font-bold text-foreground text-lg mb-4">Stick with Canva when:</h3>
                <ul className="space-y-3">
                  {[
                    'You need to design a certificate from scratch',
                    'You are making just 1–3 certificates',
                    'You need advanced visual design elements',
                    'You want 500,000+ design templates to browse',
                    'Team collaboration on the design itself matters',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-secondary">
                      <X size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <FAQSection
          faqs={[...CANVA_COMPARISON_FAQS]}
          title="Canva vs MailMyCertificate FAQ"
          subtitle="Common questions about using both tools"
        />

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Already have a Canva design? Ship certificates today.
            </h2>
            <p className="text-secondary mb-8">
              Export as PNG, import your participant list, and generate every certificate in under 2 minutes.
            </p>
            <TrackToolCta href="/tool" entryPoint="canva_comparison_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
              Open certificate tool — free
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>

        <RelatedPages pageKey="canva" />
      </main>
      <ProductFooter />
    </div>
  );
}
