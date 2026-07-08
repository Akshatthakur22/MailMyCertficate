import { ReactNode } from 'react';
import Link from 'next/link';
import { buttonVariants } from './Button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondary?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

/**
 * EmptyState component for when there's no data to display.
 * Guides users toward the next action.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondary,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="flex justify-center mb-4">
        <div className="text-secondary/40">
          {icon}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-secondary mb-8 max-w-md mx-auto">
        {description}
      </p>
      
      {action && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action.href ? (
            <Link
              href={action.href}
              className={buttonVariants({ variant: 'primary' })}
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className={buttonVariants({ variant: 'primary' })}
            >
              {action.label}
            </button>
          )}
          
          {secondary && (
            secondary.href ? (
              <Link
                href={secondary.href}
                className={buttonVariants({ variant: 'outline' })}
              >
                {secondary.label}
              </Link>
            ) : (
              <button
                onClick={secondary.onClick}
                className={buttonVariants({ variant: 'outline' })}
              >
                {secondary.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
