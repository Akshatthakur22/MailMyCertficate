'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';

function getManualTime(certs: number) {
  if (certs <= 50) return Math.round(certs * 2.4);
  if (certs <= 100) return Math.round(120 + (certs - 50) * 2.4);
  if (certs <= 250) return Math.round(240 + (certs - 100) * 1.92);
  if (certs <= 500) return Math.round(480 + (certs - 250) * 1.44);
  return Math.round(840 + (certs - 500) * 1.2);
}

function getToolTime(certs: number) {
  if (certs <= 50) return 2;
  if (certs <= 100) return 4;
  if (certs <= 250) return 7;
  if (certs <= 500) return 12;
  return 20;
}

export function TimeCalculator() {
  const [count, setCount] = useState(100);
  const manualHours = getManualTime(count);
  const toolMinutes = getToolTime(count);

  return (
    <div className="mt-32 max-w-4xl mx-auto p-12 rounded-2xl bg-accent/5 border border-accent/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Clock size={120} />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <p className="text-xs font-bold text-accent uppercase tracking-widest mb-4">TIME SAVED</p>
        <h3 className="text-3xl font-bold mb-6">How much time are you wasting manually?</h3>
        <p className="text-secondary mb-12">
          Most organizers spend 3–6 hours manually handling certificates.
          <br className="hidden sm:block" />
          Including editing, exporting, checking names, attaching PDFs, and sending emails.
        </p>

        <div className="mb-4">
          <label htmlFor="cert-count-slider" className="text-sm font-medium text-secondary mb-2 block">
            Number of certificates: <span className="text-accent font-bold">{count}</span>
          </label>
          <input
            id="cert-count-slider"
            type="range"
            min="10"
            max="1000"
            step="10"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            className="custom-slider mb-12"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center bg-white/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white">
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold tracking-widest text-red-500 mb-1">Manual Method</p>
            <p className="text-2xl font-bold">
              ~
              {manualHours > 60
                ? `${Math.round(manualHours / 60)}h ${manualHours % 60}m`
                : `${manualHours}m`}
            </p>
            <p className="text-xs text-secondary mt-1 italic">
              Realistic time for editing, exporting, and attaching manually.
            </p>
          </div>
          <div className="text-left sm:border-l border-0 sm:border-border sm:pl-8">
            <p className="text-[10px] uppercase font-bold tracking-widest text-green-500 mb-1">
              MailMyCertificate
            </p>
            <p className="text-2xl font-bold">~{toolMinutes} minutes</p>
            <p className="text-xs text-green-600 font-bold mt-1">Upload → Generate → Review → Send.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
