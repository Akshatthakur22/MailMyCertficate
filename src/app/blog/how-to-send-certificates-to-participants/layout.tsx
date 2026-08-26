import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Send Certificates to Participants | MailMyCertificate',
  description: 'Bulk send personalized PDF certificates to participants via email using Gmail. No signup, no server uploads, runs entirely in your browser.',
  keywords: [
    'send certificates',
    'bulk email certificates',
    'Gmail certificate delivery',
    'participant certificates',
    'batch certificate sending',
    'certificate email delivery',
    'automated certificate sending',
  ],
  alternates: {
    canonical: 'https://mailmycertificate.tech/blog/how-to-send-certificates-to-participants',
  },
  openGraph: {
    type: 'article',
    url: 'https://mailmycertificate.tech/blog/how-to-send-certificates-to-participants',
    title: 'Send Certificates to Participants',
    description: 'Bulk send personalized PDF certificates to participants via email using Gmail. No signup, no server uploads, runs entirely in your browser.',
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
