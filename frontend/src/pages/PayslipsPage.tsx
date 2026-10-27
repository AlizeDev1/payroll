import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Mail,
  Eye,
  Search,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { payrollService } from '../services/payrollService';
import { employeeService } from '../services/employeeService';
import { PayslipItem, Department } from '../types';
import { PayslipModal } from '../components/modals/PayslipModal';
import { useToast } from '../context/ToastContext';
import { exportToCsv } from '../utils/exportUtils';

export const PayslipsPage: React.FC = () => {
  const { success } = useToast();
  const [payslips, setPayslips] = useState<PayslipItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipItem | null>(null);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    employeeService.getDepartments().then(setDepartments);
  }, []);

  useEffect(() => {
    payrollService
      .getPayslips({
        month: selectedMonth,
        department: selectedDept !== 'All' ? selectedDept : undefined,
      })
      .then(setPayslips);
  }, [selectedMonth, selectedYear, selectedDept]);

  const handleDownloadAll = () => {
    const headers = [
      'Employee ID',
      'Employee Name',
      'Department',
      'Designation',
      'Month',
      'Basic Salary (₹)',
      'HRA (₹)',
      'Allowances (₹)',
      'Gross Pay (₹)',
      'EPF (₹)',
      'ESIC (₹)',
      'Prof Tax (₹)',
      'TDS (₹)',
      'Total Deductions (₹)',
      'Net Take-Home (₹)',
      'Payment Status',
    ];
    const rows = filteredPayslips.map((p) => [
      p.employeeId,
      p.employeeName,
      p.department,
      p.designation,
      `${selectedMonth} ${selectedYear}`,
      p.basic,
      p.hra,
      p.specialAllowance,
      p.gross,
      p.epf,
      p.esic,
      p.professionalTax,
      p.tds,
      p.totalDeductions,
      p.netPay,
      p.status,
    ]);
    exportToCsv(`payroll_register_master_${selectedMonth}_${selectedYear}.csv`, headers, rows);
    success('Bulk Payslip Register Exported', `Exported ${filteredPayslips.length} employee compensation records (.csv).`);
  };

  const handleEmailAll = () => {
    success('Email Dispatch Batch', 'Payslip PDFs queued for dispatch to all 86 registered corporate emails.');
  };

  const filteredPayslips = payslips.filter((p) => {
    const matchesSearch =
      p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || p.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payslips Registry"
        subtitle="View, print, download and email official monthly compensation slips."
        breadcrumb={['Alize Software Services', 'Payroll', 'Payslips']}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEmailAll}
              disabled={payslips.length === 0}
              leftIcon={<Mail className="w-3.5 h-3.5" />}
            >
              Email All ({payslips.length})
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadAll}
              disabled={payslips.length === 0}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Bulk ZIP ({payslips.length})
            </Button>
          </>
        }
      />

      {/* Filter Bar */}
      <div className="p-3.5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter by employee name or EMP ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 h-[38px] text-xs rounded-lg border border-[#D1D5DB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>

          <div className="w-full sm:w-36">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-2.5 h-[38px] text-xs rounded-lg border border-[#D1D5DB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="October">October</option>
              <option value="September">September</option>
              <option value="August">August</option>
            </select>
          </div>

          <div className="w-full sm:w-28">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-2.5 h-[38px] text-xs rounded-lg border border-[#D1D5DB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className="w-full sm:w-44">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 h-[38px] text-xs rounded-lg border border-[#D1D5DB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payslip Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 border-b border-[#E5E7EB] dark:border-[#1F2937] text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3.5">Employee</th>
                <th className="py-3 px-3">Period</th>
                <th className="py-3 px-3 text-right">Gross (₹)</th>
                <th className="py-3 px-3 text-right">Total Deductions (₹)</th>
                <th className="py-3 px-3.5 text-right font-bold text-slate-900 dark:text-slate-100">Net Take-Home (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredPayslips.length > 0 ? (
                filteredPayslips.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 transition-colors duration-150 h-13"
                  >
                    <td className="py-2.5 px-3.5 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-[11px] shrink-0 border border-slate-200 dark:border-slate-700">
                          {p.employeeName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {p.employeeName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{p.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-sans text-[12px]">
                      {p.month} {p.year}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                      ₹{p.totalEarnings.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[#B91C1C] dark:text-red-400 font-medium">
                      ₹{p.totalDeductions.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3.5 text-right tabular-nums font-bold text-[#6D28D9] dark:text-purple-300 text-[13px]">
                      ₹{p.netSalary.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <Badge variant={p.status === 'Downloaded' ? 'success' : 'purple'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedPayslip(p)}
                          className="p-1.5 text-slate-500 hover:text-[#6D28D9] dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          title="View Official Slip"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            success(
                              'Download Complete',
                              `Saved Payslip_${p.employeeId}_${p.month}_${p.year}.pdf`
                            )
                          }
                          className="p-1.5 text-slate-500 hover:text-[#15803D] dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            success(
                              'Dispatched',
                              `Emailed password-protected payslip to registered ID.`
                            )
                          }
                          className="p-1.5 text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          title="Email Slip"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>

          {filteredPayslips.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={FileSpreadsheet}
                title="No payslips match your query"
                description="Try clearing your filters or selecting a different monthly payroll cycle."
                secondaryActionLabel="Reset Filters"
                onSecondaryAction={() => {
                  setSearchQuery('');
                  setSelectedDept('All');
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Printable Payslip Modal */}
      <PayslipModal
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        payslip={selectedPayslip}
      />
    </div>
  );
};
