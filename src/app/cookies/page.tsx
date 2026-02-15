import { ContentLayout } from '@/components/layout/ContentLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Policy',
    description: 'How we use essential cookies (and why we don&apos;t use tracking ones).',
};

export default function CookiePolicy() {
    return (
        <ContentLayout
            title="Cookie Policy"
            subtitle="Understand how we use local storage and cookies to improve your experience."
        >
            <section>
                <h2>1. What are Cookies?</h2>
                <p>
                    Cookies are small text files stored in your browser. However, MailMyCertificate primarily uses
                    <strong>IndexedDB</strong> and <strong>LocalStorage</strong> instead of traditional cookies to provide
                    a high-performance, local-first experience.
                </p>
            </section>

            <section>
                <h2>2. Essential Storage (Strictly Necessary)</h2>
                <p>
                    We use browser storage for essential functionality only. This data is never sent to our servers:
                </p>
                <ul>
                    <li><strong>Session State:</strong> To remember your current step in the certificate generation wizard.</li>
                    <li><strong>Template Metadata:</strong> To store the dimensions and settings of your uploaded certificate.</li>
                    <li><strong>Preferences:</strong> Saving your theme or editor settings (if applicable).</li>
                </ul>
            </section>

            <section>
                <h2>3. No Third-Party Tracking</h2>
                <p>
                    We do not use advertising cookies, social media trackers, or third-party behavioral analytics. Your
                    browsing habits remain your own.
                </p>
            </section>

            <section>
                <h2>4. Analytics</h2>
                <p>
                    We may use privacy-first, cookieless analytics in the future to understand aggregated usage patterns.
                    Currently, we only monitor application stability via Sentry with full PII masking.
                </p>
            </section>

            <section>
                <h2>5. Managing Your Data</h2>
                <p>
                    You can clear all data stored by this application at any time by clearing your browser&apos;s
                    "Site Data" or "Cache" for this domain.
                </p>
            </section>
        </ContentLayout>
    );
}
