import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'surface' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const baseStyles = 'rounded-xl shadow-sm transition-all border';

  const variants = {
    default: 'bg-surface-container-lowest border-outline-variant/30 text-on-surface',
    surface: 'bg-surface-container border-outline-variant/40 text-on-surface',
    outlined: 'bg-transparent border-outline text-on-surface',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </div>
  );
};
