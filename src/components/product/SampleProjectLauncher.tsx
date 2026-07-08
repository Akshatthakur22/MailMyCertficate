'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db, type CSVRowData } from '@/core/db/schema';
import { useAppStore } from '@/store/useAppStore';
import { createSession, touchActivity, updateSession } from '@/core/session/sessionManager';

const SAMPLE_ROWS = [
  { name: 'Aarav Mehta', email: 'aarav@example.com', event: 'Open Source Sprint', role: 'Participant' },
  { name: 'Maya Kapoor', email: 'maya@example.com', event: 'Open Source Sprint', role: 'Mentor' },
  { name: 'Sam Rivera', email: 'sam@example.com', event: 'Open Source Sprint', role: 'Finalist' },
];

function makeSessionId() {
  return Math.random().toString(36).substring(2, 11);
}

async function createSampleTemplate(): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> {
  const width = 2400;
  const height = 1600;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create sample template.');

  // Blank certificate with only static design elements — NO placeholder fields
  ctx.fillStyle = '#fbfcff';
  ctx.fillRect(0, 0, width, height);

  // Outer border
  ctx.strokeStyle = '#1f4ed8';
  ctx.lineWidth = 18;
  ctx.strokeRect(90, 90, width - 180, height - 180);

  // Inner decorative border
  ctx.strokeStyle = '#dbe4ff';
  ctx.lineWidth = 4;
  ctx.strokeRect(140, 140, width - 280, height - 280);

  // Title only — static
  ctx.fillStyle = '#1f4ed8';
  ctx.font = '600 54px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Certificate of Achievement', width / 2, 320);

  // Decorative line
  ctx.strokeStyle = '#1f4ed8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 4, 380);
  ctx.lineTo((width * 3) / 4, 380);
  ctx.stroke();

  // Static label: "Presented to"
  ctx.fillStyle = '#6b7280';
  ctx.font = '400 42px Arial';
  ctx.fillText('Presented to', width / 2, 700);

  // Placeholder area for name (empty space where user will add field)
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(300, 800, width - 600, 120);
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  ctx.strokeRect(300, 800, width - 600, 120);

  // Static label: "in recognition of"
  ctx.fillStyle = '#6b7280';
  ctx.font = '400 42px Arial';
  ctx.fillText('in recognition of', width / 2, 1050);

  // Placeholder area for event/role (empty space where user will add fields)
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(300, 1100, width - 600, 100);
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  ctx.strokeRect(300, 1100, width - 600, 100);

  // Footer: Date and signature areas (static)
  ctx.fillStyle = '#9ca3af';
  ctx.font = '400 32px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Date: _______________', 280, 1400);
  ctx.textAlign = 'right';
  ctx.fillText('_______________ Signature', width - 280, 1400);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((nextBlob) => {
      if (nextBlob) resolve(nextBlob);
      else reject(new Error('Could not export sample template.'));
    }, 'image/png');
  });

  return { blob, dataUrl: canvas.toDataURL('image/png'), width, height };
}

export function SampleProjectLauncher({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const launch = async () => {
    setLoading(true);
    try {
      const sessionId = makeSessionId();
      const template = await createSampleTemplate();

      await createSession(sessionId, {
        templateDimensions: { width: template.width, height: template.height },
        currentStep: 3,
        workflowStage: 'UPLOAD',
      });
      await db.files.put({ id: `${sessionId}-template`, sessionId, type: 'template', blob: template.blob });
      const rowRecords: Array<Omit<CSVRowData, 'id'>> = SAMPLE_ROWS.map((row) => ({ sessionId, data: row }));
      await db.rows.bulkAdd(rowRecords as unknown as CSVRowData[]);
      await updateSession(sessionId, { templateDimensions: { width: template.width, height: template.height }, currentStep: 3 });
      await touchActivity(sessionId);

      // Start with NO fields — let user add them themselves as an interactive tutorial
      useAppStore.setState({
        sessionId,
        template: template.dataUrl,
        templateDimensions: { width: template.width, height: template.height },
        csvHeaders: ['name', 'email', 'event', 'role'],
        csvData: SAMPLE_ROWS,
        fields: [], // Empty — user will add fields by clicking them
        currentStep: 3,
        errorState: null,
      });

      router.push('/tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={launch} disabled={loading} variant="outline" size="lg" className={`gap-2 ${className}`}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-5 w-5" />}
      Try sample project
    </Button>
  );
}
