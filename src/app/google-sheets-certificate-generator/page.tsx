import Link from 'next/link';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
import { ArrowRight, Check, X } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
import { buttonVariants } from '@/components/ui/Button';
import {
  GOOGLE_SHEETS_HOW_TO_STEPS,
  GOOGLE_SHEETS_PAGE_FAQS,
} from '@/data/googleSheetsPageContent';

export default function GoogleSheetsCertificateGeneratorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Navbar />

      <main className="flex-1 w-full pt-16">
        <section className="relative py-16 md:py-24 border-b border-border/50">
          <div className="absolute inset-0 hero-grid" />
          <div className="relative container-width max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground">Google Sheets Certificate Generator</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Google Sheets Certificate Generator
            </h1>

            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> Use MailMyCertificate to import a public Google Sheets URL,
              map columns to certificate fields, generate personalized PDFs locally in your browser,
              and optionally send them through your Gmail account — without uploading your participant
              list to a third-party server.
            </p>

            <p className="text-secondary leading-relaxed mb-8">
              This workflow is built for organizers who already collect names and emails in Google
              Forms or Sheets after hackathons, workshops, bootcamps, and college events.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta
                href="/tool"
                entryPoint="google_sheets_page_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
              >
                Open Certificate Tool
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link
                href="/guide"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                Full visual guide
              </Link>
            </div>

            <LastUpdated path="/google-sheets-certificate-generator" />
          </div>
        </section>

        <section
          className="py-16 md:py-20 border-b border-border/50"
          aria-labelledby="how-it-works-heading"
        >
          <div className="container-width max-w-4xl">
            <h2 id="how-it-works-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How do I generate certificates from Google Sheets?
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              The fastest path is Google Forms → Google Sheets → MailMyCertificate → Gmail. Each step
              below maps to a section in our{' '}
              <Link href="/guide" className="text-accent hover:underline font-medium">
                user guide
              </Link>
              .
            </p>

            <ol className="space-y-6 list-none pl-0">
              {GOOGLE_SHEETS_HOW_TO_STEPS.map((step, index) => (
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

        <section
          className="py-16 md:py-20 border-b border-border/50 bg-muted/10"
          aria-labelledby="workflow-heading"
        >
          <div className="container-width max-w-4xl">
            <h2 id="workflow-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Google Forms → Sheets → Certificates workflow
            </h2>
            <p className="text-secondary leading-relaxed mb-6">
              Most organizers already use Google Forms for registrations. When responses land in a
              sheet, MailMyCertificate treats that sheet like a mail-merge data source — similar to
              printing labels from a spreadsheet, except the output is personalized PDF certificates.
            </p>
            <ul className="space-y-3 text-secondary list-disc pl-6">
              <li>
                <strong className="text-foreground">Form responses</strong> sync to a Google Sheet
                automatically when you enable the responses spreadsheet.
              </li>
              <li>
                <strong className="text-foreground">Public view access</strong> lets MailMyCertificate
                fetch CSV data without Google OAuth for the sheet itself.
              </li>
              <li>
                <strong className="text-foreground">Local PDF generation</strong> keeps names and
                emails on your device (IndexedDB) instead of a vendor cloud.
              </li>
              <li>
                <strong className="text-foreground">Gmail OAuth</strong> sends each certificate from
                your own inbox when you choose email delivery.
              </li>
            </ul>
          </div>
        </section>

        <section
          className="py-16 md:py-20 border-b border-border/50"
          aria-labelledby="comparison-heading"
        >
          <div className="container-width max-w-5xl">
            <h2 id="comparison-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Which data source should you use?
            </h2>
            <p className="text-secondary leading-relaxed mb-8 max-w-3xl">
              All workflows in MailMyCertificate generate certificates the same way. Choose based on where your participant data lives:
            </p>

            <div className="overflow-x-auto rounded-xl border border-border/60 mb-8">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">
                  Data source comparison for certificate generation
                </caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Your data source
                    </th>
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Recommended workflow
                    </th>
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Why
                    </th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  <tr className="border-b border-border/50 bg-accent/5">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Google Sheets (public URL)
                    </th>
                    <td className="p-4"><strong>Google Sheets workflow</strong> (this page)</td>
                    <td className="p-4">Live data; no re-download needed between runs</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Excel or CSV file on your computer
                    </th>
                    <td className="p-4"><Link href="/certificate-generator-from-excel" className="text-accent hover:underline">CSV/Excel workflow</Link></td>
                    <td className="p-4">File upload; no public URL sharing required</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Google Forms responses
                    </th>
                    <td className="p-4"><Link href="/google-forms-to-certificates" className="text-accent hover:underline">Google Forms workflow</Link></td>
                    <td className="p-4">Responses auto-sync to Sheets; automated flow</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Private or frequently updated data
                    </th>
                    <td className="p-4"><Link href="/certificate-generator-from-excel" className="text-accent hover:underline">CSV/Excel workflow</Link></td>
                    <td className="p-4">No sharing required; stays on your device</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-4">How MailMyCertificate compares to alternatives</h3>
            <p className="text-secondary leading-relaxed mb-6 max-w-3xl">
              Honest comparison for event organizers — not an enterprise LMS or verifiable credential platform.
            </p>

            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">
                  Comparison of certificate approaches for Google Sheets data
                </caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Approach
                    </th>
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Google Sheets import
                    </th>
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Privacy / data upload
                    </th>
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  <tr className="border-b border-border/50 bg-accent/5">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      MailMyCertificate
                    </th>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-green-700">
                        <Check size={16} aria-hidden="true" /> Public sheet URL
                      </span>
                    </td>
                    <td className="p-4">Local browser generation; no roster hosting</td>
                    <td className="p-4">Free, open source (MIT)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Manual Canva editing
                    </th>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1">
                        <X size={16} aria-hidden="true" /> Manual copy/paste
                      </span>
                    </td>
                    <td className="p-4">Data stays local but hours of labor</td>
                    <td className="p-4">Canva free tier limits</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-4 font-semibold text-foreground text-left">
                      Typical SaaS certificate tools
                    </th>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-green-700">
                        <Check size={16} aria-hidden="true" /> CSV / Sheets / API
                      </span>
                    </td>
                    <td className="p-4">Participant data uploaded to vendor cloud</td>
                    <td className="p-4">Often freemium or per-certificate pricing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section
          className="py-16 md:py-20 border-b border-border/50"
          aria-labelledby="privacy-heading"
        >
          <div className="container-width max-w-4xl">
            <h2 id="privacy-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Is my Google Sheet data stored on your servers?
            </h2>
            <p className="text-secondary leading-relaxed mb-4">
              <strong>No.</strong> MailMyCertificate fetches your public sheet to populate a local
              session in your browser. Certificate PDFs are generated with Web Workers and stored in
              IndexedDB on your device. We do not maintain a database of participant rows.
            </p>
            <p className="text-secondary leading-relaxed">
              Read the full breakdown in our{' '}
              <Link href="/privacy-policy" className="text-accent hover:underline font-medium">
                privacy policy
              </Link>{' '}
              or inspect the{' '}
              <Link
                href="https://github.com/akshatthakur22/MailMyCertficate"
                className="text-accent hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                open-source code
              </Link>
              .
            </p>
          </div>
        </section>

        <FAQSection
          faqs={[...GOOGLE_SHEETS_PAGE_FAQS]}
          title="Google Sheets certificate FAQ"
          subtitle="Common questions from event organizers"
        />

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Ready to generate from your sheet?
            </h2>
            <p className="text-secondary mb-8">
              Upload a template, paste your Google Sheets URL, and generate your first batch in
              minutes.
            </p>
            <TrackToolCta
              href="/tool"
              entryPoint="google_sheets_page_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}
            >
              Start with Google Sheets
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>
        <RelatedPages pageKey="googleSheets" />

      </main>

      <ProductFooter />
    </div>
  );
}
