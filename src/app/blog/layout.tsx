import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Certificate Blog | MailMyCertificate',
  description: 'Learn best practices for creating and sending certificates in bulk. Read guides on certificate templates, event management, and certificate automation.',
  keywords: [
    'certificate generation',
    'bulk certificates',
    'certificate templates',
    'certificate automation',
    'event certificates',
    'certificate tips',
    'certificate guides',
  ],
  alternates: {
    canonical: 'https://mailmycertificate.tech/blog',
  },
  openGraph: {
    type: 'website',
    url: 'https://mailmycertificate.tech/blog',
    title: 'Certificate Blog | MailMyCertificate',
    description: 'Learn best practices for creating and sending certificates in bulk.',
    siteName: 'MailMyCertificate',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
