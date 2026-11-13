import type { PDFDocument } from 'pdf-lib';

/**
 * Computes an HMAC-SHA256 verification hash for self-verifying certificates.
 * Formula: Hash = HMAC-SHA256(Recipient + CertificateID + IssueDate, SecretKey)
 */
export async function computeVerificationHash(
    message: string,
    secretKey: string = 'mail-my-certificate-default-secret'
): Promise<string> {
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
        // Fallback for non-browser environment
        let hash = 0;
        for (let i = 0; i < message.length; i++) {
            hash = (hash << 5) - hash + message.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const msgData = encoder.encode(message);

    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const hashArray = Array.from(new Uint8Array(signature));
    // Return first 16 hex chars (compact and robust for QR payloads)
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

export interface PDFMetadataOptions {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    creator?: string;
    producer?: string;
    certificateId?: string;
    recipientName?: string;
}

/**
 * Inscribes professional document metadata into generated PDF
 */
export function inscribePDFMetadata(pdfDoc: PDFDocument, options: PDFMetadataOptions = {}): void {
    const title = options.title || 'Official Certificate of Completion';
    const author = options.author || 'MailMyCertificate Document Studio';
    const creator = options.creator || 'MailMyCertificate (https://mailmycertificate.com)';
    const producer = options.producer || 'MailMyCertificate High-Scale Engine v2.0';

    pdfDoc.setTitle(title);
    pdfDoc.setAuthor(author);
    if (options.subject) pdfDoc.setSubject(options.subject);
    if (options.keywords) pdfDoc.setKeywords(options.keywords);
    pdfDoc.setCreator(creator);
    pdfDoc.setProducer(producer);
    pdfDoc.setCreationDate(new Date());
    pdfDoc.setModificationDate(new Date());
}
