'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { type EmailPayload } from '@/services/emailService';
import { Button } from '@/components/ui/Button';
import { Mail, CheckCircle, ArrowLeft, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function EmailView() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emailAuth, setEmailAuth] = useState('');
    const [passwordAuth, setPasswordAuth] = useState('');

    // App State
    const csvData = useAppStore((state) => state.csvData);
    const template = useAppStore((state) => state.template);
    const fields = useAppStore((state) => state.fields);

    // Form State
    const [subject, setSubject] = useState('Your Certificate is Here!');
    const [body, setBody] = useState(`Hi {{Name}},\n\nCongratulations on completing the event/course!\n\nPlease find your certificate attached.\n\nBest regards,\nMailMyCertificate Team`);

    const [isSending, setIsSending] = useState(false);
    const [sentSuccess, setSentSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login check
        if (emailAuth && passwordAuth) {
            setIsLoggedIn(true);
        }
    };

    const handleSend = async () => {
        if (!csvData.length || !template) {
            setError("No certificate data found. Please generate certificates first.");
            return;
        }

        setIsSending(true);
        setError(null);

        try {
            // Construct payload
            const recipientEmails = csvData.map(row => row['Email'] || row['email']).filter(Boolean);

            if (recipientEmails.length === 0) {
                throw new Error("No 'Email' column found in CSV data.");
            }

            const payload: EmailPayload = {
                recipients: recipientEmails,
                subject,
                body,
                template: template,
                fields,
                csvData: csvData, // Passing all data so backend can personalize body/subject
            };

            // Simulate API call for frontend mockup if backend not ready
            console.log("Sending Payload:", payload);
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSentSuccess(true);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to send emails.");
            } else {
                setError("Failed to send emails.");
            }
        } finally {
            setIsSending(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-full max-w-md p-8 border border-border rounded-xl shadow-sm bg-white">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock size={24} />
                        </div>
                        <h2 className="text-2xl font-bold">Sign in to Send</h2>
                        <p className="text-secondary mt-2">Please authenticate to access email services.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2 border border-border rounded-md input-field"
                                value={emailAuth}
                                onChange={(e) => setEmailAuth(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-border rounded-md input-field"
                                value={passwordAuth}
                                onChange={(e) => setPasswordAuth(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">Sign In</Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/tool" className="text-sm text-secondary hover:underline flex items-center justify-center gap-1">
                            <ArrowLeft size={14} /> Back to Generator
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (sentSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center max-w-lg p-8">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Emails Sent Successfully!</h2>
                    <p className="text-secondary text-lg mb-8">
                        Your certificates are on their way to {csvData.length} recipients.
                    </p>
                    <Button asChild size="lg">
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            <header className="border-b border-border py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container-width flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        MailMyCertificate <span className="text-secondary font-normal text-sm ml-2">Email Composer</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/tool">Cancel</Link>
                    </Button>
                </div>
            </header>

            <main className="container-width py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <Breadcrumbs items={[
                            { label: 'Tool', href: '/tool' },
                            { label: 'Generate' }, // Static label
                            { label: 'Email', isCurrent: true }
                        ]} />
                    </div>

                    <div className="flex items-center gap-2 mb-8 bg-blue-50 text-blue-800 px-4 py-3 rounded-md border border-blue-100">
                        <Mail size={18} />
                        <span className="font-medium">Ready to send {csvData.length} emails.</span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block font-semibold mb-2">Subject Line</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full text-lg font-medium border-b border-border py-2 focus:outline-hidden focus:border-accent transition-colors bg-transparent"
                                placeholder="Enter email subject..."
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">Email Body</label>
                            <div className="border border-border rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="w-full h-64 p-4 resize-none focus:outline-hidden"
                                    placeholder="Write your message here. Use {{ColumnName}} for dynamic fields."
                                />
                                <div className="bg-secondary/5 px-4 py-2 text-xs text-secondary border-t border-border flex justify-between">
                                    <span>Supported variables: {Object.keys(csvData[0] || {}).map(k => `{{${k}}}`).join(', ')}</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 bg-red-50 p-4 rounded-md border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <Button size="lg" onClick={handleSend} disabled={isSending}>
                                {isSending ? (
                                    <>
                                        <Loader2 className="mr-2 animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>Send Emails <ArrowLeft className="ml-2 rotate-180" /></>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
