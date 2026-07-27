import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, X, Clock, Palette } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
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
        {/* Hero */}
        <section className="relative py-16 md:py-24 border-b border-border/50">
          <div className="absolute inset-0 hero-grid" />
          <div className="relative container-width max-w-4xl">
            <nav
              className="flex items-center gap-2 text-sm text-secondary mb-8"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground">Canva Certificate Alternative</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Canva Certificate Alternative for Bulk Generation
            </h1>

            <p
              className="text-lg md:text-xl text-secondary leading-relaxed mb-4"
              data-speakable
            >
              <strong>Answer:</strong> Keep designing your certificate in Canva, then export it once
              as a PNG or JPG and upload it to MailMyCertificate. Import your participant list from
              CSV or Google Sheets, drag name and event fields onto the design, and generate every
              personalized PDF locally in your browser. You skip the part Canva was never built for:
              duplicating a template and retyping a name for each attendee.
            </p>

            <p className="text-secondary leading-relaxed mb-8">
              This is not a design tool and it does not try to be one. Canva is excellent at layout
              and typography. MailMyCertificate handles the mail merge and delivery step that comes
              after the design is finished, which is where manual work multiplies with every extra
              participant.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <TrackToolCta
                href="/tool"
                entryPoint="canva_alternative_page_hero"
                className={buttonVariants({
                  variant: 'primary',
                  size: 'lg',
                  className: 'shadow-sm',
                })}
              >
                Bulk-generate from your Canva design
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link href="/guide" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
                Full visual guide
              </Link>
            </div>

            <LastUpdated path="/canva-certificate-alternative" />
          </div>
        </section>

        {/* The maths of manual work */}
        <section
          className="py-16 md:py-20 border-b border-border/50"
          aria-labelledby="canva-why-manual-breaks"
        >
          <div className="container-width max-w-4xl">
            <h2
              id="canva-why-manual-breaks"
              className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
            >
              Why does manual Canva editing stop working past 100 certificates?
            </h2>
            <p className="text-secondary leading-relaxed mb-6" data-speakable>
              Because the work scales linearly with your attendee count. Duplicating a Canva design,
              editing the name field, exporting the file and renaming it takes roughly 30 to 60
              seconds per person once you account for switching between your spreadsheet and the
              editor. That is a manageable ten minutes for a workshop of fifteen people, and an
              unpleasant five to eight hours for a cohort of five hundred.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div className="flex items-start gap-3 p-5 rounded-xl border border-border bg-background">
                <Clock size={20} className="text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Manual Canva workflow</h3>
                  <p className="text-sm text-secondary leading-relaxed">
                    Duplicate, retype, export, rename, attach. Repeated once per attendee, with the
                    error rate climbing the longer you do it.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-5 rounded-xl border border-accent/30 bg-accent/5">
                <Palette size={20} className="text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Design once, merge once</h3>
                  <p className="text-sm text-secondary leading-relaxed">
                    One Canva export plus one participant file. Field placement is set a single time
                    and applies to every row in the batch.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-secondary leading-relaxed">
              The other failure mode is silent: a typo in row 240 that nobody notices until a
              participant emails about a misspelled name. Generating from a spreadsheet means every
              certificate reads from the same reviewed source of truth, so a correction happens once
              in the sheet rather than once per file.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section
          className="py-16 md:py-20 border-b border-border/50 bg-muted/10"
          aria-labelledby="canva-howto"
        >
          <div className="container-width max-w-4xl">
            <h2 id="canva-howto" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How do I bulk-generate certificates from a Canva template?
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              Five steps, and only the first one happens in Canva.
            </p>
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

            <div className="mt-10 overflow-hidden rounded-xl border border-border/60 bg-background">
              <Image
                src="/platform-preview.png"
                alt="The MailMyCertificate editor with a certificate template loaded and name and event text fields positioned on the design ready for bulk generation"
                width={640}
                height={640}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <p className="px-5 py-3 text-sm text-secondary border-t border-border/60">
                Field placement in the MailMyCertificate editor. Positions are set once and applied
                to every row in your participant file.
              </p>
            </div>
          </div>
        </section>

        {/* Template export requirements */}
        <section
          className="py-16 md:py-20 border-b border-border/50"
          aria-labelledby="canva-export-settings"
        >
          <div className="container-width max-w-4xl">
            <h2
              id="canva-export-settings"
              className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
            >
              What export settings should I use in Canva?
            </h2>
            <p className="text-secondary leading-relaxed mb-6" data-speakable>
              Export as PNG at the largest size Canva offers you, and leave the name area empty.
              MailMyCertificate uses image templates, so a PDF export will not work as a template
              file. A landscape A4 or US Letter canvas at 300 DPI gives certificates that stay crisp
              when a participant prints them.
            </p>
            <ul className="space-y-3 text-secondary list-disc pl-6">
              <li>
                <strong className="text-foreground">Format:</strong> PNG or JPG. PNG is preferable
                because it avoids the compression artefacts JPG introduces around sharp text edges.
              </li>
              <li>
                <strong className="text-foreground">Canvas:</strong> landscape A4 (297 × 210 mm) or
                US Letter (11 × 8.5 in) matches what most people expect from a certificate.
              </li>
              <li>
                <strong className="text-foreground">Leave gaps:</strong> keep the name, event and
                date areas blank in the export. Those are filled per participant, and placeholder
                text baked into the image cannot be removed later.
              </li>
              <li>
                <strong className="text-foreground">Fixed elements stay:</strong> logos, signatures,
                borders and body copy that are identical for everyone belong in the Canva design.
              </li>
              <li>
                <strong className="text-foreground">Check contrast:</strong> a busy background behind
                the name area makes generated text harder to read than it looks in the empty
                template.
              </li>
            </ul>
          </div>
        </section>

        {/* Comparison */}
        <section
          className="py-16 md:py-20 border-b border-border/50"
          aria-labelledby="canva-comparison"
        >
          <div className="container-width max-w-5xl">
            <h2 id="canva-comparison" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Canva alone vs Canva plus MailMyCertificate
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              The two tools solve different halves of the same job. This is what changes when you add
              the merge step.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">
                  Comparison of certificate production approaches: Canva alone, Canva combined with
                  MailMyCertificate, and paid SaaS certificate platforms
                </caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Approach
                    </th>
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Design control
                    </th>
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      500 certificates
                    </th>
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Participant data
                    </th>
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Canva alone (manual)
                    </th>
                    <td className="p-4">
                      <Check size={16} className="inline text-green-700" aria-hidden="true" /> Full
                    </td>
                    <td className="p-4">
                      <X size={16} className="inline" aria-hidden="true" /> Hours of repetition
                    </td>
                    <td className="p-4">Stays with you</td>
                    <td className="p-4">Free tier limits apply</td>
                  </tr>
                  <tr className="border-b border-border/50 bg-accent/5">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Canva + MailMyCertificate
                    </th>
                    <td className="p-4">
                      <Check size={16} className="inline text-green-700" aria-hidden="true" /> Full
                      (design in Canva)
                    </td>
                    <td className="p-4">
                      <Check size={16} className="inline text-green-700" aria-hidden="true" /> One
                      batch, generated locally
                    </td>
                    <td className="p-4">Never leaves your browser</td>
                    <td className="p-4">Free (MIT licence)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Paid SaaS certificate platforms
                    </th>
                    <td className="p-4">Template library, less freedom</td>
                    <td className="p-4">
                      <Check size={16} className="inline text-green-700" aria-hidden="true" /> Bulk
                      via cloud
                    </td>
                    <td className="p-4">Uploaded to the vendor</td>
                    <td className="p-4">Subscription or per certificate</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Honest limits */}
        <section
          className="py-16 md:py-20 border-b border-border/50 bg-muted/10"
          aria-labelledby="canva-limits"
        >
          <div className="container-width max-w-4xl">
            <h2 id="canva-limits" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              When should you not use MailMyCertificate?
            </h2>
            <p className="text-secondary leading-relaxed mb-6" data-speakable>
              Three cases, stated plainly so you do not waste time discovering them later.
            </p>
            <ul className="space-y-3 text-secondary list-disc pl-6">
              <li>
                <strong className="text-foreground">You need verifiable credentials.</strong> If
                recipients must validate a certificate through a public verification portal or a
                scannable registry, MailMyCertificate does not provide that. See the{' '}
                <Link href="/vs/certifier" className="text-accent hover:underline">
                  Certifier comparison
                </Link>{' '}
                for where a paid platform is the correct answer.
              </li>
              <li>
                <strong className="text-foreground">
                  You want to edit a PDF template directly.
                </strong>{' '}
                Templates are images. A PDF design has to be exported to PNG or JPG first.
              </li>
              <li>
                <strong className="text-foreground">You need LMS or API integration.</strong> There
                is no enterprise API for pushing certificates into a learning management system.
              </li>
            </ul>
            <p className="text-secondary leading-relaxed mt-6">
              For a straightforward run of participation, winner or completion certificates from a
              design you already have, none of those limits apply.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection
          faqs={[...CANVA_ALTERNATIVE_FAQS]}
          title="Canva certificate alternative FAQ"
          subtitle="Design workflow, exports, and what changes"
        />

        {/* Related pages */}
        <RelatedPages pageKey="canva" />

        {/* CTA */}
        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Your design is done. Let the merge run itself.
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              Upload the Canva export, point at your participant list, and generate the whole batch
              in your browser.
            </p>
            <TrackToolCta
              href="/tool"
              entryPoint="canva_alternative_page_footer"
              className={buttonVariants({
                variant: 'primary',
                size: 'lg',
                className: 'shadow-sm',
              })}
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
