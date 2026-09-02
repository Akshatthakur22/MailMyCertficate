import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
import { buttonVariants } from '@/components/ui/Button';
import { EXCEL_CSV_PAGE_FAQS, EXCEL_CSV_HOW_TO_STEPS } from '@/data/excelCsvPageContent';

export default function CertificateGeneratorFromExcelPage() {
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
              <span className="text-foreground">Certificate Generator from Excel</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Certificate Generator from Excel / CSV
            </h1>
            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> Export your Excel spreadsheet as CSV, upload it into
              MailMyCertificate alongside your certificate template image, and generate a personalized
              PDF certificate for every row — locally in your browser. Send via Gmail or download
              as ZIP. Free, no account required, no row limit.
            </p>
            <p className="text-secondary leading-relaxed mb-8">
              Works with Excel (.xlsx → export as CSV), Google Sheets (public URL or CSV download),
              LibreOffice Calc, and any tool that produces a standard comma-separated file.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta href="/tool" entryPoint="excel_page_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
                Generate from your spreadsheet
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link href="/google-sheets-certificate-generator"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
                Google Sheets guide
              </Link>
            </div>
            <LastUpdated path="/certificate-generator-from-excel" />
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="steps-heading">
          <div className="container-width max-w-4xl">
            <h2 id="steps-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How to generate certificates from Excel or CSV
            </h2>
            <ol className="space-y-6 list-none pl-0">
              {EXCEL_CSV_HOW_TO_STEPS.map((step, index) => (
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

        {/* CSV tips */}
        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="tips-heading">
          <div className="container-width max-w-4xl">
            <h2 id="tips-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How to prepare your Excel file for certificates
            </h2>
            <p className="text-secondary leading-relaxed mb-6" data-speakable>
              The three most common issues with Excel data before importing into any certificate tool:
            </p>
            <div className="space-y-5">
              {[
                {
                  title: 'Inconsistent name capitalisation',
                  desc: 'Excel stores exactly what was typed — "JOHN DOE" or "john doe" will print that way on the certificate. Use Excel\'s PROPER() formula or Google Sheets text functions to normalise name casing before importing.',
                },
                {
                  title: 'Duplicate rows',
                  desc: 'Remove duplicate entries before generating. In Excel: Data → Remove Duplicates. In Google Sheets: Data → Data cleanup → Remove duplicates.',
                },
                {
                  title: 'Missing email addresses',
                  desc: 'If you plan to send certificates via Gmail, verify the email column has no blank cells or typos. Missing emails mean those participants won\'t receive their certificate.',
                },
                {
                  title: 'Excel-specific formatting',
                  desc: 'Date cells in Excel may export with unexpected formatting. Store dates as plain text (e.g. "15 August 2026") in a dedicated column to ensure they print cleanly on the certificate.',
                },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3">
                  <Check size={16} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">{title}</p>
                    <p className="text-secondary text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="comparison-heading">
          <div className="container-width max-w-5xl">
            <h2 id="comparison-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              CSV vs Google Sheets — which should you use?
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              Both workflows generate certificates the same way in MailMyCertificate. Choose based on where your data lives:
            </p>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">CSV file vs Google Sheets URL comparison for certificate generation</caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold">Scenario</th>
                    <th scope="col" className="p-4 font-semibold">Recommended source</th>
                    <th scope="col" className="p-4 font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-medium text-foreground text-left">Data is in Excel on your computer</th>
                    <td className="p-4"><strong>Export as CSV</strong></td>
                    <td className="p-4">File → Save As → CSV UTF-8 in Excel</td>
                  </tr>
                  <tr className="border-b border-border/50 bg-accent/5">
                    <th scope="row" className="p-4 font-medium text-foreground text-left">Data is in Google Sheets</th>
                    <td className="p-4"><strong>Google Sheets URL</strong></td>
                    <td className="p-4"><Link href="/google-sheets-certificate-generator" className="text-accent hover:underline">Use Google Sheets workflow</Link> instead</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-medium text-foreground text-left">Data from Google Forms responses</th>
                    <td className="p-4"><strong>Google Forms workflow</strong></td>
                    <td className="p-4"><Link href="/google-forms-to-certificates" className="text-accent hover:underline">See Google Forms guide</Link> for automated flow</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th scope="row" className="p-4 font-medium text-foreground text-left">Data updated frequently</th>
                    <td className="p-4"><strong>Google Sheets URL</strong></td>
                    <td className="p-4">Always pulls the latest rows on import</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-4 font-medium text-foreground text-left">Offline or private data (no sharing)</th>
                    <td className="p-4"><strong>CSV upload</strong></td>
                    <td className="p-4">File stays on your device, no sharing required</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <FAQSection
          faqs={[...EXCEL_CSV_PAGE_FAQS]}
          title="Excel / CSV certificate generator FAQ"
          subtitle="Common questions about importing spreadsheet data"
        />

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Spreadsheet ready? Generate certificates now.
            </h2>
            <TrackToolCta href="/tool" entryPoint="excel_page_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
              Open free certificate tool
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
