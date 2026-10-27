import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumb,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E5E7EB] dark:border-[#1F2937]">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1.5 font-medium">
            {breadcrumb.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span
                  className={
                    idx === breadcrumb.length - 1
                      ? 'text-slate-800 dark:text-slate-200 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }
                >
                  {crumb}
                </span>
                {idx < breadcrumb.length - 1 && <span className="text-slate-300 dark:text-slate-700">/</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
