'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { getVerificationCertificate, type VerificationRecord } from '@/services/verificationService';

interface VerificationPageProps {
    certificateId: string;
}

export function VerificationPage({ certificateId }: VerificationPageProps) {
    const [certificate, setCertificate] = useState<VerificationRecord | null>(null);
    const [status, setStatus] = useState<'loading' | 'valid' | 'revoked' | 'missing'>('loading');

    useEffect(() => {
        let active = true;
        getVerificationCertificate(certificateId)
            .then((record) => {
                if (!active) return;
                setCertificate(record);
                setStatus(record.status === 'valid' ? 'valid' : 'revoked');
            })
            .catch(() => {
                if (active) setStatus('missing');
            });

        return () => {
            active = false;
        };
    }, [certificateId]);

    return (
        <main className="min-h-screen bg-[#fafafa] px-4 py-10 text-foreground sm:py-16">
            <div className="mx-auto w-full max-w-xl">
                <div className="mb-8 text-center">
                    <p className="text-sm font-bold tracking-tight">
                        <span className="text-foreground">Mail</span>
                        <span className="text-accent">My</span>
                        <span className="text-foreground">Certificate</span>
                    </p>
                    <p className="mt-2 text-xs text-secondary">Public certificate verification</p>
                </div>

                <section className="rounded-2xl border border-border/70 bg-white p-6 shadow-sm sm:p-8">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center py-10 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-accent" />
                            <p className="mt-4 text-sm text-secondary">Checking certificate...</p>
                        </div>
                    )}

                    {status === 'valid' && certificate && (
                        <>
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                                    <CheckCircle2 className="h-9 w-9" />
                                </div>
                                <h1 className="mt-6 text-2xl font-bold tracking-tight">Certificate verified</h1>
                                <p className="mt-2 text-sm leading-relaxed text-secondary">
                                    This certificate was registered with MailMyCertificate.
                                </p>
                            </div>
                            <VerificationDetails certificate={certificate} />
                        </>
                    )}

                    {status === 'revoked' && certificate && (
                        <>
                            <VerificationState
                                icon={<XCircle className="h-9 w-9" />}
                                title="Certificate revoked"
                                message="This certificate was registered, but it is no longer marked as valid."
                            />
                            <VerificationDetails certificate={certificate} />
                        </>
                    )}

                    {status === 'missing' && (
                        <VerificationState
                            icon={<XCircle className="h-9 w-9" />}
                            title="Certificate not found"
                            message="We could not find a certificate with this verification ID. Check that the QR code or link is correct."
                        />
                    )}
                </section>

                <p className="mt-6 text-center text-[11px] leading-relaxed text-secondary">
                    Verification confirms that the certificate details were registered by MailMyCertificate.
                    It does not replace the issuer&apos;s own records.
                </p>
            </div>
        </main>
    );
}

function VerificationDetails({ certificate }: { certificate: VerificationRecord }) {
    return (
        <div className="mt-8 divide-y divide-border/60 rounded-xl border border-border/70 bg-muted/20">
            <Detail label="Recipient" value={certificate.recipient_name || 'Not shared'} />
            <Detail label="Certificate" value={certificate.certificate_title} />
            <Detail label="Issued" value={certificate.issued_at} />
            <Detail label="Certificate ID" value={certificate.certificate_id} mono />
            <div className="flex items-center gap-2 px-4 py-3 text-xs text-emerald-700">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Registered by {certificate.issuer}
            </div>
        </div>
    );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <span className="text-secondary">{label}</span>
            <span className={`text-right font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
        </div>
    );
}

function VerificationState({
    icon,
    title,
    message,
}: {
    icon: ReactNode;
    title: string;
    message: string;
}) {
    return (
        <div className="flex flex-col items-center py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/60">
                {icon}
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-secondary">{message}</p>
        </div>
    );
}
