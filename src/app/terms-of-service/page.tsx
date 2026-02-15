import { ContentLayout } from '@/components/layout/ContentLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Guidelines for using the MailMyCertificate automation tool.',
};

export default function TermsOfService() {
    return (
        <ContentLayout
            title="Terms of Service"
            subtitle="Understand your rights and responsibilities when using our free certificate tool."
        >
            <section>
                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing and using MailMyCertificate (the "Service"), you agree to comply with and be bound by these Terms of Service.
                    The Service is provided for lawful use by individuals and organizations to automate certificate generation.
                </p>
            </section>

            <section>
                <h2>2. Open Source License</h2>
                <p>
                    This project is licensed under the <strong>MIT License</strong>. You are free to fork, modify, and distribute the code
                    according to the license terms available in our GitHub repository.
                </p>
            </section>

            <section>
                <h2>3. User Responsibilities</h2>
                <p>
                    You are solely responsible for the content of the certificates you generate. You agree not to use the Service for:
                </p>
                <ul>
                    <li>Generating fraudulent certificates or documents.</li>
                    <li>Sending spam or unsolicited emails.</li>
                    <li>Generating content that violates intellectual property rights.</li>
                    <li>Automating illegal activities.</li>
                </ul>
            </section>

            <section>
                <h2>4. Limitation of Liability</h2>
                <p>
                    THE SERVICE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. In no event shall the authors or copyright holders be liable
                    for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from,
                    out of, or in connection with the software or the use or other dealings in the software.
                </p>
            </section>

            <section>
                <h2>5. High-Load Usage</h2>
                <p>
                    While we support large batches (1000+ certificates), processing is limited by your hardware. We are not responsible
                    for browser crashes or data loss resulting from exceeding your system&apos;s memory capacity.
                </p>
            </section>

            <section>
                <h2>6. Termination</h2>
                <p>
                    We reserve the right to block access to the hosted version of this tool (mailmycertificate.com) for users found to be
                    abusing the service or violating these terms.
                </p>
            </section>
        </ContentLayout>
    );
}
