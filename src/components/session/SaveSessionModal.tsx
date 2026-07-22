'use client';

import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { saveSessionForEmail } from '@/core/session/sessionSaveService';

interface SaveSessionModalProps {
  sessionId: string;
  isOpen: boolean;
  onClose: () => void;
  certificateCount: number;
}

export function SaveSessionModal({
  sessionId,
  isOpen,
  onClose,
  certificateCount,
}: SaveSessionModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await saveSessionForEmail(email, sessionId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-border p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg transition-colors"
        >
          <X size={20} className="text-secondary" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Mail size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Save this session?</h2>
            <p className="text-xs text-secondary/60">Come back to this batch anytime</p>
          </div>
        </div>

        {/* Body */}
        <p className="text-sm text-secondary mb-4">
          We&apos;ll save your <span className="font-medium">{certificateCount} certificates</span> and let you resume where you left off when you return.
        </p>

        {/* Email input */}
        <div className="mb-4">
          <label className="text-xs font-medium text-secondary/70 block mb-1.5">Your email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 rounded-lg border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-60"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500 mb-3">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            size="sm"
            disabled={isLoading}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            size="sm"
            disabled={isLoading || !email}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : 'Save session'}
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-secondary/50 text-center mt-3">
          Your certificates stay on your device. We never store them.
        </p>
      </div>
    </div>
  );
}
