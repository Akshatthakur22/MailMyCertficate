import Link from 'next/link';
import Image from 'next/image';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
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

            <LastUpdated path="/google-forms-to-certificates" />
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
              Which data source should you use?
            </h2>
            <p className="text-secondary leading-relaxed mb-8 max-w-3xl">
              All workflows in MailMyCertificate generate certificates the same way. Choose based on where your participant data lives:
            </p>

            <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">Data source comparison for certificate generation</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold text-foreground">Your data source</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">Recommended workflow</th>
                    <th scope="col" className="p-4 font-semibold text-foreground">Why</th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  <tr className="border-b border-border/50 bg-accent/5">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Google Forms responses
                    </th>
                    <td className="p-4"><strong>Google Forms workflow</strong> (this page)</td>
                    <td className="p-4">Responses auto-sync to linked Sheet; most automated</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Google Sheets only (no Forms)
                    </th>
                    <td className="p-4"><Link href="/google-sheets-certificate-generator" className="text-accent hover:underline">Google Sheets workflow</Link></td>
                    <td className="p-4">Works with any shared Sheets URL; no Forms required</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Excel or CSV file on your computer
                    </th>
                    <td className="p-4"><Link href="/certificate-generator-from-excel" className="text-accent hover:underline">CSV/Excel workflow</Link></td>
                    <td className="p-4">File upload; no public URL sharing required</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Private or offline data
                    </th>
                    <td className="p-4"><Link href="/certificate-generator-from-excel" className="text-accent hover:underline">CSV/Excel workflow</Link></td>
                    <td className="p-4">No sharing required; stays on your device</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
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

        {/* Sample template imagery */}
        <section
          className="py-16 md:py-20 border-b border-border/50 bg-muted/10"
          aria-labelledby="forms-template-example"
        >
          <div className="container-width max-w-4xl">
            <h2
              id="forms-template-example"
              className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
            >
              What does a certificate template look like?
            </h2>
            <p className="text-secondary leading-relaxed mb-8" data-speakable>
              A template is an ordinary image with the participant-specific areas left empty. Every
              fixed element — border, title, signature line, logos — is baked into the image, and only
              the name and event details are filled per row.
            </p>
            <figure className="overflow-hidden rounded-xl border border-border/60 bg-background">
              <Image
                src="/sample-certificate-template.png"
                alt="A sample certificate template image with a decorative border, a certificate of participation title, and blank space in the centre where each participant's name is inserted during generation"
                width={1490}
                height={1058}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <figcaption className="px-5 py-3 text-sm text-secondary border-t border-border/60">
                A blank template with the name area left empty. This exact file ships in the
                repository as Test_Template.png if you want something to experiment with before
                designing your own.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Cleaning form data — the real friction point */}
        <section
          className="py-16 md:py-20 border-b border-border/50"
          aria-labelledby="forms-clean-data"
        >
          <div className="container-width max-w-4xl">
            <h2
              id="forms-clean-data"
              className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
            >
              How do I clean up messy Google Form responses first?
            </h2>
            <p className="text-secondary leading-relaxed mb-6" data-speakable>
              Fix three things in the linked spreadsheet before you import: remove duplicate
              submissions, normalise how names are capitalised, and confirm every row has a valid
              email address. Google Forms records exactly what people typed, and a certificate prints
              exactly what the sheet contains, so a name entered as &quot;JOHN DOE&quot; or
              &quot;john doe&quot; will appear that way on the PDF.
            </p>
            <p className="text-secondary leading-relaxed mb-6">
              A few minutes of tidying beats reissuing certificates afterwards. In practice these are
              the recurring problems:
            </p>
            <ul className="space-y-3 text-secondary list-disc pl-6 mb-8">
              <li>
                <strong className="text-foreground">Duplicate submissions.</strong> People submit
                twice when they are unsure the first attempt registered. Remove duplicates on the
                email column, keeping whichever row is more complete.
              </li>
              <li>
                <strong className="text-foreground">Inconsistent capitalisation.</strong> Applying a
                proper-case formula to the name column and pasting the result back gives uniform
                output across the whole batch.
              </li>
              <li>
                <strong className="text-foreground">Trailing spaces.</strong> Invisible in the sheet,
                but they shift text placement on a centred certificate. Trimming the column solves it.
              </li>
              <li>
                <strong className="text-foreground">Test entries.</strong> The rows you submitted
                yourself while building the form are still in there. Delete them before importing.
              </li>
              <li>
                <strong className="text-foreground">Timestamp and consent columns.</strong> Harmless
                to leave in place, since you choose which columns map to certificate fields, but
                hiding them makes the mapping step less error-prone.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3">
              Collecting the right fields in the first place
            </h3>
            <p className="text-secondary leading-relaxed mb-4">
              If you are still designing the form, make the name a single short-answer question rather
              than separate first and last name questions, and mark it required. One field maps
              cleanly onto one certificate placement, whereas splitting it means recombining two
              columns later.
            </p>
            <p className="text-secondary leading-relaxed">
              Collect only what the certificate and the email actually need, which is usually a name
              and an email address. Every extra personal detail is data you then have to look after,
              and the local-first workflow protects that data once it reaches your browser, not the
              copy already sitting in your Google account.
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
        <RelatedPages pageKey="googleForms" />

      </main>

      <ProductFooter />
    </div>
  );
}
