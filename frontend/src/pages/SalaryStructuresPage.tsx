import React, { useState, useEffect } from 'react';
import {
  Coins,
  Plus,
  Edit2,
  Code,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SkeletonCard } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { payrollService } from '../services/payrollService';
import { SalaryStructure } from '../types';
import { AddSalaryStructureModal } from '../components/modals/AddSalaryStructureModal';
import { VisualPayheadFormulaModal } from '../components/modals/VisualPayheadFormulaModal';
import { useToast } from '../context/ToastContext';

export const SalaryStructuresPage: React.FC = () => {
  const { success } = useToast();
  const [structures, setStructures] = useState<SalaryStructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);

  useEffect(() => {
    payrollService.getSalaryStructures().then((data) => {
      setStructures(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary Structures & Component Formulas"
        subtitle="Manage salary rules, CTC percentage breakdowns, and statutory deductions (PF, ESI, PT)."
        breadcrumb={['Alize Software Services', 'Payroll', 'Salary Structures']}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFormulaModalOpen(true)}
              leftIcon={<Code className="w-3.5 h-3.5 text-purple-600" />}
            >
              ⚡ Visual Formula Builder
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Create Salary Structure
            </Button>
          </div>
        }
      />

      {/* Salary Structures Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : structures.length === 0 ? (
        <EmptyState
          icon={Coins}
          title="No Salary Structures Configured"
          description="Create CTC breakdown templates (Basic, HRA, Special Allowance, PF, ESIC) to assign to departments and designations."
          actionLabel="Create First Structure"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {structures.map((struct) => (
            <div
              key={struct.id}
              className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center text-[#6D28D9] shrink-0">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
                        {struct.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {struct.employeeCount} Assigned Staff
                      </span>
                    </div>
                  </div>
                  <Badge variant={struct.status === 'Active' ? 'success' : 'neutral'}>
                    {struct.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {struct.description}
                </p>

                {/* Earnings Breakdown */}
                <div className="p-3.5 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl space-y-2 text-xs border border-[#E5E7EB] dark:border-[#1F2937] mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                    Earnings Formula
                  </p>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600 dark:text-slate-300 text-[11px]">Basic Pay:</span>
                    <span className="font-mono font-semibold text-[11px] text-slate-900 dark:text-slate-100">{struct.basicPct}% of CTC</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600 dark:text-slate-300 text-[11px]">House Rent Allowance (HRA):</span>
                    <span className="font-mono font-semibold text-[11px] text-slate-900 dark:text-slate-100">{struct.hraPct}% of CTC</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600 dark:text-slate-300 text-[11px]">Conveyance Allowance:</span>
                    <span className="font-mono font-semibold text-[11px] text-slate-900 dark:text-slate-100">₹{struct.conveyance.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600 dark:text-slate-300 text-[11px]">Special Allowance:</span>
                    <span className="font-mono font-semibold text-[11px] text-slate-900 dark:text-slate-100">{struct.specialAllowance}% (Residual)</span>
                  </div>
                </div>

                {/* Deductions Breakdown */}
                <div className="p-3.5 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl space-y-2 text-xs border border-[#E5E7EB] dark:border-[#1F2937]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                    Statutory Deductions
                  </p>
                  <div className="flex justify-between items-center text-[11px] py-0.5">
                    <span className="text-slate-600 dark:text-slate-300">EPFO Provident Fund (12%):</span>
                    <span className={`font-semibold ${struct.pfApplicable ? 'text-[#15803D]' : 'text-slate-400'}`}>
                      {struct.pfApplicable ? 'Enforced' : 'Exempt'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] py-0.5">
                    <span className="text-slate-600 dark:text-slate-300">ESIC Insurance (0.75%):</span>
                    <span className={`font-semibold ${struct.esiApplicable ? 'text-[#15803D]' : 'text-slate-400'}`}>
                      {struct.esiApplicable ? 'Enforced' : 'Exempt'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] py-0.5">
                    <span className="text-slate-600 dark:text-slate-300">Professional Tax (PT):</span>
                    <span className={`font-semibold ${struct.ptApplicable ? 'text-[#15803D]' : 'text-slate-400'}`}>
                      {struct.ptApplicable ? 'State Slabs' : 'Exempt'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  ID: <strong className="text-slate-800 dark:text-slate-200">{struct.id.toUpperCase()}</strong>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFormulaModalOpen(true)}
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit Formula
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddSalaryStructureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStructureAdded={(newStruct) => setStructures((prev) => [...prev, newStruct])}
      />

      {/* Visual Payhead Formula Builder Modal */}
      <VisualPayheadFormulaModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
      />
    </div>
  );
};
