import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';
import { SessionProvider } from '@/components/session/SessionProvider';

export const metadata: Metadata = createPageMetadata({
  title: 'Certificate Tool',
  description: 'Upload a template and CSV to generate personalized certificates locally in your browser.',
  path: '/tool',
  noIndex: true,
});

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
