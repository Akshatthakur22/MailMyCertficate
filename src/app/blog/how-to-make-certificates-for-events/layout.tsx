import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Make Certificates for Events | MailMyCertificate',
  description: 'Step-by-step guide to creating beautiful, personalized certificates for workshops, conferences, and webinars using templates and bulk generation.',
  keywords: [
    'event certificates',
    'certificate templates',
    'bulk certificate generation',
    'workshop certificates',
    'webinar certificates',
    'how to make certificates',
    'certificate generator',
  ],
  alternates: {
    canonical: 'https://mailmycertificate.tech/blog/how-to-make-certificates-for-events',
  },
  openGraph: {
    type: 'article',
    url: 'https://mailmycertificate.tech/blog/how-to-make-certificates-for-events',
    title: 'How to Make Certificates for Events',
    description: 'Step-by-step guide to creating beautiful, personalized certificates for workshops, conferences, and webinars using templates and bulk generation.',
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
