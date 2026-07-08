import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/metadata';
import { ProductFooter } from '@/components/product/ProductFooter';
import {
    Shield,
    Database,
    HardDrive,
    Mail,
    Github,
    Lock,
    EyeOff,
    Server,
    ArrowRight,
} from 'lucide-react';

import { SEO_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = createPageMetadata({
    title: 'Privacy Policy',
    description:
        'MailMyCertificate privacy policy: local-first certificate generation, browser storage, Gmail OAuth, and how your data is handled.',
    path: '/privacy-policy',
    keywords: [...SEO_KEYWORDS.privacy],
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
                                Your certificate data stays on your device.
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-secondary leading-relaxed max-w-3xl">
                                MailMyCertificate was designed around a simple idea:
                                organizers should not need to upload participant data
                                to external servers just to generate and send
                                certificates.
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
                                    No Participant Uploads
                                </h3>
                                <p className="text-sm text-secondary leading-relaxed">
                                    Your CSV files, participant names, and generated
                                    certificates are not uploaded to our servers.
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
                                        your browser storage.
                                    </li>
                                    <li>
                                        CSV and Google Sheets imports are processed 100%
                                        on the client side.
                                    </li>
                                    <li>
                                        PDF generation occurs exclusively within your
                                        browser using client-side processing.
                                    </li>
                                    <li>
                                        Generated certificates remain on your device until
                                        you manually send them.
                                    </li>
                                    <li>
                                        All data is deleted immediately when your browser
                                        tab closes.
                                    </li>
                                </ul>

                                <h3 className="font-semibold text-lg mt-6 mb-3 text-foreground">
                                    What We Do Not Do
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        We never upload participant data to external
                                        servers.
                                    </li>
                                    <li>
                                        We never permanently store certificate generation
                                        logs.
                                    </li>
                                    <li>
                                        We never access or cache your Google Sheets or
                                        Gmail after the immediate operation.
                                    </li>
                                    <li>
                                        We never use Workspace API data for any analytics
                                        or secondary purposes.
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
                                    <li>Basic anonymous usage analytics</li>
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
                                        <strong>Data Accessed:</strong> Only recipient
                                        email addresses and certificate content.
                                    </li>
                                    <li>
                                        <strong>Data Handling:</strong> Emails are sent
                                        through your Gmail account only; MailMyCertificate
                                        does not store, read, or retain emails, inbox
                                        data, or any Gmail account information.
                                    </li>
                                    <li>
                                        <strong>No Inbox Access:</strong> This application
                                        never reads, modifies, or stores any existing
                                        emails in your Gmail inbox.
                                    </li>
                                </ul>

                                <h3 className="font-semibold text-lg mt-6 mb-4 text-foreground">
                                    Google Sheets API (spreadsheets.readonly scope)
                                </h3>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>Purpose:</strong> Import participant data
                                        (names, emails, custom fields) from your Google
                                        Sheets to personalize certificates.
                                    </li>
                                    <li>
                                        <strong>Data Accessed:</strong> Only the columns
                                        and rows you explicitly select during import.
                                    </li>
                                    <li>
                                        <strong>Data Handling:</strong> Sheet data is read
                                        once, processed entirely on your device, and never
                                        stored on MailMyCertificate servers.
                                    </li>
                                    <li>
                                        <strong>No Modifications:</strong> This application
                                        never modifies, edits, or deletes any content in
                                        your Google Sheets.
                                    </li>
                                </ul>

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

                            {/* Section 5.5 - Analytics & GTM */}
                            <Section title="5.5 Analytics & Google Tag Manager">
                                <p>
                                    MailMyCertificate uses Google Tag Manager (GTM) and
                                    Google Analytics (GA4) to track anonymous usage
                                    metrics and improve the platform.
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
                                        Anonymous visitor ID (locally generated, never linked
                                        to email or identity)
                                    </li>
                                    <li>
                                        Page path and navigation flow (no personal data)
                                    </li>
                                    <li>
                                        Feature usage (e.g., "template_uploaded",
                                        "certificate_generated") with aggregate counts only
                                    </li>
                                    <li>
                                        Browser type and device category (non-identifying)
                                    </li>
                                    <li>
                                        Error events (no PII or sensitive data included)
                                    </li>
                                </ul>

                                <p className="mt-4">
                                    Participant rosters, certificate content, email
                                    addresses, and all data accessed from Workspace APIs are
                                    processed locally in your browser and never transmitted to
                                    analytics services.
                                </p>
                            </Section>

                            {/* Section 6 */}
                            <Section title="6. Data Retention & Instant Deletion">
                                <p>
                                    Your data is handled with the highest level of
                                    transience and minimal retention.
                                </p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent text-foreground/80">
                                    <li>
                                        <strong>Certificate Generation:</strong> All PDF
                                        generation occurs exclusively in your browser.
                                    </li>
                                    <li>
                                        <strong>Participant Data:</strong> Your participant
                                        lists are never transmitted to or stored on
                                        MailMyCertificate servers.
                                    </li>
                                    <li>
                                        <strong>Session Deletion:</strong> When you close
                                        your browser tab, all temporary workflow data is
                                        automatically deleted from local browser storage.
                                    </li>
                                    <li>
                                        <strong>No Server Logs:</strong> Participant data
                                        and certificate content are not logged on
                                        MailMyCertificate infrastructure.
                                    </li>
                                    <li>
                                        <strong>Email Content:</strong> Certificate emails
                                        are sent through <em>your</em> Gmail account;
                                        MailMyCertificate retains no copy of sent emails
                                        or their recipients.
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
                                            Engineering Commitment
                                        </p>

                                        <p className="text-foreground/85 leading-relaxed text-base">
                                            MailMyCertificate was originally built to
                                            solve a real organizer workflow problem
                                            without forcing users to trust unknown servers
                                            with participant data.
                                        </p>

                                        <p className="text-foreground/85 leading-relaxed mt-4 text-base">
                                            The goal is simple:
                                            generate and send certificates with as little
                                            unnecessary data exposure as possible.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Last Updated */}
                            <div className="mt-10 text-sm text-secondary/60">
                                Last updated: January 2026
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <ProductFooter />
        </div>
    );
}
