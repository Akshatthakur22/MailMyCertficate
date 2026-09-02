import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock, Check, X } from 'lucide-react';

export default function BlogPostBestGenerators() {
  const tools = [
    {
      name: 'MailMyCertificate',
      price: 'Free (MIT License)',
      best_for: 'Bulk certificates + Gmail integration',
      pros: ['No signup required', 'Open source', 'Bulk email sending', 'CSV/Google Sheets', 'Unlimited free'],
      cons: ['Self-hosted setup required', 'No UI hosting included'],
    },
    {
      name: 'Canva',
      price: 'Free + Pro ($13/mo)',
      best_for: 'Design-first templates',
      pros: ['Beautiful templates', 'Easy to customize', 'No design skills needed', 'PNG/PDF export'],
      cons: ['Manual one-by-one certificates', 'No bulk generation', 'Pro features locked'],
    },
    {
      name: 'Adobe Express',
      price: 'Free + Premium ($4.99/mo)',
      best_for: 'Professional-grade certificates',
      pros: ['Adobe quality', 'Extensive templates', 'Brand kit support', 'PDF preset sizes'],
      cons: ['Slow for bulk work', 'No built-in bulk features', 'Watermarks on free'],
    },
    {
      name: 'Credly',
      price: 'Free + Enterprise',
      best_for: 'Digital badges + certificates',
      pros: ['Blockchain verification', 'Social sharing', 'Credential management', 'API available'],
      cons: ['Expensive at scale', 'Complex setup', 'Digital-only (no PDF print)'],
    },
  ];

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
              Comparison
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-landing-ink leading-tight">
              Best Free Certificate Generators in 2026 (Comparison)
            </h1>
            <div className="flex gap-6 text-sm text-landing-secondary pt-4 border-t border-landing-rule">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                July 25, 2026
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                10 min read
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
              Not all certificate generators are created equal. We've tested the leading free and freemium tools to help you find the perfect fit for your use case.
            </p>

            <div className="bg-landing-section-alt/40 border border-landing-rule/30 rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold text-landing-ink mb-4">Comparison at a Glance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-landing-rule/50">
                      <th className="text-left py-3 px-2 font-semibold text-landing-ink">Tool</th>
                      <th className="text-center py-3 px-2 font-semibold text-landing-ink">Bulk</th>
                      <th className="text-center py-3 px-2 font-semibold text-landing-ink">API</th>
                      <th className="text-center py-3 px-2 font-semibold text-landing-ink">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-landing-rule/30">
                      <td className="py-3 px-2 font-medium text-landing-ink">MailMyCertificate</td>
                      <td className="text-center py-3 px-2"><Check className="text-green-600 mx-auto" size={18} /></td>
                      <td className="text-center py-3 px-2"><Check className="text-green-600 mx-auto" size={18} /></td>
                      <td className="text-center py-3 px-2"><Check className="text-green-600 mx-auto" size={18} /></td>
                    </tr>
                    <tr className="border-b border-landing-rule/30">
                      <td className="py-3 px-2 font-medium text-landing-ink">Canva</td>
                      <td className="text-center py-3 px-2"><X className="text-red-400 mx-auto" size={18} /></td>
                      <td className="text-center py-3 px-2"><Check className="text-green-600 mx-auto" size={18} /></td>
                      <td className="text-center py-3 px-2"><X className="text-red-400 mx-auto" size={18} /></td>
                    </tr>
                    <tr className="border-b border-landing-rule/30">
                      <td className="py-3 px-2 font-medium text-landing-ink">Adobe Express</td>
                      <td className="text-center py-3 px-2"><X className="text-red-400 mx-auto" size={18} /></td>
                      <td className="text-center py-3 px-2"><X className="text-red-400 mx-auto" size={18} /></td>
                      <td className="text-center py-3 px-2"><X className="text-red-400 mx-auto" size={18} /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium text-landing-ink">Credly</td>
                      <td className="text-center py-3 px-2"><Check className="text-green-600 mx-auto" size={18} /></td>
                      <td className="text-center py-3 px-2"><Check className="text-green-600 mx-auto" size={18} /></td>
                      <td className="text-center py-3 px-2"><Check className="text-green-600 mx-auto" size={18} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">The Winners by Use Case</h2>

            {tools.map((tool) => (
              <div key={tool.name} className="border border-landing-rule/30 rounded-lg p-6 md:p-8 space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold text-landing-ink">{tool.name}</h3>
                  <p className="text-sm text-landing-secondary mt-1">{tool.price}</p>
                  <p className="text-sm font-medium text-landing-accent mt-2">Best for: {tool.best_for}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-landing-ink text-sm mb-3">Pros</h4>
                    <ul className="space-y-2">
                      {tool.pros.map((pro) => (
                        <li key={pro} className="flex gap-3 text-sm">
                          <Check className="text-green-600 shrink-0 mt-0.5" size={16} />
                          <span className="text-landing-secondary">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-landing-ink text-sm mb-3">Cons</h4>
                    <ul className="space-y-2">
                      {tool.cons.map((con) => (
                        <li key={con} className="flex gap-3 text-sm">
                          <X className="text-red-400 shrink-0 mt-0.5" size={16} />
                          <span className="text-landing-secondary">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Recommendations by Scenario</h2>

            <h3 className="text-2xl font-semibold text-landing-ink">Scenario 1: You need to send 100+ certificates</h3>
            <p className="font-semibold text-landing-accent">Winner: MailMyCertificate</p>
            <p>
              Manual design tools like Canva and Adobe Express require you to create each certificate individually. That's 100+ repetitive clicks. MailMyCertificate handles all 100 in one automated batch. Free, open source, and designed for bulk workflows.
            </p>

            <h3 className="text-2xl font-semibold text-landing-ink pt-4">Scenario 2: You're not tech-savvy and want simplicity</h3>
            <p className="font-semibold text-landing-accent">Winner: Canva</p>
            <p>
              Canva's drag-and-drop interface is the most user-friendly. If you only need 5-10 certificates, Canva's templates let you design and download in minutes with zero learning curve.
            </p>

            <h3 className="text-2xl font-semibold text-landing-ink pt-4">Scenario 3: You want professional-grade design</h3>
            <p className="font-semibold text-landing-accent">Winner: Adobe Express</p>
            <p>
              Adobe's templates are industry-standard quality. If you can design each certificate individually, Express produces the most polished results. Not ideal for bulk, but excellent for one-off certificates.
            </p>

            <h3 className="text-2xl font-semibold text-landing-ink pt-4">Scenario 4: You need blockchain-verified digital badges</h3>
            <p className="font-semibold text-landing-accent">Winner: Credly</p>
            <p>
              Credly's strength is digital credentialing and verification. If your use case requires blockchain authentication and social sharing, Credly is purpose-built for this. Cost is higher but credentials are verifiable forever.
            </p>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">The Verdict</h2>
            <div className="bg-landing-accent/10 border border-landing-accent/30 rounded-lg p-6 md:p-8">
              <p className="text-landing-ink font-semibold mb-3">For most organizations sending 10+ certificates:</p>
              <p className="mb-4">
                Use <strong>MailMyCertificate</strong>. It's free, open source, requires no credit card, and handles bulk workflows that other tools simply don't support. Your participants get beautiful PDFs, you spend 5 minutes instead of 5 hours, and you control the entire process.
              </p>
              <p className="text-sm text-landing-secondary">
                For small batches (under 5 certificates) or design-focused needs, Canva and Adobe Express are excellent. For enterprise credentialing, Credly is the specialist tool.
              </p>
            </div>

            <h2 className="text-3xl font-semibold text-landing-ink pt-4">Ready to Choose?</h2>
            <p>
              Start with MailMyCertificate. It's free, no signup required, and works immediately.
            </p>
            <p className="pt-4">
              <Link href="/tool" className="inline-flex items-center gap-2 px-6 py-3 bg-landing-accent text-white font-semibold rounded-lg hover:bg-landing-accent/90 transition-colors">
                Try MailMyCertificate Now
                <ArrowRight size={18} />
              </Link>
            </p>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-landing-section-alt/40 border-t border-landing-rule">
        <div className="container-width max-w-3xl">
          <h3 className="text-lg font-semibold text-landing-ink mb-6">Back to Blog</h3>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-landing-rule hover:border-landing-ink text-landing-ink font-semibold rounded-lg hover:bg-landing-section-alt/40 transition-colors"
          >
            <ArrowLeft size={18} />
            View All Articles
          </Link>
        </div>
      </section>
    </main>
  );
}
