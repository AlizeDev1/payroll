import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { employeeService } from '../../services/employeeService';
import { Department } from '../../types';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepartmentAdded: (dept: Department) => void;
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
  onDepartmentAdded,
}) => {
  const { success } = useToast();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [headName, setHeadName] = useState('');
  const [budgetMonthly, setBudgetMonthly] = useState(2000000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dept = await employeeService.createDepartment({
        name,
        code: code.toUpperCase(),
        headName: headName || 'To Be Assigned',
        headId: 'EMP001',
        employeeCount: 0,
        budgetMonthly: Number(budgetMonthly),
        status: 'Active',
      });
      onDepartmentAdded(dept);
      success('Department Created', `${name} (${code}) added to organizational hierarchy.`);
      onClose();
      setName('');
      setCode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Department"
      description="Add a functional department unit and cost center."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Department Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Quality Assurance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Code (Prefix) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. QA"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Monthly Budget (₹)
            </label>
            <input
              type="number"
              value={budgetMonthly}
              onChange={(e) => setBudgetMonthly(Number(e.target.value))}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Department Head
          </label>
          <input
            type="text"
            placeholder="e.g. Vikram Malhotra"
            value={headName}
            onChange={(e) => setHeadName(e.target.value)}
            className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Save Department
          </Button>
        </div>
      </form>
    </Modal>
  );
};
