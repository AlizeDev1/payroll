import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
  Check,
  X,
  Coins,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { leaveService } from '../services/leaveService';
import { LeaveRequest, LeaveStatus } from '../types';
import { ApplyLeaveModal } from '../components/modals/ApplyLeaveModal';
import { LeaveEncashmentModal } from '../components/modals/LeaveEncashmentModal';
import { useToast } from '../context/ToastContext';

export const LeavePage: React.FC = () => {
  const { success } = useToast();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isEncashmentModalOpen, setIsEncashmentModalOpen] = useState(false);
  const [viewLeave, setViewLeave] = useState<LeaveRequest | null>(null);

  useEffect(() => {
    leaveService.getLeaves().then(setLeaves);
  }, []);

  const handleStatusUpdate = async (id: string, status: LeaveStatus) => {
    const updated = await leaveService.updateLeaveStatus(
      id,
      status,
      'Jayanth R (Admin)',
      status === 'Approved' ? 'Leave granted.' : 'Rejected due to sprint milestones.'
    );
    setLeaves((prev) => prev.map((l) => (l.id === id ? updated : l)));
    success(`Leave Request ${status}`, `Updated status for ${updated.employeeName}.`);
  };

  const filteredLeaves = leaves.filter((l) => {
    if (activeTab === 'All') return true;
    return l.status === activeTab;
  });

  const totalCount = leaves.length;
  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
  const rejectedCount = leaves.filter((l) => l.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        subtitle="Manage employee paid time off, compensatory leaves, and manager approval queues."
        breadcrumb={['Alize Software Services', 'Workforce', 'Leave Management']}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEncashmentModalOpen(true)}
              leftIcon={<Coins className="w-3.5 h-3.5 text-amber-600" />}
            >
              ⚡ Annual Leave Encashment
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsApplyModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Apply Leave
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Requests"
          value={totalCount}
          icon={CalendarDays}
          description="Fiscal Year 2026-27"
        />
        <StatCard
          title="Pending Approval"
          value={pendingCount}
          icon={Clock}
          description="Requires action"
          isPositive={false}
        />
        <StatCard
          title="Approved Leaves"
          value={approvedCount}
          icon={CheckCircle2}
          description="Roster updated"
          isPositive={true}
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon={XCircle}
          description="Ineligible / conflicts"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] dark:bg-slate-800 rounded-lg border border-[#E5E7EB] dark:border-[#1F2937] w-fit">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.05)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab} {tab === 'Pending' && pendingCount > 0 && `(${pendingCount})`}
          </button>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 border-b border-[#E5E7EB] dark:border-[#1F2937] text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3.5">Employee</th>
                <th className="py-3 px-3">Leave Type</th>
                <th className="py-3 px-3">Duration (From - To)</th>
                <th className="py-3 px-3 text-center">Days</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 transition-colors duration-150 h-13"
                  >
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={leave.avatar}
                          alt={leave.employeeName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate text-[12px]">
                            {leave.employeeName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{leave.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300 text-[12px]">
                      {leave.leaveType}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 tabular-nums text-[11px]">
                      {leave.fromDate} → {leave.toDate}
                    </td>

                    <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                      {leave.daysCount} d
                    </td>

                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate text-[12px]">
                      {leave.reason}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <Badge
                        variant={
                          leave.status === 'Approved'
                            ? 'success'
                            : leave.status === 'Pending'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {leave.status}
                      </Badge>
                    </td>

                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewLeave(leave)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {leave.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(leave.id, 'Approved')}
                              className="p-1.5 text-[#15803D] hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-md transition-colors"
                              title="Approve Leave"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(leave.id, 'Rejected')}
                              className="p-1.5 text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/60 rounded-md transition-colors"
                              title="Reject Leave"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>

          {filteredLeaves.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={CalendarDays}
                title="No leave requests in this category"
                description={`There are currently no ${activeTab.toLowerCase()} leave requests logged in the system.`}
                actionLabel="Apply Leave"
                onAction={() => setIsApplyModalOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onLeaveApplied={(newLeave) => setLeaves((prev) => [newLeave, ...prev])}
      />

      {/* Leave Details Modal */}
      {viewLeave && (
        <Modal
          isOpen={true}
          onClose={() => setViewLeave(null)}
          title={`Leave Request – ${viewLeave.employeeName}`}
          description={`Applied on ${viewLeave.appliedDate}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937]">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Leave Type</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{viewLeave.leaveType}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Total Days</span>
                <p className="font-semibold font-mono text-slate-900 dark:text-slate-100 mt-0.5">{viewLeave.daysCount} Working Days</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Date Range</span>
                <p className="font-mono font-semibold mt-0.5">{viewLeave.fromDate} to {viewLeave.toDate}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Status</span>
                <div className="mt-0.5">
                  <Badge variant={viewLeave.status === 'Approved' ? 'success' : 'warning'}>
                    {viewLeave.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-semibold text-[11px]">Reason stated by Employee:</span>
              <p className="p-3 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-lg mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                {viewLeave.reason}
              </p>
            </div>

            {viewLeave.reviewedBy && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#15803D] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <span className="font-semibold">Reviewed by:</span> {viewLeave.reviewedBy} on {viewLeave.reviewedDate}
                {viewLeave.comments && <p className="mt-1 italic">"{viewLeave.comments}"</p>}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Annual Leave Encashment Engine Modal */}
      <LeaveEncashmentModal
        isOpen={isEncashmentModalOpen}
        onClose={() => setIsEncashmentModalOpen(false)}
      />
    </div>
  );
};
