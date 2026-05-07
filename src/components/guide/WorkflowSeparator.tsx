import { ChevronDown } from 'lucide-react';

/* ————————————————————————————————————————————————————
   Minimal Workflow Separator
   Replaces animated arrows with subtle, clean separators
   ———————————————————————————————————————————————————— */
export function WorkflowSeparator() {
    return (
        <div className="relative py-8">
            <div className="flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-px bg-border/30"></div>
                    <ChevronDown size={20} className="text-border/40" />
                    <div className="w-16 h-px bg-border/30"></div>
                </div>
            </div>
        </div>
    );
}
