import Link from 'next/link';
import { Bug, Code2, Github, GitPullRequestArrow, Star } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { GITHUB_REPO_URL } from '@/config/github';

interface OpenSourceSupportCardProps {
  context?: 'success' | 'section' | 'compact';
  certificatesCount?: number;
}

export function OpenSourceSupportCard({ context = 'section', certificatesCount }: OpenSourceSupportCardProps) {
  const isSuccess = context === 'success';

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Github className="h-4 w-4 text-accent" />
            Open source, by design
          </div>
          <p className="mt-2 text-sm leading-6 text-secondary">
            {isSuccess
              ? `MailMyCertificate just helped with ${certificatesCount ?? 'your'} certificate${certificatesCount === 1 ? '' : 's'}. If it saved you time, a GitHub star helps other organizers discover a free, privacy-first alternative.`
              : 'The source is public so organizers can inspect the privacy model, report issues, request features, or self-host their own copy.'}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:min-w-44">
          <Link
            href={GITHUB_REPO_URL}
            target="_blank"
            className={buttonVariants({ variant: 'primary', size: 'sm', className: 'gap-2' })}
          >
            <Star size={14} />
            Star on GitHub
          </Link>
          <Link
            href={`${GITHUB_REPO_URL}/issues`}
            target="_blank"
            className={buttonVariants({ variant: 'outline', size: 'sm', className: 'gap-2' })}
          >
            <Bug size={14} />
            Report issue
          </Link>
        </div>
      </div>

      {context !== 'compact' && (
        <div className="mt-5 grid gap-3 border-t border-border/60 pt-5 sm:grid-cols-3">
          <SupportPoint icon={Code2} label="Inspect the code" />
          <SupportPoint icon={GitPullRequestArrow} label="Contribute improvements" />
          <SupportPoint icon={Github} label="Help others discover it" />
        </div>
      )}
    </div>
  );
}

function SupportPoint({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-medium text-secondary">
      <Icon className="h-3.5 w-3.5 text-accent" />
      {label}
    </div>
  );
}
