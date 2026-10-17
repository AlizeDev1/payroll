import React from 'react';

export const SkeletonText: React.FC<{ className?: string; width?: string }> = ({
  className = '',
  width = 'w-full',
}) => {
  return <div className={`h-4 ${width} skeleton-shimmer ${className}`} />;
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl p-5 space-y-3 ${className}`}
    >
      <div className="flex justify-between items-center">
        <div className="h-3.5 w-24 skeleton-shimmer" />
        <div className="w-6 h-6 rounded skeleton-shimmer" />
      </div>
      <div className="h-7 w-32 skeleton-shimmer" />
      <div className="h-3 w-40 skeleton-shimmer" />
    </div>
  );
};

export const SkeletonTableRows: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-800">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx} className="py-3 px-3">
              <div className="h-4 w-3/4 skeleton-shimmer" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
