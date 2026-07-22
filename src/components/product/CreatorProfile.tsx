import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export interface CreatorProfileProps {
  variant?: 'compact' | 'full';
  showLinks?: boolean;
}

export function CreatorProfile({
  variant = 'full',
  showLinks = true,
}: CreatorProfileProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">AT</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-foreground">Akshat Thakur</p>
          <p className="text-xs text-secondary">Software Developer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xl">AT</span>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">Akshat Thakur</h3>
          <p className="text-sm font-medium text-accent mb-2">Software Developer</p>
          <p className="text-sm text-secondary leading-relaxed">
            Building scalable web applications, AI-powered products, and educational platforms that solve real-world problems.
          </p>
        </div>
      </div>

      {/* Links */}
      {showLinks && (
        <div className="flex gap-2 pt-2">
          <a
            href="https://github.com/akshatthakur22"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-white hover:bg-muted transition-colors"
            title="GitHub"
          >
            <Github size={16} className="text-foreground" />
          </a>
          <a
            href="https://www.linkedin.com/in/akshatthakur22/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-white hover:bg-muted transition-colors"
            title="LinkedIn"
          >
            <Linkedin size={16} className="text-foreground" />
          </a>
          <a
            href="https://x.com/akshatt66612958"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-white hover:bg-muted transition-colors"
            title="Twitter/X"
          >
            <Twitter size={16} className="text-foreground" />
          </a>
          <a
            href="mailto:akshatthakur22@gmail.com"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-white hover:bg-muted transition-colors"
            title="Email"
          >
            <Mail size={16} className="text-foreground" />
          </a>
        </div>
      )}
    </div>
  );
}
