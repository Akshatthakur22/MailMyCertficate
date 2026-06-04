'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/core/db/schema';
import { useAppStore } from '@/store/useAppStore';
import { emailService, updateCsrfToken } from '@/services/emailService';
import { ConnectGmailPanel } from '@/components/email/redesign/ConnectGmailPanel';
import { GmailComposer } from '@/components/email/redesign/GmailComposer';
import { SendReadinessPanel } from '@/components/email/redesign/SendReadinessPanel';
import { SendingTracker } from '@/components/email/redesign/SendingTracker';
import { CompletionPanel } from '@/components/email/redesign/CompletionPanel';
import { RefreshGuardBanner } from '@/components/email/redesign/RefreshGuardBanner';
import { ManageLocalDataMenu } from '@/components/session/ManageLocalDataMenu';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { EmailQueueItem } from '@/core/queue/emailQueue';
import {
  buildTemplateText,
  detectEmailColumn,
  detectNameColumn,
  getDisplayName,
  isValidEmail,
  resolveRecipientEmail,
  summarizeRecipientValidation,
} from '@/utils/recipientColumn';
import {
  persistEmailQueueItems,
  startNewBatch,
  touchActivity,
  updateSession,
} from '@/core/session/sessionManager';

interface AuthStatus {
  authenticated: boolean;
  email: string | null;
}

interface EmailFormState {
  subject: string;
  body: string;
}

export default function EmailView() {
  const router = useRouter();
  const sessionId = useAppStore((state) => state.sessionId);
  const csvHeaders = useAppStore((state) => state.csvHeaders);

  const [csvRows, setCsvRows] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ authenticated: false, email: null });
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailForm, setEmailForm] = useState<EmailFormState>({
    subject: 'Certificate of Completion for {{name}}',
    body: 'Dear {{name}},\n\nCongratulations on completing your course! Your certificate is attached.\n\nBest regards,\nYour Team',
  });
  const [emailColumnOverride, setEmailColumnOverride] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [deliveryStartedAt, setDeliveryStartedAt] = useState<number | null>(null);
  const [deliveryCompletedAt, setDeliveryCompletedAt] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sendingState, setSendingState] = useState({ sending: false, processed: 0, total: 0, current: '' });
  const [sendItems, setSendItems] = useState<EmailQueueItem[]>([]);
  const [failedItems, setFailedItems] = useState<EmailQueueItem[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [keepSession, setKeepSession] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const rows = await db.rows.where({ sessionId }).toArray();
      const certs = await db.certificates.where({ sessionId, status: 'completed' }).toArray();
      setCsvRows(rows);
      setCertificates(certs);
      await touchActivity(sessionId);
      await updateSession(sessionId, { workflowStage: 'EMAIL_SETUP' });
    };
    fetchData();
  }, [sessionId]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const csrfFromOAuth = urlParams.get('csrf_token');
    if (csrfFromOAuth) {
      updateCsrfToken(csrfFromOAuth);
      localStorage.setItem('csrf_token', csrfFromOAuth);
    }
    if (urlParams.get('auth_success') === 'true') {
      window.history.replaceState({}, document.title, window.location.pathname);
      checkAuthStatus();
      setMessage({ type: 'success', text: 'Your Gmail account is securely connected.' });
    } else if (urlParams.get('error')) {
      const error = urlParams.get('error');
      window.history.replaceState({}, document.title, window.location.pathname);
      setMessage({ type: 'error', text: `Authentication failed: ${error}` });
    }
  }, []);

  // Guard against accidental refresh / tab close while a send is in progress.
  useEffect(() => {
    if (!sending) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [sending]);

  const formatDuration = (ms: number) => {
    const seconds = Math.max(0, Math.round(ms / 1000));
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
  };

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadDeliveryReport = () => {
    const rows = ['recipient,status,updated_at,error'];
    for (const item of sendItems) {
      rows.push([JSON.stringify(item.recipient), JSON.stringify(item.status), JSON.stringify(new Date(item.updatedAt).toLocaleString()), JSON.stringify(item.error || '')].join(','));
    }
    downloadTextFile(`delivery_report_${sessionId}.csv`, rows.join('\n'));
  };

  const downloadFailureReport = () => {
    const rows = ['recipient,subject,error,error_type,attempts'];
    for (const item of failedItems) {
      rows.push([JSON.stringify(item.recipient), JSON.stringify(item.subject), JSON.stringify(item.error || ''), JSON.stringify(item.errorType || ''), JSON.stringify(item.attempts)].join(','));
    }
    downloadTextFile(`failed_recipients_${sessionId}.csv`, rows.join('\n'));
  };

  const rowDataList = useMemo(
    () => csvRows.map((row) => (row.data ?? {}) as Record<string, unknown>),
    [csvRows]
  );

  const emailDetection = useMemo(
    () => detectEmailColumn(csvHeaders, rowDataList),
    [csvHeaders, rowDataList]
  );

  const nameColumn = useMemo(() => detectNameColumn(csvHeaders), [csvHeaders]);

  const emailColumn = emailColumnOverride ?? emailDetection.column;

  const recipientValidation = useMemo(() => {
    if (!emailColumn) return { valid: 0, invalid: 0, invalidExamples: [] as string[] };
    return summarizeRecipientValidation(rowDataList, emailColumn);
  }, [emailColumn, rowDataList]);

  const templateTokens = useMemo(
    () => csvHeaders.map((header) => `{{${header}}}`),
    [csvHeaders]
  );

  const sampleRecipients = useMemo(() => {
    if (!emailColumn) return [] as { name: string; email: string }[];
    const out: { name: string; email: string }[] = [];
    for (const row of csvRows) {
      const data = (row.data ?? {}) as Record<string, unknown>;
      const email = resolveRecipientEmail(data, emailColumn);
      if (!isValidEmail(email)) continue;
      out.push({ name: getDisplayName(data, nameColumn), email });
      if (out.length >= 2) break;
    }
    return out;
  }, [csvRows, emailColumn, nameColumn]);

  const getCertificateForRow = (rowId: number) => certificates.find((certificate) => certificate.rowId === rowId);

  const getPreviewLabel = (row: { data?: Record<string, unknown> }) => {
    if (!row.data) return 'Participant';
    return getDisplayName(row.data, nameColumn);
  };

  const previewRows = csvRows.slice(0, 3);
  const currentPreviewRow = previewRows[previewIndex] || previewRows[0];
  const currentPreviewData = (currentPreviewRow?.data ?? {}) as Record<string, unknown>;
  const currentPreviewName = currentPreviewRow ? getDisplayName(currentPreviewData, nameColumn) : 'First participant';
  const currentPreviewEmail = emailColumn ? resolveRecipientEmail(currentPreviewData, emailColumn) : '';
  const currentSendingRecipient = sendingState.current || sendItems.find((item) => item.status === 'pending' || item.status === 'retry')?.recipient || '';
  const sentCount = sendItems.filter((item) => item.status === 'sent').length;
  const failedCount = failedItems.length;
  const totalCount = sendItems.length || csvRows.length;
  const remainingCount = Math.max(0, totalCount - sentCount - failedCount);
  const isSending = sendingState.sending;
  const isComplete = !isSending && totalCount > 0 && sendItems.length > 0 && sendItems.every((item) => item.status === 'sent' || item.status === 'failed');
  const totalElapsed = deliveryStartedAt && deliveryCompletedAt ? formatDuration(deliveryCompletedAt - deliveryStartedAt) : '—';
  const estimatedRemaining = isSending ? formatDuration(Math.max(1, remainingCount) * 1200) : 'Ready';
  const previewSubject = buildTemplateText(emailForm.subject, currentPreviewData);
  const previewBody = buildTemplateText(emailForm.body, currentPreviewData);
  const currentSendingIds = currentSendingRecipient ? sendItems.filter((item) => item.recipient === currentSendingRecipient).map((item) => item.id) : [];

  const validRecipients = recipientValidation.valid;
  const estimatedMinutes = Math.max(1, Math.ceil((validRecipients * 1.2) / 60));
  const canSend = Boolean(emailColumn) && validRecipients > 0;

  const checkAuthStatus = async () => {
    try {
      const status = await emailService.getStatus();
      setAuthStatus(status);
    } catch {
      setMessage({ type: 'error', text: 'Failed to check authentication status' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setAuthenticating(true);
    try {
      const loginData = await emailService.login();
      window.location.href = loginData.authorization_url;
    } catch {
      setMessage({ type: 'error', text: 'Failed to initiate login' });
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await emailService.logout();
      setAuthStatus({ authenticated: false, email: null });
      setMessage({ type: 'success', text: 'Disconnected securely.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to logout' });
    }
  };

  const prepareSend = () => {
    if (!emailColumn) {
      setMessage({
        type: 'error',
        text: 'Could not find an email column in your participant data. Add a column with valid email addresses.',
      });
      return;
    }
    if (!csvRows.length) {
      setMessage({ type: 'error', text: 'No CSV data loaded.' });
      return;
    }
    if (recipientValidation.valid === 0) {
      setMessage({ type: 'error', text: 'None of your rows have a valid email address in the detected column.' });
      return;
    }

    const items: EmailQueueItem[] = [];
    for (const row of csvRows) {
      const data = (row.data ?? {}) as Record<string, unknown>;
      const recipient = resolveRecipientEmail(data, emailColumn);
      if (!isValidEmail(recipient)) continue;

      items.push({
        id: `${sessionId}-${row.id}`,
        sessionId,
        rowId: row.id,
        recipient,
        displayName: getDisplayName(data, nameColumn),
        subject: buildTemplateText(emailForm.subject, data),
        body: buildTemplateText(emailForm.body, data),
        status: 'pending',
        attempts: 0,
        maxAttempts: 3,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    setSendItems(items);
    setFailedItems([]);
    setDeliveryCompletedAt(null);
    setMessage(null);
    setConfirming(true);
  };

  const confirmAndStartSend = async () => {
    setConfirming(false);
    setSending(true);
    setKeepSession(false);
    await updateSession(sessionId, { workflowStage: 'SENDING' });
    setDeliveryStartedAt(Date.now());
    setDeliveryCompletedAt(null);
    setSendingState({ sending: true, processed: 0, total: sendItems.length, current: '' });

    const updatedItems: EmailQueueItem[] = [];
    const failed: EmailQueueItem[] = [];

    for (let index = 0; index < sendItems.length; index++) {
      const item = sendItems[index];
      setSendingState((previous) => ({ ...previous, processed: index, current: item.recipient }));

      try {
        const certificate = getCertificateForRow(item.rowId);
        if (!certificate?.pdf) throw new Error('No certificate PDF found for this recipient');
        await emailService.sendEmailWithAttachment({
          recipient: item.recipient,
          subject: item.subject,
          body: item.body,
          certificate: certificate.pdf,
        });
        const sentItem: EmailQueueItem = { ...item, status: 'sent', updatedAt: Date.now(), sentAt: Date.now() };
        updatedItems.push(sentItem);
      } catch (error: any) {
        const failItem: EmailQueueItem = { ...item, status: 'failed', updatedAt: Date.now(), error: error?.message || String(error) };
        updatedItems.push(failItem);
        failed.push(failItem);
      }

      setSendItems((previous) => {
        const copy = [...previous];
        copy[index] = updatedItems[index];
        return copy;
      });
      setFailedItems([...failed]);
    }

    setSending(false);
    setSendingState({ sending: false, processed: sendItems.length, total: sendItems.length, current: '' });
    setDeliveryCompletedAt(Date.now());
    await persistEmailQueueItems(updatedItems);
    await updateSession(sessionId, {
      workflowStage: 'COMPLETED',
      emailStatus: failed.length === 0 ? 'complete' : 'partial',
    });
    await touchActivity(sessionId);
    setMessage({ type: 'success', text: `Processing complete. ${sendItems.length - failed.length} sent, ${failed.length} failed.` });
  };

  const retryFailedItems = async () => {
    if (!failedItems.length) return;

    setMessage(null);
    setSending(true);
    setDeliveryStartedAt(deliveryStartedAt ?? Date.now());
    setSendingState({ sending: true, processed: sentCount, total: totalCount, current: failedItems[0]?.recipient || '' });

    const retriedItems: EmailQueueItem[] = [];
    for (const item of failedItems) {
      try {
        const certificate = getCertificateForRow(item.rowId);
        if (!certificate?.pdf) throw new Error('No certificate PDF found for this recipient');
        await emailService.sendEmailWithAttachment({
          recipient: item.recipient,
          subject: item.subject,
          body: item.body,
          certificate: certificate.pdf,
        });
        retriedItems.push({ ...item, status: 'sent', updatedAt: Date.now(), sentAt: Date.now() });
      } catch (error: any) {
        retriedItems.push({ ...item, status: 'failed', updatedAt: Date.now(), error: error?.message || String(error) });
      }
    }

    const nextFailed = retriedItems.filter((item) => item.status === 'failed');
    setSendItems((previous) => previous.map((item) => retriedItems.find((retryItem) => retryItem.id === item.id) ?? item));
    setFailedItems(nextFailed);
    setSending(false);
    setSendingState({ sending: false, processed: sentCount + retriedItems.filter((item) => item.status === 'sent').length, total: totalCount, current: '' });

    if (nextFailed.length === 0) {
      setDeliveryCompletedAt(Date.now());
    }
  };

  const handleStartNewBatch = async () => {
    await startNewBatch();
    router.push('/tool');
  };

  const handleKeepSession = async () => {
    setKeepSession(true);
    await updateSession(sessionId, { keepSessionAfterEmail: true });
    await touchActivity(sessionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-6 py-16">
        <div className="mx-auto flex min-h-64 max-w-3xl items-center justify-center rounded-2xl border border-border bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      </div>
    );
  }

  const phase: 'connect' | 'sending' | 'complete' | 'compose' = !authStatus.authenticated
    ? 'connect'
    : isSending
      ? 'sending'
      : isComplete
        ? 'complete'
        : 'compose';

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex flex-col gap-3 py-3 max-w-6xl items-start justify-between px-4 sm:h-14 sm:flex-row sm:items-center sm:px-6 lg:px-8 sm:py-0">
          <Link href="/" className="brand-text hover:opacity-80 transition-opacity">
            <span>Mail</span><span>My</span><span>Certificate</span>
          </Link>
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
            <ManageLocalDataMenu variant="header" />
            <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium">
              <span className={`h-2 w-2 rounded-full ${authStatus.authenticated ? 'bg-green-500' : 'bg-gray-300'}`} />
              {authStatus.authenticated ? (
                <span className="max-w-[160px] truncate text-foreground">{authStatus.email}</span>
              ) : (
                <span className="text-secondary">Gmail not connected</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Send certificates by email</h1>
          <p className="mt-1 text-sm text-secondary">
            {phase === 'sending'
              ? 'Delivery is running — keep this tab open.'
              : phase === 'complete'
                ? 'Your delivery is finished.'
                : 'Write your message, review the recipients, and send personalized certificates through Gmail.'}
          </p>
        </div>

        {message && (
          <div
            className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {phase === 'connect' && (
          <ConnectGmailPanel
            recipientCount={validRecipients || csvRows.length}
            certificateCount={certificates.length}
            authenticating={authenticating}
            onLogin={handleLogin}
          />
        )}

        {phase === 'compose' && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[auto_1fr] lg:items-stretch">
            <div className="min-w-0 lg:col-span-2 lg:col-start-1 lg:row-start-1">
              <RefreshGuardBanner active={false} />
            </div>
            <div className="min-w-0 lg:col-start-1 lg:row-start-2">
              <GmailComposer
                fromEmail={authStatus.email}
                emailColumn={emailDetection.column}
                nameColumn={nameColumn}
                recipientCount={validRecipients}
                validation={recipientValidation}
                ambiguousColumns={emailDetection.ambiguousColumns}
                selectedColumn={emailColumn}
                onSelectColumn={setEmailColumnOverride}
                emailForm={emailForm}
                setEmailForm={setEmailForm}
                templateTokens={templateTokens.length > 0 ? templateTokens.slice(0, 8) : ['{{name}}', '{{email}}']}
                attachmentCount={certificates.length}
                previewRows={previewRows}
                previewIndex={previewIndex}
                setPreviewIndex={setPreviewIndex}
                getPreviewLabel={getPreviewLabel}
                previewSubject={previewSubject}
                previewBody={previewBody}
                previewName={currentPreviewName}
                previewEmail={currentPreviewEmail}
              />
            </div>
            <div className="flex min-h-0 min-w-0 flex-col lg:col-start-2 lg:row-start-2 lg:sticky lg:top-[4.25rem] lg:self-stretch">
              <SendReadinessPanel
                  email={authStatus.email}
                  validRecipients={validRecipients}
                  totalRows={csvRows.length}
                  invalidRecipients={recipientValidation.invalid}
                  certificateCount={certificates.length}
                  sampleRecipients={sampleRecipients}
                  canSend={canSend}
                  estimatedMinutes={estimatedMinutes}
                  confirming={confirming}
                  onLogout={handleLogout}
                  onRequestSend={prepareSend}
                  onConfirmSend={confirmAndStartSend}
                  onCancelConfirm={() => setConfirming(false)}
                />
            </div>
          </div>
        )}

        {phase === 'sending' && (
          <div className="space-y-5">
            <RefreshGuardBanner active />
            <SendingTracker
              sent={sentCount}
              failed={failedCount}
              remaining={remainingCount}
              total={totalCount}
              currentRecipient={currentSendingRecipient}
              estimatedRemaining={estimatedRemaining}
              items={sendItems}
              currentSendingIds={currentSendingIds}
            />
          </div>
        )}

        {phase === 'complete' && (
          <CompletionPanel
            sent={sentCount}
            failed={failedCount}
            total={totalCount}
            totalTime={totalElapsed}
            failedItems={failedItems}
            isRetrying={isSending}
            onRetryFailed={retryFailedItems}
            onDownloadReport={downloadDeliveryReport}
            onDownloadFailed={downloadFailureReport}
            onSendAnother={() => router.push('/tool')}
            onStartNewBatch={handleStartNewBatch}
            onKeepSession={handleKeepSession}
            showAutoCleanup={failedCount === 0 && !keepSession}
          />
        )}
      </div>
    </div>
  );
}
