import Link from 'next/link';
import { LastUpdated } from '@/components/seo/LastUpdated';
import { RelatedPages } from '@/components/seo/RelatedPages';
import { buttonVariants } from '@/components/ui/Button';
import { RevealSection } from '@/components/layout/RevealSection';
import { ProductFooter } from '@/components/product/ProductFooter';
import { GuideStructuredData } from '@/components/guide/GuideStructuredData';
import { 
    Upload,
    Mail,
    Monitor,
    Github,
    Layers,
    Database,
} from 'lucide-react';

// Import refined components
import { WorkflowSeparator } from '@/components/guide/WorkflowSeparator';
import { HelpAnswersSection } from '@/components/guide/HelpAnswersSection';
import { Hero } from '@/components/guide/Hero';
import { BeforeYouStart } from '@/components/guide/BeforeYouStart';
import { WorkflowOverview } from '@/components/guide/WorkflowOverview';
import { Step1PrepareTemplate } from '@/components/guide/Step1PrepareTemplate';
import { Step2OrganizeParticipants } from '@/components/guide/Step2OrganizeParticipants';
import { Step3CustomizeFields } from '@/components/guide/Step3CustomizeFields';
import { Step4GenerateCertificates } from '@/components/guide/Step4GenerateCertificates';
import { Step5DownloadOrSend } from '@/components/guide/Step5DownloadOrSend';
import { Step6SendEmails } from '@/components/guide/Step6SendEmails';
import { OAuthFlow } from '@/components/guide/OAuthFlow';
import { CTASection } from '@/components/guide/CTASection';
import { LocalDataManagementSection } from '@/components/guide/LocalDataManagementSection';

export default function Guide() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            <GuideStructuredData />
            {/* ======================================
                NAVIGATION
               ====================================== */}
            <nav className="fixed top-0 w-full z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
                <div className="container-width flex flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
                    <Link
                        href="/"
                        className="brand-text hover:opacity-80 transition-opacity"
                    >
                        <span>Mail</span><span>My</span><span>Certificate</span>
                    </Link>

                    <div className="flex items-center justify-between gap-3 flex-wrap sm:justify-end">
                        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-secondary">
                            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
                            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
                            <Link href="/guide" className="hover:text-accent transition-colors">Guide</Link>
                            <Link href="/settings" className="hover:text-accent transition-colors">Settings</Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="https://github.com/akshatthakur22/MailMyCertficate"
                                target="_blank"
                                className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/20"
                            >
                                <Github size={16} />
                                <span className="hidden sm:inline">GitHub</span>
                            </Link>
                            <Link
                                href="/tool"
                                className={buttonVariants({ variant: 'primary', size: 'sm', className: 'shadow-sm' })}
                            >
                                Open Tool
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 w-full pt-16">
            {/* ======================================
                HERO SECTION
               ====================================== */}
            <RevealSection>
                <Hero />
            </RevealSection>

            {/* Visible content freshness signal, sourced from the same
                PAGE_DATES map that feeds this route's metadata. */}
            <div className="container-width pb-4">
                <LastUpdated path="/guide" />
            </div>

            {/* ======================================
                BEFORE YOU START
               ====================================== */}
            <RevealSection>
                <BeforeYouStart />
            </RevealSection>

            <WorkflowSeparator />

            {/* ======================================
                COMPLETE WORKFLOW OVERVIEW
               ====================================== */}
            <RevealSection>
                <WorkflowOverview />
            </RevealSection>

            <WorkflowSeparator />

            {/* ======================================
                STEP 1 — PREPARE YOUR TEMPLATE
               ====================================== */}
            <RevealSection>
                <Step1PrepareTemplate />
            </RevealSection>

            <WorkflowSeparator />

            {/* ======================================
                STEP 2 — ORGANIZE YOUR PARTICIPANTS
               ====================================== */}
            <RevealSection>
                <Step2OrganizeParticipants />
            </RevealSection>

            <WorkflowSeparator />

            {/* ======================================
                STEP 3 — CUSTOMIZE FIELD PLACEMENT
               ====================================== */}
            <RevealSection>
                <Step3CustomizeFields />
            </RevealSection>

            <WorkflowSeparator />

            {/* ======================================
                STEP 4 — GENERATE CERTIFICATES
               ====================================== */}
            <RevealSection>
                <Step4GenerateCertificates />
            </RevealSection>

            <WorkflowSeparator />

            {/* ======================================
                STEP 5 — DOWNLOAD OR SEND
               ====================================== */}
            <RevealSection>
                <Step5DownloadOrSend />
            </RevealSection>

            <WorkflowSeparator />

            {/* ======================================
                GOOGLE OAUTH FLOW
               ====================================== */}
            <RevealSection>
                <OAuthFlow />
            </RevealSection>

            <WorkflowSeparator />

            {/* ======================================
                STEP 6 — SEND EMAILS
               ====================================== */}
            <RevealSection>
                <Step6SendEmails />
            </RevealSection>

            <WorkflowSeparator />

            {/* ======================================
                LOCAL DATA MANAGEMENT
               ====================================== */}
            <RevealSection>
                <LocalDataManagementSection />
            </RevealSection>

            {/* ======================================
                HELP & ANSWERS (Troubleshooting + FAQ combined)
               ====================================== */}
            <RevealSection>
                <HelpAnswersSection
                    items={[
                        {
                            type: 'troubleshooting',
                            icon: <Database size={18} className="text-accent" />,
                            question: "Previous session stuck or confusing?",
                            answer: "Open Your local data in the tool header → Continue this batch, or Delete data & start fresh. See the Managing local data section above."
                        },
                        {
                            type: 'troubleshooting',
                            icon: <Layers size={18} className="text-accent" />,
                            question: "Google Sheet not importing?",
                            answer: "Make sheet public, check URL, and ensure required columns (name, email) exist in your spreadsheet."
                        },
                        {
                            type: 'troubleshooting',
                            icon: <Upload size={18} className="text-accent" />,
                            question: "Template too large?",
                            answer: "Compress images, reduce dimensions, or use a smaller file. Maximum template size is 5MB."
                        },
                        {
                            type: 'troubleshooting',
                            icon: <Mail size={18} className="text-accent" />,
                            question: "Email sending interrupted?",
                            answer: "Check your internet connection, avoid refreshing during send, and wait for Gmail API limits to reset (usually 1-2 hours)."
                        },
                        {
                            type: 'troubleshooting',
                            icon: <Monitor size={18} className="text-accent" />,
                            question: "Mobile limitations?",
                            answer: "Use desktop for editing and field placement. Mobile works fine for downloading certificates after setup."
                        },
                        {
                            type: 'faq',
                            question: 'Is my data uploaded to your servers?',
                            answer: 'No. Certificate generation happens locally in your browser. Participant lists and PDFs stay on your device unless you choose to send email through Gmail.'
                        },
                        {
                            type: 'faq',
                            question: 'Can I use Google Sheets instead of CSV?',
                            answer: 'Yes. Provide a public Google Sheets URL — ideal for Google Forms → Sheets → certificate workflows.'
                        },
                        {
                            type: 'faq',
                            question: 'Does this work on mobile devices?',
                            answer: 'The visual field editor works best on desktop. You can generate and download certificates on mobile after setup.'
                        },
                        {
                            type: 'faq',
                            question: 'Why does Google ask for permissions?',
                            answer: 'MailMyCertificate uses official Google OAuth to send mail from your Gmail account. We never handle your Google password.'
                        },
                        {
                            type: 'faq',
                            question: 'Can I only download certificates without email?',
                            answer: 'Yes. Download all certificates as a ZIP and distribute them manually if you prefer.'
                        },
                        {
                            type: 'faq',
                            question: 'How many emails can I send at once?',
                            answer: 'We recommend about 400 emails per batch for reliability, subject to Gmail API limits and browser performance.'
                        },
                        {
                            type: 'faq',
                            question: 'Are PDF templates supported?',
                            answer: 'Use PNG or JPG templates today. Convert PDF designs to images with any standard export tool.'
                        },
                        {
                            type: 'faq',
                            question: 'Why should I avoid refreshing during email sending?',
                            answer: 'Refreshing mid-send can interrupt delivery. Keep the tab open until sending completes.'
                        },
                        {
                            type: 'faq',
                            question: 'How do I delete my certificate data from this browser?',
                            answer: 'Use Your local data in the tool or email header, or open Session settings to clear a batch or all local data.'
                        },
                        {
                            type: 'faq',
                            question: 'What happens when I return to the site later?',
                            answer: 'You may see a Previous session found prompt. Continue to resume or start a new batch. Sessions older than 7 days expire automatically.'
                        },
                        {
                            type: 'faq',
                            question: 'Does downloading the ZIP delete my certificates?',
                            answer: 'No. Files remain in your browser so you can re-download, verify, or regenerate before starting a new batch.'
                        }
                    ]}
                />
            </RevealSection>

            {/* ======================================
                READY TO START CTA
               ====================================== */}
            <RevealSection>
                <CTASection />
            </RevealSection>

            {/* Author byline */}
            <div className="container-width py-8 border-t border-border/40">
                <p className="text-sm text-secondary text-center">
                    Written by Akshat Thakur — developer of MailMyCertificate and organizer of too many hackathons.
                </p>
            </div>
        <RelatedPages pageKey="guide" />

        </main>

        <ProductFooter />
    </div>
);
}
