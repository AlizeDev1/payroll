import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  size = 'md',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-[#ECFDF5] text-[#15803D] border-[#A7F3D0] dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    warning: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    danger: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60',
    info: 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD] dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
    purple: 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE] dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
    neutral: 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60',
  };

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px] rounded',
    md: 'px-2 py-0.5 text-[11px] rounded-md',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold border whitespace-nowrap shrink-0 tracking-tight leading-normal ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
