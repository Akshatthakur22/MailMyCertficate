import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { ProductFooter } from '@/components/product/ProductFooter';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-10 border-t border-border/40 first:border-t-0 first:pt-0">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 text-foreground">
        {title}
      </h2>
      <div className="space-y-4 text-foreground/80 leading-relaxed text-base">
        {children}
      </div>
    </section>
  );
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container-width max-w-4xl pt-24 pb-20 px-4 sm:px-6">
        <nav
          className="flex items-center gap-2 text-sm text-secondary mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">Terms of Service</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-secondary mb-12">
          Last updated: July 2026
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing and using MailMyCertificate (&quot;the Service&quot;), you
            agree to these terms. If you do not agree, do not use the Service.
            MailMyCertificate is provided free of charge under the MIT open-source
            license.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            MailMyCertificate is a browser-based tool for generating personalized
            PDF certificates from templates and participant data. The Service
            includes optional Gmail integration for email delivery.
          </p>
          <p>
            Certificate generation runs locally in your browser. No participant
            data is uploaded to MailMyCertificate servers during the generation
            process.
          </p>
        </Section>

        <Section title="3. User Responsibilities">
          <p>You are responsible for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The content of certificates you generate</li>
            <li>Having permission to use template designs you upload</li>
            <li>Complying with applicable laws regarding bulk email sending</li>
            <li>Managing your Gmail OAuth connection and understanding its scope</li>
            <li>Ensuring participant data accuracy</li>
          </ul>
        </Section>

        <Section title="4. Gmail Integration">
          <p>
            When you connect Gmail, you authorize MailMyCertificate to send emails
            on your behalf using the <code>gmail.send</code> scope. We do not read,
            store, or access your inbox, contacts, or other Gmail data.
          </p>
          <p>
            You are responsible for complying with Gmail&apos;s terms of service and
            sending limits. MailMyCertificate is not liable for account restrictions
            imposed by Google.
          </p>
        </Section>

        <Section title="5. Data and Privacy">
          <p>
            MailMyCertificate processes data locally in your browser. See our{' '}
            <Link href="/privacy-policy" className="text-accent hover:underline font-medium">
              Privacy Policy
            </Link>{' '}
            for full details on data handling, storage, and Google Workspace API
            compliance.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            The MailMyCertificate source code is licensed under the MIT License. You
            may use, modify, and distribute it according to MIT terms. Certificate
            designs you create remain your intellectual property.
          </p>
        </Section>

        <Section title="7. Disclaimer of Warranties">
          <p>
            The Service is provided &quot;AS IS&quot; without warranty of any kind,
            express or implied. We do not guarantee uninterrupted service, data
            integrity, or fitness for a particular purpose.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            In no event shall MailMyCertificate or its creator be liable for any
            indirect, incidental, or consequential damages arising from use of the
            Service, including lost data or failed email delivery.
          </p>
        </Section>

        <Section title="9. Changes to Terms">
          <p>
            We may update these terms at any time. Continued use of the Service
            after changes constitutes acceptance of the new terms. Check this page
            periodically for updates.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            Questions about these terms? Reach out via our{' '}
            <Link href="/contact" className="text-accent hover:underline font-medium">
              Contact page
            </Link>{' '}
            or email akshatthakur22@gmail.com.
          </p>
        </Section>
      </main>

      <ProductFooter />
    </div>
  );
}
