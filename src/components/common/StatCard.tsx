import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
  description?: string;
  className?: string;
  accent?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  change,
  isPositive = true,
  icon: Icon,
  description,
  className = '',
  accent = false,
}) => {
  return (
    <div
      className={`group relative overflow-hidden bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl p-3.5 sm:p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] hover:shadow-[0_10px_25px_-5px_rgba(109,40,217,0.12)] hover:border-[#6D28D9]/40 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between ${className}`}
    >
      {/* Dynamic ambient hover glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#6D28D9]/5 dark:bg-[#6D28D9]/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase font-sans">
            {title}
          </span>
          {Icon && (
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                accent
                  ? 'bg-purple-50 text-[#6D28D9] dark:bg-purple-950/60 dark:text-purple-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono tabular-nums leading-none">
            {value}
          </span>
          {subValue && (
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums font-medium">
              {subValue}
            </span>
          )}
        </div>
      </div>

      {(change || description) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-sans">
          {change && (
            <span
              className={`inline-flex items-center font-semibold tabular-nums text-[11px] ${
                isPositive ? 'text-[#15803D] dark:text-emerald-400' : 'text-[#B91C1C] dark:text-red-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {change}
            </span>
          )}
          {change && description && <span className="text-slate-300 dark:text-slate-700">·</span>}
          {description && <span className="truncate text-[11px]">{description}</span>}
        </div>
      )}
    </div>
  );
};
