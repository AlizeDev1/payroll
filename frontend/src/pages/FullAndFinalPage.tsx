import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Coins,
  Eye,
  Check,
  FileCheck2,
  Search,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { complianceService } from '../services/complianceService';
import { FullAndFinalSettlement } from '../types';
import { useToast } from '../context/ToastContext';

export const FullAndFinalPage: React.FC = () => {
  const { success } = useToast();
  const [settlements, setSettlements] = useState<FullAndFinalSettlement[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSettlement, setSelectedSettlement] = useState<FullAndFinalSettlement | null>(null);

  useEffect(() => {
    complianceService.getFullAndFinalSettlements().then(setSettlements);
  }, []);

  const handleUpdateStatus = async (id: string, status: FullAndFinalSettlement['status']) => {
    const updated = await complianceService.updateSettlementStatus(id, status);
    setSettlements((prev) => prev.map((s) => (s.id === id ? updated : s)));
    success('F&F Settlement Updated', `Status set to ${status} for ${updated.employeeName}.`);
  };

  const pendingCount = settlements.filter((s) => s.status === 'Pending').length;
  const reviewCount = settlements.filter((s) => s.status === 'Under Review').length;
  const approvedCount = settlements.filter((s) => s.status === 'Approved').length;
  const settledCount = settlements.filter((s) => s.status === 'Settled').length;

  const filtered = settlements.filter((s) => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesSearch =
      s.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Full & Final (F&F) Settlements"
        subtitle="Compute exit compensation, leave encashment days, gratuity eligibility, and notice shortfall deductions."
        breadcrumb={['Overview', 'Compliance', 'Full & Final']}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Pending Exits"
          value={pendingCount}
          icon={Clock}
          isPositive={false}
          description="Handover ongoing"
        />
        <StatCard
          title="Under Review"
          value={reviewCount}
          icon={FileCheck2}
          description="Asset clearance audit"
        />
        <StatCard
          title="Approved Payout"
          value={approvedCount}
          icon={CheckCircle2}
          isPositive={true}
          description="Bank transfer queued"
        />
        <StatCard
          title="Fully Settled"
          value={settledCount}
          icon={Coins}
          description="No-dues certificate issued"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-1 overflow-x-auto p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700/60 w-fit">
          {['ALL', 'Pending', 'Under Review', 'Approved', 'Settled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-[6px] transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Exits' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[8px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="No Settlements Found"
            description="No F&F settlement records match your selected criteria."
            actionLabel="Reset Filters"
            onAction={() => {
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-3.5">Employee</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Last Working Day</th>
                  <th className="py-3 px-3 text-right">Unpaid Salary</th>
                  <th className="py-3 px-3 text-right">Leave Encashment</th>
                  <th className="py-3 px-3 text-right">Deductions</th>
                  <th className="py-3 px-3 text-right">Net Settlement</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[#6D28D9] dark:text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {s.employeeName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {s.employeeName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-xs">
                      {s.department}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono tabular-nums text-[11px]">{s.lastWorkingDay}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      ₹{s.unpaidSalary.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#15803D] dark:text-emerald-400">
                      ₹{s.leaveEncashmentAmount.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400">({s.leaveEncashmentDays}d)</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#B91C1C] dark:text-red-400">
                      ₹{(s.noticeRecovery + s.loanBalanceRecovery + s.taxDeduction).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-[#6D28D9] dark:text-purple-300">
                      ₹{s.netSettlementAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge
                        variant={
                          s.status === 'Settled'
                            ? 'success'
                            : s.status === 'Approved'
                            ? 'purple'
                            : 'warning'
                        }
                      >
                        {s.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedSettlement(s)}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Detailed Sheet"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {s.status === 'Under Review' && (
                          <button
                            onClick={() => handleUpdateStatus(s.id, 'Approved')}
                            className="p-1 text-[#15803D] hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-[6px] transition-colors"
                            title="Authorize F&F"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settlement Detail Modal */}
      {selectedSettlement && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSettlement(null)}
          title={`F&F Settlement Sheet: ${selectedSettlement.employeeName}`}
          description={`Exit Date: ${selectedSettlement.lastWorkingDay} · Notice Served: ${selectedSettlement.noticePeriodDays} days`}
          maxWidth="md"
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-[8px] border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">
                Payable Components (Earnings)
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Prorated Unpaid Salary:</span>
                <span className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                  ₹{selectedSettlement.unpaidSalary.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Earned Leave Encashment ({selectedSettlement.leaveEncashmentDays} days):</span>
                <span className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                  ₹{selectedSettlement.leaveEncashmentAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Bonus / Pro-rata Incentive:</span>
                <span className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                  ₹{selectedSettlement.bonusIncentive.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-[8px] border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">
                Deductions & Recoveries
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Outstanding Loan Recovery:</span>
                <span className="font-mono tabular-nums font-medium text-[#B91C1C] dark:text-red-400">
                  ₹{selectedSettlement.loanBalanceRecovery.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">TDS Tax Withheld:</span>
                <span className="font-mono tabular-nums font-medium text-[#B91C1C] dark:text-red-400">
                  ₹{selectedSettlement.taxDeduction.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/40 rounded-[8px] border border-purple-200 dark:border-purple-900/60 flex justify-between items-center text-xs font-bold">
              <span className="text-[#6D28D9] dark:text-purple-200">Final Net Settlement Amount:</span>
              <span className="font-mono text-base text-slate-900 dark:text-slate-100 tabular-nums">
                ₹{selectedSettlement.netSettlementAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
