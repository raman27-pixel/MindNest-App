import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  interactive = false,
  className,
  padding = 'md',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  return (
    <div
      className={twMerge(
        clsx(
          interactive ? 'clay-card-interactive' : 'clay-card',
          paddingClasses[padding],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
