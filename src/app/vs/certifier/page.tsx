import Link from 'next/link';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
import { ArrowRight, Check } from 'lucide-react';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { FAQSection } from '@/components/guide/FAQSection';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';
import { buttonVariants } from '@/components/ui/Button';
import {
  CERTIFIER_COMPARISON_FAQS,
  CERTIFIER_COMPARISON_FEATURES,
} from '@/data/certifierComparisonContent';

export default function CertifierComparisonPage() {
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
              <span className="text-foreground">vs Certifier</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              MailMyCertificate vs Certifier
            </h1>

            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-4">
              <strong>Answer:</strong> MailMyCertificate is a free, open-source
              alternative to Certifier that generates certificates locally in
              your browser. Certifier is a paid SaaS with cloud processing,
              verification portals, and LMS integrations.
            </p>

            <p className="text-secondary leading-relaxed mb-8">
              Honest comparison for event organizers choosing between a
              privacy-first open-source tool and an enterprise credential
              platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <TrackToolCta
                href="/tool"
                entryPoint="certifier_comparison_hero"
                className={buttonVariants({
                  variant: 'primary',
                  size: 'lg',
                  className: 'shadow-sm',
                })}
              >
                Try MailMyCertificate Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </TrackToolCta>
            </div>

            <LastUpdated path="/vs/certifier" />
          </div>
        </section>

        {/* Feature comparison table */}
        <section
          className="py-16 md:py-20 border-b border-border/50"
          aria-labelledby="comparison-table"
        >
          <div className="container-width max-w-5xl">
            <h2
              id="comparison-table"
              className="text-2xl md:text-3xl font-bold tracking-tight mb-8"
            >
              Feature-by-feature comparison
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">
                  MailMyCertificate vs Certifier feature comparison
                </caption>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Feature
                    </th>
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      MailMyCertificate
                    </th>
                    <th scope="col" className="p-4 font-semibold text-foreground">
                      Certifier
                    </th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  {CERTIFIER_COMPARISON_FEATURES.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-accent/5' : ''}`}
                    >
                      <th
                        scope="row"
                        className="p-4 font-medium text-foreground text-left"
                      >
                        {row.feature}
                      </th>
                      <td className="p-4">{row.mailMyCertificate}</td>
                      <td className="p-4">{row.certifier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* When to choose which */}
        <section
          className="py-16 md:py-20 border-b border-border/50 bg-muted/10"
          aria-labelledby="when-to-choose"
        >
          <div className="container-width max-w-4xl">
            <h2
              id="when-to-choose"
              className="text-2xl md:text-3xl font-bold tracking-tight mb-6"
            >
              When to choose each tool
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="font-semibold text-foreground mb-3">
                  Choose MailMyCertificate when:
                </h3>
                <ul className="space-y-2 text-secondary text-sm">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-700 mt-0.5 shrink-0" />
                    You need free, unlimited certificate generation
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-700 mt-0.5 shrink-0" />
                    Privacy matters — no data upload to third parties
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-700 mt-0.5 shrink-0" />
                    You want to send from your own Gmail address
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-700 mt-0.5 shrink-0" />
                    You value open source and code transparency
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="font-semibold text-foreground mb-3">
                  Choose Certifier when:
                </h3>
                <ul className="space-y-2 text-secondary text-sm">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-700 mt-0.5 shrink-0" />
                    You need public verification portals with QR codes
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-700 mt-0.5 shrink-0" />
                    You require LMS/API integrations
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-700 mt-0.5 shrink-0" />
                    You need credential analytics and tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-700 mt-0.5 shrink-0" />
                    Enterprise support and SLA are important
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The underlying difference */}
        <section
          className="py-16 md:py-20 border-b border-border/50"
          aria-labelledby="certifier-real-difference"
        >
          <div className="container-width max-w-4xl">
            <h2
              id="certifier-real-difference"
              className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
            >
              What is the real difference between MailMyCertificate and Certifier?
            </h2>
            <p className="text-secondary leading-relaxed mb-6" data-speakable>
              The feature grid above is the surface. The underlying difference is where the
              certificate lives after you make it. MailMyCertificate produces a file: a PDF that you
              own, hand over, and are then finished with. Certifier and platforms like it produce a
              hosted record: a credential that continues to exist on their infrastructure so it can be
              verified, revoked, tracked and reported on later.
            </p>
            <p className="text-secondary leading-relaxed mb-6">
              That single distinction explains nearly every other difference. A hosted credential
              needs an account, a database holding recipient details, and a subscription to keep the
              verification page online. A file needs none of those, which is why MailMyCertificate can
              be free and can keep participant data on your device — but also why it cannot offer a
              verification URL, because there is no server keeping a record to verify against.
            </p>
            <p className="text-secondary leading-relaxed">
              So the question is not which tool is better. It is whether your certificates need to
              stay verifiable after you send them. If a recipient will put the credential on LinkedIn
              and an employer may click through to confirm it, you want the hosted model. If the
              certificate is recognition for attending your event, the file model does the job without
              an ongoing cost.
            </p>
          </div>
        </section>

        {/* Cost model */}
        <section
          className="py-16 md:py-20 border-b border-border/50 bg-muted/10"
          aria-labelledby="certifier-cost"
        >
          <div className="container-width max-w-4xl">
            <h2 id="certifier-cost" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How do the costs compare?
            </h2>
            <p className="text-secondary leading-relaxed mb-6" data-speakable>
              MailMyCertificate is free at every volume. It is MIT licensed with no paid tier, no
              per-certificate fee and no cap, because generation runs on your own device and there is
              no infrastructure cost to recover. Certifier is commercial software with paid plans,
              which typically scale by how many credentials you issue.
            </p>
            <p className="text-secondary leading-relaxed mb-6">
              Deliberately, no specific prices are quoted here. SaaS pricing and plan limits change
              often, and a stale figure on this page would be worse than no figure at all. Check{' '}
              <Link
                href="https://certifier.io/pricing"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-accent hover:underline"
              >
                Certifier&apos;s own pricing page
              </Link>{' '}
              for current numbers, then weigh them against what the hosted features are worth to you.
            </p>
            <p className="text-secondary leading-relaxed">
              The more useful comparison is not money but time. Both tools remove the manual work of
              editing certificates individually. Where they differ is setup: MailMyCertificate needs
              no account, so first use to finished batch is a single session, while a hosted platform
              front-loads onboarding in exchange for capabilities that persist afterwards.
            </p>
          </div>
        </section>

        {/* Decision path */}
        <section
          className="py-16 md:py-20 border-b border-border/50"
          aria-labelledby="certifier-decide"
        >
          <div className="container-width max-w-4xl">
            <h2 id="certifier-decide" className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How do I decide which one to use?
            </h2>
            <p className="text-secondary leading-relaxed mb-8" data-speakable>
              Work through these five questions in order. The first one you answer &quot;yes&quot; to
              settles it.
            </p>
            <ol className="space-y-5 list-none pl-0">
              {[
                {
                  q: 'Must recipients verify the certificate at a public URL?',
                  a: 'If yes, choose a hosted platform. This is the one requirement MailMyCertificate cannot meet, and no workaround changes that.',
                },
                {
                  q: 'Does it need to flow into an LMS, CRM or HR system automatically?',
                  a: 'If yes, choose a hosted platform. MailMyCertificate has no integration API; it produces files and emails.',
                },
                {
                  q: 'Are you contractually barred from uploading participant personal data to a vendor?',
                  a: 'If yes, choose MailMyCertificate. Participant rows stay in your browser, so there is no processor agreement to negotiate.',
                },
                {
                  q: 'Is your budget zero?',
                  a: 'If yes, choose MailMyCertificate. It is free at any volume, which matters for student clubs and volunteer-run events.',
                },
                {
                  q: 'Do you just need good-looking certificates in inboxes this week?',
                  a: 'Then MailMyCertificate is the shorter path. No account, no onboarding, no procurement conversation.',
                },
              ].map((item, index) => (
                <li key={item.q} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent border border-accent/20">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.q}</h3>
                    <p className="text-secondary text-sm leading-relaxed">{item.a}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-secondary leading-relaxed mt-8">
              Plenty of organizers end up using both: a hosted platform for accredited programmes
              where verification matters, and MailMyCertificate for the long tail of workshops,
              hackathons and community events where it does not.
            </p>
          </div>
        </section>

        {/* Accuracy note — E-E-A-T */}
        <section
          className="py-12 border-b border-border/50 bg-muted/10"
          aria-labelledby="certifier-accuracy"
        >
          <div className="container-width max-w-4xl">
            <h2
              id="certifier-accuracy"
              className="text-lg font-semibold tracking-tight mb-3 text-foreground"
            >
              About this comparison
            </h2>
            <p className="text-secondary text-sm leading-relaxed">
              Written and maintained by Akshat Thakur, who builds MailMyCertificate, so treat it as
              informed but not neutral. Claims about MailMyCertificate are verifiable in the{' '}
              <Link
                href="https://github.com/akshatthakur22/MailMyCertficate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                public source code
              </Link>
              . Claims about Certifier describe its product category at a general level and are not
              endorsed by Certifier; confirm current features and pricing on their own site before
              deciding. Corrections are welcome via{' '}
              <Link href="/contact" className="text-accent hover:underline">
                the contact page
              </Link>
              .
            </p>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection
          faqs={[...CERTIFIER_COMPARISON_FAQS]}
          title="MailMyCertificate vs Certifier FAQ"
          subtitle="Common questions about switching or choosing"
        />

        {/* CTA */}
        <section className="py-16 md:py-24 bg-muted/20">
          <div className="container-width max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Free certificates, no strings attached.
            </h2>
            <TrackToolCta
              href="/tool"
              entryPoint="certifier_comparison_footer"
              className={buttonVariants({
                variant: 'primary',
                size: 'lg',
                className: 'shadow-sm',
              })}
            >
              Open MailMyCertificate
              <ArrowRight className="ml-2 w-5 h-5" />
            </TrackToolCta>
          </div>
        </section>

        <RelatedPages pageKey="certifier" />
      </main>

      <ProductFooter />
    </div>
  );
}
