import * as React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    asChild?: boolean; // Added for compatibility but ignored for now in simple implementation, or handled if I want to match API surface. 
}

export const buttonVariants = ({
    variant = 'primary',
    size = 'md',
    className,
}: {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}) => {
    return cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
        // Variants
        variant === 'primary' && 'bg-accent text-white hover:opacity-90',
        variant === 'secondary' && 'bg-secondary/10 text-foreground hover:bg-secondary/20',
        variant === 'outline' && 'border border-border bg-background hover:bg-secondary/5',
        variant === 'ghost' && 'hover:bg-secondary/10 hover:text-accent',
        // Sizes
        size === 'sm' && 'h-9 px-4 text-sm',
        size === 'md' && 'h-12 px-6 text-base',
        size === 'lg' && 'h-14 px-8 text-lg',
        className
    );
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={buttonVariants({ variant, size, className })}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
