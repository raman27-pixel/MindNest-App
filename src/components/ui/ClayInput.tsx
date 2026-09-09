import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const ClayInput: React.FC<ClayInputProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-bold text-clay-text px-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={twMerge(
          clsx(
            'clay-input w-full font-medium text-slate-800 placeholder-slate-400',
            error ? 'border-red-400 focus:border-red-500' : '',
            className
          )
        )}
        {...props}
      />
      {error && <span className="text-xs font-semibold text-red-500 px-1">{error}</span>}
    </div>
  );
};
