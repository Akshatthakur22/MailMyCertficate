import Image from 'next/image';
import Link from 'next/link';
import { Code2, Github, ShieldCheck } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/config/github';

export function CreatorMissionCard() {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Image
          src="https://github.com/akshatthakur22.png"
          alt="Akshat Thakur"
          width={72}
          height={72}
          className="rounded-2xl border border-border"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Built by Akshat Thakur</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            A real organizer workflow, rebuilt as open-source software.
          </h3>
          <p className="mt-3 text-sm leading-6 text-secondary">
            MailMyCertificate started as automation for a college event with hundreds of certificates.
            The product keeps the same practical promise: fast local generation, transparent data handling,
            and no unnecessary account system.
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <Badge icon={ShieldCheck} text="Browser-first" />
            <Badge icon={Code2} text="Open source" />
            <Badge icon={Github} text="Community-backed" />
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
            <Link href="/about" className="text-accent hover:text-accent/80">
              Read the story
            </Link>
            <Link href={GITHUB_REPO_URL} target="_blank" className="text-secondary hover:text-foreground">
              View source
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-medium text-secondary">
      <Icon className="h-3.5 w-3.5 text-accent" />
      {text}
    </div>
  );
}
