import { ContentLayout } from '@/components/layout/ContentLayout';
import { Metadata } from 'next';
import { Github, Mail, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch for support, feedback, or to report a bug.',
};

export default function Contact() {
    return (
        <ContentLayout
            title="Get in Touch"
            subtitle="Have a question or found a bug? We are here to help."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 not-prose">
                <div className="p-10 rounded-[2.5rem] bg-accent/5 border border-accent/10 flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-accent mb-6 group-hover:rotate-6 transition-transform">
                        <Github size={32} />
                    </div>
                    <h3 className="text-xl font-black mb-2">GitHub</h3>
                    <p className="text-sm text-secondary font-medium mb-8">Best for bug reports and feature requests.</p>
                    <Link
                        href="https://github.com/akshatthakur22/MailMyCertficate/issues"
                        target="_blank"
                        className="mt-auto w-full py-4 bg-white border border-border rounded-xl text-xs font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-all"
                    >
                        Open Issue
                    </Link>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-accent/5 border border-accent/10 flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-accent mb-6 group-hover:-rotate-6 transition-transform">
                        <Twitter size={32} />
                    </div>
                    <h3 className="text-xl font-black mb-2">Twitter / X</h3>
                    <p className="text-sm text-secondary font-medium mb-8">Reach out for quick questions or shoutouts.</p>
                    <Link
                        href="https://x.com/akshatt66612958"
                        target="_blank"
                        className="mt-auto w-full py-4 bg-white border border-border rounded-xl text-xs font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-all"
                    >
                        DM on X
                    </Link>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-accent/5 border border-accent/10 flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                        <Linkedin size={32} />
                    </div>
                    <h3 className="text-xl font-black mb-2">LinkedIn</h3>
                    <p className="text-sm text-secondary font-medium mb-8">Professional inquiries and networking.</p>
                    <Link
                        href="https://www.linkedin.com/in/akshatthakur22/"
                        target="_blank"
                        className="mt-auto w-full py-4 bg-white border border-border rounded-xl text-xs font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-all"
                    >
                        Connect
                    </Link>
                </div>
            </div>

            <section className="mt-20 border-t border-border/40 pt-20">
                <h2>Direct Email</h2>
                <p>
                    For organizational partnerships or private inquiries, you can reach the author directly at:
                </p>
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-muted/50 border border-border w-fit font-mono font-bold text-accent">
                    <Mail size={18} /> akshatthakur22@gmail.com
                </div>
            </section>

            <section className="mt-20">
                <h2>Contributing</h2>
                <p>
                    MailMyCertificate is a community-driven project. If you are a developer and want to help optimize the
                    rendering engine or add new features, please check our contributing guidelines on GitHub.
                </p>
            </section>
        </ContentLayout>
    );
}
