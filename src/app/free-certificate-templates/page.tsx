import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Download } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
import { buttonVariants } from '@/components/ui/Button';

const TEMPLATES = [
  {
    id: 'participation',
    name: 'Certificate of Participation',
    desc: 'Clean, minimal design suitable for workshops, webinars, hackathons, and college events.',
    uses: 'Hackathons · Workshops · Webinars',
    file: '/sample-certificate-template.png',
  },
] as const;

const TEMPLATE_TIPS = [
  {
    title: 'Leave name areas blank',
    desc: 'The participant name, role, and event fields should be empty space in your template. MailMyCertificate overlays those per row from your CSV.',
  },
  {
    title: 'Use high resolution',
    desc: 'Export at 1920×1080px minimum for digital delivery. For print-quality use 3508×2480px (A4 at 300 DPI).',
  },
  {
    title: 'PNG over JPG for sharp text',
    desc: 'If your template has thin text or fine borders, export as PNG to avoid JPEG compression artefacts on the overlaid fields.',
  },
  {
    title: 'Landscape works best',
    desc: 'Traditional certificates are landscape (wider than tall). MailMyCertificate handles portrait too, but most organisers use landscape.',
  },
] as const;

export default function FreeCertificateTemplatesPage() {
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
              <span className="text-foreground">Free Certificate Templates</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              Free Certificate Templates
            </h1>
            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4" data-speakable>
              Download free certificate template PNG files for bulk generation with MailMyCertificate.
              Each template is ready to use as-is or customise further in Canva or Figma before
              importing.
            </p>
            <p className="text-secondary leading-relaxed mb-8">
              MailMyCertificate uses PNG or JPG images as certificate templates — your design becomes
              the background, and participant names, dates, and roles are overlaid per row from your
              CSV or Google Sheets data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta href="/tool" entryPoint="templates_page_hero"
                className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
                Use a template now — free
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
              <Link href="/guide" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
                How templates work
              </Link>
            </div>
            <LastUpdated path="/free-certificate-templates" />
          </div>
        </section>

        {/* Template gallery */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="gallery-heading">
          <div className="container-width max-w-5xl">
            <h2 id="gallery-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Download free certificate templates
            </h2>
            <p className="text-secondary mb-8">
              All templates are free to use, modify, and distribute. Right-click any template and
              save as PNG, or click the download button.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEMPLATES.map((template) => (
                <div key={template.id} className="rounded-xl border border-border/60 bg-background overflow-hidden">
                  <div className="aspect-[4/3] bg-muted/20 overflow-hidden">
                    <Image
                      src={template.file}
                      alt={`${template.name} — free certificate template PNG`}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                    <p className="text-sm text-secondary mb-2">{template.desc}</p>
                    <p className="text-xs text-secondary/70 mb-4">{template.uses}</p>
                    <a href={template.file} download
                      className={buttonVariants({ variant: 'secondary', size: 'sm', className: 'inline-flex items-center gap-2 w-full justify-center' })}>
                      <Download size={14} />
                      Download PNG
                    </a>
                  </div>
                </div>
              ))}

              {/* Canva CTA card */}
              <div className="rounded-xl border border-dashed border-border/60 bg-muted/5 p-6 flex flex-col items-center justify-center text-center gap-3">
                <p className="font-semibold text-foreground">Need a custom design?</p>
                <p className="text-sm text-secondary">Create your own in Canva or Figma, export as PNG, and use it as your template.</p>
                <Link href="/canva-certificate-alternative"
                  className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
                  Canva + MailMyCertificate guide →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Template tips */}
        <section className="py-16 md:py-20 border-b border-border/50 bg-muted/10" aria-labelledby="tips-heading">
          <div className="container-width max-w-4xl">
            <h2 id="tips-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Certificate template best practices
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {TEMPLATE_TIPS.map(({ title, desc }) => (
                <div key={title} className="rounded-xl border border-border/60 p-5">
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="py-16 md:py-20 border-b border-border/50" aria-labelledby="howto-heading">
          <div className="container-width max-w-4xl">
            <h2 id="howto-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How to use a certificate template with MailMyCertificate
            </h2>
            <ol className="space-y-5 list-none pl-0">
              {[
                { step: '1', title: 'Download a template above', desc: 'Or design your own in Canva and export as PNG.' },
                { step: '2', title: 'Open MailMyCertificate', desc: 'No account needed. Open the tool in your browser.' },
                { step: '3', title: 'Upload the template PNG', desc: 'Drag the PNG file into the template upload zone.' },
                { step: '4', title: 'Import your participant list', desc: 'Upload CSV or paste a Google Sheets URL.' },
                { step: '5', title: 'Position fields and generate', desc: 'Drag name/email fields onto the canvas and click Generate.' },
              ].map(({ step, title, desc }) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent border border-accent/20">
                    {step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-0.5">{title}</h3>
                    <p className="text-secondary text-sm">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Template ready? Generate certificates in minutes.
            </h2>
            <TrackToolCta href="/tool" entryPoint="templates_page_footer"
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-sm' })}>
              Open free certificate tool
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
