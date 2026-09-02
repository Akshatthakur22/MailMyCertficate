import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

const BLOG_POSTS = [
  {
    slug: 'how-to-make-certificates-for-events',
    title: 'How to Make Professional Certificates for Your Events',
    excerpt: 'Step-by-step guide to creating beautiful, personalized certificates for workshops, conferences, and webinars using templates and bulk generation.',
    date: '2026-07-27',
    readTime: '8 min',
    category: 'Guide',
  },
  {
    slug: 'how-to-send-certificates-to-participants',
    title: 'How to Send Certificates to 500+ Participants in Minutes',
    excerpt: 'Learn the fastest way to send bulk certificates via Gmail. Discover automation techniques, email best practices, and delivery tracking.',
    date: '2026-07-26',
    readTime: '6 min',
    category: 'Tutorial',
  },
  {
    slug: 'best-free-certificate-generators',
    title: 'Best Free Certificate Generators in 2026 (Comparison)',
    excerpt: 'Compare leading certificate generators. Find the best tool for your use case—from simple online makers to enterprise solutions.',
    date: '2026-07-25',
    readTime: '10 min',
    category: 'Comparison',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Hero */}
      <section className="py-20 md:py-28 border-b border-landing-rule">
        <div className="container-width max-w-4xl">
          <div className="space-y-6">
            <div>
              <span className="landing-label mb-3 block text-xs">Blog</span>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-landing-ink">
                Certificate Tips & Guides
              </h1>
            </div>
            <p className="text-lg text-landing-secondary leading-relaxed max-w-2xl">
              Learn best practices for creating, customizing, and sending professional certificates at scale.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container-width max-w-4xl">
          <div className="grid gap-8">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-landing-rule/20 text-landing-secondary">
                          {post.category}
                        </span>
                        <span className="text-xs text-landing-secondary flex items-center gap-1">
                          <Clock size={14} />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-semibold text-landing-ink group-hover:text-landing-accent transition-colors leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-base text-landing-secondary leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="shrink-0 mt-2">
                      <ArrowRight className="text-landing-secondary group-hover:text-landing-accent transition-colors" size={20} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-landing-secondary/60">
                    <Calendar size={14} />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </Link>
                <div className="mt-6 border-b border-landing-rule/30" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-landing-section-alt/40 border-t border-landing-rule">
        <div className="container-width max-w-4xl text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-landing-ink">
            Ready to generate certificates?
          </h2>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-landing-accent text-white font-semibold rounded-lg hover:bg-landing-accent/90 transition-colors"
          >
            Try MailMyCertificate Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
