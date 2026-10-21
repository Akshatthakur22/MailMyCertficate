import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/metadata';
import { ProductFooter } from '@/components/product/ProductFooter';
import {
    Shield,
    Database,
    HardDrive,
    Github,
    Lock,
    EyeOff,
    ArrowRight,
} from 'lucide-react';

import { SEO_KEYWORDS } from '@/lib/seo-keywords';
import { PAGE_DATES } from '@/data/pageDates';
import { JsonLd } from '@/components/seo/JsonLd';
import { SpeakableSchema } from '@/components/seo/SpeakableSchema';
import { buildBreadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = createPageMetadata({
    title: 'Privacy Policy — MailMyCertificate',
    description:
        'MailMyCertificate privacy policy: local-first certificate generation, browser storage, Gmail OAuth scopes, and exactly what data is never collected.',
    path: '/privacy-policy',
    keywords: [...SEO_KEYWORDS.privacy],
    datePublished: PAGE_DATES['/privacy-policy'].published,
    dateModified: PAGE_DATES['/privacy-policy'].modified,
});

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="py-12 border-t border-border/40 first:border-t-0 first:pt-0">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 text-foreground">
                {title}
            </h2>
            <div className="space-y-5 text-foreground/80 leading-relaxed text-base md:text-[16px]">
                {children}
            </div>
        </section>
    );
}

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <JsonLd
                data={buildBreadcrumbJsonLd([
                    { name: 'Home', path: '/' },
                    { name: 'Privacy Policy', path: '/privacy-policy' },
                ])}
            />
            <SpeakableSchema path="/privacy-policy" cssSelectors={['h1', 'h2', '[data-speakable]']} />
            {/* ======================================
                NAVBAR
               ====================================== */}
            <nav className="fixed top-0 w-full z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
                <div className="container-width flex flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
                    <Link
                        href="/"
                        className="brand-text hover:opacity-80 transition-opacity"
                    >
                        <span>Mail</span>
                        <span>My</span>
                        <span>Certificate</span>
                    </Link>

                    <div className="flex items-center justify-between gap-3 flex-wrap text-sm font-medium text-secondary sm:justify-end">
                        <Link
                            href="/about"
                            className="hover:text-foreground transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="hover:text-foreground transition-colors"
                        >
                            Contact
                        </Link>

                        <Link href="/guide" className="hover:text-accent transition-colors">Guide</Link>
                        <Link
                            href="/tool"
                            className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
                        >
                            Open Tool
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-16">
                {/* ======================================
                    HERO
                   ====================================== */}
                <section className="relative py-16 md:py-24 overflow-hidden">
                    <div className="absolute inset-0 hero-grid opacity-80" />

                    <div className="relative container-width">
                        <div className="max-w-4xl">
                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-2 text-sm text-secondary mb-8">
                                <Link
                                    href="/"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Home
                                </Link>
                                <span>/</span>
                                <span className="text-foreground">
                                    Privacy Policy
                                </span>
                            </nav>

                            {/* Small Label */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/20 text-sm text-secondary mb-6">
                                <Shield size={14} className="text-accent" />
                                Privacy-First Architecture
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 max-w-4xl">
                                Certificate generation runs on your device.
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-secondary leading-relaxed max-w-3xl">
                                MailMyCertificate was designed around a simple idea:
                                organizers should not need to upload participant data
                                just to generate certificates. Optional Sheets import
                                and Gmail delivery send data through our backend.
                            </p>

                            {/* Small Human Note */}
                            <div className="mt-8 inline-flex items-center gap-2 text-sm text-secondary/70 italic">
                                <EyeOff size={14} className="text-accent" />
                                Built because privacy should be part of the workflow —
                                not an afterthought.
                            </div>
                        </div>
                    </div>
                </section>

                {/* ======================================
                    PRIVACY HIGHLIGHTS
                   ====================================== */}
                <section className="py-12 md:py-16 border-y border-border/40 bg-muted/20">
                    <div className="container-width">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            <div className="p-6 rounded-2xl bg-background border border-border/50">
                                <HardDrive
                                    size={22}
                                    className="text-accent mb-4"
                                />
                                <h3 className="font-semibold text-lg mb-2">
                                    Local Processing
                                </h3>
                                <p className="text-sm text-secondary leading-relaxed">
                                    Certificate generation happens directly inside your
                                    browser using your own device.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-background border border-border/50">
                                <Database
                                    size={22}
                                    className="text-accent mb-4"
                                />
                                <h3 className="font-semibold text-lg mb-2">
                                    Browser-side generation
                                </h3>
                                <p className="text-sm text-secondary leading-relaxed">
                                    CSV files and generated PDFs stay in your browser for
                                    generation and download. Public Sheets imports are fetched
                                    through our backend; Gmail delivery sends recipient details
                                    and PDF attachments through our backend to Google.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-background border border-border/50">
                                <Lock
                                    size={22}
                                    className="text-accent mb-4"
                                />
                                <h3 className="font-semibold text-lg mb-2">
                                    Minimal Trust Required
                                </h3>
                                <p className="text-sm text-secondary leading-relaxed">
                                    The product is intentionally engineered to minimize
                                    how much user data ever leaves the browser.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ======================================
                    MAIN CONTENT
                   ====================================== */}
                <section className="py-16 md:py-24">
                    <div className="container-width">
                        <div className="max-w-4xl mx-auto">
                            {/* Intro Note */}
                            <div className="mb-16 p-6 rounded-2xl bg-accent/5 border border-accent/10">
                                <p className="text-base leading-relaxed text-foreground/85">
                                    This Privacy Policy explains how
                                    MailMyCertificate handles data when you use the
                                    application. By using the platform, you agree to the
                                    practices described below.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <Section title="1. Local-First Processing & Data Sovereignty">
                                <p>
                                    MailMyCertificate is developed by Akshat Thakur and
                                    follows a local-first architecture. Certificate
                                    templates, participant data, generated PDFs, and
                                    workflow progress are processed directly inside your
                                    browser whenever possible.
                                </p>

                                <p>
                                    Unlike many traditional SaaS tools,
                                    MailMyCertificate is intentionally designed to
                                    reduce dependency on external cloud storage for core
                                    certificate generation workflows.
                                </p>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    Complete Local Processing
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        Certificate templates are stored locally inside
                                        your browser storage (IndexedDB).
                                    </li>
                                    <li>
                                        CSV and Google Sheets imports are processed 100%
                                        on the client side.
                                    </li>
                                    <li>
                                        PDF generation occurs exclusively within your
                                        browser using client-side Web Workers and pdf-lib.
                                    </li>
                                    <li>
                                        Generated certificates remain on your device until
                                        you manually send or download them.
                                    </li>
                                    <li>
                                        Local browser storage data persists across page
                                        reloads. You can clear it manually via browser
                                        storage settings or using the app's "Clear Data"
                                        option.
                                    </li>
                                </ul>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    What We Do Not Do With Participant Data
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        We do not permanently upload or store participant
                                        rosters on MailMyCertificate servers.
                                    </li>
                                    <li>
                                        We do not retain participant names, emails, or
                                        personal information in any permanent database.
                                    </li>
                                    <li>
                                        We do not permanently store generated certificate PDFs.
                                    </li>
                                    <li>
                                        We do not use Workspace API data (Gmail, Google Sheets)
                                        for secondary purposes like analytics, marketing, or
                                        machine learning.
                                    </li>
                                    <li>
                                        We do not access your Google Sheets or Gmail after
                                        the immediate operation completes.
                                    </li>
                                </ul>
                            </Section>

                            {/* Section 2 */}
                            <Section title="2. Information We Collect">
                                <p>
                                    MailMyCertificate does not intentionally collect or
                                    sell participant information.
                                </p>

                                <p>
                                    Some limited technical information may be collected
                                    automatically for operational and security purposes,
                                    including:
                                </p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>Browser type and version</li>
                                    <li>Device information</li>
                                    <li>Error logs and crash diagnostics</li>
                                    <li>Usage analytics, which may be associated with the Google account email used for Gmail delivery</li>
                                </ul>

                                <p>
                                    Any monitoring or diagnostics services used by the
                                    platform are configured to avoid intentionally
                                    storing Personally Identifiable Information (PII)
                                    wherever reasonably possible.
                                </p>
                            </Section>

                            {/* Section 3 */}
                            <Section title="3. Browser Storage & Local Data">
                                <p>
                                    MailMyCertificate may store temporary workflow data
                                    locally inside your browser using technologies such
                                    as IndexedDB or Local Storage.
                                </p>

                                <p>This may include:</p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>Uploaded certificate templates</li>
                                    <li>Participant lists</li>
                                    <li>Generated certificate references</li>
                                    <li>Workflow progress and session recovery data</li>
                                </ul>

                                <p>
                                    This local data exists only on your device and can
                                    typically be removed by clearing your browser
                                    storage.
                                </p>
                            </Section>

                            {/* Section 4 */}
                            <Section title="4. Google Workspace API Usage & Guaranteed Data Handling">
                                <p>
                                    MailMyCertificate uses the following Google APIs to
                                    deliver its core functionality.
                                </p>

                                <h3 className="font-semibold text-lg mt-6 mb-4 text-foreground">
                                    Gmail API (gmail.send scope)
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>Purpose:</strong> Send personalized
                                        certificates directly through your Gmail account
                                        to event participants.
                                    </li>
                                    <li>
                                        <strong>Data Sent to Backend:</strong> When you request
                                        email delivery, the backend temporarily receives recipient
                                        email address, email subject, email body, and the PDF
                                        certificate file necessary to compose and send the message
                                        via Gmail API on your behalf.
                                    </li>
                                    <li>
                                        <strong>Temporary Processing:</strong> The backend uses
                                        your Gmail OAuth credentials to submit the composed email
                                        through Google's Gmail API. This email data is processed
                                        only for the duration of the send operation and is not
                                        intentionally retained in any permanent MailMyCertificate
                                        database or log file.
                                    </li>
                                    <li>
                                        <strong>No Inbox Access:</strong> This application requests
                                        the <code className="text-sm bg-muted px-1.5 py-0.5 rounded">gmail.send</code>{' '}
                                        scope plus OpenID and profile/email scopes to identify the
                                        connected account. It never reads, modifies, stores, or deletes
                                        existing emails in your Gmail inbox and cannot access Gmail
                                        history.
                                    </li>
                                    <li>
                                        <strong>After Send:</strong> Once the email is transmitted
                                        through Gmail, MailMyCertificate does not retain a copy of
                                        the sent message, recipient address, or email content.
                                    </li>
                                </ul>

                                <h3 className="font-semibold text-lg mt-6 mb-4 text-foreground">
                                    Google Sheets Import (Public CSV Export — No OAuth Scope Required)
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>How it works:</strong> When you provide a
                                        publicly accessible Google Sheets URL, MailMyCertificate
                                        retrieves the sheet&apos;s public CSV export through our
                                        backend. No Google Sheets OAuth scope or API access is required.
                                        The CSV data is returned to your browser for parsing and use in
                                        the certificate workflow.
                                    </li>
                                    <li>
                                        <strong>Requirement:</strong> The sheet must be set
                                        to &quot;Anyone with the link can view&quot; by you before
                                        import. MailMyCertificate only accesses publicly shared sheets
                                        and never requests private or non-shared sheets.
                                    </li>
                                    <li>
                                        <strong>Data Handling:</strong> After retrieving the CSV export,
                                        the data is passed to your browser for parsing. Imported participant
                                        data is stored locally in your browser's IndexedDB and is never
                                        permanently retained on MailMyCertificate servers.
                                    </li>
                                    <li>
                                        <strong>No Authentication Required:</strong> This
                                        feature does not request or use any Google Sheets API
                                        scope, Google OAuth token, or access to your Google account.
                                    </li>
                                </ul>

                                <h3 className="font-semibold text-lg mt-6 mb-4 text-foreground">
                                    Recipient Email Sources — No Leads Database or Lead Generation
                                </h3>

                                <p>
                                    MailMyCertificate does NOT provide any of the following:
                                </p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>A leads database or shared contact database</li>
                                    <li>Lead generation or lead sourcing services</li>
                                    <li>Email address suggestions or recipient recommendations</li>
                                    <li>Email scraping or automated email discovery services</li>
                                    <li>Recipient list sharing or distribution between users</li>
                                </ul>

                                <p className="mt-4">
                                    <strong>Recipients enter the system entirely from you:</strong>
                                </p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>CSV files you upload:</strong> Stored locally in your browser's IndexedDB, never uploaded to our servers
                                    </li>
                                    <li>
                                        <strong>Public Google Sheets you specify:</strong> Imported once per session using a public CSV export (no OAuth required)
                                    </li>
                                </ul>

                                <p className="mt-4">
                                    <strong>Data isolation:</strong> All recipient data is scoped to your session and cannot be accessed by other MailMyCertificate users.
                                </p>

                                <h3 className="font-semibold text-lg mt-6 mb-4 text-foreground">
                                    No Email Warming, Automated Sending, or Reputation Services
                                </h3>

                                <p>
                                    MailMyCertificate does NOT provide:
                                </p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>Email warming, inbox warming, or sender reputation optimization services</li>
                                    <li>Automated email sequences, background email jobs, or scheduled sending</li>
                                    <li>Simulated email activity, artificial engagement metrics, or deliverability enhancement</li>
                                    <li>Any mechanism for unsolicited commercial email or cold outreach</li>
                                </ul>

                                <p className="mt-4">
                                    <strong>How email sending works:</strong> All emails are sent immediately and synchronously when you explicitly click "Send". You control each send operation — MailMyCertificate does not autonomously generate, schedule, or send emails. The queue system manages rate limiting and reliability (preventing Gmail API rate limits from being exceeded), not email warming or reputation building.
                                </p>

                                <div className="mt-8 p-6 rounded-xl bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700">
                                    <div className="flex items-start gap-3">
                                        <Lock
                                            size={18}
                                            className="text-red-700 dark:text-red-600 mt-0.5"
                                        />
                                        <div>
                                            <p className="text-base font-bold uppercase tracking-[0.15em] text-black dark:text-black mb-2">
                                                AI/ML & Foundational Model Compliance
                                                (2026 Mandate)
                                            </p>
                                            <p className="text-base text-black dark:text-black leading-relaxed">
                                                <strong>Critical Guarantee:</strong> Data
                                                accessed from Google Workspace APIs (Gmail,
                                                Google Sheets) will never be used, transferred,
                                                or sold to train, improve, or create any
                                                foundational, generative, or large language
                                                models, or any other machine learning or
                                                artificial intelligence systems. We are
                                                prohibited from using your data for any AI
                                                training purposes.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 rounded-xl bg-accent/5 border border-accent/20">
                                    <h3 className="font-semibold text-lg mb-3 text-foreground">
                                        Google API Services User Data Policy — Limited Use Disclosure
                                    </h3>
                                    <p className="text-base leading-relaxed text-foreground/85">
                                        MailMyCertificate&apos;s use and transfer to any other app of
                                        information received from Google APIs will adhere to the{' '}
                                        <a
                                            href="https://developers.google.com/terms/api-services-user-data-policy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent font-medium hover:underline"
                                        >
                                            Google API Services User Data Policy
                                        </a>
                                        , including the Limited Use requirements.
                                    </p>
                                    <p className="mt-3 text-base leading-relaxed text-foreground/85">
                                        Specifically, MailMyCertificate limits its use of Google user
                                        data to providing and improving user-facing features that are
                                        visible and prominent in the application&apos;s interface. We do not
                                        use Google user data for serving advertisements, and we do not
                                        allow humans to read user data except with affirmative user
                                        consent, for security purposes, or to comply with applicable law.
                                    </p>
                                </div>
                            </Section>

                            {/* Section 5 */}
                            <Section title="5. Hosting & Infrastructure">
                                <p>
                                    MailMyCertificate may use third-party hosting and
                                    infrastructure providers such as Vercel for website
                                    delivery, uptime, analytics, and security.
                                </p>

                                <p>
                                    These providers may temporarily process technical
                                    request information such as IP addresses, browser
                                    metadata, and performance logs as part of normal web
                                    infrastructure operations.
                                </p>

                                <p>
                                    However, participant certificate data is not intended
                                    to be permanently stored on these infrastructure
                                    services.
                                </p>
                            </Section>

                            {/* Section 5.1 - Data Protection & Security */}
                            <Section title="5.1 Data Protection & Security Measures">
                                <p>
                                    MailMyCertificate implements multiple layers of
                                    security to protect your data during the certificate
                                    generation and email delivery workflow.
                                </p>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    Transport Security
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>HTTPS only:</strong> All communication
                                        between your browser and our servers is encrypted
                                        using HTTPS. Unencrypted HTTP connections
                                        are not accepted.
                                    </li>
                                    <li>
                                        <strong>OAuth tokens in transit:</strong> Google
                                        OAuth tokens are sent over HTTPS between your browser
                                        and the Flask API. They are not included in URLs or
                                        browser local storage.
                                    </li>
                                </ul>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    Session & Credential Security
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>Encrypted session cookie:</strong> OAuth
                                        credentials are encrypted before being placed in Flask&apos;s
                                        signed session cookie. The cookie is held by your browser
                                        and is HttpOnly, Secure in production, and SameSite=Lax;
                                        it is not a server-side session store.
                                    </li>
                                    <li>
                                        <strong>Session-scoped credentials:</strong> The encrypted
                                        credential payload is carried by the session cookie and is
                                        sent to the API with requests. Logout clears the cookie;
                                        expiry follows the configured Flask session lifetime. The
                                        API does not intentionally write OAuth tokens to its database
                                        or file system.
                                    </li>
                                    <li>
                                        <strong>CSRF protection:</strong> All state-changing
                                        operations (sending emails, logout) are protected
                                        by cryptographic CSRF tokens validated on the server.
                                    </li>
                                    <li>
                                        <strong>OAuth state validation:</strong> The OAuth
                                        callback verifies a server-generated state parameter
                                        to prevent cross-site request forgery during login.
                                    </li>
                                </ul>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    Access Controls
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>Requested scopes:</strong> We request
                                        <code className="text-sm bg-muted px-1.5 py-0.5 rounded">gmail.send</code>
                                        for sending, along with OpenID and profile/email scopes
                                        to identify the connected account. We do not request Gmail
                                        inbox read access.
                                    </li>
                                    <li>
                                        <strong>Not intentionally persisted:</strong> OAuth
                                        credentials are not intentionally written to a database
                                        or file system; encrypted credentials are carried in the
                                        session cookie.
                                    </li>
                                    <li>
                                        <strong>Production hardening:</strong> Debug endpoints
                                        and verbose error messages are disabled in production.
                                        Internal errors are sanitized before being returned
                                        to clients. Specific hardening measures include:
                                        <ul className="mt-2 ml-4 space-y-2 list-disc">
                                            <li>No stack traces or internal error details exposed to users</li>
                                            <li>Request logging excludes sensitive data (tokens, OAuth credentials)</li>
                                            <li>Monitoring and alerting configured for suspicious activity</li>
                                            <li>Infrastructure runs on secure, managed platforms with security scanning</li>
                                            <li>Dependencies are regularly audited for known vulnerabilities</li>
                                        </ul>
                                    </li>
                                </ul>
                            </Section>

                            {/* Section 5.2 - Consent & Email Preferences */}
                            <Section title="5.2 Recipient Consent & Email Preferences">
                                <p>
                                    MailMyCertificate is designed for sending certificates to event participants who have implicitly consented to receive communications from the event organizer.
                                </p>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    Consent & Organizer Responsibility
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>Organizer-provided recipients:</strong> Recipients are supplied
                                        by the organizer from participant data the organizer provides. MailMyCertificate
                                        does not independently verify consent or contact preferences.
                                    </li>
                                    <li>
                                        <strong>Your responsibility:</strong> The organizer is responsible for
                                        ensuring that all use of recipient information and email communications
                                        complies with applicable laws and regulations in their jurisdiction,
                                        including requirements regarding consent, notification, and opt-out mechanisms.
                                    </li>
                                    <li>
                                        <strong>Product context:</strong> MailMyCertificate is designed for
                                        organizer-initiated delivery of event-related communications (primarily certificates)
                                        to participants whose information the organizer has provided.
                                    </li>
                                </ul>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    Unsubscribe & Preference Management
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>No built-in unsubscribe or preference system:</strong> MailMyCertificate
                                        does not provide unsubscribe links, preference management, suppression lists,
                                        or recipient opt-out functionality.
                                    </li>
                                    <li>
                                        <strong>Recipient contact:</strong> Recipients who wish to manage their
                                        communication preferences or opt out of future communications should contact
                                        the event organizer directly.
                                    </li>
                                    <li>
                                        <strong>Product design:</strong> MailMyCertificate is designed for
                                        organizer-initiated certificate delivery rather than subscription-based
                                        or recurring communications. Compliance with applicable email communication
                                        laws and regulations is the organizer&apos;s responsibility.
                                    </li>
                                </ul>
                            </Section>

                            {/* Section 5.3 - Data Sharing & Prohibited Uses */}
                            <Section title="5.3 Data Sharing, Disclosure & Prohibited Uses">
                                <p>
                                    MailMyCertificate does not sell, rent, trade, or
                                    otherwise disclose Google user data to any third
                                    party except as strictly necessary to provide the
                                    service (e.g., transmitting your email through
                                    Google&apos;s own Gmail API on your behalf).
                                </p>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    We explicitly do NOT use Google user data for:
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>Advertising:</strong> No targeted,
                                        personalized, retargeted, or interest-based
                                        advertising of any kind.
                                    </li>
                                    <li>
                                        <strong>Data brokering or resale:</strong> We never
                                        sell or transfer user data to data brokers,
                                        information resellers, or any party for
                                        commercial gain.
                                    </li>
                                    <li>
                                        <strong>Credit or lending decisions:</strong> User
                                        data is never used to determine creditworthiness
                                        or for lending purposes.
                                    </li>
                                    <li>
                                        <strong>Unrelated databases:</strong> We never
                                        combine or build datasets unrelated to
                                        MailMyCertificate&apos;s user-facing certificate
                                        generation and delivery features.
                                    </li>
                                    <li>
                                        <strong>AI/ML model training:</strong> Google user
                                        data is never used to train, improve, or develop
                                        generalized or non-personalized artificial
                                        intelligence or machine learning models.
                                    </li>
                                    <li>
                                        <strong>Surveillance or tracking:</strong> We do
                                        not use Google user data for profiling,
                                        monitoring, or tracking individuals beyond what is
                                        needed to deliver the certificate email they
                                        requested.
                                    </li>
                                </ul>

                                <p className="mt-6">
                                    <strong>Summary:</strong> Gmail permission is used to send
                                    certificate emails on your behalf. OpenID/profile data identifies
                                    the connected account; the account email and a hashed account
                                    identifier are also stored with usage aggregates in the backend
                                    analytics database. Email content and attachments are transmitted
                                    to Google&apos;s Gmail API to complete each send.
                                </p>
                            </Section>

                            {/* Section 5.5 - Analytics & GTM */}
                            <Section title="5.5 Analytics & Google Tag Manager">
                                <p>
                                    MailMyCertificate uses Google Tag Manager (GTM) and
                                    Google Analytics (GA4) for client-side usage measurement. The
                                    backend also maintains usage aggregates associated with the
                                    connected Google account email and a hashed account identifier.
                                </p>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    Critical: Workspace Data Exclusion
                                </h3>

                                <p>
                                    <strong>GUARANTEED:</strong> No data accessed from Google
                                    Workspace APIs (Gmail, Google Sheets, participant
                                    information, certificate content, or email addresses) is
                                    ever sent to Google Analytics, Google Tag Manager, or any
                                    third-party analytics service.
                                </p>

                                <p>Analytics data collected is limited to:</p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        Locally generated visitor ID and page/navigation events
                                    </li>
                                    <li>
                                        Page path and navigation flow (no personal data)
                                    </li>
                                    <li>
                                        Feature usage (e.g., &quot;template_uploaded&quot;,
                                        &quot;certificate_generated&quot;) with aggregate counts only
                                    </li>
                                    <li>
                                        Browser type and device category (non-identifying)
                                    </li>
                                    <li>
                                        Error events (no PII or sensitive data included)
                                    </li>
                                </ul>

                                <p className="mt-4">
                                    The client analytics event code does not intentionally send
                                    participant row data or certificate contents. The backend
                                    analytics database does store the connected Google account
                                    email and a hashed account identifier with usage aggregates;
                                    its cleanup/retention schedule is not defined in this codebase.
                                </p>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    Data Retention for Analytics
                                </h3>

                                <p>
                                    Google Analytics retention depends on the property configuration,
                                    which is not available in this repository. The custom backend
                                    analytics database has no retention cleanup schedule in the
                                    inspected code. Contact us to ask about analytics data deletion.
                                </p>
                            </Section>

                            {/* Section 6 */}
                            <Section title="6. Data Retention & Deletion">
                                <p>
                                    MailMyCertificate minimizes data retention wherever
                                    possible.
                                </p>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    Browser-Side Data
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>Storage mechanism:</strong> Participant lists,
                                        templates, and certificate references are stored in
                                        your browser's IndexedDB and localStorage.
                                    </li>
                                    <li>
                                        <strong>Persistence:</strong> This data persists across
                                        page reloads within the same browser session. It allows
                                        you to resume work if the page is accidentally refreshed.
                                    </li>
                                    <li>
                                        <strong>Manual deletion:</strong> You can clear this data at any
                                        time by:
                                        <ul className="mt-2 ml-4 space-y-2 list-disc">
                                            <li>Using the app's Settings → "Clear Data" option</li>
                                            <li>Clearing your browser's site data for mailmycertificate.tech</li>
                                            <li>Using your browser's storage management tools</li>
                                        </ul>
                                    </li>
                                    <li>
                                    <strong>No persistent participant-row database:</strong> CSV-based
                                        rows are stored in browser IndexedDB. Public Sheets data passes
                                        through the backend during import, and Gmail send requests
                                        temporarily include recipient details and PDF attachments.
                                    </li>
                                </ul>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    Backend Data
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>Gmail Send Operations:</strong> When you send a
                                        certificate email, the backend temporarily receives the
                                        recipient address and email content to compose and transmit
                                        the message. This data is not intentionally retained in a
                                        permanent database after the send operation completes.
                                    </li>
                                    <li>
                                        <strong>OAuth Credentials & Session Security:</strong> Google
                                        OAuth access and refresh tokens are encrypted inside Flask&apos;s
                                        signed session cookie, which is held by the browser. The cookie
                                        has the following protections:
                                        <ul className="mt-2 ml-4 space-y-2 list-disc">
                                            <li><strong>HttpOnly flag:</strong> The cookie is not readable through browser JavaScript</li>
                                            <li><strong>Secure flag:</strong> Tokens are only transmitted over HTTPS</li>
                                            <li><strong>SameSite="Lax":</strong> Limits when browsers send the cookie on cross-site requests; state-changing API calls also validate a CSRF token in production</li>
                                            <li><strong>Session lifetime:</strong> Cookie expiry follows the configured Flask permanent-session lifetime</li>
                                            <li><strong>Storage:</strong> OAuth tokens are carried in the encrypted cookie and are not intentionally written to a database, local storage, or files</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Analytics Events:</strong> Usage events and aggregates
                                        are recorded for product improvement. The backend analytics
                                        database associates records with the connected Google account
                                        email and a hashed account identifier. Participant row data
                                        and certificate contents are not intentionally included in
                                        client event payloads. See &quot;Analytics &amp; GTM&quot; below.
                                    </li>
                                </ul>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    Requesting Data Deletion
                                </h3>

                                <p>
                                    If you have questions about data retention or believe any
                                    personal information has been retained on MailMyCertificate
                                    servers, you may:
                                </p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>Revoke OAuth access:</strong> Visit your{' '}
                                        <a
                                            href="https://myaccount.google.com/permissions"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent font-medium hover:underline"
                                        >
                                            Google Account Permissions
                                        </a>{' '}
                                        page and disconnect MailMyCertificate. This immediately
                                        invalidates our access to your Gmail account.
                                    </li>
                                    <li>
                                        <strong>Clear local data:</strong> Clear your browser's
                                        IndexedDB and localStorage for mailmycertificate.tech, or
                                        use the app's "Clear Data" option.
                                    </li>
                                    <li>
                                        <strong>Contact us:</strong> Email{' '}
                                        <a
                                            href="mailto:akshatthakur22@gmail.com"
                                            className="text-accent font-medium hover:underline"
                                        >
                                            akshatthakur22@gmail.com
                                        </a>{' '}
                                        or use our{' '}
                                        <Link
                                            href="/contact"
                                            className="text-accent font-medium hover:underline"
                                        >
                                            Contact page
                                        </Link>
                                        {' '}to report data retention concerns. We will respond
                                        within 7 days.
                                    </li>
                                </ul>
                            </Section>

                            {/* Section 7 */}
                            <Section title="7. Open Source Transparency">
                                <p>
                                    MailMyCertificate is an open-source project.
                                </p>

                                <p>
                                    Transparency is important for tools that process
                                    participant information and certificate workflows.
                                    Users may inspect the public source code repository
                                    to better understand how the application works.
                                </p>

                                <Link
                                    href="https://github.com/akshatthakur22/MailMyCertficate"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 mt-2 text-accent font-medium hover:text-accent/80 transition-colors"
                                >
                                    <Github size={16} />
                                    View GitHub Repository
                                    <ArrowRight size={14} />
                                </Link>
                            </Section>

                            {/* Section 8 */}
                            <Section title="8. Policy Updates">
                                <p>
                                    This Privacy Policy may be updated from time to time
                                    to reflect technical improvements, legal
                                    requirements, or workflow changes.
                                </p>

                                <p>
                                    Material privacy-related changes will be reflected on
                                    this page.
                                </p>
                            </Section>

                            {/* Final Commitment */}
                            <div className="mt-16 p-8 rounded-3xl bg-accent-light/20 border border-accent/10">
                                <div className="flex items-start gap-4">
                                    <Shield
                                        size={24}
                                        className="text-accent mt-1"
                                    />

                                    <div>
                                        <p className="text-base font-bold uppercase tracking-[0.18em] text-accent mb-3">
                                            Our Commitment
                                        </p>

                                        <p className="text-foreground/85 leading-relaxed text-base">
                                            MailMyCertificate was built to solve a real organizer workflow problem
                                            without forcing users to trust unknown servers
                                            with participant data.
                                        </p>

                                        <p className="text-foreground/85 leading-relaxed mt-4 text-base">
                                            We keep it simple:
                                            generate and send certificates with as little
                                            unnecessary data exposure as possible.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Last Updated */}
                            <div className="mt-10 text-sm text-secondary/60">
                                Last updated: July 2026
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <ProductFooter />
        </div>
    );
}
