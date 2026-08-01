import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Free Certificate Generators in 2026 (Comparison) | MailMyCertificate Blog',
  description: 'Compare leading certificate generators. Find the best tool for your use case—from simple online makers to enterprise solutions.',
  alternates: {
    canonical: 'https://mailmycertificate.tech/blog/best-free-certificate-generators',
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
