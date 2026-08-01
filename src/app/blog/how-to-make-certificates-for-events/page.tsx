'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';

export default function BlogPostEventCertificates() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-landing-rule">
        <div className="container-width max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-landing-secondary hover:text-landing-ink transition-colors mb-8">
            <ArrowLeft size={18} />
            Back to blog
          </Link>
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-landing-rule/20 text-landing-secondary inline-block">
              Guide
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-landing-ink leading-tight">
              How to Make Professional Certificates for Your Events
            </h1>
            <div className="flex gap-6 text-sm text-landing-secondary pt-4 border-t border-landing-rule">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                July 27, 2026
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                8 min read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container-width max-w-3xl prose prose-sm md:prose-base max-w-none">
          <article className="space-y-8 text-landing-secondary">
            <p className="text-lg leading-relaxed text-landing-ink font-medium">
              Creating professional certificates for your events—whether it's a hackathon, workshop, or webinar—doesn't require design skills or expensive software. In this guide, we'll walk you through the entire process from design to delivery.
            </p>

            <div className="bg-landing-section-alt/40 border border-landing-rule/30 rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold text-landing-ink mb-4">What You'll Learn</h3>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-landing-accent font-bold">•</span>
                  <span>How to design a certificate template that looks professional</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-landing-accent font-bold">•</span>
                  <span>Tools and techniques for customizing certificates per participant</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-landing-accent font-bold">•</span>
                  <span>How to generate bulk certificates from CSV or Google Sheets data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-landing-accent font-bold">•</span>
                  <span>Best practices for sending certificates to hundreds of people</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Step 1: Design Your Certificate Template</h2>
            <p>
              The foundation of a great certificate is a clean, professional template. You don't need to start from scratch—here are your options:
            </p>
            <ul className="space-y-3 pl-6">
              <li><strong className="text-landing-ink">Use a template:</strong> Canva, Adobe Express, or MailMyCertificate all offer pre-built certificate templates. Start with a design that matches your event branding.</li>
              <li><strong className="text-landing-ink">Customize colors and fonts:</strong> Add your organization's colors, logo, and event name. Keep the design minimal—whitespace is your friend.</li>
              <li><strong className="text-landing-ink">Add placeholders:</strong> Include spaces for the participant's name, date, signature, and any relevant details (e.g., "for completing the JavaScript Bootcamp").</li>
            </ul>

            <p>
              Export your template as a PNG or JPG. High resolution (300 DPI) ensures it prints beautifully.
            </p>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Step 2: Prepare Your Participant Data</h2>
            <p>
              Organize your participant information in a CSV file or Google Sheet. At minimum, include:
            </p>
            <ul className="space-y-2 pl-6">
              <li>• Participant Name (required)</li>
              <li>• Email Address (for sending)</li>
              <li>• Completion Date or Badge (optional but recommended)</li>
            </ul>

            <p>
              The cleaner your data, the better your certificates will look. Double-check names for spelling and formatting.
            </p>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Step 3: Generate Certificates in Bulk</h2>
            <p>
              This is where MailMyCertificate shines. Upload your template and participant data:
            </p>
            <ol className="space-y-3 pl-6 list-decimal">
              <li><strong className="text-landing-ink">Upload your template</strong> (PNG/JPG)</li>
              <li><strong className="text-landing-ink">Connect your Google Sheet or CSV</strong> with participant names</li>
              <li><strong className="text-landing-ink">Place name fields</strong> on the certificate canvas (drag-and-drop)</li>
              <li><strong className="text-landing-ink">Click Generate</strong> — your certificates are created instantly as PDFs</li>
            </ol>

            <p>
              No coding required. No design experience needed. The entire process takes minutes.
            </p>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Step 4: Send Certificates to Your Participants</h2>
            <p>
              Once generated, you can send certificates directly via Gmail:
            </p>
            <ul className="space-y-3 pl-6">
              <li><strong className="text-landing-ink">Connect your Gmail account:</strong> MailMyCertificate uses OAuth—your credentials are never stored.</li>
              <li><strong className="text-landing-ink">Customize the email:</strong> Add a personal message thanking participants for attending.</li>
              <li><strong className="text-landing-ink">Send in bulk:</strong> One click sends all certificates. Gmail handles delivery automatically.</li>
            </ul>

            <div className="bg-landing-section-alt/40 border border-landing-rule/30 rounded-lg p-6 md:p-8 my-8">
              <h3 className="text-lg font-semibold text-landing-ink mb-3">💡 Pro Tip</h3>
              <p>
                Personalize your email subject line and body. Instead of a generic "Here's your certificate," try: "You earned your certificate! 🎉 — [Event Name]". Higher open rates and participant engagement.
              </p>
            </div>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Best Practices for Event Certificates</h2>
            <ul className="space-y-3 pl-6">
              <li><strong className="text-landing-ink">Include event branding:</strong> Your organization's logo, colors, and event name should be visible.</li>
              <li><strong className="text-landing-ink">Keep it simple:</strong> Avoid clutter. Certificates are more impactful with negative space.</li>
              <li><strong className="text-landing-ink">Add credibility:</strong> Include the date, organizer signature (digital or real), and relevant credentials or badges.</li>
              <li><strong className="text-landing-ink">Make it shareable:</strong> Participants will want to share their certificates. A clean, professional design encourages this.</li>
              <li><strong className="text-landing-ink">Test before sending:</strong> Generate one test certificate and review it before sending to all participants.</li>
            </ul>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Ready to Get Started?</h2>
            <p>
              Creating professional event certificates is now as simple as uploading a template and pressing a button.
            </p>
            <p className="pt-4">
              <Link href="/tool" className="inline-flex items-center gap-2 px-6 py-3 bg-landing-accent text-white font-semibold rounded-lg hover:bg-landing-accent/90 transition-colors">
                Generate Your First Certificate
                <ArrowRight size={18} />
              </Link>
            </p>
          </article>
        </div>
      </section>

      {/* Next Post */}
      <section className="py-16 md:py-20 bg-landing-section-alt/40 border-t border-landing-rule">
        <div className="container-width max-w-3xl">
          <h3 className="text-lg font-semibold text-landing-ink mb-6">Continue Reading</h3>
          <Link
            href="/blog/how-to-send-certificates-to-participants"
            className="group block space-y-3 p-6 border border-landing-rule/30 rounded-lg hover:border-landing-accent/50 transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-landing-secondary">Next Article</p>
            <p className="text-xl font-semibold text-landing-ink group-hover:text-landing-accent transition-colors">
              How to Send Certificates to 500+ Participants in Minutes
            </p>
            <div className="flex items-center gap-2 text-landing-accent">
              Read More <ArrowRight size={18} />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
