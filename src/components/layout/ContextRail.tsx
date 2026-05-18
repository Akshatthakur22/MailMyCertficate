import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ContextRail({ email, sentCount, attachments, onLogin, onLogout, authenticating, authenticated }: { email?: string | null; sentCount?: number; attachments?: number; onLogin?: () => void; onLogout?: () => void; authenticating?: boolean; authenticated?: boolean }) {
  return (
    <aside className="w-full sm:w-72 lg:w-64 sticky top-20 self-start">
      <div className="rounded-xl bg-white/60 backdrop-blur-sm p-4"> 
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">{email ? String(email).slice(0,1).toUpperCase() : 'G'}</div>
          <div className="min-w-0">
            <div className="text-xs text-gray-500">Sending as</div>
            <div className="truncate font-medium text-gray-900">{email ?? 'Connect Gmail'}</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Local processing • secure delivery</span>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-700">
          <div className="text-xs text-gray-500">Ready</div>
          <div className="font-semibold">{sentCount ?? 0} sent</div>
          <div className="text-sm text-gray-500">{attachments ?? 0} attachments</div>
        </div>

        <div className="mt-4">
          {authenticated ? (
            <Button variant="secondary" size="sm" onClick={onLogout} className="w-full">Disconnect</Button>
          ) : (
            <Button variant="primary" size="sm" onClick={onLogin} disabled={authenticating} className="w-full">
              {authenticating ? 'Connecting…' : 'Connect Gmail'}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default ContextRail;
