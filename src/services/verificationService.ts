export interface VerificationRegistration {
    clientKey: string;
    recipientName?: string;
    certificateTitle: string;
    issuedAt: string;
}

export interface VerificationRecord {
    certificate_id: string;
    recipient_name: string | null;
    certificate_title: string;
    issued_at: string;
    issuer: string;
    pdf_hash: string | null;
    status: 'valid' | 'revoked';
    revoked_at?: number | null;
}

interface RegistrationResponse {
    certificates: Array<VerificationRecord & { client_key: string }>;
}

export async function registerCertificates(
    certificates: VerificationRegistration[],
): Promise<Record<string, string>> {
    const response = await fetch('/api/verification/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            certificates: certificates.map((certificate) => ({
                client_key: certificate.clientKey,
                recipient_name: certificate.recipientName || '',
                certificate_title: certificate.certificateTitle,
                issued_at: certificate.issuedAt,
            })),
        }),
    });

    if (!response.ok) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error || 'Could not register certificates for verification.');
    }

    const payload = await response.json() as RegistrationResponse;
    return Object.fromEntries(
        payload.certificates.map((certificate) => [certificate.client_key, certificate.certificate_id]),
    );
}

export async function getVerificationCertificate(id: string): Promise<VerificationRecord> {
    const response = await fetch(`/api/verification/certificates/${encodeURIComponent(id)}`);
    if (!response.ok) {
        throw new Error('Certificate not found.');
    }
    const payload = await response.json() as { certificate: VerificationRecord };
    return payload.certificate;
}
