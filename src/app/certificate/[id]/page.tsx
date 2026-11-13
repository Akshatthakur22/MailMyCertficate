import { VerificationPage } from '@/components/verification/VerificationPage';

interface CertificateVerificationRouteProps {
    params: Promise<{ id: string }>;
}

export default async function CertificateVerificationRoute({
    params,
}: CertificateVerificationRouteProps) {
    const { id } = await params;
    return <VerificationPage certificateId={id} />;
}
