import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Free Certificate Generators 2026 | MailMyCertificate',
  description: 'Compare free certificate generators for bulk creation and email delivery. Learn which tools are best for events, hackathons, workshops, and training programs.',
  keywords: [
    'free certificate generators',
    'best certificate tools',
    'certificate generator comparison',
    'free certificate software',
    'bulk certificate generator',
    'certificate creation tools',
    'online certificate maker',
  ],
  alternates: {
    canonical: 'https://mailmycertificate.tech/blog/best-free-certificate-generators',
  },
  openGraph: {
    type: 'article',
    url: 'https://mailmycertificate.tech/blog/best-free-certificate-generators',
    title: 'Best Free Certificate Generators 2026',
    description: 'Compare free certificate generators for bulk creation and email delivery. Learn which tools are best for events, hackathons, workshops, and training programs.',
    siteName: 'MailMyCertificate',
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
