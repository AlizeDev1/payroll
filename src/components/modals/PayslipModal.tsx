import React, { useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PayslipItem } from '../../types';
import { COMPANY_INFO } from '../../data/mockData';
import { Printer, Download, Mail, CheckCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: PayslipItem | null;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  payslip,
}) => {
  const { success } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  if (!payslip) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    success('Payslip Downloaded', `Saved as Payslip_${payslip.employeeId}_${payslip.month}_${payslip.year}.pdf`);
  };

  const handleEmail = () => {
    success('Payslip Dispatched', `Official password-protected PDF emailed to registered employee address.`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Official Payslip — ${payslip.employeeName}`}
      description={`${payslip.month} ${payslip.year} · Employee ID: ${payslip.employeeId}`}
      maxWidth="3xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-400">
            Confidential · Generated on {payslip.generatedDate}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleEmail}
              leftIcon={<Mail className="w-3.5 h-3.5" />}
            >
              Email PDF
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Print
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download PDF
            </Button>
          </div>
        </div>
      }
    >
      <div
        ref={printRef}
        className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 text-xs shadow-xs"
      >
        {/* Company Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#6D28D9] text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                {COMPANY_INFO.name}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{COMPANY_INFO.address}, {COMPANY_INFO.city} - {COMPANY_INFO.pincode}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              TAN: {COMPANY_INFO.tan} | PF Est: {COMPANY_INFO.pfEstCode} | ESIC Reg: 53000892010001001
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-block px-2.5 py-0.5 bg-purple-50 dark:bg-purple-950 text-[#6D28D9] dark:text-purple-300 font-bold tracking-wider rounded border border-purple-200 dark:border-purple-800 uppercase text-[10px]">
              SALARY STATEMENT
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              {payslip.month} {payslip.year}
            </p>
          </div>
        </div>

        {/* Employee Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-slate-200 dark:border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Employee Name:</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{payslip.employeeName}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Employee ID:</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">{payslip.employeeId}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Department:</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{payslip.department}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Designation:</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{payslip.designation}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Date of Joining:</span>
            <p className="font-semibold mt-0.5 font-mono">{payslip.joiningDate}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Bank Account:</span>
            <p className="font-semibold font-mono mt-0.5">{payslip.bankName} - •••• {payslip.accountNumber.slice(-4)}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">EPFO UAN:</span>
            <p className="font-semibold font-mono mt-0.5">{payslip.uanNumber}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Days Paid / LOP:</span>
            <p className="font-semibold tabular-nums mt-0.5">{payslip.workedDays} / {payslip.totalDays} (LOP: {payslip.lopDays})</p>
          </div>
        </div>

        {/* Earnings & Deductions Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {/* Earnings */}
          <div className="border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 flex justify-between text-[11px] uppercase tracking-wider">
              <span>Earnings</span>
              <span>Amount (₹)</span>
            </div>
            <div className="p-3 space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Basic Salary</span>
                <span className="font-mono tabular-nums font-medium">₹{payslip.basic.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">House Rent Allowance (HRA)</span>
                <span className="font-mono tabular-nums font-medium">₹{payslip.hra.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Conveyance Allowance</span>
                <span className="font-mono tabular-nums font-medium">₹{payslip.conveyance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Special Allowance</span>
                <span className="font-mono tabular-nums font-medium">₹{payslip.specialAllowance.toLocaleString('en-IN')}</span>
              </div>
              {payslip.bonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Bonus</span>
                  <span className="font-mono tabular-nums font-medium">₹{payslip.bonus.toLocaleString('en-IN')}</span>
                </div>
              )}
              {payslip.incentives > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Performance Incentive</span>
                  <span className="font-mono tabular-nums font-medium">₹{payslip.incentives.toLocaleString('en-IN')}</span>
                </div>
              )}
              {payslip.overtime > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Overtime</span>
                  <span className="font-mono tabular-nums font-medium">₹{payslip.overtime.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-2 font-bold text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs">
              <span>Gross Earnings (A)</span>
              <span className="font-mono tabular-nums">₹{payslip.totalEarnings.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 flex justify-between text-[11px] uppercase tracking-wider">
              <span>Deductions</span>
              <span>Amount (₹)</span>
            </div>
            <div className="p-3 space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Provident Fund (PF Employee)</span>
                <span className="font-mono tabular-nums font-medium">₹{payslip.pf.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Employee State Insurance (ESI)</span>
                <span className="font-mono tabular-nums font-medium">₹{payslip.esi.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Professional Tax (PT - Karnataka)</span>
                <span className="font-mono tabular-nums font-medium">₹{payslip.pt.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Tax Deducted at Source (TDS 192)</span>
                <span className="font-mono tabular-nums font-medium">₹{payslip.tds.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Labour Welfare Fund (LWF)</span>
                <span className="font-mono tabular-nums font-medium">₹{payslip.lwf || 20}</span>
              </div>
              {payslip.lop > 0 && (
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>Loss of Pay (LOP) Deduction</span>
                  <span className="font-mono tabular-nums font-medium">₹{payslip.lop.toLocaleString('en-IN')}</span>
                </div>
              )}
              {payslip.loanDeduction > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Loan Recovery EMI</span>
                  <span className="font-mono tabular-nums font-medium">₹{payslip.loanDeduction.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-2 font-bold text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs">
              <span>Total Deductions (B)</span>
              <span className="font-mono tabular-nums">₹{payslip.totalDeductions.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Net Salary Highlight Box */}
        <div className="p-4 rounded border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#6D28D9] dark:text-purple-300 uppercase tracking-wider">
              Net Take-Home Salary (A - B)
            </span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              ₹{payslip.netSalary.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 italic mt-0.5">
              {payslip.netSalaryInWords}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803D] dark:text-emerald-300">
              <CheckCircle className="w-3.5 h-3.5" /> Direct NEFT Transfer Authorized
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">Electronically generated by Alize Payroll engine.</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
