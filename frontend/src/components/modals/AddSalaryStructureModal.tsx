import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { payrollService } from '../../services/payrollService';
import { SalaryStructure } from '../../types';

interface AddSalaryStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStructureAdded: (struct: SalaryStructure) => void;
}

export const AddSalaryStructureModal: React.FC<AddSalaryStructureModalProps> = ({
  isOpen,
  onClose,
  onStructureAdded,
}) => {
  const { success } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basicPct, setBasicPct] = useState(45);
  const [hraPct, setHraPct] = useState(22.5);
  const [conveyance, setConveyance] = useState(1600);
  const [specialAllowance, setSpecialAllowance] = useState(32.5);
  const [pfApplicable, setPfApplicable] = useState(true);
  const [esiApplicable, setEsiApplicable] = useState(false);
  const [ptApplicable, setPtApplicable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newStruct = await payrollService.createSalaryStructure({
        name,
        description: description || 'Custom compensation tier',
        employeeCount: 0,
        basicPct: Number(basicPct),
        hraPct: Number(hraPct),
        conveyance: Number(conveyance),
        specialAllowance: Number(specialAllowance),
        pfApplicable,
        esiApplicable,
        ptApplicable,
        status: 'Active',
      });
      onStructureAdded(newStruct);
      success('Salary Structure Created', `${name} is ready for assignment.`);
      onClose();
      setName('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Salary Structure & Component Rules"
      description="Configure Indian statutory formulas, earnings percentage split, and statutory rules."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Structure Template Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Technology Specialists & Architects (Band A)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Description
          </label>
          <input
            type="text"
            placeholder="Applicable bands or job levels..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-[8px] border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Earnings Components Split (% of Gross CTC)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Basic Salary (%)</label>
              <input
                type="number"
                value={basicPct}
                onChange={(e) => setBasicPct(Number(e.target.value))}
                className="w-full h-[36px] px-2.5 text-xs rounded-[6px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">HRA (% of Basic / CTC)</label>
              <input
                type="number"
                value={hraPct}
                onChange={(e) => setHraPct(Number(e.target.value))}
                className="w-full h-[36px] px-2.5 text-xs rounded-[6px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Special Allowance (%)</label>
              <input
                type="number"
                value={specialAllowance}
                onChange={(e) => setSpecialAllowance(Number(e.target.value))}
                className="w-full h-[36px] px-2.5 text-xs rounded-[6px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-[8px] border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Statutory Compliance & Deductions Toggles
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={pfApplicable}
                onChange={(e) => setPfApplicable(e.target.checked)}
                className="rounded-[4px] text-[#6D28D9] focus:ring-[#6D28D9]"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Provident Fund (EPF 12%)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={esiApplicable}
                onChange={(e) => setEsiApplicable(e.target.checked)}
                className="rounded-[4px] text-[#6D28D9] focus:ring-[#6D28D9]"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">ESIC Contribution (0.75%)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ptApplicable}
                onChange={(e) => setPtApplicable(e.target.checked)}
                className="rounded-[4px] text-[#6D28D9] focus:ring-[#6D28D9]"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Professional Tax (PT)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Save Structure
          </Button>
        </div>
      </form>
    </Modal>
  );
};
