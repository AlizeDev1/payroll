import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import {
  BookOpen,
  Download,
  CheckCircle2,
  FileCode,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface GlAccountingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GlEntry {
  accountCode: string;
  accountName: string;
  accountType: 'Expense' | 'Liability' | 'Asset';
  debit: number;
  credit: number;
  erpCategory: string;
}

const GL_JOURNAL_ENTRIES: GlEntry[] = [
  {
    accountCode: '5001-SAL',
    accountName: 'Salaries & Gross Wages Expense',
    accountType: 'Expense',
    debit: 2150000,
    credit: 0,
    erpCategory: 'Payroll Operating Expense',
  },
  {
    accountCode: '5005-PF-ER',
    accountName: 'Employer Provident Fund Contribution (EPF/EPS)',
    accountType: 'Expense',
    debit: 103200,
    credit: 0,
    erpCategory: 'Statutory Employer Expense',
  },
  {
    accountCode: '5006-ESI-ER',
    accountName: 'Employer ESIC Contribution (3.25%)',
    accountType: 'Expense',
    debit: 16125,
    credit: 0,
    erpCategory: 'Statutory Employer Expense',
  },
  {
    accountCode: '5012-OT-EXP',
    accountName: 'Overtime & Shift Allowance Expense',
    accountType: 'Expense',
    debit: 80357,
    credit: 0,
    erpCategory: 'Workforce Variable Expense',
  },
  {
    accountCode: '2003-PF-LIAB',
    accountName: 'EPFO Remittance Liability (Account 01, 10, 02)',
    accountType: 'Liability',
    debit: 0,
    credit: 206400,
    erpCategory: 'Statutory Dues Payable',
  },
  {
    accountCode: '2004-ESI-LIAB',
    accountName: 'ESIC Remittance Liability (Employee + Employer)',
    accountType: 'Liability',
    debit: 0,
    credit: 20425,
    erpCategory: 'Statutory Dues Payable',
  },
  {
    accountCode: '2005-TDS-LIAB',
    accountName: 'Income Tax TDS Withholding (Section 192)',
    accountType: 'Liability',
    debit: 0,
    credit: 172000,
    erpCategory: 'Tax Withholding Liability',
  },
  {
    accountCode: '2006-PT-LIAB',
    accountName: 'State Professional Tax (PT) Payable',
    accountType: 'Liability',
    debit: 0,
    credit: 17200,
    erpCategory: 'State Statutory Liability',
  },
  {
    accountCode: '1002-HDFC-CORP',
    accountName: 'HDFC Corporate Bank Clearing Account',
    accountType: 'Asset',
    debit: 0,
    credit: 1933657,
    erpCategory: 'Direct Bank Disbursal Account',
  },
];

export const GlAccountingModal: React.FC<GlAccountingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { success } = useToast();
  const [selectedErp, setSelectedErp] = useState<'Tally' | 'Zoho' | 'NetSuite' | 'QuickBooks'>('Tally');

  const totalDebits = GL_JOURNAL_ENTRIES.reduce((acc, it) => acc + it.debit, 0);
  const totalCredits = GL_JOURNAL_ENTRIES.reduce((acc, it) => acc + it.credit, 0);
  const isBalanced = totalDebits === totalCredits;

  const handleExport = (format: string) => {
    success(
      'GL Journal Exported',
      `Downloaded October_2026_Payroll_Journal_Voucher.${format} for ${selectedErp} ERP.`
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="General Ledger (GL) Accounting Mapper & Journal Generator"
      description="Map payroll debits and credits to corporate ERP Chart of Accounts (Tally, Zoho Books, NetSuite)."
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Double-Entry Balance Card */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50/40 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 font-heading">
                  Double-Entry Trial Balance Verification
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  100% Balanced (Zero Variance)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 font-mono">
                Total Debits: <strong className="text-emerald-800">₹{totalDebits.toLocaleString('en-IN')}</strong> = Total Credits: <strong className="text-emerald-800">₹{totalCredits.toLocaleString('en-IN')}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-700">Target ERP:</label>
            <select
              value={selectedErp}
              onChange={(e) => setSelectedErp(e.target.value as any)}
              className="h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-purple-600 text-xs"
            >
              <option value="Tally">Tally Prime (XML Voucher)</option>
              <option value="Zoho">Zoho Books (CSV / API)</option>
              <option value="NetSuite">Oracle NetSuite (CSV)</option>
              <option value="QuickBooks">QuickBooks Online (IIF)</option>
            </select>
          </div>
        </div>

        {/* GL Journal Entries Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 font-heading">
              Voucher No: ALZ-JV-2026-10-091 · Date: 31st October 2026
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              9 Ledger Lines
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200 text-[11px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">GL Account Code</th>
                  <th className="py-2.5 px-3">Ledger Name</th>
                  <th className="py-2.5 px-2">Type</th>
                  <th className="py-2.5 px-3 text-right">Debit (Dr)</th>
                  <th className="py-2.5 px-3 text-right">Credit (Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {GL_JOURNAL_ENTRIES.map((entry) => (
                  <tr key={entry.accountCode} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{entry.accountCode}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">
                      {entry.accountName}
                      <span className="block text-[10px] text-slate-400">{entry.erpCategory}</span>
                    </td>
                    <td className="py-2.5 px-2 font-sans">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        entry.accountType === 'Expense'
                          ? 'bg-amber-100 text-amber-800'
                          : entry.accountType === 'Liability'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {entry.accountType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {entry.debit > 0 ? `₹${entry.debit.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      {entry.credit > 0 ? `₹${entry.credit.toLocaleString('en-IN')}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold font-mono text-xs">
                <tr>
                  <td colSpan={3} className="py-2.5 px-3 font-sans text-slate-900">Total Balanced Ledger:</td>
                  <td className="py-2.5 px-3 text-right text-slate-900">₹{totalDebits.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700">₹{totalCredits.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Export & Integration Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('xml')}
              leftIcon={<FileCode className="w-3.5 h-3.5 text-purple-600" />}
            >
              Export Tally XML Voucher
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              leftIcon={<Download className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Export CSV Journal
            </Button>
          </div>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Mapper
          </Button>
        </div>
      </div>
    </Modal>
  );
};
