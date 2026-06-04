import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Send Certificates by Email',
  description: 'Connect Gmail and send personalized certificates with attachments. Delivery runs from your account.',
  path: '/email',
  noIndex: true,
});

export default function EmailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
