import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { HeroContent } from '../components/HeroContent';
import { FloatingIllustration } from '../components/FloatingIllustration';
import { QuickLinksSection } from '../components/QuickLinksSection';
import { ProjectShowcase } from '../components/ProjectShowcase';
import {
  RecoverySection,
  NotFoundFooterNote,
} from '../components/RecoverySection';

export const metadata: Metadata = {
  title: '404 — Page not found | MailMyCertificate',
  description:
    "The page you're looking for doesn't exist. Head back to MailMyCertificate to send certificates in bulk, or find your way via the guide, tool, and support.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Decorative background layer: grid + glow + blobs, all subtle */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.15] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute top-1/3 -left-32 h-[360px] w-[360px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <Navbar />

      <main className="relative">
        <div className="container-width px-6 pb-24 pt-16 sm:pt-24 lg:pt-28">
          {/* Hero */}
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-8">
            <HeroContent />
            <FloatingIllustration />
          </div>

          <QuickLinksSection />
          <ProjectShowcase />
          <RecoverySection />
          <NotFoundFooterNote />
        </div>
      </main>
    </div>
  );
}