'use client';

import { FileCheck } from 'lucide-react';
import type { SessionSummary, WorkflowStage } from '@/types/session';
import { Button } from '@/components/ui/Button';

interface SessionRecoveryModalProps {
  summary: SessionSummary;
  onContinue: () => void;
  onStartNew: () => void;
  busy?: boolean;
}

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getMessaging(summary: SessionSummary) {
  const count = summary.certificatesCount || summary.recipientsCount;
  const plural = count === 1 ? '' : 's';

  const byStage: Partial<
    Record<
      WorkflowStage,
      { title: string; description: string; continueLabel: string; summaryLine: string }
    >
  > = {
    EMAIL_SETUP: {
      title: 'Ready to send your certificates?',
      description: `You have ${count} certificate${plural} ready. Would you like to continue setting up email delivery?`,
      continueLabel: 'Yes, continue sending',
      summaryLine: `${count} certificate${plural} ready to email`,
    },
    DOWNLOAD: {
      title: 'Your certificates are ready',
      description: `You have ${count} certificate${plural} from your last project. Continue where you left off, or start a new project.`,
      continueLabel: 'Continue',
      summaryLine: `${count} certificate${plural} ready`,
    },
    SENDING: {
      title: 'You have emails in progress',
      description: 'Would you like to continue sending, or start a completely new project?',
      continueLabel: 'Continue sending',
      summaryLine: `${count} certificate${plural} · sending in progress`,
    },
    COMPLETED: {
      title: 'Welcome back',
      description: 'Your last project is complete. Continue reviewing it, or start a new one.',
      continueLabel: 'Continue',
      summaryLine: `${count} certificate${plural} · completed`,
    },
    GENERATE: {
      title: 'Continue your project?',
      description: `You were working on ${summary.recipientsCount} certificate${summary.recipientsCount === 1 ? '' : 's'}. Pick up where you left off, or start fresh.`,
      continueLabel: 'Continue',
      summaryLine: `${summary.recipientsCount} recipient${summary.recipientsCount === 1 ? '' : 's'} loaded`,
    },
  };

  return (
    byStage[summary.workflowStage] ?? {
      title: 'Continue where you left off?',
      description:
        'You have an unfinished certificate project on this device. Would you like to keep working on it, or start over?',
      continueLabel: 'Yes, continue',
      summaryLine: summary.hasTemplate
        ? 'Template and data saved'
        : 'Project in progress',
    }
  );
}

export function SessionRecoveryModal({
  summary,
  onContinue,
  onStartNew,
  busy = false,
}: SessionRecoveryModalProps) {
  const messaging = getMessaging(summary);

  const handleStartNew = () => {
    const ok = window.confirm(
      'Start a new project?\n\nYour current certificates, recipient list, and email draft will be removed from this device. This cannot be undone.',
    );
    if (ok) onStartNew();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-recovery-title"
    >
      <div className="w-full max-w-md rounded-xl border border-border/60 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <h2 id="session-recovery-title" className="text-lg font-semibold tracking-tight text-foreground">
          {messaging.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-secondary">{messaging.description}</p>

        <div className="mt-5 rounded-lg border border-border/60 bg-muted/30 p-4 text-left space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-border/60">
              <FileCheck className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{messaging.summaryLine}</p>
              <p className="text-xs text-secondary mt-0.5">
                {summary.recipientsCount > 0 && summary.certificatesCount > 0 && (
                  <>For {summary.recipientsCount} recipient{summary.recipientsCount !== 1 ? 's' : ''} · </>
                )}
                Last opened {formatDateTime(summary.lastActivity)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Button className="w-full rounded-lg h-11" onClick={onContinue} disabled={busy}>
            {messaging.continueLabel}
          </Button>
          <Button
            className="w-full rounded-lg h-11"
            variant="outline"
            onClick={handleStartNew}
            disabled={busy}
          >
            Start a new project
          </Button>
          <p className="text-[11px] text-center text-secondary/70 pt-1">
            Starting new removes your current work from this device only.
          </p>
        </div>

        <p className="mt-4 text-[11px] text-center text-secondary/60 leading-relaxed">
          Private by design — your certificates never leave this device.
        </p>
      </div>
    </div>
  );
}
