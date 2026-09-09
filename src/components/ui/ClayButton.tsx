import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'neutral' | 'alert';
  size?: 'sm' | 'md' | 'lg' | 'patient';
  fullWidth?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const ClayButton: React.FC<ClayButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  icon,
  ...props
}) => {
  const variantClasses = {
    primary: 'clay-btn-primary',
    secondary: 'clay-btn-secondary',
    neutral: 'clay-btn-neutral',
    alert: 'clay-btn-alert',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-[16px]',
    md: 'px-6 py-3.5 text-base rounded-[22px]',
    lg: 'px-8 py-4 text-lg rounded-[24px]',
    patient: 'patient-touch-btn px-8 py-5 text-xl font-extrabold rounded-[28px] shadow-clay-card'
  };

  return (
    <button
      className={twMerge(
        clsx(
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          'inline-flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.98]',
          className
        )
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
