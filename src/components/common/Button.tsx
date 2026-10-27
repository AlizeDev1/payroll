import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]/40 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap shrink-0 rounded-lg cursor-pointer select-none';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-2.5 py-1.5 min-h-[34px] gap-1.5',
    md: 'text-xs sm:text-sm px-3.5 py-2 min-h-[38px] gap-2',
    lg: 'text-sm px-4 py-2.5 min-h-[42px] gap-2.5',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#6D28D9] hover:bg-[#5B21B6] active:bg-[#4C1D95] text-white shadow-[0_1px_2px_0_rgba(109,40,217,0.2)] border border-transparent dark:bg-[#7C3AED] dark:hover:bg-[#6D28D9]',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-800 dark:bg-[#111827] dark:hover:bg-slate-800 dark:text-slate-200 border border-[#D1D5DB] dark:border-[#374151] shadow-[0_1px_2px_0_rgba(15,23,42,0.03)]',
    outline:
      'bg-transparent hover:bg-slate-50 text-slate-700 border border-[#D1D5DB] dark:text-slate-300 dark:border-[#374151] dark:hover:bg-slate-800/60',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 border border-transparent',
    danger:
      'bg-white hover:bg-red-50 text-[#B91C1C] border border-red-200 dark:bg-[#111827] dark:hover:bg-red-950/40 dark:text-red-400 dark:border-red-900/60 shadow-[0_1px_2px_0_rgba(15,23,42,0.02)]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
