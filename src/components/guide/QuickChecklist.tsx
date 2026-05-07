/* ————————————————————————————————————————————————————
   Compact Checklist Item
   Clean, minimal checklist items with subtle hover states
   ———————————————————————————————————————————————————— */
interface CompactChecklistItemProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
}

export function CompactChecklistItem({
    icon,
    title,
    subtitle,
}: CompactChecklistItemProps) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-border/20 hover:bg-muted/20 hover:border-border/30 transition-all duration-200">
            <div className="w-8 h-8 rounded-lg bg-accent/5 border border-accent/20 flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div className="flex-1">
                <div className="font-medium text-foreground text-sm">{title}</div>
                {subtitle && <div className="text-xs text-secondary/60">{subtitle}</div>}
            </div>
        </div>
    );
}
