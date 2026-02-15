import { ContentLayout } from '@/components/layout/ContentLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Our privacy-first commitment. How we handle your data locally in your browser.',
};

export default function PrivacyPolicy() {
    return (
        <ContentLayout
            title="Privacy Policy"
            subtitle="At MailMyCertificate, your privacy isn't just a policy—it's how the tool is engineered."
        >
            <section>
                <h2>1. The Privacy-First Architecture</h2>
                <p>
                    Unlike traditional SaaS tools, MailMyCertificate is built on a <strong>Local Workstation Architecture</strong>. This means that
                    from the moment you upload your certificate template to the moment you generate the final PDF,
                    <strong>no data leaves your device</strong> through our system.
                </p>
                <ul>
                    <li><strong>Template Storage:</strong> Stored locally in your browser&apos;s IndexedDB.</li>
                    <li><strong>Recipient Data:</strong> Your CSV files are parsed and stored locally. We never see your participant lists.</li>
                    <li><strong>PDF Generation:</strong> Rendering happens in a local Web Worker on your machine.</li>
                </ul>
            </section>

            <section>
                <h2>2. Data Collection</h2>
                <p>
                    We do not use tracking cookies or collect personal identification data. We use privacy-masking monitoring (via Sentry)
                    to detect application crashes, but we explicitly mask all Personally Identifiable Information (PII) before it is sent.
                </p>
            </section>

            <section>
                <h2>3. Email Integration (Future)</h2>
                <p>
                    When you use the email sending feature, the tool connects directly to your chosen email provider (e.g., Google OAuth).
                    Your certificate data is transmitted directly from your browser to your email provider. We act only as a
                    client-side orchestrator.
                </p>
            </section>

            <section>
                <h2>4. Third-Party Services</h2>
                <p>
                    Our application is hosted on Vercel. While Vercel may collect standard web server logs (IP addresses, user agents)
                    for security and performance, no application data (your certificates or CSVs) is ever sent to or stored by Vercel servers.
                </p>
            </section>

            <section>
                <h2>5. Changes to This Policy</h2>
                <p>
                    As an open-source project, any changes to how data is handled will be documented in our public GitHub repository.
                    We will never change our core philosophy of "Local-First" data processing.
                </p>
            </section>

            <section>
                <div className="mt-12 p-8 rounded-3xl bg-accent-light/30 border border-accent/10">
                    <p className="text-sm font-black uppercase tracking-widest text-accent mb-2">Engineering Commitment</p>
                    <p className="text-sm italic">
                        By engineering the tool to work entirely in the browser, we remove the "Trust" requirement.
                        You don&apos;t have to trust us with your data, because we never receive it.
                    </p>
                </div>
            </section>
        </ContentLayout>
    );
}
