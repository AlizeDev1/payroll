import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { payrollService } from '../../services/payrollService';
import { MonthlyPayrollSummary } from '../../types';
import { Check, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProcessPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayrollCompleted: (summary: MonthlyPayrollSummary) => void;
}

export const ProcessPayrollModal: React.FC<ProcessPayrollModalProps> = ({
  isOpen,
  onClose,
  onPayrollCompleted,
}) => {
  const { success } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [period, setPeriod] = useState({
    month: 'October',
    year: 2026,
    workingDays: 31,
  });

  const steps = [
    { num: 1, label: 'Select Period' },
    { num: 2, label: 'Review Attendance' },
    { num: 3, label: 'Review Salary' },
    { num: 4, label: 'Calculate Payroll' },
    { num: 5, label: 'Review Payroll' },
    { num: 6, label: 'Approve' },
    { num: 7, label: 'Publish Payslips' },
  ];

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleExecuteApproval = async () => {
    setIsProcessing(true);
    try {
      const summary = await payrollService.processPayrollRun({
        month: period.month,
        year: period.year,
        attendanceApproved: true,
        salaryReviewed: true,
      });
      setCurrentStep(7);
      onPayrollCompleted(summary);
      success('Payroll Run Processed & Published', `${period.month} ${period.year} salary distribution completed for 86 employees.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Monthly Payroll Processing Wizard"
      description="7-step automated compliance and disbursement pipeline."
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto gap-2">
          {steps.map((s) => (
            <div key={s.num} className="flex items-center gap-1.5 shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep > s.num
                    ? 'bg-[#15803D] text-white'
                    : currentStep === s.num
                    ? 'bg-[#6D28D9] text-white ring-2 ring-purple-200 dark:ring-purple-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  currentStep === s.num
                    ? 'text-slate-900 dark:text-slate-100 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Select Period */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              1. Choose Payroll Cycle
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pay Month
                </label>
                <select
                  value={period.month}
                  onChange={(e) => setPeriod({ ...period, month: e.target.value })}
                  className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                >
                  <option value="October">October 2026 (Current Cycle)</option>
                  <option value="November">November 2026</option>
                  <option value="September">September 2026</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Calendar Days in Month
                </label>
                <input
                  type="number"
                  readOnly
                  value={period.workingDays}
                  className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>
            <div className="p-3.5 rounded-[8px] bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-[#6D28D9] dark:text-purple-300">86 Active Employees</span> detected in this payroll cycle. All employee bank accounts and PF UAN mappings will be validated in step 2 & 3.
            </div>
          </div>
        )}

        {/* Step 2: Review Attendance */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              2. Biometric & Leave Sync Verification
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400">Total Workforce</span>
                <p className="text-lg font-bold tabular-nums">86</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-[8px] border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300">
                <span>Present Rate</span>
                <p className="text-lg font-bold tabular-nums">91.8%</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-[8px] border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300">
                <span>Approved Leaves</span>
                <p className="text-lg font-bold tabular-nums">5</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-[8px] border border-red-200 dark:border-red-800/40 text-red-800 dark:text-red-300">
                <span>Unexcused LOP</span>
                <p className="text-lg font-bold tabular-nums">2 days</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Attendance records for Bellandur Tech Hub and remote clusters synchronized. Loss of Pay (LOP) will automatically prorate gross pay.
            </p>
          </div>
        )}

        {/* Step 3: Review Salary */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              3. Salary Components & Variable Pay
            </h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Standard Gross CTC Commitment</span>
                <span className="font-mono font-semibold tabular-nums">₹21,50,000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Approved Reimbursements to Add</span>
                <span className="font-mono font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">+₹24,949</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Approved Biometric Overtime Pay (69.0 hrs @ 1.5x)
                </span>
                <span className="font-mono font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">+₹80,357</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Loan & Advance EMI Deductions</span>
                <span className="font-mono font-semibold tabular-nums text-red-600 dark:text-red-400">-₹18,000</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Calculate Payroll */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              4. Statutory Deductions Computation
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500">EPFO Contribution (12% of Basic capped)</p>
                <p className="text-base font-bold font-mono mt-1 tabular-nums">₹1,54,800</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500">ESIC Remittance (0.75% for eligible staff)</p>
                <p className="text-base font-bold font-mono mt-1 tabular-nums">₹9,450</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500">Karnataka Professional Tax (₹200/emp)</p>
                <p className="text-base font-bold font-mono mt-1 tabular-nums">₹17,200</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500">Labour Welfare Fund (LWF ₹20/emp)</p>
                <p className="text-base font-bold font-mono mt-1 tabular-nums">₹1,720</p>
              </div>
              <div className="p-3 col-span-2 bg-slate-50 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500">Income Tax TDS (Section 192)</p>
                <p className="text-base font-bold font-mono mt-1 tabular-nums">₹1,42,000</p>
              </div>
            </div>
            <div className="p-3 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs">
              Total Deductions Calculated: <span className="font-bold font-mono">₹3,25,170</span> (EPF + ESIC + PT + LWF + TDS). Matches statutory limits.
            </div>
          </div>
        )}

        {/* Step 5: Review Payroll */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              5. Final Distribution Summary
            </h4>
            <div className="p-4 bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 rounded-[10px] space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total Net Payout Required</span>
                <span className="text-2xl font-extrabold text-[#6D28D9] dark:text-purple-300 font-mono tabular-nums">
                  ₹18,42,500
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2.5 border-t border-purple-200 dark:border-purple-900/50 text-[11px]">
                <div>
                  <span className="text-slate-400">Total Headcount</span>
                  <p className="font-bold tabular-nums">86 Employees</p>
                </div>
                <div>
                  <span className="text-slate-400">Payout Mode</span>
                  <p className="font-bold">HDFC Corporate NEFT</p>
                </div>
                <div>
                  <span className="text-slate-400">Disbursement Date</span>
                  <p className="font-bold">Immediate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Approve */}
        {currentStep === 6 && (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-[#6D28D9] dark:text-purple-400 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Authorize October 2026 Payroll Execution
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              By authorizing, bank transfer batch ALIZE/PAY/2026-10/0091 will be scheduled, statutory journals logged, and payslips released to 86 staff accounts.
            </p>
          </div>
        )}

        {/* Step 7: Completed */}
        {currentStep === 7 && (
          <div className="space-y-4 text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Payroll Successfully Published!
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All 86 employee payslips have been generated, statutory challan batches prepared, and net payout of ₹18,42,500 logged.
            </p>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          {currentStep < 7 ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                disabled={currentStep === 1 || isProcessing}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                {currentStep < 6 ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleNext}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleExecuteApproval}
                    isLoading={isProcessing}
                    leftIcon={<Check className="w-4 h-4" />}
                  >
                    Approve & Disburse
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-end w-full">
              <Button type="button" variant="primary" size="sm" onClick={onClose}>
                Done & Return to Payroll
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
