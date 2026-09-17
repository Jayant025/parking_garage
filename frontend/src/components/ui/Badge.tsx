import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'available' | 'occupied' | 'reserved' | 'ev' | 'compact' | 'standard' | 'neutral' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className,
}) => {
  const baseStyles = 'inline-flex items-center gap-1 font-label-caps uppercase tracking-wider rounded font-bold shrink-0';

  const variants = {
    available: 'bg-secondary-container text-on-secondary-container border border-secondary/20',
    occupied: 'bg-error-container text-on-error-container border border-error/20',
    reserved: 'bg-tertiary-container text-on-tertiary-container border border-tertiary/20',
    ev: 'bg-primary-container text-on-primary-container border border-primary/20',
    compact: 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/30',
    standard: 'bg-surface-container text-on-surface border border-outline-variant/40',
    neutral: 'bg-surface-container-high text-on-surface-variant',
    warning: 'bg-tertiary-container text-on-tertiary-container',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[9px]',
    md: 'px-2 py-1 text-[11px]',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}>
      {children}
    </span>
  );
};
