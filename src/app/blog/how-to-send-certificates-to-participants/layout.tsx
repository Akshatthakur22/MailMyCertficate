import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Send Certificates to 500+ Participants in Minutes | MailMyCertificate Blog',
  description: 'Learn the fastest way to send bulk certificates via Gmail. Discover automation techniques, email best practices, and delivery tracking.',
  alternates: {
    canonical: 'https://mailmycertificate.tech/blog/how-to-send-certificates-to-participants',
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
