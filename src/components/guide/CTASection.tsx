import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Call to Action Section
   Clean, compelling final CTA without over-animation
   ———————————————————————————————————————————————————— */
export function CTASection() {
    return (
        <section className="py-16 md:py-20 border-t border-border/50">
            <div className="container-width">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8">
                        <Sparkles size={40} className="text-accent mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Ready to create certificates?
                        </h2>
                        <p className="text-xl text-secondary max-w-2xl mx-auto">
                            Join thousands of organizers generating certificates for events worldwide
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/tool"
                            className={buttonVariants({ variant: 'primary', size: 'lg', className: 'shadow-md hover:shadow-lg transition-shadow duration-300' })}
                        >
                            Open Certificate Tool
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/"
                            className={buttonVariants({ variant: 'ghost', size: 'lg' })}
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
