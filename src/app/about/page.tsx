import { ContentLayout } from '@/components/layout/ContentLayout';
import { Metadata } from 'next';
import Link from 'next/link';
import { Zap, Shield, Github, Cpu } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About MailMyCertificate',
    description: 'Learn why we built the fastest, most private bulk certificate generator on the web.',
};

export default function About() {
    return (
        <ContentLayout
            title="About the Project"
            subtitle="The story of how an engineering frustration became a tool for thousands of organizers."
        >
            <section>
                <h2>The Problem</h2>
                <p>
                    Bulk certificate generation is usually a painful process. Most tools are either:
                </p>
                <ul>
                    <li><strong>Too manual:</strong> Editing templates one-by-one in Canva.</li>
                    <li><strong>Too expensive:</strong> Charging per-certificate fees for a "SaaS" that is essentially just a mail-merge.</li>
                    <li><strong>Too intrusive:</strong> Forcing you to upload your sensitive participant lists to mysterious servers.</li>
                </ul>
            </section>

            <section>
                <h2>The Local Workstation Solution</h2>
                <p>
                    We built <strong>MailMyCertificate</strong> with a different philosophy. We believe that simple utility tools
                    should be free, fast, and entirely private.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose my-12">
                    <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10">
                        <Cpu className="text-accent mb-4" />
                        <h3 className="font-black text-lg mb-2">Edge Computation</h3>
                        <p className="text-sm text-secondary font-medium">We use Web Workers to process PDFs on your local machine, utilizing your own hardware for maximum speed.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10">
                        <Shield className="text-accent mb-4" />
                        <h3 className="font-black text-lg mb-2">Zero-Server Data</h3>
                        <p className="text-sm text-secondary font-medium">Your data never touches our cloud. We use IndexedDB to cache your session only in your browser tab.</p>
                    </div>
                </div>
            </section>

            <section>
                <h2>Engineered for Organizers</h2>
                <p>
                    Whether you are running a small local workshop or a 2000-person international hackathon, our goal is to
                    give you the power of a dedicated engineering team in a single, easy-to-use interface.
                </p>
            </section>

            <section>
                <h2>Open Source Fidelity</h2>
                <p>
                    This is an open-source project. We believe in transparency, especially for tools that handle user data.
                    You can inspect every line of code, fork it, or even host your own version.
                </p>
                <div className="mt-8">
                    <Link
                        href="https://github.com/akshatthakur22/MailMyCertficate"
                        target="_blank"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.05] transition-all shadow-xl"
                    >
                        <Github size={18} /> View on GitHub
                    </Link>
                </div>
            </section>
        </ContentLayout>
    );
}
