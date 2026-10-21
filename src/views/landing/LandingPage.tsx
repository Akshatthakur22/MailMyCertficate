import Link from 'next/link';
import Image from 'next/image';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { RevealSection } from '@/components/layout/RevealSection';
import { ProductFooter } from '@/components/product/ProductFooter';
import { FloatingStarWidget } from '@/components/github/FloatingStarWidget';
import { SampleProjectLauncher } from '@/components/product/SampleProjectLauncher';
import { GITHUB_REPO_URL } from '@/config/github';
import { HOME_PAGE_FAQS } from '@/data/homeFaqs';
import { getRelatedPages } from '@/data/relatedPages';
import { ArrowRight, Github, Check, Star, Lock, FileSpreadsheet, FileText, Mail, ShieldCheck } from 'lucide-react';
import {
  CertificateFlowIllustration,
  LocalPipelineIllustration,
  OpenSourceIllustration,
  UploadStepIcon,
  DataStepIcon,
  GenerateStepIcon,
  SendStepIcon,
} from '@/components/landing/illustrations';

const WORKFLOW_BENEFITS = [
  { Icon: FileSpreadsheet, title: 'Bring your list', detail: 'Import a CSV or connect a Google Sheet.' },
  { Icon: FileText, title: 'Make a batch', detail: 'Personalize a certificate for every participant.' },
  { Icon: Mail, title: 'Send with Gmail', detail: 'Deliver each PDF to the right inbox.' },
] as const;

export default function LandingPage() {
  return (
    <div className="landing-page flex flex-col min-h-screen font-sans overflow-x-hidden">

      {/* NAV */}
      <nav className="landing-nav fixed top-0 w-full z-50" aria-label="Main navigation">
        <div className="container-width h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-landing-ink hover:opacity-70 transition-opacity">
            MailMyCertificate
          </Link>
          <div className="flex items-center gap-6 md:gap-8">
            <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-landing-secondary">
              <Link href="/about" className="hover:text-landing-ink transition-colors">About</Link>
              <Link href="/guide" className="hover:text-landing-ink transition-colors">Guide</Link>
              <Link href="/blog" className="hover:text-landing-ink transition-colors">Blog</Link>
              <Link href="/contact" className="hover:text-landing-ink transition-colors">Contact</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer"
                className="text-[13px] font-medium text-landing-secondary hover:text-landing-ink transition-colors flex items-center gap-1.5">
                <Github size={15} />
                <span className="hidden sm:inline">Star</span>
              </Link>
              <TrackToolCta href="/tool" entryPoint="navbar"
                className="landing-btn-primary text-sm font-semibold px-5 py-2 rounded-lg">
                Open Tool
              </TrackToolCta>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full">

        {/* HERO */}
        <section className="relative pt-24 pb-14 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_78%_40%,rgba(45,106,79,0.10),transparent_48%)]" aria-hidden="true" />
          <div className="container-width">
            <div className="relative grid lg:grid-cols-[1fr_0.9fr] gap-10 lg:gap-16 items-center">
              <div className="max-w-2xl">
                <RevealSection>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2D6A4F]/20 bg-white/70 px-3.5 py-2 shadow-sm">
                    <ShieldCheck size={15} className="text-[#2D6A4F]" aria-hidden="true" />
                    <span className="text-xs font-semibold text-landing-ink">
                      Free · No account · Processed in your browser
                    </span>
                  </div>
                </RevealSection>
                <RevealSection>
                  <h1 className="text-[clamp(2.55rem,5.5vw,5rem)] font-semibold leading-[1.02] tracking-tight text-landing-ink mb-5">
                    Create and send<br className="hidden sm:block" /> certificates in batches.
                  </h1>
                </RevealSection>
                <RevealSection>
                  <p className="text-lg md:text-xl text-landing-secondary leading-relaxed mb-7 max-w-xl">
                    Turn one certificate design and a participant list into personalized PDFs, then email them with Gmail. Free, open source, and no signup required.
                  </p>
                </RevealSection>
                <RevealSection>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8 text-sm text-landing-secondary" aria-label="Supported workflows">
                    <span>CSV and Google Sheets</span><span aria-hidden="true" className="text-landing-rule">•</span>
                    <span>Personalized PDFs</span><span aria-hidden="true" className="text-landing-rule">•</span>
                    <span>Gmail delivery</span>
                  </div>
                </RevealSection>
                <RevealSection className="flex flex-col sm:flex-row gap-3 mb-6">
                  <TrackToolCta href="/tool" entryPoint="hero_cta"
                    className="landing-btn-primary inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-base">
                    Create certificates free
                    <ArrowRight size={17} />
                  </TrackToolCta>
                    <SampleProjectLauncher className="landing-btn-secondary font-semibold px-7 py-3.5 rounded-lg text-base" />
                </RevealSection>
              </div>
              <RevealSection className="w-full">
                <div className="rounded-2xl border border-landing-rule bg-white/70 p-4 shadow-[0_24px_70px_-36px_rgba(26,26,26,0.3)] sm:p-6">
                  <div className="flex items-center justify-between gap-3 border-b border-landing-rule pb-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.13em] text-landing-secondary">One workflow, one place</span>
                    <span className="rounded-full bg-[#2D6A4F]/10 px-2.5 py-1 text-[11px] font-semibold text-[#2D6A4F]">Runs locally</span>
                  </div>
                  <CertificateFlowIllustration className="my-2 w-full animate-float-gentle" />
                  <div className="grid grid-cols-3 gap-2 border-t border-landing-rule pt-4 sm:gap-4">
                    {WORKFLOW_BENEFITS.map(({ Icon, title, detail }, index) => (
                      <div key={title} className="min-w-0">
                        <div className="mb-2 flex items-center gap-1.5 text-[#2D6A4F]">
                          <Icon size={15} aria-hidden="true" />
                          <span className="text-[10px] font-bold uppercase tracking-wide text-landing-secondary">0{index + 1}</span>
                        </div>
                        <p className="text-xs font-semibold text-landing-ink sm:text-sm">{title}</p>
                        <p className="mt-1 hidden text-xs leading-relaxed text-landing-secondary sm:block">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* FREE FOREVER — trust block */}
        <section className="border-t border-landing-rule py-10 md:py-12" aria-label="Free forever guarantee">
          <div className="container-width">
            <RevealSection>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16 text-center sm:text-left">
                {[
                  { Icon: Star, label: '$0', sub: 'No payment, ever' },
                  { Icon: Check, label: 'Unlimited', sub: 'No certificate cap' },
                  { Icon: Lock, label: 'No signup', sub: 'Open and start' },
                  // 3.2 — Link LICENSE directly for specificity over generic GitHub link; enables verification
                  { Icon: Github, label: 'MIT licence', sub: 'Fully open source', href: `${GITHUB_REPO_URL}/blob/main/LICENSE` },
                ].map(({ Icon, label, sub, href }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2D6A4F]/10 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-[#2D6A4F]" />
                    </div>
                    <div>
                      {href ? (
                        <Link href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                          <p className="text-base font-semibold text-landing-ink leading-none mb-0.5">{label}</p>
                          <p className="text-xs text-landing-secondary">{sub}</p>
                        </Link>
                      ) : (
                        <>
                          <p className="text-base font-semibold text-landing-ink leading-none mb-0.5">{label}</p>
                          <p className="text-xs text-landing-secondary">{sub}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* USE CASES */}
        <section className="landing-section-alt py-16 md:py-20 border-t border-landing-rule">
          <div className="container-width max-w-6xl">
            <RevealSection className="text-center mb-12">
              <span className="landing-label mb-4 block">Made for event organizers</span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-landing-ink max-w-2xl mx-auto">
                Spend less time on certificates after the event.
              </h2>
            </RevealSection>
            <RevealSection>
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  { title: 'Hackathons', detail: 'Prepare participant and finalist certificates from your event roster.' },
                  { title: 'Workshops', detail: 'Personalize completion certificates for attendees in one batch.' },
                  { title: 'Webinars and training', detail: 'Match each certificate to a participant and email address.' },
                ].map((item) => (
                  <div key={item.title} className="landing-annotation-card p-6">
                    <Check size={18} className="mb-4 text-[#2D6A4F]" aria-hidden="true" />
                    <h3 className="mb-2 text-lg font-semibold text-landing-ink">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-landing-secondary">{item.detail}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* STORY */}
        <section className="py-24 md:py-32 border-t border-landing-rule">
          <div className="container-width max-w-6xl">
            <RevealSection className="mb-16 md:mb-20">
              <span className="landing-label">The Story</span>
            </RevealSection>
            <RevealSection>
              <blockquote className="text-[clamp(1.7rem,3.5vw,2.9rem)] font-semibold leading-[1.2] text-landing-ink mb-12 max-w-4xl">
                {'\u201C'}We have 300 certificates left to send and it{'\u2019'}s already{' '}
                <span className="font-serif italic font-normal text-landing-secondary">midnight on Sunday.{'\u201D'}</span>
              </blockquote>
            </RevealSection>
            <div className="grid md:grid-cols-[1fr_0.85fr] gap-12 md:gap-20 items-start">
              <RevealSection>
                <p className="text-xl text-landing-secondary leading-relaxed mb-6">
                  You organized the event. You made it great. And now you&apos;re spending your entire
                  Sunday manually editing certificates in Canva, exporting them one by one, attaching
                  them to emails, and praying you didn&apos;t mix up two names.
                </p>
                <p className="text-xl text-landing-secondary leading-relaxed mb-6">It shouldn&apos;t be this hard.</p>
                <p className="text-lg text-landing-secondary/80 leading-relaxed">
                  MailMyCertificate was built by Akshat Thakur after doing exactly this —
                  then deciding no one should ever have to again. It&apos;s free. It&apos;s open source.
                  Certificate generation runs in your browser; Google Sheets import and Gmail delivery use the backend.
                </p>
              </RevealSection>
              <RevealSection>
                <div className="landing-annotation-card">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-landing-secondary mb-5">Real scenario</p>
                  <div className="space-y-4 mb-6">
                    {[
                      { label: 'Edit names in Canva', time: '~2 hrs' },
                      { label: 'Export PDFs one by one', time: '~45 min' },
                      { label: 'Rename every file', time: '~20 min' },
                      { label: 'Attach & send emails', time: '~1 hr' },
                    ].map(({ label, time }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-landing-secondary">{label}</span>
                        <span className="font-semibold text-landing-ink tabular-nums">{time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-landing-rule pt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-landing-ink">Total lost</span>
                    <span className="text-xl font-bold text-[#C0392B]">4+ hours</span>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* WORKFLOW (keeping existing) */}
        <section className="py-24 md:py-32 border-t border-landing-rule">
          <div className="container-width max-w-6xl">
            <RevealSection className="max-w-xl mb-20">
              <span className="landing-label mb-4 block">How It Works</span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-landing-ink">
                Four steps from roster to ready-to-send certificates.
              </h2>
            </RevealSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
              {[
                { Icon: UploadStepIcon, step: '01', title: 'Upload template', desc: 'Any PNG or JPG certificate design works as your base. Drag it in.', offset: '' },
                { Icon: DataStepIcon, step: '02', title: 'Import participants', desc: 'Paste a Google Sheets URL or upload a CSV. Headers auto-detected.', offset: 'lg:mt-10' },
                { Icon: GenerateStepIcon, step: '03', title: 'Generate PDFs', desc: 'Place name fields on the canvas. One click creates every certificate.', offset: 'lg:mt-20' },
                // 3.4 — Step 04 (Gmail) is highest-anxiety step: add explicit reassurance about OAuth scope + revocation
                { Icon: SendStepIcon, step: '04', title: 'Send via Gmail', desc: 'Connect your own Gmail account and send all at once. Your credentials, your control.', offset: 'lg:mt-10', anxiety: true },
              ].map(({ Icon, step, title, desc, offset, anxiety }) => (
                <RevealSection key={step} className={offset}>
                  <div className="group">
                    <div className="mb-5 w-14 h-14 transition-transform duration-500 group-hover:-translate-y-1.5">
                      <Icon className="w-full h-full" />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-landing-secondary mb-2">Step {step}</p>
                    <h3 className="text-lg font-semibold text-landing-ink mb-3">{title}</h3>
                    <p className="text-sm text-landing-secondary leading-relaxed">{desc}</p>
                    {/* 3.4 — Anxiety-step specific reassurance: defuses OAuth concern before it happens */}
                    {anxiety && (
                      <p className="text-xs text-landing-secondary/70 mt-3">
                        Send-only access · Revoke anytime in your Google Account
                      </p>
                    )}
                  </div>
                </RevealSection>
              ))}
            </div>
            <RevealSection className="mt-12 text-center">
              <TrackToolCta href="/tool" entryPoint="workflow_cta"
                className="landing-btn-primary inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-base">
                Try It Now — It&apos;s Free
                <ArrowRight size={17} />
              </TrackToolCta>
            </RevealSection>
          </div>
        </section>

        {/* PRIVACY */}
        <section className="py-24 md:py-32 border-t border-landing-rule">
          <div className="container-width max-w-6xl">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">
              <div>
                <RevealSection>
                  <span className="landing-label mb-4 block">Privacy</span>
                  <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-landing-ink mb-8">
                    Your participant list<br />
                    <span className="font-serif italic font-normal text-landing-secondary">is processed in your browser.</span>
                  </h2>
                </RevealSection>
                <RevealSection>
                  <p className="text-lg text-landing-secondary leading-relaxed mb-8">
                    PDF generation and field placement happen in your browser using a Web Worker.
                    Public Google Sheets data is fetched through our backend. If you choose email
                    delivery, recipient details and PDF attachments pass through our backend to Gmail.
                  </p>
                </RevealSection>
                <RevealSection>
                  <div className="space-y-4 mb-8">
                    {[
                      'PDF engine runs locally via Web Worker',
                      'Participant data stored in IndexedDB (your device)',
                      'PDF generation runs locally; Sheets import and Gmail delivery contact their services',
                      'Gmail send uses your own OAuth account',
                    ].map((text) => (
                      <div key={text} className="flex items-start gap-3 text-sm">
                        <Check size={16} className="mt-0.5 text-[#2D6A4F] shrink-0" />
                        <span className="text-landing-secondary">{text}</span>
                      </div>
                    ))}
                  </div>
                </RevealSection>
                <RevealSection>
                  <div className="landing-annotation-card inline-block">
                    <p className="text-xs text-landing-secondary mb-1">Certificate and participant processing</p>
                    <p className="text-lg font-bold text-[#2D6A4F]">In your browser</p>
                  </div>
                </RevealSection>
                {/* 3.5 — Convert claim into self-verifiable challenge: highest-leverage trust move for privacy-first tool */}
                <RevealSection className="mt-8">
                  <p className="text-sm text-landing-secondary/80 leading-relaxed">
                    <strong>Verify it yourself:</strong> Open DevTools (F12 → Network tab), generate a certificate, and watch nothing leave your device. Or{' '}
                    <Link href={`${GITHUB_REPO_URL}/blob/main/src/core/engine/pdfRenderer.ts`} target="_blank" rel="noopener noreferrer"
                      className="text-landing-ink font-medium hover:underline">
                      see the exact function in code →
                    </Link>
                  </p>
                </RevealSection>
              </div>
              <RevealSection className="hidden lg:block">
                <LocalPipelineIllustration className="w-full" />
              </RevealSection>
            </div>
          </div>
        </section>

        {/* OPEN SOURCE */}
        <section className="landing-section-alt py-24 md:py-32 border-t border-landing-rule">
          <div className="container-width max-w-6xl">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
              <RevealSection className="hidden lg:block">
                <OpenSourceIllustration className="w-full max-w-sm mx-auto" />
              </RevealSection>
              <div>
                <RevealSection>
                  <span className="landing-label mb-4 block">Open Source</span>
                  <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-landing-ink mb-8">
                    Built in public.<br />
                    <span className="font-serif italic font-normal text-landing-secondary">Trusted by design.</span>
                  </h2>
                </RevealSection>
                <RevealSection>
                  {/* 3.6 — Honest reframing: avoid false community social proof; emphasize openness + forkability instead */}
                  <p className="text-lg text-landing-secondary leading-relaxed mb-10">
                    Every line of code is on GitHub. One developer built this, but it's open for anyone to fork, 
                    audit, modify, and contribute to. This isn't a black box — it's a tool you can own, customize, 
                    and deploy yourself.
                  </p>
                </RevealSection>
                <RevealSection className="flex flex-wrap gap-3">
                  <Link href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer"
                    className="landing-btn-primary inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg text-sm">
                    <Github size={16} />
                    View Source Code
                  </Link>
                  <Link href={`${GITHUB_REPO_URL}/fork`} target="_blank" rel="noopener noreferrer"
                    className="landing-btn-secondary inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg text-sm">
                    Fork & Deploy
                  </Link>
                </RevealSection>
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDER */}
        <section className="py-24 md:py-32 border-t border-landing-rule">
          <div className="container-width max-w-4xl">
            <RevealSection>
              <span className="landing-label mb-4 block">Built By</span>
            </RevealSection>
            <RevealSection>
              <div className="landing-annotation-card p-8 md:p-12">
                <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                  <Image src="/developer-photo.png" alt="Akshat Thakur" width={72} height={72}
                    className="aspect-square rounded-full object-cover object-[center_30%] ring-2 ring-landing-rule" />
                  <div>
                    <h3 className="text-xl font-semibold text-landing-ink mb-1">Akshat Thakur</h3>
                    <p className="text-sm text-landing-secondary font-medium mb-4">Software Developer</p>
                    <div className="flex gap-3 mb-3">
                      <Link href="https://akshatt.in" target="_blank" rel="noopener noreferrer"
                        className="text-sm text-landing-secondary hover:text-landing-ink transition-colors">Portfolio →</Link>
                      <Link href="https://github.com/akshatthakur22" target="_blank" rel="noopener noreferrer"
                        className="text-sm text-landing-secondary hover:text-landing-ink transition-colors">GitHub →</Link>
                      <Link href="https://linkedin.com/in/akshatthakur22" target="_blank" rel="noopener noreferrer"
                        className="text-sm text-landing-secondary hover:text-landing-ink transition-colors">LinkedIn →</Link>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-landing-secondary leading-relaxed mb-6">
                  I built this because I was the organizer spending weekends on certificate work.
                  After doing it manually for one too many hackathons, I automated it for myself —
                  then rebuilt it properly so every community organizer could use it without paying,
                  without signing up, and without handing over their participants&apos; data.
                </p>
                <p className="text-base text-landing-secondary/80 leading-relaxed italic">
                  If it saves you even one Sunday, it was worth building.
                </p>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* FAQ — compact accordion */}
        <section className="landing-section-alt py-16 md:py-20 border-t border-landing-rule" aria-labelledby="home-faq-heading">
          <div className="container-width max-w-4xl">
            <RevealSection className="mb-8">
              <span className="landing-label mb-3 block text-xs">Questions</span>
              <h2 id="home-faq-heading" className="text-2xl md:text-3xl font-semibold leading-tight text-landing-ink">
                Frequently asked
              </h2>
            </RevealSection>
            <RevealSection>
              <dl className="space-y-2">
                {HOME_PAGE_FAQS.slice(0, 5).map((faq) => (
                  // 4 — Micro-interactions: smooth transitions + visual feedback on hover/open
                  <details key={faq.question} className="group rounded-lg border border-landing-rule/50 bg-white/40 transition-all duration-300 hover:border-landing-rule hover:shadow-sm hover:bg-white/60">
                    <summary className="cursor-pointer px-4 py-3 font-medium text-landing-ink text-sm md:text-base flex items-center justify-between">
                      {faq.question}
                      <span className="transition-transform duration-300 group-open:rotate-180 text-landing-secondary shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </span>
                    </summary>
                    {/* 4 — Smooth max-height transition on open/close */}
                    <div className="max-h-0 group-open:max-h-96 overflow-hidden transition-all duration-300 ease-in-out">
                      <div className="px-4 py-3 border-t border-landing-rule/30 bg-white/20 text-sm text-landing-secondary leading-relaxed" data-speakable>
                        {faq.answer}
                      </div>
                    </div>
                  </details>
                ))}
              </dl>
              <p className="mt-6 text-sm text-landing-secondary/70">
                See all FAQs on the{' '}
                <Link href="/guide" className="text-landing-ink font-medium hover:underline">
                  complete guide →
                </Link>
              </p>
            </RevealSection>
          </div>
        </section>

        {/* EXPLORE */}
        <section className="py-24 md:py-32 border-t border-landing-rule" aria-labelledby="home-explore-heading">
          <div className="container-width max-w-5xl">
            <RevealSection>
              <span className="landing-label mb-4 block">Where To Next</span>
              <h2 id="home-explore-heading" className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-landing-ink mb-12">
                Find the workflow that matches yours.
              </h2>
            </RevealSection>
            <RevealSection>
              <ul className="grid gap-5 sm:grid-cols-2 list-none pl-0">
                {getRelatedPages('home').map((link) => (
                  // 4 — Card hover: subtle scale + shadow lift for feedback
                  <li key={link.href}>
                    <Link href={link.href}
                      className="landing-annotation-card group flex h-full flex-col p-6 transition-all duration-300 hover:border-[#2D6A4F]/40 hover:shadow-md hover:scale-[1.01] hover:bg-white/60">
                      <span className="mb-2 inline-flex items-center gap-2 text-lg font-semibold text-landing-ink">
                        {link.label}
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                      <span className="text-base leading-relaxed text-landing-secondary">{link.blurb}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </RevealSection>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="landing-section-alt py-28 md:py-40 border-t border-landing-rule">
          <div className="container-width max-w-3xl text-center">
            <RevealSection>
              <h2 className="text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[1.08] text-landing-ink mb-6">
                Stop losing weekends<br />to certificate work.
              </h2>
              <p className="text-xl text-landing-secondary mb-12 max-w-xl mx-auto leading-relaxed">
                No signup or payment. Prepare your certificate batch in your browser, then choose whether to download it or send it with Gmail.
              </p>
            </RevealSection>
            <RevealSection className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <TrackToolCta href="/tool" entryPoint="footer_cta"
                className="landing-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-9 py-4 rounded-lg text-base">
                Generate Your First Batch
                <ArrowRight size={18} />
              </TrackToolCta>
              <Link href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer"
                className="landing-btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-7 py-4 rounded-lg text-base">
                <Github size={17} />
                Star on GitHub
              </Link>
            </RevealSection>
            <RevealSection>
              <p className="text-sm text-landing-secondary/60 italic">Free forever · Open source · Built with care</p>
            </RevealSection>
          </div>
        </section>

        <FloatingStarWidget />
      </main>

      <ProductFooter />
    </div>
  );
}
