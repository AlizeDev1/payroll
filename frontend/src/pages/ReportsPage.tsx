import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  TrendingUp,
  CalendarCheck,
  CalendarDays,
  ShieldCheck,
  Activity,
  Receipt,
  PieChart,
  Clock,
  FileText,
  DollarSign,
  Users,
  Download,
  Search,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { reportService, ReportItem } from '../services/reportService';
import { ExportReportModal } from '../components/modals/ExportReportModal';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    reportService.getAvailableReports().then(setReports);
  }, []);

  const getReportIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSpreadsheet':
        return FileSpreadsheet;
      case 'TrendingUp':
        return TrendingUp;
      case 'CalendarCheck':
        return CalendarCheck;
      case 'CalendarDays':
        return CalendarDays;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Activity':
        return Activity;
      case 'Receipt':
        return Receipt;
      case 'PieChart':
        return PieChart;
      case 'Clock':
        return Clock;
      case 'FileText':
        return FileText;
      case 'DollarSign':
        return DollarSign;
      case 'Users':
      default:
        return Users;
    }
  };

  const categories = ['All', 'Payroll', 'Statutory', 'Attendance', 'Leave', 'Finance'];

  const filteredReports = reports.filter((r) => {
    const matchesCat = activeCategory === 'All' || r.category === activeCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit & Statutory Reports Center"
        subtitle="Generate master payroll registers, EPFO Form 3A, ESIC statements, and Income Tax Form 24Q sheets."
        breadcrumb={['Overview', 'Reports', 'Audit Reports']}
      />

      {/* Category filter pills & Search */}
      <div className="p-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-1 overflow-x-auto p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700/60 w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-[6px] transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search report templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[8px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>
      </div>

      {/* 12 Report Cards Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <EmptyState
            title="No Report Templates Match"
            description="Try modifying your keyword search or select 'All' categories."
            actionLabel="Reset Search"
            onAction={() => {
              setSearchQuery('');
              setActiveCategory('All');
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const IconComponent = getReportIcon(report.icon);
            return (
              <div
                key={report.id}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] p-4.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-9 h-9 rounded-[8px] bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center text-[#6D28D9] dark:text-purple-300 shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                      {report.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {report.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {report.formats.join(' · ')}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedReport(report)}
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Configuration & Export Dialog */}
      <ExportReportModal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </div>
  );
};
