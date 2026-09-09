import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayAvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'patient';
  className?: string;
}

export const ClayAvatar: React.FC<ClayAvatarProps> = ({
  src,
  alt,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-28 h-28 text-4xl',
    patient: 'w-32 h-32 md:w-40 md:h-40 text-5xl ring-4 ring-white'
  };

  const initials = alt
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={twMerge(
        clsx(
          'relative shrink-0 rounded-full overflow-hidden shadow-clay-card border-2 border-white flex items-center justify-center bg-[#6C63FF]/10 text-[#6C63FF] font-black',
          sizeClasses[size],
          className
        )
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
