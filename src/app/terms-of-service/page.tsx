import { Metadata } from 'next';
import Link from 'next/link';
import {
    Scale,
    Shield,
    Github,
    AlertTriangle,
    Mail,
    Cpu,
    ArrowRight,
    FileText,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description:
        'Terms and conditions for using MailMyCertificate and its certificate generation workflows.',
};

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="py-12 border-t border-border/40 first:border-t-0 first:pt-0">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                {title}
            </h2>

            <div className="space-y-5 text-secondary leading-relaxed text-[15px] md:text-base">
                {children}
            </div>
        </section>
    );
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* ======================================
                NAVBAR
               ====================================== */}
            <nav className="fixed top-0 w-full z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
                <div className="container-width flex justify-between items-center h-16">
                    <Link
                        href="/"
                        className="brand-text hover:opacity-80 transition-opacity"
                    >
                        <span>Mail</span>
                        <span>My</span>
                        <span>Certificate</span>
                    </Link>

                    <div className="flex items-center gap-6 text-sm font-medium text-secondary">
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
                                    Terms of Service
                                </span>
                            </nav>

                            {/* Label */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/20 text-sm text-secondary mb-6">
                                <Scale size={14} className="text-accent" />
                                Usage Guidelines & Responsibilities
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 max-w-4xl">
                                Terms for using MailMyCertificate responsibly.
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-secondary leading-relaxed max-w-3xl">
                                These Terms explain the rules, limitations, and
                                responsibilities associated with using
                                MailMyCertificate and its certificate automation
                                workflows.
                            </p>

                            {/* Human Line */}
                            <div className="mt-8 inline-flex items-center gap-2 text-sm text-secondary/70 italic">
                                <FileText
                                    size={14}
                                    className="text-accent"
                                />
                                Built for real organizers — not mass spam or
                                abuse.
                            </div>
                        </div>
                    </div>
                </section>

                {/* ======================================
                    QUICK HIGHLIGHTS
                   ====================================== */}
                <section className="py-12 md:py-16 border-y border-border/40 bg-muted/20">
                    <div className="container-width">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl bg-background border border-border/50">
                                <Shield
                                    size={22}
                                    className="text-accent mb-4"
                                />

                                <h3 className="font-semibold text-lg mb-2">
                                    Responsible Usage
                                </h3>

                                <p className="text-sm text-secondary leading-relaxed">
                                    The tool must not be used for fraudulent
                                    certificates, spam, or deceptive activity.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-background border border-border/50">
                                <Cpu
                                    size={22}
                                    className="text-accent mb-4"
                                />

                                <h3 className="font-semibold text-lg mb-2">
                                    Browser-Based Processing
                                </h3>

                                <p className="text-sm text-secondary leading-relaxed">
                                    Large workflows depend on your own device
                                    performance, browser limits, and available
                                    memory.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-background border border-border/50">
                                <Github
                                    size={22}
                                    className="text-accent mb-4"
                                />

                                <h3 className="font-semibold text-lg mb-2">
                                    Open Source Project
                                </h3>

                                <p className="text-sm text-secondary leading-relaxed">
                                    MailMyCertificate is openly inspectable and
                                    distributed under an open-source license.
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
                            {/* Intro Box */}
                            <div className="mb-16 p-6 rounded-2xl bg-accent/5 border border-accent/10">
                                <p className="text-sm leading-relaxed text-secondary">
                                    By accessing or using
                                    MailMyCertificate, you agree to these Terms
                                    of Service. If you do not agree with these
                                    terms, please do not use the application.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <Section title="1. Permitted Use">
                                <p>
                                    MailMyCertificate is intended for lawful
                                    certificate generation, participant
                                    management, and communication workflows.
                                </p>

                                <p>
                                    You may use the platform for educational
                                    events, workshops, hackathons, communities,
                                    organizations, conferences, or similar
                                    legitimate use cases.
                                </p>

                                <p>
                                    You agree not to use the platform for:
                                </p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent">
                                    <li>
                                        Fraudulent or misleading certificates
                                    </li>

                                    <li>
                                        Spam campaigns or unsolicited mass email
                                    </li>

                                    <li>
                                        Illegal, deceptive, or abusive activity
                                    </li>

                                    <li>
                                        Violations of intellectual property
                                        rights
                                    </li>

                                    <li>
                                        Harmful automation or malicious behavior
                                    </li>
                                </ul>
                            </Section>

                            {/* Section 2 */}
                            <Section title="2. Open Source Licensing">
                                <p>
                                    MailMyCertificate is an open-source project.
                                </p>

                                <p>
                                    Unless otherwise stated, source code is made
                                    available under the MIT License or other
                                    applicable open-source licensing terms.
                                </p>

                                <p>
                                    You may inspect, modify, fork, or contribute
                                    to the project in accordance with the
                                    repository license terms.
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

                            {/* Section 3 */}
                            <Section title="3. User Responsibility">
                                <p>
                                    You are solely responsible for:
                                </p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent">
                                    <li>
                                        The certificates you generate
                                    </li>

                                    <li>
                                        The participant information you process
                                    </li>

                                    <li>
                                        The email communications you send
                                    </li>

                                    <li>
                                        Compliance with applicable laws,
                                        institutional policies, or organizational
                                        guidelines
                                    </li>
                                </ul>

                                <p>
                                    MailMyCertificate does not verify the
                                    authenticity, legality, or accuracy of
                                    generated content.
                                </p>
                            </Section>

                            {/* Section 4 */}
                            <Section title="4. Performance & Browser Limitations">
                                <p>
                                    MailMyCertificate performs many operations
                                    locally inside the browser, including
                                    certificate rendering and workflow
                                    processing.
                                </p>

                                <p>
                                    Performance may vary depending on:
                                </p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent">
                                    <li>Device hardware capabilities</li>

                                    <li>Available browser memory</li>

                                    <li>File sizes and participant count</li>

                                    <li>Browser extensions or restrictions</li>
                                </ul>

                                <div className="mt-6 p-5 rounded-xl bg-muted/30 border border-border/50">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle
                                            size={18}
                                            className="text-accent mt-0.5"
                                        />

                                        <p className="text-sm text-secondary leading-relaxed">
                                            Extremely large workflows may cause
                                            browser slowdowns, crashes, or
                                            interrupted processing depending on
                                            system limitations.
                                        </p>
                                    </div>
                                </div>
                            </Section>

                            {/* Section 5 */}
                            <Section title="5. Availability & Service Changes">
                                <p>
                                    MailMyCertificate may evolve over time
                                    through updates, feature changes,
                                    improvements, redesigns, or infrastructure
                                    modifications.
                                </p>

                                <p>
                                    Features may be added, modified, limited, or
                                    removed without prior notice.
                                </p>

                                <p>
                                    We do not guarantee uninterrupted
                                    availability of hosted services, APIs, or
                                    integrations.
                                </p>
                            </Section>

                            {/* Section 6 */}
                            <Section title="6. Limitation of Liability">
                                <p>
                                    MailMyCertificate is provided on an “AS IS”
                                    and “AS AVAILABLE” basis without warranties
                                    of any kind, whether express or implied.
                                </p>

                                <p>
                                    To the maximum extent permitted by law, the
                                    creators, contributors, maintainers, or
                                    licensors shall not be liable for:
                                </p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent">
                                    <li>Data loss</li>

                                    <li>Workflow interruptions</li>

                                    <li>Email delivery failures</li>

                                    <li>Certificate generation errors</li>

                                    <li>Indirect or consequential damages</li>
                                </ul>

                                <p>
                                    Use of the software is at your own
                                    discretion and risk.
                                </p>
                            </Section>

                            {/* Section 7 */}
                            <Section title="7. Termination & Abuse Prevention">
                                <p>
                                    We reserve the right to restrict or block
                                    access to hosted versions of the platform if
                                    users are found engaging in:
                                </p>

                                <ul className="space-y-3 pl-5 list-disc marker:text-accent">
                                    <li>Spam or abusive automation</li>

                                    <li>Malicious usage patterns</li>

                                    <li>Platform exploitation attempts</li>

                                    <li>Violations of these Terms</li>
                                </ul>

                                <p>
                                    This does not limit your rights under
                                    applicable open-source licenses for
                                    self-hosted versions of the project.
                                </p>
                            </Section>

                            {/* Section 8 */}
                            <Section title="8. Updates to These Terms">
                                <p>
                                    These Terms may be updated periodically to
                                    reflect technical, legal, or operational
                                    changes.
                                </p>

                                <p>
                                    Continued use of the platform after updates
                                    constitutes acceptance of the revised Terms.
                                </p>
                            </Section>

                            {/* Final Commitment */}
                            <div className="mt-16 p-8 rounded-3xl bg-accent-light/20 border border-accent/10">
                                <div className="flex items-start gap-4">
                                    <Scale
                                        size={24}
                                        className="text-accent mt-1"
                                    />

                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent mb-3">
                                            Practical Philosophy
                                        </p>

                                        <p className="text-secondary leading-relaxed">
                                            MailMyCertificate was built to solve
                                            real certificate workflow problems —
                                            not to create unnecessary complexity.
                                        </p>

                                        <p className="text-secondary leading-relaxed mt-4">
                                            These Terms exist to protect the
                                            platform, its contributors, and the
                                            organizers using it responsibly.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Note */}
                            <div className="mt-10 flex items-center gap-2 text-sm text-secondary/60 italic">
                                <Mail size={14} />
                                Questions about these Terms? Reach out anytime.
                            </div>

                            {/* Last Updated */}
                            <div className="mt-4 text-sm text-secondary/60">
                                Last updated: January 2026
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
