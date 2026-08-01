'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';

export default function BlogPostSendCertificates() {
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
              Tutorial
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-landing-ink leading-tight">
              How to Send Certificates to 500+ Participants in Minutes
            </h1>
            <div className="flex gap-6 text-sm text-landing-secondary pt-4 border-t border-landing-rule">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                July 26, 2026
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                6 min read
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
              Sending 500+ certificates individually would take weeks. Discover the fastest, most reliable ways to deliver certificates in bulk using automation, email templates, and smart tools.
            </p>

            <div className="bg-landing-section-alt/40 border border-landing-rule/30 rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold text-landing-ink mb-4">Why Bulk Sending Matters</h3>
              <p>
                The difference between manually sending 500 emails vs. bulk sending:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex gap-3">
                  <span className="text-landing-accent font-bold">•</span>
                  <span><strong className="text-landing-ink">Manual:</strong> 10-20 hours of work + human error</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-landing-accent font-bold">•</span>
                  <span><strong className="text-landing-ink">Bulk:</strong> 5 minutes + zero errors + tracking</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Method 1: Gmail Bulk Send (Recommended)</h2>
            <p>
              The simplest and most reliable method for most organizations.
            </p>

            <h3 className="text-2xl font-semibold text-landing-ink">How It Works</h3>
            <ol className="space-y-3 pl-6 list-decimal">
              <li><strong className="text-landing-ink">Upload your certificates:</strong> Generated PDFs from MailMyCertificate or your tool of choice</li>
              <li><strong className="text-landing-ink">Import recipient list:</strong> CSV or Google Sheet with names and email addresses</li>
              <li><strong className="text-landing-ink">Connect Gmail:</strong> Authorize the sending account (your organization's email)</li>
              <li><strong className="text-landing-ink">Customize email:</strong> Add a personal subject line and message</li>
              <li><strong className="text-landing-ink">Click Send:</strong> All 500+ certificates go out automatically</li>
            </ol>

            <h3 className="text-2xl font-semibold text-landing-ink pt-4">Why Gmail?</h3>
            <ul className="space-y-3 pl-6">
              <li><strong className="text-landing-ink">Trusted delivery:</strong> Gmail's infrastructure ensures high delivery rates</li>
              <li><strong className="text-landing-ink">Your reputation:</strong> Emails come from your domain, not a third party</li>
              <li><strong className="text-landing-ink">Open rates:</strong> Participants recognize and trust your organization</li>
              <li><strong className="text-landing-ink">DKIM/SPF ready:</strong> Automatic authentication prevents spam flagging</li>
            </ul>

            <div className="bg-landing-section-alt/40 border border-landing-rule/30 rounded-lg p-6 md:p-8 my-8">
              <h3 className="text-lg font-semibold text-landing-ink mb-3">⚡ Gmail Rate Limits</h3>
              <p>
                Gmail allows up to 500 emails per day per user. For larger batches (1000+), spread sends across multiple days or use a business email account with higher limits.
              </p>
            </div>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Method 2: Mailgun / SendGrid for Enterprise</h2>
            <p>
              For organizations sending 1000+ certificates or needing advanced analytics:
            </p>
            <ul className="space-y-3 pl-6">
              <li><strong className="text-landing-ink">SendGrid:</strong> Transactional email service, 100 free emails/day, then paid plans</li>
              <li><strong className="text-landing-ink">Mailgun:</strong> Developer-friendly, great for custom integrations</li>
              <li><strong className="text-landing-ink">Benefit:</strong> Unlimited sending, detailed delivery tracking, bounce handling</li>
            </ul>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Best Practices for Bulk Email</h2>

            <h3 className="text-2xl font-semibold text-landing-ink">1. Personalize the Subject Line</h3>
            <p>
              Instead of: "Certificate attached"<br />
              Try: "You earned your [event] certificate! 🎉"
            </p>
            <p className="text-sm text-landing-secondary/70">
              Use brackets like [variable] or double-braces in your sending tool to replace with actual data from your CSV.
            </p>

            <h3 className="text-2xl font-semibold text-landing-ink pt-4">2. Write a Compelling Email Body</h3>
            <p>
              Make it personal and celebratory:
            </p>
            <div className="bg-landing-section-alt/40 border border-landing-rule/30 rounded p-4 text-sm font-mono my-4 overflow-x-auto">
              <p>Hi [name],</p>
              <p className="mt-3">Congratulations! Your certificate for [event] is attached.</p>
              <p className="mt-3">We're proud to have had you with us. Your participation made a real impact.</p>
              <p className="mt-3">Feel free to share your certificate on LinkedIn, Twitter, or your resume.</p>
              <p className="mt-3">Best,<br/>The [organization] Team</p>
            </div>

            <h3 className="text-2xl font-semibold text-landing-ink pt-4">3. Timing Matters</h3>
            <ul className="space-y-2 pl-6">
              <li>• <strong className="text-landing-ink">Send within 24 hours</strong> of event completion for maximum engagement</li>
              <li>• <strong className="text-landing-ink">Avoid weekends and late nights</strong> for better open rates</li>
              <li>• <strong className="text-landing-ink">Tuesday-Thursday, 10 AM</strong> is typically optimal</li>
            </ul>

            <h3 className="text-2xl font-semibold text-landing-ink pt-4">4. Track Delivery</h3>
            <ul className="space-y-2 pl-6">
              <li>• <strong className="text-landing-ink">Monitor bounces:</strong> Identify bad email addresses</li>
              <li>• <strong className="text-landing-ink">Check open rates:</strong> See who's downloading certificates</li>
              <li>• <strong className="text-landing-ink">Re-send to bounces:</strong> Try alternative emails if available</li>
            </ul>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Common Mistakes to Avoid</h2>
            <ul className="space-y-3 pl-6">
              <li><strong className="text-landing-ink">❌ Wrong email address:</strong> Always verify recipient emails before sending</li>
              <li><strong className="text-landing-ink">❌ Generic subject:</strong> Low open rates if it looks like spam</li>
              <li><strong className="text-landing-ink">❌ Sending all at once:</strong> May hit Gmail rate limits; spread across days if 500+</li>
              <li><strong className="text-landing-ink">❌ Forgetting attachments:</strong> Test with one recipient first</li>
              <li><strong className="text-landing-ink">❌ No follow-up:</strong> Some emails may bounce—have a backup plan</li>
            </ul>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Your Next Step</h2>
            <p>
              Ready to send your certificates? MailMyCertificate handles the entire workflow—from certificate generation to bulk Gmail delivery—without leaving the platform.
            </p>
            <p className="pt-4">
              <Link href="/tool" className="inline-flex items-center gap-2 px-6 py-3 bg-landing-accent text-white font-semibold rounded-lg hover:bg-landing-accent/90 transition-colors">
                Send Your First Bulk Certificates
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
            href="/blog/best-free-certificate-generators"
            className="group block space-y-3 p-6 border border-landing-rule/30 rounded-lg hover:border-landing-accent/50 transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-landing-secondary">Next Article</p>
            <p className="text-xl font-semibold text-landing-ink group-hover:text-landing-accent transition-colors">
              Best Free Certificate Generators in 2026 (Comparison)
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
