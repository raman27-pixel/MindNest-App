import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'alert' | 'neutral';
  className?: string;
  icon?: React.ReactNode;
}

export const ClayBadge: React.FC<ClayBadgeProps> = ({
  children,
  variant = 'primary',
  className,
  icon
}) => {
  const variantClasses = {
    primary: 'bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20',
    secondary: 'bg-[#2CDA9D]/10 text-[#1BA877] border border-[#2CDA9D]/20',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    alert: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'clay-badge font-bold tracking-wide',
          variantClasses[variant],
          className
        )
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
