import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { employeeService } from '../../services/employeeService';
import { Designation, Department } from '../../types';

interface AddDesignationModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onDesignationAdded: (desig: Designation) => void;
}

export const AddDesignationModal: React.FC<AddDesignationModalProps> = ({
  isOpen,
  onClose,
  departments,
  onDesignationAdded,
}) => {
  const { success } = useToast();
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept-eng');
  const [level, setLevel] = useState('L2');
  const [minSalary, setMinSalary] = useState(60000);
  const [maxSalary, setMaxSalary] = useState(100000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedDept = departments.find((d) => d.id === departmentId) || departments[0];
      const deptName = selectedDept?.name || 'General Operations';
      const desig = await employeeService.createDesignation({
        title,
        departmentId: selectedDept?.id || 'dept-general',
        departmentName: deptName,
        level,
        employeeCount: 0,
        minSalary: Number(minSalary),
        maxSalary: Number(maxSalary),
        status: 'Active',
      });
      onDesignationAdded(desig);
      success('Designation Added', `${title} (${level}) created under ${deptName}.`);
      onClose();
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Designation & Pay Band"
      description="Define role title, career band, and compensation range."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Designation Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Lead DevOps Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Department
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              {departments.length > 0 ? (
                departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))
              ) : (
                <option value="dept-general">General Operations</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Band / Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="L1">L1 (Associate / Trainee)</option>
              <option value="L2">L2 (Mid-Level Professional)</option>
              <option value="L3">L3 (Senior Specialist)</option>
              <option value="L4">L4 (Lead / Manager)</option>
              <option value="L5">L5 (Principal / Director)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Min Salary (₹/month)
            </label>
            <input
              type="number"
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Max Salary (₹/month)
            </label>
            <input
              type="number"
              value={maxSalary}
              onChange={(e) => setMaxSalary(Number(e.target.value))}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Save Designation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
