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
      className={`bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between ${className}`}
    >
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
