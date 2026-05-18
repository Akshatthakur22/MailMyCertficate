'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/core/db/schema';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { emailService } from '@/services/emailService';
import { SendProgressTable } from '@/components/email/SendProgressTable';
import { FailedRecipientsList } from '@/components/email/FailedRecipientsList';
import { DeliveryIllustrationSection } from '@/components/email/delivery/DeliveryIllustrationSection';
import { DeliverySummary } from '@/components/email/delivery/DeliverySummary';
import { EmailPreviewCard } from '@/components/email/delivery/EmailPreviewCard';
import { DeliveryProgress } from '@/components/email/delivery/DeliveryProgress';
import { LiveActivityFeed } from '@/components/email/delivery/LiveActivityFeed';
import { DeliveryCompletionState } from '@/components/email/delivery/DeliveryCompletionState';
import { RetryPanel } from '@/components/email/delivery/RetryPanel';
import ContextRail from '@/components/layout/ContextRail';
import ComposePane from '@/components/email/redesign/ComposePane';
import LivePreviewInline from '@/components/email/redesign/LivePreviewInline';
import { Mail, LogIn, LogOut, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { EmailQueueItem } from '@/core/queue/emailQueue';

async function sendEmailWithAttachment({ recipient, subject, body, certificate }: { recipient: string; subject: string; body: string; certificate: Uint8Array | undefined }) {
  if (!certificate) throw new Error('No certificate PDF provided');

  const formData = new FormData();
  formData.append('recipient', recipient);
  formData.append('subject', subject);
  formData.append('body', body);

  const arrayBuffer = certificate.buffer instanceof ArrayBuffer ? certificate.buffer : new Uint8Array(certificate).buffer;
  const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
  formData.append('attachment', pdfBlob, 'certificate.pdf');

  const response = await fetch('/api/send-email', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to send email');
  return data;
}

interface AuthStatus {
  authenticated: boolean;
  email: string | null;
}

interface EmailRequest {
  recipient: string;
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
  const [emailForm, setEmailForm] = useState<EmailRequest>({ recipient: '', subject: 'Certificate of Completion for {{Name}}', body: 'Dear {{Name}},\n\nCongratulations on completing your course! Your certificate is attached.\n\nBest regards,\nYour Team' });
  const [recipientColumn, setRecipientColumn] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deliveryStartedAt, setDeliveryStartedAt] = useState<number | null>(null);
  const [deliveryCompletedAt, setDeliveryCompletedAt] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sendingState, setSendingState] = useState({ sending: false, processed: 0, total: 0, current: '' });
  const [sendItems, setSendItems] = useState<EmailQueueItem[]>([]);
  const [failedItems, setFailedItems] = useState<EmailQueueItem[]>([]);
  const [showReviewBeforeSend, setShowReviewBeforeSend] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const rows = await db.rows.where({ sessionId }).toArray();
      const certs = await db.certificates.where({ sessionId, status: 'completed' }).toArray();
      setCsvRows(rows);
      setCertificates(certs);
    };
    fetchData();
  }, [sessionId]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
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

  const getCertificateForRow = (rowId: number) => certificates.find((certificate) => certificate.rowId === rowId);
  const getNameForRow = (row: any) => row?.data?.Name || row?.data?.name || row?.data?.fullName || row?.data?.FullName || row?.data?.participant || row?.data?.Participant || row?.data?.email || row?.data?.Email || 'Participant';
  const buildTemplateText = (template: string, data: Record<string, any>) => template.replace(/{{(\w+)}}/g, (_, key) => String(data[key] ?? ''));

  const previewRows = csvRows.slice(0, 3);
  const currentPreviewRow = previewRows[previewIndex] || previewRows[0];
  const currentPreviewName = currentPreviewRow ? getNameForRow(currentPreviewRow) : 'First participant';
  const currentSendingRecipient = sendingState.current || sendItems.find((item) => item.status === 'pending' || item.status === 'retry')?.recipient || '';
  const sentCount = sendItems.filter((item) => item.status === 'sent').length;
  const failedCount = failedItems.length;
  const activeCount = sendItems.filter((item) => item.status === 'pending' || item.status === 'retry').length;
  const totalCount = sendItems.length || csvRows.length;
  const remainingCount = Math.max(0, totalCount - sentCount - failedCount);
  const isSending = sendingState.sending;
  const isComplete = !isSending && totalCount > 0 && sendItems.length > 0 && sendItems.every((item) => item.status === 'sent' || item.status === 'failed');
  const totalElapsed = deliveryStartedAt && deliveryCompletedAt ? formatDuration(deliveryCompletedAt - deliveryStartedAt) : totalCount > 0 ? formatDuration(totalCount * 1200) : '—';
  const estimatedRemaining = isSending ? formatDuration(Math.max(1, remainingCount) * 1200) : 'Ready';
  const currentActivityItems = sendItems.filter((item) => item.status !== 'pending').sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6);
  const previewSubject = buildTemplateText(emailForm.subject, currentPreviewRow?.data ?? {});
  const previewBody = buildTemplateText(emailForm.body, currentPreviewRow?.data ?? {});
  const currentSendingIds = currentSendingRecipient ? sendItems.filter((item) => item.recipient === currentSendingRecipient).map((item) => item.id) : [];

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

  const handleBulkSend = async () => {
    if (!recipientColumn) {
      setMessage({ type: 'error', text: 'Please select the recipient email column.' });
      return;
    }
    if (!csvRows.length) {
      setMessage({ type: 'error', text: 'No CSV data loaded.' });
      return;
    }

    const items: EmailQueueItem[] = csvRows.map((row) => ({
      id: `${sessionId}-${row.id}`,
      sessionId,
      rowId: row.id,
      recipient: row.data[recipientColumn],
      subject: buildTemplateText(emailForm.subject, row.data),
      body: buildTemplateText(emailForm.body, row.data),
      status: 'pending',
      attempts: 0,
      maxAttempts: 3,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));

    setSendItems(items);
    setFailedItems([]);
    setDeliveryCompletedAt(null);
    setShowReviewBeforeSend(true);
  };

  const confirmAndStartSend = async () => {
    setShowReviewBeforeSend(false);
    setSending(true);
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
        await sendEmailWithAttachment({ recipient: item.recipient, subject: item.subject, body: item.body, certificate: certificate?.pdf });
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
        await sendEmailWithAttachment({ recipient: item.recipient, subject: item.subject, body: item.body, certificate: certificate?.pdf });
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

  const sendAnotherBatch = () => {
    router.push('/tool');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto flex min-h-64 max-w-3xl items-center justify-center rounded-3xl border border-gray-200 bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,rgba(250,250,249,1),rgba(255,255,255,1))]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Email delivery</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Guided Delivery Studio</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              A calm, premium workflow for sending personalized certificates through Gmail.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Local processing • secure delivery
          </div>
        </div>

        {message && (
          <div className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm ${message.type === 'success' ? 'border-emerald-100 bg-emerald-50/80 text-emerald-800' : 'border-rose-100 bg-rose-50/80 text-rose-800'}`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <ContextRail
            email={authStatus.email}
            sentCount={sentCount}
            attachments={certificates.length}
            onLogin={handleLogin}
            onLogout={handleLogout}
            authenticating={authenticating}
            authenticated={authStatus.authenticated}
          />

          <main className="space-y-10">
            {!authStatus.authenticated ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Start here</p>
                    <h2 className="mt-2 text-2xl font-semibold text-gray-900">Connect Gmail to begin delivery</h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
                      Once connected, you can review personalized emails, preview attachments, and send with calm operational transparency.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                    <p className="text-sm font-medium text-gray-900">Why this is safe</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                      <li>• No participant data is uploaded for delivery.</li>
                      <li>• Your Google password is never shared.</li>
                      <li>• You can review every message before sending.</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/60 p-6 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Delivery setup</p>
                    <h2 className="mt-2 text-2xl font-semibold text-gray-900">Prepare personalized emails</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-600">Write once, personalize automatically, then review before delivery.</p>
                  </div>
                  <div className="text-sm text-gray-500">{csvRows.length} recipients • {certificates.length} attachments ready</div>
                </div>

                <div className="mt-8">
                  <ComposePane
                    csvHeaders={csvHeaders}
                    recipientColumn={recipientColumn}
                    setRecipientColumn={setRecipientColumn}
                    emailForm={emailForm}
                    setEmailForm={setEmailForm}
                    previewRows={previewRows}
                    previewIndex={previewIndex}
                    setPreviewIndex={setPreviewIndex}
                    onReview={handleBulkSend}
                    sending={sending}
                  />

                  <div className="mt-6">
                    <LivePreviewInline subject={previewSubject} body={previewBody} previewRecipient={currentPreviewName} attachmentCount={certificates.length} />
                  </div>

                  <div className="mt-6 text-sm text-gray-600">
                    Your template never leaves your browser. Use tokens like <span className="font-medium text-gray-900">{'{{Name}}'}</span>, <span className="font-medium text-gray-900">{'{{Event}}'}</span>, and <span className="font-medium text-gray-900">{'{{College}}'}</span> to personalize the batch.
                  </div>
                </div>
              </div>
            )}

            {showReviewBeforeSend && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Pre-send review</p>
                    <h2 className="mt-2 text-2xl font-semibold text-gray-900">Review delivery before it starts</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-600">This is the last calm checkpoint before Gmail delivery begins.</p>
                  </div>
                  <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">Please keep this tab open during delivery</div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Account</div>
                    <div className="mt-2 text-sm font-medium text-gray-900">{authStatus.email}</div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Recipients</div>
                    <div className="mt-2 text-sm font-medium text-gray-900">{sendItems.length}</div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Attachments</div>
                    <div className="mt-2 text-sm font-medium text-gray-900">{sendItems.length} certificates</div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Estimated duration</div>
                    <div className="mt-2 text-sm font-medium text-gray-900">~{Math.max(1, Math.ceil(sendItems.length * 1.2 / 60))} min</div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-emerald-800">
                  Everything is processed locally inside your browser. Your Gmail password is never shared with MailMyCertificate.
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button variant="secondary" onClick={() => setShowReviewBeforeSend(false)}>
                    Go back
                  </Button>
                  <Button onClick={confirmAndStartSend} className="inline-flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    Start delivery
                  </Button>
                </div>
              </div>
            )}

            {(isSending || isComplete || failedCount > 0) && (
              <div className="space-y-6">
                {(isSending || isComplete) && (
                  <DeliveryProgress
                    sent={sentCount}
                    total={totalCount}
                    currentRecipient={currentSendingRecipient}
                    estimatedRemaining={isSending ? estimatedRemaining : totalElapsed}
                    active={isSending}
                  />
                )}

                {(isSending || currentActivityItems.length > 0 || failedCount > 0 || isComplete) && (
                  <LiveActivityFeed items={sendItems} currentSendingIds={currentSendingIds} />
                )}

                {isComplete && (
                  <DeliveryCompletionState
                    delivered={sentCount}
                    failed={failedCount}
                    totalTime={totalElapsed}
                    onDownloadReport={downloadDeliveryReport}
                    onSendAnotherBatch={sendAnotherBatch}
                  />
                )}

                {failedCount > 0 && <RetryPanel failedCount={failedCount} onRetryFailed={retryFailedItems} onDownloadFailed={downloadFailureReport} />}

                {(isSending || currentActivityItems.length > 0 || failedCount > 0) && (
                  <details open={detailsOpen} onToggle={(event) => setDetailsOpen(event.currentTarget.open)} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <summary className="cursor-pointer list-none text-sm font-medium text-gray-900 outline-none">
                      View detailed delivery logs
                      <span className="ml-2 text-xs font-normal text-gray-500">Optional, secondary detail</span>
                    </summary>
                    <div className="mt-5 space-y-5">
                      <SendProgressTable items={sendItems} currentSendingIds={currentSendingIds} />
                      {failedCount > 0 && <FailedRecipientsList failedItems={failedItems} onRetryFailed={retryFailedItems} onRetrySingle={retryFailedItems as any} isRetrying={isSending} />}
                    </div>
                  </details>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
