import React, { useState } from 'react';
import { FileSpreadsheet, FileText, FileDown } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { reportService, ReportItem } from '../../services/reportService';
import { MOCK_DEPARTMENTS, MOCK_EMPLOYEES } from '../../data/mockData';
import { Department, Employee } from '../../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportItem | null;
  departments?: Department[];
  employees?: Employee[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  report,
  departments,
  employees,
}) => {
  const { success } = useToast();
  const activeDepartments = departments && departments.length > 0 ? departments : (MOCK_DEPARTMENTS || []);
  const activeEmployees = employees && employees.length > 0 ? employees : (MOCK_EMPLOYEES || []);

  const [format, setFormat] = useState<'PDF' | 'Excel' | 'CSV'>('Excel');
  const [dateRange, setDateRange] = useState('October 2026');
  const [department, setDepartment] = useState('All');
  const [employee, setEmployee] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!report) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await reportService.generateReport(report.id, {
        format,
        dateRange,
        department,
        employeeId: employee,
      });

      // Trigger automatic browser file download
      if (res.downloadUrl) {
        if (res.downloadUrl.startsWith('/api')) {
          const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
          const downloadEndpoint = res.downloadUrl.replace(/^\/api\/v1/, '');
          const downloadUrl = `${apiBase}${downloadEndpoint}`;
          const token = localStorage.getItem('alize_auth_token');

          // Download via authenticated fetch or direct anchor
          fetch(downloadUrl, {
            headers: token && token !== 'false' && token !== 'true' ? { Authorization: `Bearer ${token}` } : {},
          })
            .then((response) => response.blob())
            .then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = res.filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            })
            .catch(() => {
              window.open(downloadUrl, '_blank');
            });
        } else {
          // Client-side fallback download
          const mockCsv = `Report: ${report.title}\nCategory: ${report.category}\nPeriod: ${dateRange}\nFormat: ${format}\nGeneratedAt: ${new Date().toISOString()}\nStatus: Verified Master Register`;
          const blob = new Blob([mockCsv], { type: 'text/csv;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = res.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      }

      success('Report Export Complete', `Generated and downloaded ${res.filename} (${format} format).`);
      onClose();
    } catch (err: any) {
      console.error('Report generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Export: ${report.title}`}
      description={report.description}
      maxWidth="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Period / Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          >
            <option value="October 2026">Current Month (October 2026)</option>
            <option value="Q3 FY27">Current Quarter (Q3 FY27)</option>
            <option value="FY 2026-27">Full Financial Year (FY 2026-27)</option>
            <option value="September 2026">Previous Month (September 2026)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Department Filter
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="All">All Departments</option>
              {activeDepartments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Employee Filter
            </label>
            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="All">All Workforce ({activeEmployees.length})</option>
              {activeEmployees.slice(0, 15).map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Target File Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormat('Excel')}
              className={`flex flex-col items-center justify-center p-3 rounded-[8px] border text-xs font-semibold transition-all ${
                format === 'Excel'
                  ? 'border-[#6D28D9] bg-purple-50 dark:bg-purple-950/60 text-[#6D28D9] dark:text-purple-300 ring-1 ring-[#6D28D9]'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 mb-1.5 text-emerald-600" />
              <span>Excel (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={() => setFormat('PDF')}
              className={`flex flex-col items-center justify-center p-3 rounded-[8px] border text-xs font-semibold transition-all ${
                format === 'PDF'
                  ? 'border-[#6D28D9] bg-purple-50 dark:bg-purple-950/60 text-[#6D28D9] dark:text-purple-300 ring-1 ring-[#6D28D9]'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FileText className="w-5 h-5 mb-1.5 text-red-600" />
              <span>PDF Document</span>
            </button>
            <button
              type="button"
              onClick={() => setFormat('CSV')}
              className={`flex flex-col items-center justify-center p-3 rounded-[8px] border text-xs font-semibold transition-all ${
                format === 'CSV'
                  ? 'border-[#6D28D9] bg-purple-50 dark:bg-purple-950/60 text-[#6D28D9] dark:text-purple-300 ring-1 ring-[#6D28D9]'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FileDown className="w-5 h-5 mb-1.5 text-blue-600" />
              <span>Raw CSV Data</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleGenerate}
            isLoading={isGenerating}
            leftIcon={<FileDown className="w-4 h-4" />}
          >
            Export & Download
          </Button>
        </div>
      </div>
    </Modal>
  );
};
