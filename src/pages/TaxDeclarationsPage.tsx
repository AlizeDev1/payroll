import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  Eye,
  Check,
  X,
  Download,
  Search,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { AiTaxOptimizerModal } from '../components/modals/AiTaxOptimizerModal';
import { complianceService } from '../services/complianceService';
import { TaxDeclaration } from '../types';
import { useToast } from '../context/ToastContext';

export const TaxDeclarationsPage: React.FC = () => {
  const { success } = useToast();
  const [declarations, setDeclarations] = useState<TaxDeclaration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [regimeFilter, setRegimeFilter] = useState<'ALL' | 'New' | 'Old'>('ALL');
  const [selectedDeclaration, setSelectedDeclaration] = useState<TaxDeclaration | null>(null);
  const [isAiOptimizerOpen, setIsAiOptimizerOpen] = useState(false);

  useEffect(() => {
    complianceService.getTaxDeclarations().then(setDeclarations);
  }, []);

  const handleApplyOptimization = (employeeId: string, newRegime: 'New Regime (115BAC)' | 'Old Regime') => {
    setDeclarations((prev) =>
      prev.map((d) =>
        d.employeeId === employeeId || d.employeeName.toLowerCase().includes(employeeId.toLowerCase())
          ? { ...d, taxRegime: newRegime }
          : d
      )
    );
  };

  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    const updated = await complianceService.updateTaxDeclarationStatus(
      id,
      status,
      'Rajesh Kulkarni (Finance Head)'
    );
    setDeclarations((prev) => prev.map((d) => (d.id === id ? updated : d)));
    success(`Tax Declaration ${status}`, `Verified deductions for ${updated.employeeName}.`);
  };

  const filtered = declarations.filter((d) => {
    const matchesSearch =
      d.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegime =
      regimeFilter === 'ALL'
        ? true
        : regimeFilter === 'New'
        ? d.taxRegime.includes('New')
        : d.taxRegime.includes('Old');
    return matchesSearch && matchesRegime;
  });

  const newRegimeCount = declarations.filter((d) => d.taxRegime.includes('New')).length;
  const oldRegimeCount = declarations.filter((d) => d.taxRegime.includes('Old')).length;
  const pendingCount = declarations.filter((d) => d.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Income Tax Declarations (Section 115BAC)"
        subtitle="Review employee tax regime elections (Old vs New) and Section 80C, 80D, and HRA exemption proofs."
        breadcrumb={['Overview', 'Compliance', 'Tax Declarations']}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAiOptimizerOpen(true)}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              ⚡ AI Tax Regime Optimizer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => success('Exported', 'Downloaded Tax Regime Declarations Report (.xlsx)')}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export All Declarations
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          title="New Regime (115BAC)"
          value={newRegimeCount.toString()}
          subValue={`${((newRegimeCount / (declarations.length || 1)) * 100).toFixed(1)}%`}
          icon={CheckCircle2}
          description="Default concessional rate"
        />
        <StatCard
          title="Old Regime (With Proofs)"
          value={oldRegimeCount.toString()}
          subValue={`${((oldRegimeCount / (declarations.length || 1)) * 100).toFixed(1)}%`}
          icon={FileCheck2}
          description="80C, 80D & HRA exemptions"
        />
        <StatCard
          title="Pending Proof Audits"
          value={pendingCount}
          icon={Clock}
          isPositive={false}
          description="Requires finance verification"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700/60 w-fit">
          <button
            onClick={() => setRegimeFilter('ALL')}
            className={`px-3 py-1 text-xs font-semibold rounded-[6px] transition-colors ${
              regimeFilter === 'ALL'
                ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Regimes ({declarations.length})
          </button>
          <button
            onClick={() => setRegimeFilter('New')}
            className={`px-3 py-1 text-xs font-semibold rounded-[6px] transition-colors ${
              regimeFilter === 'New'
                ? 'bg-white dark:bg-[#111827] text-[#6D28D9] dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            New Regime ({newRegimeCount})
          </button>
          <button
            onClick={() => setRegimeFilter('Old')}
            className={`px-3 py-1 text-xs font-semibold rounded-[6px] transition-colors ${
              regimeFilter === 'Old'
                ? 'bg-white dark:bg-[#111827] text-amber-700 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Old Regime ({oldRegimeCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search employee or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[8px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>
      </div>

      {/* Declarations Table */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="No Declarations Found"
            description="No tax investment declarations match your search criteria or regime filter."
            actionLabel="Reset Filter"
            onAction={() => {
              setSearchQuery('');
              setRegimeFilter('ALL');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-3.5">Employee Name</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Fiscal Year</th>
                  <th className="py-3 px-3">Tax Regime</th>
                  <th className="py-3 px-3 text-right">80C Deductions</th>
                  <th className="py-3 px-3 text-right">Total Declared</th>
                  <th className="py-3 px-3">Submitted Date</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filtered.map((decl) => (
                  <tr
                    key={decl.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[#6D28D9] dark:text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {decl.employeeName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {decl.employeeName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-xs">
                      {decl.department}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{decl.financialYear}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-[4px] text-[11px] font-semibold border ${
                          decl.taxRegime.includes('New')
                            ? 'bg-purple-50 text-[#6D28D9] border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60'
                            : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60'
                        }`}
                      >
                        {decl.taxRegime}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      ₹{decl.section80C.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                      ₹{decl.totalDeclaredDeductions.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono tabular-nums text-[11px]">{decl.submittedDate}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge
                        variant={
                          decl.status === 'Approved'
                            ? 'success'
                            : decl.status === 'Pending'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {decl.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedDeclaration(decl)}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Inspect Exemption Proofs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {decl.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(decl.id, 'Approved')}
                              className="p-1 text-[#15803D] hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-[6px] transition-colors"
                              title="Accept Proofs"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(decl.id, 'Rejected')}
                              className="p-1 text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/60 rounded-[6px] transition-colors"
                              title="Reject Declaration"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
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

      {/* Tax Declaration Detail Modal */}
      {selectedDeclaration && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDeclaration(null)}
          title={`Investment Declaration — ${selectedDeclaration.employeeName}`}
          description={`${selectedDeclaration.financialYear} · ${selectedDeclaration.taxRegime}`}
          maxWidth="md"
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-[8px] border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Section 80C (PPF, ELSS, EPF, Life Insurance):</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  ₹{selectedDeclaration.section80C.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Section 80D (Medical Insurance):</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  ₹{selectedDeclaration.section80D.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Section 10(13A) House Rent Allowance (HRA):</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  ₹{selectedDeclaration.hraExemption.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Section 24(b) Home Loan Interest:</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  ₹{selectedDeclaration.homeLoanInterest.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-slate-200 dark:border-slate-700/80 font-bold text-xs">
                <span className="text-slate-900 dark:text-slate-100">Total Tax Exemptions Allowed:</span>
                <span className="font-mono text-[#6D28D9] dark:text-purple-300 tabular-nums">
                  ₹{selectedDeclaration.totalDeclaredDeductions.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Reviewed by: {selectedDeclaration.reviewedBy || 'Pending Finance Verification'}. Supporting receipts submitted by employee.
            </p>
          </div>
        </Modal>
      )}

      {/* AI Tax Regime Optimizer Modal */}
      <AiTaxOptimizerModal
        isOpen={isAiOptimizerOpen}
        onClose={() => setIsAiOptimizerOpen(false)}
        onApplyOptimization={handleApplyOptimization}
      />
    </div>
  );
};

