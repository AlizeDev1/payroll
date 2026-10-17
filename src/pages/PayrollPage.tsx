import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  ShieldCheck,
  CreditCard,
  Download,
  Play,
  FileSpreadsheet,
  Check,
  Search,
  CheckCircle2,
  Users,
  Zap,
  UserCheck,
  BookOpen,
  History,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { payrollService } from '../services/payrollService';
import { MonthlyPayrollSummary, PayrollRecordItem, PayslipItem } from '../types';
import { ProcessPayrollModal } from '../components/modals/ProcessPayrollModal';
import { PayslipModal } from '../components/modals/PayslipModal';
import { ConnectedBankingModal } from '../components/modals/ConnectedBankingModal';
import { MakerCheckerApprovalModal } from '../components/modals/MakerCheckerApprovalModal';
import { GlAccountingModal } from '../components/modals/GlAccountingModal';
import { RetroactiveArrearsModal } from '../components/modals/RetroactiveArrearsModal';
import { useToast } from '../context/ToastContext';
import { usePageSeo } from '../hooks/usePageSeo';

export const PayrollPage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();

  usePageSeo({
    title: 'Monthly Payroll Run & Bank Disbursal | Alize Payroll',
    description: 'Process monthly payroll runs, direct bank disbursements, GL journal postings, and maker-checker dual approvals.',
    canonicalPath: '/payroll',
  });

  const [summary, setSummary] = useState<MonthlyPayrollSummary | null>(null);
  const [items, setItems] = useState<PayrollRecordItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isConnectedBankingOpen, setIsConnectedBankingOpen] = useState(false);
  const [isMakerCheckerOpen, setIsMakerCheckerOpen] = useState(false);
  const [isGlMapperOpen, setIsGlMapperOpen] = useState(false);
  const [isArrearsOpen, setIsArrearsOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipItem | null>(null);

  useEffect(() => {
    payrollService.getPayrollSummary(`${selectedMonth} ${selectedYear}`).then(setSummary);
    payrollService.getPayrollItems().then(setItems);
  }, [selectedMonth, selectedYear]);

  const handleOpenPayslip = async (employeeId: string) => {
    const slip = await payrollService.getPayslipById(employeeId);
    if (slip) {
      setSelectedPayslip(slip);
    } else {
      success('Payslip Preview', `Generated instant preview for ${employeeId}`);
    }
  };

  const handleApproveItem = (id: string, name: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'Paid' } : it))
    );
    success('Salary Disbursed', `Payment authorized for ${name}.`);
  };

  const filteredItems = items.filter(
    (it) =>
      it.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Section as Specified in Section 13 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E5E7EB] dark:border-[#1F2937]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
              Payroll
            </h1>
            <span className="text-lg sm:text-xl font-medium text-slate-400 dark:text-slate-500 font-heading">
              ·
            </span>
            <span className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300 font-heading">
              {selectedMonth} {selectedYear}
            </span>
            <Badge variant="success">Approved</Badge>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            Batch ID: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">ALIZE/PAY/2026-10/0091</span> · Authorized by {summary?.approvedBy || 'Jayanth R (Admin)'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="October">October</option>
              <option value="September">September</option>
              <option value="August">August</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMakerCheckerOpen(true)}
            leftIcon={<UserCheck className="w-3.5 h-3.5 text-purple-600" />}
          >
            Dual Approvals
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGlMapperOpen(true)}
            leftIcon={<BookOpen className="w-3.5 h-3.5 text-blue-600" />}
          >
            GL Journal
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsArrearsOpen(true)}
            leftIcon={<History className="w-3.5 h-3.5 text-amber-600" />}
          >
            Arrears
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => success('Export Complete', 'Exported October 2026 Payroll Register (.xlsx)')}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsConnectedBankingOpen(true)}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
            className="bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] font-bold shadow-xs text-xs"
          >
            ⚡ 1-Click Disburse
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsProcessModalOpen(true)}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            Process Wizard
          </Button>
        </div>
      </div>

      {/* 4 Financial Metrics Specified in Section 13 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Gross Payroll"
          value={summary ? `₹${summary.grossAmount.toLocaleString('en-IN')}` : (items.length > 0 ? `₹${items.reduce((acc, it) => acc + it.grossSalary, 0).toLocaleString('en-IN')}` : '₹0')}
          icon={Coins}
          description="Total earnings commitment"
        />
        <StatCard
          title="Deductions"
          value={summary ? `₹${summary.totalDeductions.toLocaleString('en-IN')}` : (items.length > 0 ? `₹${items.reduce((acc, it) => acc + it.totalDeductions, 0).toLocaleString('en-IN')}` : '₹0')}
          isPositive={false}
          icon={ShieldCheck}
          description="PF, ESI, PT, TDS & LOP"
        />
        <StatCard
          title="Net Payroll"
          value={summary ? `₹${summary.netPayable.toLocaleString('en-IN')}` : (items.length > 0 ? `₹${items.reduce((acc, it) => acc + it.netSalary, 0).toLocaleString('en-IN')}` : '₹0')}
          change="+5.4% vs last cycle"
          isPositive={true}
          icon={CreditCard}
          accent={true}
          description="Total net take-home payable"
        />
        <StatCard
          title="Employees"
          value={summary?.totalEmployees ?? items.length}
          subValue="Staff"
          icon={Users}
          description="Eligible for disbursement"
        />
      </div>

      {/* Search Toolbar */}
      <div className="p-3 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl flex items-center justify-between gap-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
        <div className="relative w-full max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search employee, ID, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0 text-xs text-slate-500 font-mono tabular-nums">
          <span>Showing {filteredItems.length} records</span>
        </div>
      </div>

      {/* Financial-Grade Payroll Table: Compact 48-56px rows, strong numerical hierarchy */}
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 border-b border-[#E5E7EB] dark:border-[#1F2937] text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3.5">Employee</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3 text-right">Gross (₹)</th>
                <th className="py-3 px-3 text-right">LOP (₹)</th>
                <th className="py-3 px-3 text-right">PF (₹)</th>
                <th className="py-3 px-3 text-right">ESI (₹)</th>
                <th className="py-3 px-3 text-right">TDS (₹)</th>
                <th className="py-3 px-3 text-right">Deductions (₹)</th>
                <th className="py-3 px-3.5 text-right font-bold text-slate-900 dark:text-slate-100">
                  Net Salary (₹)
                </th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 transition-colors duration-150 h-13"
                >
                  {/* Employee cell: Avatar + Name + ID (Section 12 specification) */}
                  <td className="py-2.5 px-3.5 font-sans">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-[11px] shrink-0 border border-slate-200 dark:border-slate-700">
                        {item.employeeName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {item.employeeName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.employeeId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-400 text-[12px]">
                    {item.department}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                    ₹{item.grossSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#B91C1C] dark:text-red-400">
                    {item.lopDeduction > 0 ? `₹${item.lopDeduction.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                    ₹{item.pfDeduction.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                    {item.esiDeduction > 0 ? `₹${item.esiDeduction.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                    ₹{item.tdsDeduction.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[#B91C1C] dark:text-red-400 font-medium">
                    ₹{item.totalDeductions.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3.5 text-right tabular-nums font-bold text-[#6D28D9] dark:text-purple-300 text-[13px]">
                    ₹{item.netSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <Badge variant={item.status === 'Paid' ? 'success' : 'purple'}>
                      {item.status === 'Paid' ? 'Disbursed' : 'Approved'}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenPayslip(item.employeeId)}
                        className="p-1.5 text-slate-400 hover:text-[#6D28D9] dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                        title="View Official Payslip"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </button>
                      {item.status !== 'Paid' && (
                        <button
                          onClick={() => handleApproveItem(item.id, item.employeeName)}
                          className="p-1.5 text-[#15803D] hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-md transition-colors"
                          title="Authorize Payment"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500 font-sans">
                    <Coins className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No payroll records found</p>
                    <p className="text-xs text-slate-400">Initialize a payroll run or adjust your search filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7-Step Payroll Run Wizard */}
      <ProcessPayrollModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        onPayrollCompleted={(updatedSummary) => {
          setSummary(updatedSummary);
          setItems((prev) => prev.map((it) => ({ ...it, status: 'Paid' })));
        }}
      />

      {/* Printable Payslip Modal */}
      <PayslipModal
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        payslip={selectedPayslip}
      />

      {/* Connected Banking Direct API Disbursal Modal */}
      <ConnectedBankingModal
        isOpen={isConnectedBankingOpen}
        onClose={() => setIsConnectedBankingOpen(false)}
        totalAmount={1842500}
        employeeCount={items.length || 86}
        onDisbursementSuccess={(utr) => {
          setItems((prev) => prev.map((it) => ({ ...it, status: 'Paid' })));
        }}
      />

      {/* Maker-Checker Dual Approval Workflow Modal */}
      <MakerCheckerApprovalModal
        isOpen={isMakerCheckerOpen}
        onClose={() => setIsMakerCheckerOpen(false)}
        onAuthorized={() => {
          success('CFO Approval Recorded', 'Payroll batch marked as fully authorized.');
        }}
      />

      {/* General Ledger (GL) Accounting Mapper Modal */}
      <GlAccountingModal
        isOpen={isGlMapperOpen}
        onClose={() => setIsGlMapperOpen(false)}
      />

      {/* Retroactive Pay & Arrears Adjustment Engine Modal */}
      <RetroactiveArrearsModal
        isOpen={isArrearsOpen}
        onClose={() => setIsArrearsOpen(false)}
      />
    </div>
  );
};
