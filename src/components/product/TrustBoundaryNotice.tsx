import { Database, FileText, Mail, ShieldCheck } from 'lucide-react';

interface TrustBoundaryNoticeProps {
  variant?: 'upload' | 'csv' | 'email' | 'queue' | 'compact';
  className?: string;
}

const content = {
  upload: {
    icon: FileText,
    title: 'Template stays in this browser',
    body: 'The image is saved to IndexedDB for this session so you can recover your work without uploading it to a certificate platform.',
  },
  csv: {
    icon: Database,
    title: 'Participant rows stay local',
    body: 'CSV data is stored in this browser. Google Sheets import fetches only the public sheet link you provide.',
  },
  email: {
    icon: Mail,
    title: 'Email is explicit',
    body: 'Certificates are attached only when you send. Each message goes through your connected Gmail account at delivery time.',
  },
  queue: {
    icon: ShieldCheck,
    title: 'Sending progress is recoverable',
    body: 'The email queue is saved locally, so a refresh can show exactly what sent, failed, or needs review.',
  },
  compact: {
    icon: ShieldCheck,
    title: 'Browser-first by design',
    body: 'Generation happens locally. You choose when to download or send.',
  },
};

export function TrustBoundaryNotice({ variant = 'compact', className = '' }: TrustBoundaryNoticeProps) {
  const item = content[variant];
  const Icon = item.icon;

  return (
    <div className={`rounded-xl border border-accent/15 bg-accent-light/60 px-4 py-3 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-accent ring-1 ring-accent/10">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{item.title}</p>
          <p className="mt-1 text-xs leading-5 text-secondary">{item.body}</p>
        </div>
      </div>
    </div>
  );
}
