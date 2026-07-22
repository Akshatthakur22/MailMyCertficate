import Link from 'next/link';
import Image from 'next/image';
import { TrackToolCta } from '@/components/analytics/TrackToolCta';
import { RevealSection } from '@/components/layout/RevealSection';
import { ProductFooter } from '@/components/product/ProductFooter';
import { GITHUB_REPO_URL } from '@/config/github';
import { ArrowRight, Github, Check } from 'lucide-react';
import {
  CertificateFlowIllustration,
  LocalPipelineIllustration,
  OpenSourceIllustration,
  UploadStepIcon,
  DataStepIcon,
  GenerateStepIcon,
  SendStepIcon,
} from '@/components/landing/illustrations';

export default function LandingPage() {
  return (
    <div className="landing-page flex flex-col min-h-screen font-sans overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          NAVIGATION — Warm, minimal, editorial
         ═══════════════════════════════════════════════════════ */}
      <nav className="landing-nav fixed top-0 w-full z-50" aria-label="Main navigation">
        <div className="container-width h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-landing-ink hover:opacity-70 transition-opacity">
            MailMyCertificate
          </Link>

          <div className="flex items-center gap-6 md:gap-8">
            <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-landing-secondary">
              <Link href="/about" className="hover:text-landing-ink transition-colors">About</Link>
              <Link href="/guide" className="hover:text-landing-ink transition-colors">Guide</Link>
              <Link href="/contact" className="hover:text-landing-ink transition-colors">Contact</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={GITHUB_REPO_URL}
                target="_blank"
                className="text-[13px] font-medium text-landing-secondary hover:text-landing-ink transition-colors flex items-center gap-1.5"
              >
                <Github size={15} />
                <span className="hidden sm:inline">Star</span>
              </Link>
              <TrackToolCta
                href="/tool"
                entryPoint="navbar"
                className="landing-btn-primary text-sm font-semibold px-5 py-2 rounded-lg"
              >
                Open Tool
              </TrackToolCta>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full">

        {/* ═══════════════════════════════════════════════════════
            HERO — Iconic, editorial typography, warm illustration
           ═══════════════════════════════════════════════════════ */}
        <section className="pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24">
          <div className="container-width">
            <div className="grid lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-16 items-center">
              {/* Left: Typography */}
              <div className="max-w-xl">
                <RevealSection>
                  <div className="mb-6 flex items-center gap-2.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#2D6A4F]" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-landing-secondary">
                      Open Source · Privacy First · Free Forever
                    </span>
                  </div>
                </RevealSection>

                <RevealSection>
                  <h1 className="text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-landing-ink mb-6">
                    Certificates for
                    <br />
                    hundreds, in
                    <br />
                    <span className="font-serif italic font-normal text-landing-secondary">minutes.</span>
                  </h1>
                </RevealSection>

                <RevealSection>
                  <p className="text-lg md:text-xl text-landing-secondary leading-relaxed mb-10 max-w-md">
                    Upload a template. Import your participants. Generate personalized PDFs
                    — entirely in your browser. No signup. No cloud uploads. No subscription.
                  </p>
                </RevealSection>

                <RevealSection className="flex flex-col sm:flex-row gap-3 mb-8">
                  <TrackToolCta
                    href="/tool"
                    entryPoint="hero_cta"
                    className="landing-btn-primary inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-base"
                  >
                    Start Generating
                    <ArrowRight size={17} />
                  </TrackToolCta>
                  <Link
                    href="/guide"
                    className="landing-btn-secondary inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-base"
                  >
                    How It Works
                  </Link>
                </RevealSection>

                <RevealSection>
                  <p className="text-xs text-landing-secondary/70 italic">
                    Trusted by hackathon organizers, universities, and communities.
                  </p>
                </RevealSection>
              </div>

              {/* Right: Certificate Flow Illustration */}
              <RevealSection className="hidden lg:block">
                <CertificateFlowIllustration className="w-full max-w-lg mx-auto animate-float-gentle" />
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            STORY — The problem, told honestly
           ═══════════════════════════════════════════════════════ */}
        <section className="landing-section-alt py-24 md:py-32 border-t border-landing-rule">
          <div className="container-width max-w-6xl">

            {/* Label */}
            <RevealSection className="mb-16 md:mb-20">
              <span className="landing-label">The Story</span>
            </RevealSection>

            {/* Big pull-quote — full width, editorial */}
            <RevealSection>
              <blockquote className="text-[clamp(1.7rem,3.5vw,2.9rem)] font-semibold leading-[1.2] text-landing-ink mb-12 max-w-4xl">
                {"\u201C"}We have 300 certificates left to send
                and it{"\u2019"}s already{' '}
                <span className="font-serif italic font-normal text-landing-secondary">
                  midnight on Sunday.
                </span>{"\u201D"}
              </blockquote>
            </RevealSection>

            {/* Two-column: narrative + annotation */}
            <div className="grid md:grid-cols-[1fr_0.85fr] gap-12 md:gap-20 items-start">
              <RevealSection>
                <p className="text-xl text-landing-secondary leading-relaxed mb-6">
                  You organized the event. You made it great.
                  And now you&apos;re spending your entire Sunday manually editing
                  certificates in Canva, exporting them one by one, attaching
                  them to emails, and praying you didn&apos;t mix up two names.
                </p>
                <p className="text-xl text-landing-secondary leading-relaxed mb-6">
                  It shouldn&apos;t be this hard.
                </p>
                <p className="text-lg text-landing-secondary/80 leading-relaxed">
                  MailMyCertificate was built by Akshat Thakur after doing exactly this —
                  then deciding no one should ever have to again. It&apos;s free. It&apos;s open source.
                  And everything runs in your browser.
                </p>
              </RevealSection>

              {/* Annotation card — hand-placed feel */}
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
                  {/* hand-drawn underline accent */}
                  <svg className="mt-3 w-full" height="10" viewBox="0 0 200 10" fill="none" aria-hidden="true">
                    <path d="M4 7 C 50 3, 120 9, 196 5" stroke="#2D6A4F" strokeWidth="2"
                      strokeLinecap="round" opacity="0.4" />
                  </svg>
                </div>
              </RevealSection>
            </div>

            {/* The transformation stat — full-width moment */}
            <RevealSection className="mt-24 md:mt-32 py-16 md:py-20 border-t border-b border-landing-rule text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-landing-secondary mb-6">With MailMyCertificate</p>
              <p className="text-[clamp(3rem,8vw,7rem)] font-semibold leading-none text-landing-ink">
                4 hours
                <span className="mx-4 md:mx-6 font-serif italic font-normal text-landing-secondary">
                  →
                </span>
                2 minutes
              </p>
              <p className="mt-4 text-lg text-landing-secondary">For 200 certificates. Same result. No chaos.</p>
            </RevealSection>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            WORKFLOW — 4 illustrated steps, staggered editorial
           ═══════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 border-t border-landing-rule">
          <div className="container-width max-w-6xl">
            <RevealSection className="max-w-xl mb-20">
              <span className="landing-label mb-4 block">How It Works</span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-landing-ink">
                Four steps. Two minutes. Done.
              </h2>
            </RevealSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
              {[
                {
                  Icon: UploadStepIcon,
                  step: '01',
                  title: 'Upload template',
                  desc: 'Any PNG or JPG certificate design works as your base. Drag it in.',
                  offset: '',
                },
                {
                  Icon: DataStepIcon,
                  step: '02',
                  title: 'Import participants',
                  desc: 'Paste a Google Sheets URL or upload a CSV. Headers auto-detected.',
                  offset: 'lg:mt-10',
                },
                {
                  Icon: GenerateStepIcon,
                  step: '03',
                  title: 'Generate PDFs',
                  desc: 'Place name fields on the canvas. One click creates every certificate.',
                  offset: 'lg:mt-20',
                },
                {
                  Icon: SendStepIcon,
                  step: '04',
                  title: 'Send via Gmail',
                  desc: 'Connect your own Gmail account and send all at once. Your credentials, your control.',
                  offset: 'lg:mt-10',
                },
              ].map(({ Icon, step, title, desc, offset }) => (
                <RevealSection key={step} className={offset}>
                  <div className="group">
                    <div className="mb-5 w-14 h-14 transition-transform duration-500 group-hover:-translate-y-1.5">
                      <Icon className="w-full h-full" />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-landing-secondary mb-2">
                      Step {step}
                    </p>
                    <h3 className="text-lg font-semibold text-landing-ink mb-3">{title}</h3>
                    <p className="text-sm text-landing-secondary leading-relaxed">{desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>

            {/* Connector line under steps — decorative, hand-drawn */}
            <RevealSection className="mt-16 flex items-center justify-center opacity-20" aria-hidden="true">
              <svg width="80%" height="16" viewBox="0 0 600 16" fill="none">
                <path d="M0 8 C 150 3, 300 13, 450 6 C 520 3, 570 9, 600 8"
                  stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </RevealSection>

            {/* CTA below workflow */}
            <RevealSection className="mt-12 text-center">
              <TrackToolCta
                href="/tool"
                entryPoint="workflow_cta"
                className="landing-btn-primary inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-base"
              >
                Try It Now — It&apos;s Free
                <ArrowRight size={17} />
              </TrackToolCta>
            </RevealSection>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PRODUCT SHOWCASE — Show the actual tool UI
           ═══════════════════════════════════════════════════════ */}
        <section className="landing-section-alt py-24 md:py-32 border-t border-landing-rule">
          <div className="container-width max-w-6xl">
            <RevealSection className="text-center mb-16 md:mb-20">
              <span className="landing-label mb-4 block">The Product</span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-landing-ink max-w-2xl mx-auto mb-6">
                A complete certificate workflow that fits in one browser tab.
              </h2>
              <p className="text-lg text-landing-secondary max-w-lg mx-auto">
                Visual field editor. Batch PDF engine. Built-in email composer.
                No installs, no switching tools.
              </p>
            </RevealSection>

            {/* Product mockup — browser chrome with internal UI representation */}
            <RevealSection>
              <div className="landing-browser-chrome mx-auto max-w-4xl">
                {/* Browser top bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-landing-rule/60">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#E07070]/60" />
                    <span className="w-3 h-3 rounded-full bg-[#E0C070]/60" />
                    <span className="w-3 h-3 rounded-full bg-[#70C070]/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <span className="bg-white/80 border border-landing-rule/40 rounded-md px-4 py-1 text-xs text-landing-secondary font-mono">
                      mailmycertificate.tech/tool
                    </span>
                  </div>
                </div>

                {/* Inner content — simplified tool UI */}
                <div className="p-6 md:p-8">
                  <div className="grid md:grid-cols-[0.6fr_1fr] gap-6">
                    {/* Left sidebar — wizard steps */}
                    <div className="space-y-3">
                      {[
                        { n: 1, label: 'Template Uploaded', done: true },
                        { n: 2, label: 'Participants Imported', done: true },
                        { n: 3, label: 'Fields Placed', done: true },
                        { n: 4, label: 'Generating 200 PDFs…', done: false },
                      ].map(({ n, label, done }) => (
                        <div key={n} className="flex items-center gap-3 text-sm">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                            ${done ? 'bg-[#2D6A4F] text-white' : 'border-2 border-[#2D6A4F] text-[#2D6A4F]'}`}>
                            {done ? <Check size={12} /> : n}
                          </span>
                          <span className={done ? 'text-landing-secondary line-through' : 'text-landing-ink font-semibold'}>
                            {label}
                          </span>
                        </div>
                      ))}

                      {/* Progress bar */}
                      <div className="pt-4">
                        <div className="flex justify-between text-xs text-landing-secondary mb-1.5">
                          <span>Progress</span>
                          <span className="font-semibold text-landing-ink">147/200</span>
                        </div>
                        <div className="h-2 bg-landing-rule/40 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2D6A4F] rounded-full" style={{ width: '73.5%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Right — canvas mockup */}
                    <div className="border border-landing-rule rounded-lg p-4 bg-white/50 min-h-[200px] flex items-center justify-center relative overflow-hidden">
                      {/* Simplified certificate canvas */}
                      <div className="w-full max-w-xs aspect-[4/3] border border-dashed border-landing-rule/60 rounded bg-white/80 p-4 relative">
                        {/* Certificate template placeholder */}
                        <div className="absolute inset-2 flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-full border-2 border-[#2D6A4F]/30" />
                          <div className="h-2 w-24 bg-landing-ink/10 rounded" />
                          <div className="h-2 w-16 bg-landing-ink/5 rounded" />
                          {/* Name field — highlighted */}
                          <div className="mt-2 px-3 py-1.5 border-2 border-[#2D6A4F] border-dashed rounded bg-[#2D6A4F]/5">
                            <span className="text-[10px] font-mono text-[#2D6A4F] font-semibold">{'{{name}}'}</span>
                          </div>
                          <div className="h-1.5 w-20 bg-landing-ink/5 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>

            {/* Feature pills below product showcase */}
            <RevealSection className="flex flex-wrap justify-center gap-3 mt-12">
              {['Drag & drop fields', 'Undo / redo', 'Google Sheets sync', 'ZIP download', 'Session recovery'].map((f) => (
                <span key={f} className="landing-feature-pill">{f}</span>
              ))}
            </RevealSection>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PRIVACY & TRUST — Local pipeline visualization
           ═══════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 border-t border-landing-rule">
          <div className="container-width max-w-6xl">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">
              {/* Left: Messaging */}
              <div>
                <RevealSection>
                  <span className="landing-label mb-4 block">Privacy</span>
                  <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-landing-ink mb-8">
                    Your data never
                    <br />
                    <span className="font-serif italic font-normal text-landing-secondary">leaves your computer.</span>
                  </h2>
                </RevealSection>

                <RevealSection>
                  <p className="text-lg text-landing-secondary leading-relaxed mb-8">
                    PDF generation, field placement, data processing — everything happens
                    inside your browser using a Web Worker. No server ever receives your
                    participant list or certificate files.
                  </p>
                </RevealSection>

                <RevealSection>
                  <div className="space-y-4 mb-8">
                    {[
                      { text: 'PDF engine runs locally via Web Worker', check: true },
                      { text: 'Participant data stored in IndexedDB (your device)', check: true },
                      { text: 'Zero external API calls for processing', check: true },
                      { text: 'Gmail send uses your own OAuth account', check: true },
                    ].map(({ text, check }) => (
                      <div key={text} className="flex items-start gap-3 text-sm">
                        {check && <Check size={16} className="mt-0.5 text-[#2D6A4F] shrink-0" />}
                        <span className="text-landing-secondary">{text}</span>
                      </div>
                    ))}
                  </div>
                </RevealSection>

                {/* Network monitor stat */}
                <RevealSection>
                  <div className="landing-annotation-card inline-block">
                    <p className="text-xs text-landing-secondary mb-1">Network requests to external servers</p>
                    <p className="text-4xl font-bold text-[#2D6A4F]">0</p>
                  </div>
                </RevealSection>
              </div>

              {/* Right: Pipeline illustration */}
              <RevealSection className="hidden lg:block">
                <LocalPipelineIllustration className="w-full" />
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            OPEN SOURCE & COMMUNITY
           ═══════════════════════════════════════════════════════ */}
        <section className="landing-section-alt py-24 md:py-32 border-t border-landing-rule">
          <div className="container-width max-w-6xl">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
              {/* Left: Illustration */}
              <RevealSection className="hidden lg:block">
                <OpenSourceIllustration className="w-full max-w-sm mx-auto" />
              </RevealSection>

              {/* Right: Messaging */}
              <div>
                <RevealSection>
                  <span className="landing-label mb-4 block">Open Source</span>
                  <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-landing-ink mb-8">
                    Built in public.
                    <br />
                    <span className="font-serif italic font-normal text-landing-secondary">Trusted by design.</span>
                  </h2>
                </RevealSection>

                <RevealSection>
                  <p className="text-lg text-landing-secondary leading-relaxed mb-10">
                    Every line of code is on GitHub. Read it. Audit it. Fork it. Deploy your own.
                    This isn&apos;t a black box — it&apos;s a tool you can own.
                  </p>
                </RevealSection>

                <RevealSection>
                  <div className="grid sm:grid-cols-2 gap-6 mb-10">
                    {[
                      { title: 'Transparency', desc: 'No hidden trackers. No data collection. The code proves it.' },
                      { title: 'Community', desc: 'File issues, submit PRs, suggest features. Everyone is welcome.' },
                      { title: 'Control', desc: 'Self-host it. Modify it. Your deployment, your rules.' },
                      { title: 'Sustainability', desc: 'No VC funding to chase. No shutdown risk. Just code that works.' },
                    ].map(({ title, desc }) => (
                      <div key={title}>
                        <h3 className="text-sm font-semibold text-landing-ink mb-1.5">{title}</h3>
                        <p className="text-sm text-landing-secondary leading-relaxed">{desc}</p>
                      </div>
                    ))}
                  </div>
                </RevealSection>

                <RevealSection className="flex flex-wrap gap-3">
                  <Link
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    className="landing-btn-primary inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg text-sm"
                  >
                    <Github size={16} />
                    View Source Code
                  </Link>
                  <Link
                    href={`${GITHUB_REPO_URL}/issues`}
                    target="_blank"
                    className="landing-btn-secondary inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg text-sm"
                  >
                    Open Issues
                  </Link>
                </RevealSection>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FOUNDER — Human trust, real story
           ═══════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 border-t border-landing-rule">
          <div className="container-width max-w-4xl">
            <RevealSection>
              <span className="landing-label mb-4 block">Built By</span>
            </RevealSection>

            <RevealSection>
              <div className="landing-annotation-card p-8 md:p-12">
                <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                  <Image
                    src="https://github.com/akshatthakur22.png"
                    alt="Akshat Thakur"
                    width={72}
                    height={72}
                    className="rounded-full ring-2 ring-landing-rule"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-landing-ink mb-1">Akshat Thakur</h3>
                    <p className="text-sm text-landing-secondary font-medium mb-4">Software Developer</p>
                    <div className="flex gap-3">
                      <Link
                        href="https://github.com/akshatthakur22"
                        target="_blank"
                        className="text-sm text-landing-secondary hover:text-landing-ink transition-colors"
                      >
                        GitHub →
                      </Link>
                      <Link
                        href="https://linkedin.com/in/akshatthakur22"
                        target="_blank"
                        className="text-sm text-landing-secondary hover:text-landing-ink transition-colors"
                      >
                        LinkedIn →
                      </Link>
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

        {/* ═══════════════════════════════════════════════════════
            FINAL CTA — Earned, warm, confident
           ═══════════════════════════════════════════════════════ */}
        <section className="landing-section-alt py-28 md:py-40 border-t border-landing-rule">
          <div className="container-width max-w-3xl text-center">
            <RevealSection>
              {/* Hand-drawn flourish above */}
              <svg className="mx-auto mb-8 opacity-30" width="120" height="20" viewBox="0 0 120 20" fill="none" aria-hidden="true">
                <path d="M10 12 C 30 5, 60 16, 90 8 C 100 5, 110 9, 112 10"
                  stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>

              <h2 className="text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[1.08] text-landing-ink mb-6">
                Stop losing weekends
                <br />
                to certificate work.
              </h2>
              <p className="text-xl text-landing-secondary mb-12 max-w-xl mx-auto leading-relaxed">
                No signup. No payment. No uploads. Just open the tool, import your list, and it&apos;s done.
              </p>
            </RevealSection>

            <RevealSection className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <TrackToolCta
                href="/tool"
                entryPoint="footer_cta"
                className="landing-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-9 py-4 rounded-lg text-base"
              >
                Generate Your First Batch
                <ArrowRight size={18} />
              </TrackToolCta>
              <Link
                href={GITHUB_REPO_URL}
                target="_blank"
                className="landing-btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-7 py-4 rounded-lg text-base"
              >
                <Github size={17} />
                Star on GitHub
              </Link>
            </RevealSection>

            <RevealSection>
              <p className="text-sm text-landing-secondary/60 italic">
                Free forever · Open source · Built with care
              </p>
            </RevealSection>
          </div>
        </section>

      </main>

      <ProductFooter />
    </div>
  );
}
