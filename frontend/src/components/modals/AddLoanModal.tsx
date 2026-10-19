import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { loanService } from '../../services/loanService';
import { LoanAdvance, Employee } from '../../types';
import { MOCK_EMPLOYEES } from '../../data/mockData';
import { AlertCircle } from 'lucide-react';

interface AddLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoanCreated: (loan: LoanAdvance) => void;
  employees?: Employee[];
}

export const AddLoanModal: React.FC<AddLoanModalProps> = ({
  isOpen,
  onClose,
  onLoanCreated,
  employees,
}) => {
  const { success, error } = useToast();
  const activeEmployees = employees && employees.length > 0 ? employees : (MOCK_EMPLOYEES || []);
  const initialEmpId = activeEmployees[0]?.employeeId || '';

  const [employeeId, setEmployeeId] = useState(initialEmpId);
  const [loanType, setLoanType] = useState<LoanAdvance['loanType']>('Salary Advance');
  const [amount, setAmount] = useState(40000);
  const [tenureMonths, setTenureMonths] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeTenure = Math.max(1, Number(tenureMonths) || 1);
  const monthlyEMI = Math.round(Number(amount || 0) / safeTenure);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = activeEmployees.find((m) => m.employeeId === (employeeId || initialEmpId)) || activeEmployees[0];
    if (!emp) {
      error('No Employee Selected', 'Please select a valid employee for the loan.');
      return;
    }
    if (amount <= 0) {
      error('Invalid Amount', 'Principal loan amount must be greater than zero.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newLoan = await loanService.applyLoan({
        employeeId: emp.employeeId,
        employeeName: `${emp.firstName || 'Employee'} ${emp.lastName || ''}`.trim(),
        department: emp.departmentName || 'General',
        loanType,
        originalAmount: Number(amount),
        monthlyDeduction: monthlyEMI,
        tenureMonths: safeTenure,
        startDate: '2026-11-01',
        endDate: '2027-03-31',
      });
      onLoanCreated(newLoan);
      success('Loan Facility Approved', `Loan ID ${newLoan.loanId} activated with ₹${monthlyEMI.toLocaleString('en-IN')}/mo payroll recovery.`);
      onClose();
    } catch {
      error('Loan Approval Failed', 'Could not process loan application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasEmployees = activeEmployees.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Loan or Salary Advance"
      description="Configure monthly payroll recovery schedule for staff."
      maxWidth="md"
    >
      {!hasEmployees ? (
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-800 text-sm">No Employees Found</p>
          <p className="text-xs text-slate-500">
            You must add employees to the system before issuing loans or advances.
          </p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Employee Beneficiary
            </label>
            <select
              value={employeeId || initialEmpId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              {activeEmployees.slice(0, 20).map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId}) - Gross: ₹{(emp.salary || 0).toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Facility Type
            </label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value as LoanAdvance['loanType'])}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="Salary Advance">Salary Advance (Short Term)</option>
              <option value="Personal Loan">Personal Loan (Company Subsidized 0% Interest)</option>
              <option value="Emergency Aid">Emergency Aid Grant</option>
              <option value="Equipment Advance">Work-from-Home Equipment Advance</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Principal Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                min={1000}
                step={1000}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Repayment Tenure (Months)
              </label>
              <select
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              >
                <option value={2}>2 Months</option>
                <option value={3}>3 Months</option>
                <option value={5}>5 Months</option>
                <option value={10}>10 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/30 rounded-[8px] border border-purple-200 dark:border-purple-900/60 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-purple-900 dark:text-purple-300 font-semibold">Estimated Monthly Payroll EMI:</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                ₹{monthlyEMI.toLocaleString('en-IN')} / mo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Deductions will begin from next payroll run automatically.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Grant Facility
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
