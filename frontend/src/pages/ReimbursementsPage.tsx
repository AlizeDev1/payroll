import React, { useState, useEffect } from 'react';
import {
  HandCoins,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Plus,
  Eye,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { reimbursementService } from '../services/reimbursementService';
import { ReimbursementClaim, ClaimStatus } from '../types';
import { AddReimbursementModal } from '../components/modals/AddReimbursementModal';
import { useToast } from '../context/ToastContext';

export const ReimbursementsPage: React.FC = () => {
  const { success } = useToast();
  const [claims, setClaims] = useState<ReimbursementClaim[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Paid' | 'Rejected'>('All');
  const [selectedClaim, setSelectedClaim] = useState<ReimbursementClaim | null>(null);

  useEffect(() => {
    reimbursementService.getClaims().then(setClaims);
  }, []);

  const handleUpdateStatus = async (id: string, status: ClaimStatus) => {
    const updated = await reimbursementService.updateClaimStatus(
      id,
      status,
      'Rajesh Kulkarni (Finance)',
      status === 'Approved' ? 'Verified invoice & GSTIN.' : 'Tax invoice missing.'
    );
    setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
    success(`Claim ${status}`, `Updated ${updated.claimId}.`);
  };

  const pendingCount = claims.filter((c) => c.status === 'Pending').length;
  const approvedCount = claims.filter((c) => c.status === 'Approved').length;
  const paidCount = claims.filter((c) => c.status === 'Paid').length;
  const totalAmount = claims.reduce((acc, c) => acc + c.amount, 0);

  const filteredClaims = claims.filter((c) => {
    if (activeTab === 'All') return true;
    return c.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Claims & Reimbursements"
        subtitle="Manage employee business travel, meals, broadband, and medical bill clearances."
        breadcrumb={['Alize Software Services', 'Payroll', 'Reimbursements']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            File New Claim
          </Button>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Pending Audit"
          value={pendingCount}
          icon={Clock}
          isPositive={false}
          description="Awaiting finance review"
        />
        <StatCard
          title="Approved Claims"
          value={approvedCount}
          icon={CheckCircle2}
          isPositive={true}
          description="Added to next payroll"
        />
        <StatCard
          title="Paid Claims"
          value={paidCount}
          icon={CreditCard}
          description="Direct bank credited"
        />
        <StatCard
          title="Rejected Claims"
          value={claims.filter((c) => c.status === 'Rejected').length}
          icon={XCircle}
          description="Invalid receipts"
        />
        <StatCard
          title="Total Claimed"
          value={`₹${totalAmount.toLocaleString('en-IN')}`}
          icon={HandCoins}
          accent={true}
          description="October fiscal total"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] dark:bg-slate-800 rounded-lg border border-[#E5E7EB] dark:border-[#1F2937] w-fit">
        {(['All', 'Pending', 'Approved', 'Paid', 'Rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.05)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Claims Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 border-b border-[#E5E7EB] dark:border-[#1F2937] text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3.5">Claim ID</th>
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Amount (₹)</th>
                <th className="py-3 px-3">Bill Date</th>
                <th className="py-3 px-3">Submitted</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 transition-colors duration-150 h-13"
                  >
                    <td className="py-2.5 px-3.5 font-semibold text-[#6D28D9] dark:text-purple-300">
                      {claim.claimId}
                    </td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                      {claim.employeeName}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300">
                      {claim.category}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                      ₹{claim.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 tabular-nums">{claim.billDate}</td>
                    <td className="py-2.5 px-3 text-slate-500 tabular-nums">{claim.submittedDate}</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <Badge
                        variant={
                          claim.status === 'Paid'
                            ? 'success'
                            : claim.status === 'Approved'
                            ? 'purple'
                            : claim.status === 'Pending'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {claim.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3.5 text-center font-sans">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedClaim(claim)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {claim.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(claim.id, 'Approved')}
                              className="p-1.5 text-[#15803D] hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-md transition-colors"
                              title="Approve Claim"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(claim.id, 'Rejected')}
                              className="p-1.5 text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/60 rounded-md transition-colors"
                              title="Reject Claim"
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

          {filteredClaims.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={HandCoins}
                title="No reimbursement claims found"
                description={`There are currently no expense claims in the ${activeTab.toLowerCase()} status category.`}
                actionLabel="File Claim"
                onAction={() => setIsAddModalOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedClaim(null)}
          title={`Claim Audit: ${selectedClaim.claimId}`}
          description={`Filed by ${selectedClaim.employeeName} on ${selectedClaim.submittedDate}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937]">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Expense Category</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{selectedClaim.category}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Amount Claimed</span>
                <p className="font-bold font-mono text-base text-[#6D28D9] dark:text-purple-300 mt-0.5">
                  ₹{selectedClaim.amount.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Tax Invoice Date</span>
                <p className="font-mono font-semibold mt-0.5">{selectedClaim.billDate}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Audit Status</span>
                <div className="mt-0.5">
                  <Badge variant={selectedClaim.status === 'Approved' ? 'success' : 'warning'}>
                    {selectedClaim.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-semibold text-[11px]">Business Description:</span>
              <p className="p-3 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-lg mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedClaim.description}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6D28D9]" />
                <span className="font-mono text-[11px]">{selectedClaim.receiptAttachment || 'tax_invoice_receipt.pdf'}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => success('Downloaded', 'Receipt downloaded for verification')}
              >
                Inspect Receipt
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <AddReimbursementModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onClaimSubmitted={(newClaim) => setClaims((prev) => [newClaim, ...prev])}
      />
    </div>
  );
};
