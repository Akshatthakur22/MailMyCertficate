'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

const Progress = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative h-4 w-full overflow-hidden rounded-full bg-secondary/20",
            className
        )}
        {...props}
    >
        <div
            className="h-full w-full flex-1 bg-accent transition-all duration-300 ease-in-out"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </div>
));
Progress.displayName = "Progress";

export { Progress };
