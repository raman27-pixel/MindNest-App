import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayProgressProps {
  value: number; // 0 to 100
  label?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'alert';
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ClayProgress: React.FC<ClayProgressProps> = ({
  value,
  label,
  variant = 'primary',
  height = 'md',
  className
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const variantBar = {
    primary: 'bg-[#6C63FF]',
    secondary: 'bg-[#2CDA9D]',
    success: 'bg-[#27AE60]',
    warning: 'bg-[#F2994A]',
    alert: 'bg-[#EB5757]'
  };

  const heightClasses = {
    sm: 'h-2.5 rounded-full',
    md: 'h-4 rounded-full',
    lg: 'h-6 rounded-full'
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <div className="flex justify-between items-center text-sm font-bold text-slate-700">
          <span>{label}</span>
          <span>{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className={twMerge(clsx('w-full bg-[#E2E6F0] shadow-clay-inset overflow-hidden p-0.5', heightClasses[height], className))}>
        <div
          className={twMerge(clsx('h-full transition-all duration-500 rounded-full shadow-md', variantBar[variant]))}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
