import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { RevealSection } from '@/components/guide/ClientOnlyGuide';
import { 
    Upload,
    FileSpreadsheet,
    Palette,
    Zap,
    Download,
    Mail,
    Monitor,
    HardDrive,
    Lock,
    AlertCircle,
    Github,
    Move,
    MousePointer,
    Settings,
    Type,
    ZoomIn,
    RefreshCw,
    Layers,
    Clock,
    Users,
    Shield,
    CheckCircle,
    Sparkles,
    ArrowRight,
    Eye,
    Database,
} from 'lucide-react';

// Import refined components
import { WorkflowSeparator } from '@/components/guide/WorkflowSeparator';
import { VisualWorkflowStep } from '@/components/guide/VisualWorkflowStep';
import { CompactChecklistItem } from '@/components/guide/QuickChecklist';
import { FAQSection } from '@/components/guide/FAQSection';
import { TroubleshootingSection } from '@/components/guide/TroubleshootingSection';
import { Hero } from '@/components/guide/Hero';
import { OAuthFlow } from '@/components/guide/OAuthFlow';
import { CTASection } from '@/components/guide/CTASection';
import { LocalDataManagementSection } from '@/components/guide/LocalDataManagementSection';
import { GUIDE_FAQS } from '@/data/guideFaqs';

export default function Guide() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            {/* ======================================
                NAVIGATION
               ====================================== */}
            <nav className="fixed top-0 w-full z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
                <div className="container-width flex flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
                    <Link
                        href="/"
                        className="brand-text hover:opacity-80 transition-opacity"
                    >
                        <span>Mail</span><span>My</span><span>Certificate</span>
                    </Link>

                    <div className="flex items-center justify-between gap-3 flex-wrap sm:justify-end">
                        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-secondary">
                            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
                            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
                            <Link href="/guide" className="hover:text-accent transition-colors">Guide</Link>
                            <Link href="/guide#local-data" className="hover:text-accent transition-colors">Your data</Link>
                            <Link href="/settings" className="hover:text-accent transition-colors">Settings</Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="https://github.com/akshatthakur22/MailMyCertficate"
                                target="_blank"
                                className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/20"
                            >
                                <Github size={16} />
                                <span className="hidden sm:inline">GitHub</span>
                            </Link>
                            <Link
                                href="/tool"
                                className={buttonVariants({ variant: 'primary', size: 'sm', className: 'shadow-sm' })}
                            >
                                Open Tool
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 w-full pt-16">
            {/* ======================================
                HERO SECTION
               ====================================== */}
            <RevealSection>
                <Hero />
            </RevealSection>

            {/* ======================================
                QUICK START CHECKLIST
               ====================================== */}
            <section className="py-12 md:py-16 border-t border-border/50">
                <div className="container-width">
                    <RevealSection className="max-w-5xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/15 mb-4">
                                <Clock size={14} className="text-accent" />
                                <span className="text-sm font-medium text-accent">60 seconds</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                                Quick Setup
                            </h2>
                            <p className="text-secondary">This is where most organizers start</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                            <CompactChecklistItem
                                icon={<Monitor size={16} className="text-accent" />}
                                title="Desktop + Chrome"
                                subtitle="Best experience"
                            />
                            <CompactChecklistItem
                                icon={<Upload size={16} className="text-accent" />}
                                title="PNG/JPG Template"
                                subtitle="Under 5MB"
                            />
                            <CompactChecklistItem
                                icon={<FileSpreadsheet size={16} className="text-accent" />}
                                title="CSV or Google Sheets"
                                subtitle="Ready data"
                            />
                            <CompactChecklistItem
                                icon={<HardDrive size={16} className="text-accent" />}
                                title="Stable Internet"
                                subtitle="For sending"
                            />
                            <CompactChecklistItem
                                icon={<Lock size={16} className="text-accent" />}
                                title="Gmail Account"
                                subtitle="For OAuth"
                            />
                            <CompactChecklistItem
                                icon={<AlertCircle size={16} className="text-yellow-500" />}
                                title="No PDF Templates"
                                subtitle="Convert to image"
                            />
                            <CompactChecklistItem
                                icon={<Database size={16} className="text-accent" />}
                                title="Know your data controls"
                                subtitle="See Managing local data below"
                            />
                        </div>
                        
                        <div className="mt-8 text-center">
                            <div className="inline-flex items-center gap-2 text-sm text-secondary/60 bg-muted/10 rounded-full px-4 py-2 border border-border/20">
                                <Users size={14} className="text-accent" />
                                <span>Built from real event workflows. No spreadsheet chaos anymore.</span>
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </section>

            <WorkflowSeparator />

            {/* ======================================
                STEP 1 — UPLOAD TEMPLATE
               ====================================== */}
            <section className="py-16 md:py-20 border-t border-border/50">
                <div className="container-width">
                    <RevealSection className="max-w-6xl">
                        <VisualWorkflowStep
                            number={1}
                            title="Upload Your Template"
                            shortDescription="Start with your certificate design. Most organizers use Canva or Figma for this."
                            icon={<Upload size={24} className="text-accent" />}
                            isReverse={false}
                            tips={[
                                "Design in Canva, Figma, or any tool",
                                "Leave space for dynamic fields",
                                "Use high-resolution images",
                                "Keep file size under 5MB"
                            ]}
                            visualContent={
                                <div className="space-y-4">
                                    {/* Upload Area with subtle hover */}
                                    <div className="border-2 border-dashed border-border/40 rounded-xl p-8 text-center bg-muted/5 hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 cursor-pointer group">
                                        <Upload size={48} className="text-accent/60 mx-auto mb-4 group-hover:text-accent transition-colors" />
                                        <div className="font-medium text-foreground mb-2 text-lg">Drop your template here</div>
                                        <div className="text-sm text-secondary mb-3">PNG, JPG up to 5MB</div>
                                        <div className="text-xs text-secondary/60">or click to browse files</div>
                                    </div>
                                    
                                    {/* Template Preview */}
                                    <div className="flex items-center gap-4 p-4 bg-muted/10 rounded-lg border border-border/20">
                                        <div className="w-16 h-20 bg-muted/30 rounded-lg border border-border/30 flex items-center justify-center">
                                            <div className="w-8 h-10 bg-background/50 rounded border border-border/20"></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-foreground">certificate-template.png</div>
                                            <div className="text-sm text-secondary/60">2.4 MB • 1920×1080</div>
                                            <div className="text-xs text-accent/60 mt-1">✓ Ready to use</div>
                                        </div>
                                        <div className="text-xs text-secondary/50 italic">
                                            Usually takes under a minute
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </RevealSection>
                </div>
            </section>

            <WorkflowSeparator />

            {/* ======================================
                STEP 2 — IMPORT DATA
               ====================================== */}
            <section className="py-16 md:py-20 border-t border-border/50">
                <div className="container-width">
                    <RevealSection className="max-w-6xl">
                        <VisualWorkflowStep
                            number={2}
                            title="Import Participant Data"
                            shortDescription="Bring your participant list. Most users use Google Forms + Sheets workflow."
                            icon={<FileSpreadsheet size={24} className="text-accent" />}
                            isReverse={true}
                            tips={[
                                "CSV: Drag & drop supported",
                                "Google Sheets: Public URL",
                                "Google Forms → Sheets → Certificates",
                                "Extra columns are ignored"
                            ]}
                            visualContent={
                                <div className="space-y-4">
                                    {/* Import Options */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="border border-border/30 rounded-lg p-4 bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer group">
                                            <FileSpreadsheet size={24} className="text-accent mb-2 group-hover:text-accent/80 transition-colors" />
                                            <div className="font-medium text-foreground text-sm mb-1">CSV File</div>
                                            <div className="text-xs text-secondary">Drag & drop • Instant</div>
                                        </div>
                                        <div className="border border-border/30 rounded-lg p-4 bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer group">
                                            <Layers size={24} className="text-secondary mb-2 group-hover:text-accent transition-colors" />
                                            <div className="font-medium text-foreground text-sm mb-1">Google Sheets</div>
                                            <div className="text-xs text-secondary">Public URL • Auto-sync</div>
                                        </div>
                                    </div>
                                    
                                    {/* Data Preview */}
                                    <div className="bg-muted/10 rounded-lg p-4 border border-border/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="text-xs font-medium text-foreground">Data Preview</div>
                                            <div className="text-xs text-accent/60">• 50 participants found</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex gap-3 text-xs font-medium text-secondary/60 border-b border-border/10 pb-1">
                                                <div className="w-20">Name</div>
                                                <div className="w-24">Email</div>
                                                <div className="w-20">Event</div>
                                                <div className="w-16">Position</div>
                                            </div>
                                            <div className="flex gap-3 text-xs text-secondary">
                                                <div className="w-20 font-medium">Alice Johnson</div>
                                                <div className="w-24">alice@email.com</div>
                                                <div className="w-20">Workshop 2024</div>
                                                <div className="w-16">Participant</div>
                                            </div>
                                            <div className="flex gap-3 text-xs text-secondary">
                                                <div className="w-20 font-medium">Bob Smith</div>
                                                <div className="w-24">bob@email.com</div>
                                                <div className="w-20">Workshop 2024</div>
                                                <div className="w-16">Volunteer</div>
                                            </div>
                                            <div className="flex gap-3 text-xs text-secondary">
                                                <div className="w-20 font-medium">Carol Davis</div>
                                                <div className="w-24">carol@email.com</div>
                                                <div className="w-20">Workshop 2024</div>
                                                <div className="w-16">Speaker</div>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-xs text-accent/60 italic">
                                            Popular workflow: Google Forms → Google Sheets → MailMyCertificate
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </RevealSection>
                </div>
            </section>

            <WorkflowSeparator />

            {/* ======================================
                STEP 3 — VISUAL EDITOR
               ====================================== */}
            <section className="py-20 md:py-24 border-t border-border/50 bg-muted/5">
                <div className="container-width">
                    <RevealSection className="max-w-7xl">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/15 mb-4">
                                <Sparkles size={14} className="text-accent" />
                                <span className="text-sm font-medium text-accent">The Fun Part</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                                Visual Editor
                            </h2>
                            <p className="text-xl text-secondary max-w-3xl mx-auto">
                                This is where your certificate comes to life. Drag fields exactly where you want them.
                            </p>
                            <div className="mt-4 text-sm text-secondary/60">
                                Most organizers say this is surprisingly intuitive.
                            </div>
                        </div>

                        {/* Enhanced Editor Interface */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-muted/10 rounded-3xl transform -rotate-1"></div>
                            <div className="relative bg-background rounded-3xl border border-border/40 shadow-lg overflow-hidden">
                                {/* Editor Toolbar */}
                                <div className="bg-muted/20 border-b border-border/30 px-6 py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 group cursor-pointer">
                                                <div className="w-8 h-8 rounded bg-accent/5 border border-accent/20 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                                    <Move size={16} className="text-accent" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground">Move</span>
                                            </div>
                                            <div className="flex items-center gap-2 group cursor-pointer">
                                                <div className="w-8 h-8 rounded bg-accent/5 border border-accent/20 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                                    <Type size={16} className="text-accent" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground">Text</span>
                                            </div>
                                            <div className="flex items-center gap-2 group cursor-pointer">
                                                <div className="w-8 h-8 rounded bg-accent/5 border border-accent/20 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                                    <ZoomIn size={16} className="text-accent" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground">Zoom</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-accent/20 rounded-full">
                                                <div className="w-6 h-6 rounded bg-accent text-white flex items-center justify-center text-xs font-bold">3</div>
                                                <span className="text-sm font-medium">Customize</span>
                                            </div>
                                            <div className="text-xs text-secondary/60">Auto-saved</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Editor Canvas */}
                                <div className="p-8">
                                    <div className="grid lg:grid-cols-4 gap-8">
                                        {/* Certificate Preview */}
                                        <div className="lg:col-span-3">
                                            <div className="relative">
                                                <div className="relative bg-muted/10 rounded-2xl border-2 border-border/20 shadow-inner h-[500px] overflow-hidden">
                                                    {/* Certificate Content */}
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                                                        <div className="text-center mb-12">
                                                            <div className="text-3xl font-bold text-foreground mb-3">Certificate of Completion</div>
                                                            <div className="text-base text-secondary mb-2">This is to certify that</div>
                                                            <div className="w-32 h-px bg-border/30 mx-auto"></div>
                                                        </div>
                                                        
                                                        {/* Dynamic Fields */}
                                                        <div className="relative space-y-6">
                                                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 group cursor-move">
                                                                <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-2 text-center hover:bg-accent/10 transition-colors">
                                                                    <div className="text-sm text-accent font-medium">{'{name}'}</div>
                                                                </div>
                                                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <div className="w-4 h-4 bg-accent rounded-full shadow-md flex items-center justify-center">
                                                                        <Move size={10} className="text-white" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 group cursor-move">
                                                                <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-2 text-center hover:bg-accent/10 transition-colors">
                                                                    <div className="text-sm text-accent font-medium">{'{event}'}</div>
                                                                </div>
                                                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <div className="w-4 h-4 bg-accent rounded-full shadow-md flex items-center justify-center">
                                                                        <Move size={10} className="text-white" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 group cursor-move">
                                                                <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-2 text-center hover:bg-accent/10 transition-colors">
                                                                    <div className="text-sm text-accent font-medium">{'{date}'}</div>
                                                                </div>
                                                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <div className="w-4 h-4 bg-accent rounded-full shadow-md flex items-center justify-center">
                                                                        <Move size={10} className="text-white" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Zoom Controls */}
                                                    <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-background/90 backdrop-blur rounded-xl border border-border/30 px-3 py-2 shadow-md">
                                                        <ZoomIn size={16} className="text-secondary" />
                                                        <span className="text-sm text-secondary font-medium">125%</span>
                                                        <div className="w-px h-4 bg-border/30"></div>
                                                        <RefreshCw size={14} className="text-secondary cursor-pointer hover:text-accent transition-colors" />
                                                    </div>
                                                </div>
                                                
                                                {/* Before/After Comparison */}
                                                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-secondary">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                                        <span>Before: Blank template</span>
                                                    </div>
                                                    <div className="w-4 h-px bg-border/30"></div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <span>After: Fields positioned</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Field Controls */}
                                        <div className="space-y-6">
                                            <div className="bg-muted/10 rounded-xl p-5 border border-border/20">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Layers size={16} className="text-accent" />
                                                    <div className="font-semibold text-foreground text-sm">Drag Fields</div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/20 cursor-move hover:border-accent/40 hover:shadow-sm transition-all group">
                                                        <Move size={16} className="text-accent" />
                                                        <code className="text-sm font-mono">{'{name}'}</code>
                                                        <div className="ml-auto text-xs text-secondary/60">Required</div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/20 cursor-move hover:border-accent/40 hover:shadow-sm transition-all group">
                                                        <Move size={16} className="text-accent" />
                                                        <code className="text-sm font-mono">{'{event}'}</code>
                                                        <div className="ml-auto text-xs text-secondary/60">Optional</div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/20 cursor-move hover:border-accent/40 hover:shadow-sm transition-all group">
                                                        <Move size={16} className="text-accent" />
                                                        <code className="text-sm font-mono">{'{date}'}</code>
                                                        <div className="ml-auto text-xs text-secondary/60">Optional</div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/20 cursor-move hover:border-accent/40 hover:shadow-sm transition-all group">
                                                        <Move size={16} className="text-accent" />
                                                        <code className="text-sm font-mono">{'{position}'}</code>
                                                        <div className="ml-auto text-xs text-secondary/60">Optional</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-muted/10 rounded-xl p-5 border border-border/20">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Settings size={16} className="text-accent" />
                                                    <div className="font-semibold text-foreground text-sm">Style Field</div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-xs text-secondary/60 font-medium">Font Size</label>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div className="flex-1 h-2 bg-muted rounded-full">
                                                                <div className="h-2 bg-accent rounded-full" style={{width: '60%'}}></div>
                                                            </div>
                                                            <span className="text-sm text-secondary font-medium">24px</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-secondary/60 font-medium">Font Weight</label>
                                                        <div className="flex gap-2 mt-2">
                                                            <div className="px-3 py-1 bg-muted rounded text-xs cursor-pointer hover:bg-accent hover:text-white transition-colors">Regular</div>
                                                            <div className="px-3 py-1 bg-accent text-white rounded text-xs cursor-pointer">Medium</div>
                                                            <div className="px-3 py-1 bg-muted rounded text-xs cursor-pointer hover:bg-accent hover:text-white transition-colors">Bold</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-secondary/60 font-medium">Color</label>
                                                        <div className="flex gap-2 mt-2">
                                                            <div className="w-8 h-8 bg-black rounded-lg border-2 border-accent cursor-pointer hover:opacity-80 transition-opacity"></div>
                                                            <div className="w-8 h-8 bg-accent rounded-lg cursor-pointer hover:opacity-80 transition-opacity"></div>
                                                            <div className="w-8 h-8 bg-secondary rounded-lg cursor-pointer hover:opacity-80 transition-opacity"></div>
                                                            <div className="w-8 h-8 bg-red-500 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"></div>
                                                            <div className="w-8 h-8 bg-blue-500 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center gap-6 text-sm text-secondary bg-muted/10 rounded-full px-6 py-3 border border-border/20">
                                <div className="flex items-center gap-2">
                                    <MousePointer size={16} className="text-accent" />
                                    <span>Drag to position</span>
                                </div>
                                <div className="w-px h-4 bg-border/30"></div>
                                <div className="flex items-center gap-2">
                                    <Settings size={16} className="text-accent" />
                                    <span>Customize styling</span>
                                </div>
                                <div className="w-px h-4 bg-border/30"></div>
                                <div className="flex items-center gap-2">
                                    <ZoomIn size={16} className="text-accent" />
                                    <span>Live preview</span>
                                </div>
                            </div>
                            <div className="mt-6 text-sm text-secondary/60 italic">
                                "This is where most organizers have their 'aha!' moment."
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </section>

            <WorkflowSeparator />

            {/* ======================================
                STEP 4 — GENERATE CERTIFICATES
               ====================================== */}
            <section className="py-16 md:py-20 border-t border-border/50">
                <div className="container-width">
                    <RevealSection className="max-w-6xl">
                        <VisualWorkflowStep
                            number={4}
                            title="Generate Certificates"
                            shortDescription="Watch your certificates appear instantly in your browser — completely private."
                            icon={<Zap size={24} className="text-accent" />}
                            isReverse={false}
                            tips={[
                                "Usually takes under 30 seconds",
                                "Happens entirely in your browser",
                                "No data ever leaves your device",
                                "Built for privacy-first workflows"
                            ]}
                            visualContent={
                                <div className="space-y-4">
                                    {/* Generation Progress */}
                                    <div className="bg-muted/10 rounded-xl p-5 border border-border/20">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                                                    <Zap size={16} className="text-accent" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground text-sm">Generating Certificates</div>
                                                    <div className="text-xs text-secondary/60">Local processing • No server upload</div>
                                                </div>
                                            </div>
                                            <div className="text-lg font-bold text-accent">42/50</div>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3 mb-3">
                                            <div className="bg-accent h-3 rounded-full transition-all duration-500" style={{width: '84%'}}></div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-secondary">
                                            <span>Processing Alice Johnson...</span>
                                            <span>~15 seconds remaining</span>
                                        </div>
                                    </div>
                                    
                                    {/* Certificate Grid */}
                                    <div className="relative">
                                        <div className="grid grid-cols-3 gap-3">
                                            {[1, 2, 3, 4, 5, 6].map((i, index) => (
                                                <div key={i} className={`aspect-[3/4] bg-muted/20 rounded-lg border border-border/30 flex items-center justify-center transition-all duration-200 hover:shadow-md cursor-pointer ${index === 2 ? 'ring-2 ring-accent/40' : ''}`}>
                                                    <div className="text-center p-2">
                                                        <div className={`w-6 h-6 bg-accent/20 rounded-full mx-auto mb-1 ${index < 4 ? '' : ''}`}></div>
                                                        <div className="text-xs text-secondary font-medium">Cert {i}</div>
                                                        {index < 4 && <div className="text-xs text-accent/60 mt-1">Ready</div>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* More certificates indicator */}
                                        <div className="absolute -bottom-2 -right-2 bg-accent text-white text-xs px-2 py-1 rounded-full shadow-md">
                                            +44 more
                                        </div>
                                    </div>
                                    
                                    {/* Privacy Trust Badge */}
                                    <div className="flex items-center gap-3 text-xs text-secondary bg-muted/5 rounded-lg p-3 border border-border/20">
                                        <div className="w-6 h-6 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center">
                                            <Shield size={12} className="text-accent" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground">100% Private Generation</div>
                                            <div className="text-secondary/60">No certificates leave your browser</div>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </RevealSection>
                </div>
            </section>

            <WorkflowSeparator />

            {/* ======================================
                STEP 5 — DOWNLOAD OR SEND
               ====================================== */}
            <section className="py-16 md:py-20 border-t border-border/50">
                <div className="container-width">
                    <RevealSection className="max-w-6xl">
                        <VisualWorkflowStep
                            number={5}
                            title="Download or Send"
                            shortDescription="Choose your delivery method — ZIP download or email delivery."
                            icon={<Download size={24} className="text-accent" />}
                            isReverse={true}
                            tips={[
                                "ZIP download for manual distribution",
                                "Email delivery for automated sending",
                                "Both options available simultaneously",
                                "Certificates stay available in session"
                            ]}
                            visualContent={
                                <div className="space-y-4">
                                    {/* Delivery Options */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="border border-border/30 rounded-lg p-4 bg-accent/5">
                                            <Download size={24} className="text-accent mb-2" />
                                            <div className="font-medium text-foreground text-sm mb-1">Download ZIP</div>
                                            <div className="text-xs text-secondary">Manual distribution</div>
                                        </div>
                                        <div className="border border-border/30 rounded-lg p-4">
                                            <Mail size={24} className="text-secondary mb-2" />
                                            <div className="font-medium text-foreground text-sm mb-1">Send Emails</div>
                                            <div className="text-xs text-secondary">Automated delivery</div>
                                        </div>
                                    </div>
                                    
                                    {/* ZIP Preview */}
                                    <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/20">
                                        <div className="w-10 h-12 bg-accent/10 border border-accent/20 rounded flex items-center justify-center">
                                            <HardDrive size={16} className="text-accent" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground text-sm">certificates.zip</div>
                                            <div className="text-xs text-secondary/60">50 files • 12.4 MB</div>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </RevealSection>
                </div>
            </section>

            <WorkflowSeparator />

            {/* ======================================
                GOOGLE OAUTH FLOW
               ====================================== */}
            <RevealSection>
                <OAuthFlow />
            </RevealSection>

            <WorkflowSeparator />

            {/* ======================================
                STEP 6 — SEND EMAILS
               ====================================== */}
            <section className="py-16 md:py-20 border-t border-border/50">
                <div className="container-width">
                    <RevealSection className="max-w-6xl">
                        <VisualWorkflowStep
                            number={6}
                            title="Send Emails"
                            shortDescription="Deliver certificates directly to participants' inboxes with personalized messages."
                            icon={<Mail size={24} className="text-accent" />}
                            isReverse={false}
                            tips={[
                                "Personalize with {name} placeholders",
                                "Track each email in real-time",
                                "Gmail handles delivery reliably",
                                "Usually ~400 emails per batch"
                            ]}
                            visualContent={
                                <div className="space-y-4">
                                    {/* Email Composer */}
                                    <div className="bg-muted/10 rounded-xl p-5 border border-border/20">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Mail size={16} className="text-accent" />
                                            <div className="font-medium text-foreground text-sm">Email Composer</div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs text-secondary/60 font-medium">Subject Line</label>
                                                <div className="mt-2 p-3 bg-background rounded-lg border border-border/20 text-sm font-medium">
                                                    Your Certificate - {'{event}'}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-secondary/60 font-medium">Message Body</label>
                                                <div className="mt-2 p-3 bg-background rounded-lg border border-border/20 text-sm leading-relaxed">
                                                    Hi {'{name}'},<br /><br />
                                                    Congratulations! 🎉 Your certificate is attached.<br />
                                                    Thank you for participating in {'{event}'}.<br /><br />
                                                    Best regards,<br />
                                                    The Organizing Team
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-secondary/60">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                    <span>Attachments: certificates.zip</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                    <span>Personalization: Enabled</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Sending Progress */}
                                    <div className="bg-muted/5 rounded-xl p-5 border border-border/20">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                                                    <Mail size={16} className="text-accent" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground text-sm">Sending Progress</div>
                                                    <div className="text-xs text-secondary/60">Via Gmail • Secure delivery</div>
                                                </div>
                                            </div>
                                            <div className="text-lg font-bold text-accent">47/50</div>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3 mb-3">
                                            <div className="bg-accent h-3 rounded-full transition-all duration-500" style={{width: '94%'}}></div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-secondary">
                                            <span>Sending to charlie@email.com...</span>
                                            <span>~8 seconds remaining</span>
                                        </div>
                                    </div>
                                    
                                    {/* Email Status */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/20">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="text-sm text-secondary">alice@email.com</div>
                                                <div className="text-xs text-accent/60">Delivered successfully</div>
                                            </div>
                                            <div className="text-xs text-secondary/60">2 min ago</div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/20">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="text-sm text-secondary">bob@email.com</div>
                                                <div className="text-xs text-accent/60">Delivered successfully</div>
                                            </div>
                                            <div className="text-xs text-secondary/60">2 min ago</div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/20">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="text-sm text-secondary">charlie@email.com</div>
                                                <div className="text-xs text-accent font-medium">Sending now...</div>
                                            </div>
                                            <div className="text-xs text-secondary/60">In progress</div>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </RevealSection>
                </div>
            </section>

            <WorkflowSeparator />

            {/* ======================================
                LOCAL DATA MANAGEMENT
               ====================================== */}
            <RevealSection>
                <LocalDataManagementSection />
            </RevealSection>

            {/* ======================================
                TROUBLESHOOTING SECTION
               ====================================== */}
            <RevealSection>
                <TroubleshootingSection
                    items={[
                        {
                            icon: <Database size={18} className="text-accent" />,
                            title: "Previous session stuck or confusing?",
                            description: "Recovery modal or generate step not progressing",
                            solution: "Open Your local data in the tool header → Continue this batch, or Delete data & start fresh. See the Managing local data section above."
                        },
                        {
                            icon: <Layers size={18} className="text-accent" />,
                            title: "Google Sheet not importing?",
                            description: "Public sheet URL or column issues",
                            solution: "Make sheet public, check URL, ensure required columns exist"
                        },
                        {
                            icon: <Upload size={18} className="text-accent" />,
                            title: "Template too large?",
                            description: "File size over 5MB limit",
                            solution: "Compress images, reduce dimensions, or use smaller file"
                        },
                        {
                            icon: <Mail size={18} className="text-accent" />,
                            title: "Email sending interrupted?",
                            description: "Connection or API limit issues",
                            solution: "Check internet, avoid refreshing, wait for API limits to reset"
                        },
                        {
                            icon: <Monitor size={18} className="text-accent" />,
                            title: "Mobile limitations?",
                            description: "Editor not working on mobile",
                            solution: "Use desktop for editing, mobile works for download-only"
                        }
                    ]}
                />
            </RevealSection>

            {/* ======================================
                FAQ SECTION
               ====================================== */}
            <RevealSection>
                <FAQSection faqs={GUIDE_FAQS} />
            </RevealSection>

            {/* ======================================
                READY TO START CTA
               ====================================== */}
            <RevealSection>
                <CTASection />
            </RevealSection>
        </main>
    </div>
);
}
