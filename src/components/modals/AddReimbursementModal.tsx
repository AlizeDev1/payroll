import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import { reimbursementService } from '../../services/reimbursementService';
import { ReimbursementClaim, ReimbursementCategory } from '../../types';
import { MOCK_EMPLOYEES } from '../../data/mockData';
import {
  UploadCloud,
  Sparkles,
  ScanLine,
  CheckCircle2,
  FileText,
  Loader2,
  Receipt,
} from 'lucide-react';

interface AddReimbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimSubmitted: (claim: ReimbursementClaim) => void;
  employees?: any[];
}

interface ScannedBill {
  merchant: string;
  category: ReimbursementCategory;
  amount: number;
  billDate: string;
  description: string;
  gstin: string;
  invoiceNo: string;
  cgst: number;
  sgst: number;
}

const OCR_PRESETS: ScannedBill[] = [
  {
    merchant: 'Uber Premier Business (Trip #UBR-8921)',
    category: 'Travel',
    amount: 1450,
    billDate: '2026-10-12',
    description: 'Airport commute for Enterprise Client Kickoff in Whitefield',
    gstin: '29AABCU9324K1ZW',
    invoiceNo: 'INV-UBR-2026-8921',
    cgst: 36,
    sgst: 36,
  },
  {
    merchant: 'The Taj West End (Business Dining)',
    category: 'Food',
    amount: 5840,
    billDate: '2026-10-10',
    description: 'Quarterly Executive Review Dinner with Key Accounts',
    gstin: '29AABCT1284L1ZM',
    invoiceNo: 'TAJ-BLR-48201',
    cgst: 146,
    sgst: 146,
  },
  {
    merchant: 'Airtel Xstream Fiber Corporate (WFH)',
    category: 'Internet',
    amount: 1887,
    billDate: '2026-10-01',
    description: 'Monthly high-speed 300 Mbps broadband reimbursement',
    gstin: '29AABCA2811N1ZA',
    invoiceNo: 'AIR-OCT-9921',
    cgst: 144,
    sgst: 144,
  },
  {
    merchant: 'Apollo Health City (Executive Checkup)',
    category: 'Medical',
    amount: 3600,
    billDate: '2026-10-05',
    description: 'Annual corporate health checkup diagnostic panel',
    gstin: '29AABCA7211P1ZD',
    invoiceNo: 'APL-BLR-0281',
    cgst: 0,
    sgst: 0,
  },
];

export const AddReimbursementModal: React.FC<AddReimbursementModalProps> = ({
  isOpen,
  onClose,
  onClaimSubmitted,
  employees,
}) => {
  const { success, error } = useToast();
  const activeEmployees = employees && employees.length > 0 ? employees : (MOCK_EMPLOYEES || []);
  const initialEmpId = activeEmployees[0]?.employeeId || '';

  const [employeeId, setEmployeeId] = useState(initialEmpId);
  const [category, setCategory] = useState<ReimbursementCategory>('Travel');
  const [amount, setAmount] = useState(2500);
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OCR scanning state
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrVerifiedData, setOcrVerifiedData] = useState<ScannedBill | null>(null);

  const handleSimulateOcr = (preset: ScannedBill) => {
    setIsOcrScanning(true);
    setOcrVerifiedData(null);

    setTimeout(() => {
      setCategory(preset.category);
      setAmount(preset.amount);
      setBillDate(preset.billDate);
      setDescription(preset.description);
      setOcrVerifiedData(preset);
      setIsOcrScanning(false);
      success(
        'AI OCR Scan Complete',
        `Extracted ₹${preset.amount.toLocaleString('en-IN')} from ${preset.merchant}. GSTIN verified.`
      );
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) {
      error('Please specify a description and valid amount');
      return;
    }
    const emp = activeEmployees.find((m) => m.employeeId === (employeeId || initialEmpId)) || activeEmployees[0];
    if (!emp) {
      error('No Employee Selected', 'Please register an employee first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newClaim = await reimbursementService.submitClaim({
        employeeId: emp.employeeId,
        employeeName: `${emp.firstName || 'Employee'} ${emp.lastName || ''}`.trim(),
        department: emp.departmentName || 'General',
        category,
        amount: Number(amount),
        billDate,
        description: ocrVerifiedData
          ? `${description} (Verified GSTIN: ${ocrVerifiedData.gstin}, Inv: ${ocrVerifiedData.invoiceNo})`
          : description,
        receiptAttachment: ocrVerifiedData ? `${ocrVerifiedData.invoiceNo}.pdf` : 'receipt.pdf',
      });
      onClaimSubmitted(newClaim);
      success('Reimbursement Claim Filed', `Claim ID: ${newClaim.claimId} submitted for audit.`);
      onClose();
      setDescription('');
      setOcrVerifiedData(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="File Reimbursement Claim"
      description="Submit corporate expenses with automated AI OCR receipt scanning & GSTIN validation."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Smart AI OCR Scanner Widget */}
        <div className="p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50/40 border border-purple-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900 font-heading">
                AI Smart Receipt OCR Scanner
              </span>
            </div>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full">
              Automated Extraction
            </span>
          </div>

          <p className="text-[11px] text-slate-600">
            Click any demo receipt below to simulate intelligent OCR field detection, merchant extraction, and GST verification:
          </p>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {OCR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSimulateOcr(preset)}
                disabled={isOcrScanning}
                className="p-2 text-left bg-white hover:bg-purple-50/80 border border-slate-200 hover:border-purple-300 rounded-lg transition-all group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-slate-900 group-hover:text-purple-700 truncate block">
                    {preset.category}
                  </span>
                  <span className="font-mono font-bold text-[11px] text-purple-600">
                    ₹{preset.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                  {preset.merchant.split('(')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* OCR Scanning Progress State */}
        {isOcrScanning && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3 animate-pulse">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-purple-900">Scanning receipt image with Vision OCR...</span>
              <p className="text-[11px] text-purple-700 mt-0.5">
                Extracting line items, invoice number, CGST/SGST tax values, and merchant GSTIN.
              </p>
            </div>
          </div>
        )}

        {/* OCR Verified Results Banner */}
        {ocrVerifiedData && !isOcrScanning && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Receipt Successfully Parsed via OCR</span>
              </div>
              <Badge variant="success">100% Valid Tax Invoice</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-900 font-mono pt-1">
              <div>
                <span className="text-emerald-700 block">Merchant & GSTIN:</span>
                <span className="font-semibold">{ocrVerifiedData.gstin}</span>
              </div>
              <div>
                <span className="text-emerald-700 block">Invoice Number:</span>
                <span className="font-semibold">{ocrVerifiedData.invoiceNo}</span>
              </div>
            </div>
          </div>
        )}

        {/* Standard Form Inputs */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Claimant Employee
          </label>
          <select
            value={employeeId || initialEmpId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          >
            {activeEmployees.slice(0, 20).map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.firstName} {emp.lastName} ({emp.employeeId}) - {emp.departmentName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Expense Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReimbursementCategory)}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="Travel">Travel (Flights / Cabs / Rail)</option>
              <option value="Food">Food & Business Entertainment</option>
              <option value="Medical">Medical Health Checkup</option>
              <option value="Internet">Broadband / Mobile</option>
              <option value="Fuel">Fuel & Local Commute</option>
              <option value="Other">Other Office Supplies</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Invoice Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              min={100}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] font-mono tabular-nums"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Bill / Receipt Date
          </label>
          <input
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
            className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Business Justification *
          </label>
          <textarea
            rows={2}
            placeholder="Explain why this expense was incurred..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>

        <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-[8px] p-3 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
          <UploadCloud className="w-5 h-5 text-[#6D28D9] dark:text-purple-400 mx-auto mb-1" />
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {ocrVerifiedData ? `Attached: ${ocrVerifiedData.invoiceNo}.pdf (Auto-extracted)` : 'Attach Bill / Receipt (PDF or JPG)'}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Submit Claim
          </Button>
        </div>
      </form>
    </Modal>
  );
};
