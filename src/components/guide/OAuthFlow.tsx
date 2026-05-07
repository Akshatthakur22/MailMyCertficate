import { Users, Lock, Shield, Mail, ArrowRight, CheckCircle } from 'lucide-react';

/* ————————————————————————————————————————————————————
   OAuth Flow Visualization
   Clean, trustworthy presentation of Gmail integration
   ———————————————————————————————————————————————————— */
export function OAuthFlow() {
    return (
        <section className="py-16 md:py-20 border-t border-border/50 bg-muted/5">
            <div className="container-width">
                <div className="max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Secure Gmail Integration
                        </h2>
                        <p className="text-xl text-secondary max-w-2xl mx-auto">
                            Official Google OAuth — no passwords collected
                        </p>
                    </div>

                    <div className="bg-background rounded-2xl border border-border/40 shadow-md overflow-hidden">
                        <div className="p-8">
                            {/* OAuth Flow Visualization */}
                            <div className="grid md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center mx-auto mb-3">
                                        <Users size={24} className="text-accent" />
                                    </div>
                                    <div className="font-medium text-foreground text-sm mb-1">You</div>
                                    <div className="text-xs text-secondary/70">Click "Connect Gmail"</div>
                                </div>
                                
                                <ArrowRight size={20} className="text-border/30 mx-auto" />
                                
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center mx-auto mb-3">
                                        <Lock size={24} className="text-accent" />
                                    </div>
                                    <div className="font-medium text-foreground text-sm mb-1">Google Login</div>
                                    <div className="text-xs text-secondary/70">Official authentication</div>
                                </div>
                                
                                <ArrowRight size={20} className="text-border/30 mx-auto" />
                                
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center mx-auto mb-3">
                                        <Shield size={24} className="text-accent" />
                                    </div>
                                    <div className="font-medium text-foreground text-sm mb-1">Permission</div>
                                    <div className="text-xs text-secondary/70">"Send emails on your behalf"</div>
                                </div>
                                
                                <ArrowRight size={20} className="text-border/30 mx-auto" />
                                
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center mx-auto mb-3">
                                        <Mail size={24} className="text-accent" />
                                    </div>
                                    <div className="font-medium text-foreground text-sm mb-1">Connected</div>
                                    <div className="text-xs text-secondary/70">Ready to send certificates</div>
                                </div>
                            </div>
                            
                            {/* Trust Indicators */}
                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-accent/5 border border-accent/10">
                                    <CheckCircle size={14} className="text-accent" />
                                    <span className="text-sm text-secondary">No passwords stored</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-accent/5 border border-accent/10">
                                    <CheckCircle size={14} className="text-accent" />
                                    <span className="text-sm text-secondary">Official Google OAuth</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-accent/5 border border-accent/10">
                                    <CheckCircle size={14} className="text-accent" />
                                    <span className="text-sm text-secondary">Temporary authorization</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
