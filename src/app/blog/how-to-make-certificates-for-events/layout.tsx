import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Make Professional Certificates for Your Events | MailMyCertificate Blog',
  description: 'Step-by-step guide to creating beautiful, personalized certificates for workshops, conferences, and webinars using templates and bulk generation.',
  alternates: {
    canonical: 'https://mailmycertificate.tech/blog/how-to-make-certificates-for-events',
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
