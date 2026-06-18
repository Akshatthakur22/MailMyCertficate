import Link from 'next/link';
import { ArrowRight, Check, X } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { buttonVariants } from '@/components/ui/Button';
import {
  CANVA_ALTERNATIVE_HOW_TO_STEPS,
  CANVA_ALTERNATIVE_FAQS,
} from '@/data/canvaAlternativePageContent';

export default function CanvaCertificateAlternativePage() {
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
              <span className="text-foreground">Canva Certificate Alternative</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Canva Certificate Alternative for Bulk Delivery
            </h1>

            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> Keep designing in Canva once, export your template as PNG or JPG,
              then use MailMyCertificate to mail-merge hundreds of personalized PDFs locally and send
              them via Gmail — without opening the same Canva file 200 times.
            </p>

            <p className="text-secondary leading-relaxed mb-8">
              Canva is excellent for design. It was not built for spreadsheet-scale certificate
              delivery.
            </p>

            <TrackToolCta
              href="/tool"
              entryPoint="canva_alternative_hero"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
            >
              Automate after Canva export
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="canva-workflow">
          <div className="container-width max-w-4xl">
            <h2 id="canva-workflow" className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Canva design + MailMyCertificate automation
            </h2>
            <ol className="space-y-6 list-none pl-0">
              {CANVA_ALTERNATIVE_HOW_TO_STEPS.map((step, index) => (
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

        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="canva-compare">
          <div className="container-width max-w-5xl">
            <h2 id="canva-compare" className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Manual Canva vs MailMyCertificate
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">Manual Canva workflow vs automated bulk generation</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold">Task</th>
                    <th scope="col" className="p-4 font-semibold">Manual Canva</th>
                    <th scope="col" className="p-4 font-semibold">MailMyCertificate</th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-medium text-foreground">Design template</th>
                    <td className="p-4"><Check className="inline text-green-700" size={16} aria-label="Yes" /></td>
                    <td className="p-4">Upload Canva export</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-medium text-foreground">Personalize 200 names</th>
                    <td className="p-4"><X className="inline" size={16} aria-label="Manual" /> Hours of edits</td>
                    <td className="p-4"><Check className="inline text-green-700" size={16} aria-label="Automated" /> Minutes</td>
                  </tr>
                  <tr className="border-b border-border/50 bg-accent/5">
                    <th scope="row" className="p-4 font-medium text-foreground">Email attachments</th>
                    <td className="p-4">One-by-one in Gmail</td>
                    <td className="p-4">Bulk send with OAuth</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-4 font-medium text-foreground">Cost at scale</th>
                    <td className="p-4">Time + Canva limits</td>
                    <td className="p-4">Free (MIT)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <FAQSection faqs={[...CANVA_ALTERNATIVE_FAQS]} title="Canva automation FAQ" />

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <TrackToolCta
              href="/tool"
              entryPoint="canva_alternative_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
            >
              Upload your Canva export
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
            <Link href="/vs/certifier" className="text-accent hover:underline">vs Certifier</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
