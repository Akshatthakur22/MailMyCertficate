'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: () => void;
    isCurrent?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("text-sm text-secondary", className)}>
            <ol className="flex items-center gap-1.5 flex-wrap">
                <li className="flex items-center gap-1.5">
                    <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                        <Home size={14} />
                        <span className="sr-only">Home</span>
                    </Link>
                    <ChevronRight size={14} className="opacity-50" />
                </li>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={item.label} className="flex items-center gap-1.5">
                            {item.isCurrent || isLast ? (
                                <span className={cn("font-medium text-foreground", item.isCurrent && "font-semibold")}>
                                    {item.label}
                                </span>
                            ) : item.href ? (
                                <Link href={item.href} className="hover:text-foreground transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                <button
                                    onClick={item.onClick}
                                    className="hover:text-foreground transition-colors cursor-pointer"
                                    disabled={!item.onClick}
                                >
                                    {item.label}
                                </button>
                            )}

                            {!isLast && <ChevronRight size={14} className="opacity-50" />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
