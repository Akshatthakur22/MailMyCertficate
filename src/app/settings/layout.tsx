import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Session & Privacy',
  description:
    'Manage local certificate data in your browser: view your session, start a new batch, or delete stored files.',
  path: '/settings',
  noIndex: true,
});

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
