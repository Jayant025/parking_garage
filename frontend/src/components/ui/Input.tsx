import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isPlateInput?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  isPlateInput = false,
  className,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={twMerge(
          clsx(
            'h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface placeholder:text-outline/70 transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            isPlateInput && 'font-code-plate uppercase tracking-widest text-[16px] text-center bg-surface-container-lowest border-primary/50',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )
        )}
        {...props}
      />
      {error ? (
        <span className="font-body-sm text-[11px] text-error flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </span>
      ) : helperText ? (
        <span className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
