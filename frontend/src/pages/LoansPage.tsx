import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Coins,
  TrendingDown,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { loanService } from '../services/loanService';
import { LoanAdvance } from '../types';
import { AddLoanModal } from '../components/modals/AddLoanModal';
import { useToast } from '../context/ToastContext';

export const LoansPage: React.FC = () => {
  const { success } = useToast();
  const [loans, setLoans] = useState<LoanAdvance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loanService.getLoans().then(setLoans);
  }, []);

  const totalOutstanding = loans
    .filter((l) => l.status === 'Active')
    .reduce((acc, l) => acc + l.remainingAmount, 0);

  const monthlyRecoveryTotal = loans
    .filter((l) => l.status === 'Active')
    .reduce((acc, l) => acc + l.monthlyDeduction, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Loans & Salary Advances Ledger"
        subtitle="Manage interest-free staff loans, emergency advances, and automatic monthly EMI payroll recoveries."
        breadcrumb={['Alize Software Services', 'Payroll', 'Loans & Advances']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Grant Loan / Advance
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <StatCard
          title="Active Loan Accounts"
          value={loans.filter((l) => l.status === 'Active').length}
          subValue="Staff"
          icon={CreditCard}
          description="In repayment cycle"
        />
        <StatCard
          title="Total Outstanding Balance"
          value={`₹${totalOutstanding.toLocaleString('en-IN')}`}
          icon={Coins}
          accent={true}
          description="Principal receivable"
        />
        <StatCard
          title="Monthly Payroll Recovery"
          value={`₹${monthlyRecoveryTotal.toLocaleString('en-IN')}`}
          icon={TrendingDown}
          description="Deducted in next cycle"
        />
      </div>

      {/* Loans Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 border-b border-[#E5E7EB] dark:border-[#1F2937] text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3.5">Loan ID</th>
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3 text-right">Sanctioned (₹)</th>
                <th className="py-3 px-3 text-right">Repaid (₹)</th>
                <th className="py-3 px-3 text-right">Balance Due (₹)</th>
                <th className="py-3 px-3 text-right">Monthly EMI (₹)</th>
                <th className="py-3 px-3 text-center min-w-[130px]">Repayment Progress</th>
                <th className="py-3 px-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {loans.length > 0 ? (
                loans.map((loan) => {
                  const progressPct = loan.originalAmount > 0
                    ? Math.min(100, Math.round(((loan.repaidAmount || 0) / loan.originalAmount) * 100))
                    : 0;
                  return (
                    <tr
                      key={loan.id}
                      className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 transition-colors duration-150 h-13"
                    >
                      <td className="py-2.5 px-3.5 font-semibold text-[#6D28D9] dark:text-purple-300">
                        {loan.loanId}
                      </td>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                        {loan.employeeName}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-400 text-[12px]">
                        {loan.loanType}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-slate-900 dark:text-slate-100">
                        ₹{loan.originalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-[#15803D] dark:text-emerald-400">
                        ₹{loan.repaidAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-[#B91C1C] dark:text-red-400">
                        ₹{loan.remainingAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-medium text-slate-800 dark:text-slate-200">
                        ₹{loan.monthlyDeduction.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded overflow-hidden mb-1">
                          <div
                            className="bg-[#6D28D9] h-full rounded transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                          {progressPct}% ({loan.remainingMonths} mos left)
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-center font-sans">
                        <Badge variant={loan.status === 'Active' ? 'purple' : 'success'}>
                          {loan.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              ) : null}
            </tbody>
          </table>

          {loans.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={CreditCard}
                title="No active staff loans"
                description="There are currently no staff loans or salary advances logged in the ledger."
                actionLabel="Grant Loan"
                onAction={() => setIsModalOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      <AddLoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoanCreated={(newLoan) => {
          setLoans((prev) => [newLoan, ...prev]);
          success('Loan Disbursed', `Loan ${newLoan.loanId} created for ${newLoan.employeeName}`);
        }}
      />
    </div>
  );
};
