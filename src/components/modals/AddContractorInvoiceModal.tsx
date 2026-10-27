import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { contractorService } from '../../services/contractorService';
import { Contractor, ContractorInvoice } from '../../types';

interface AddContractorInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractors: Contractor[];
  onInvoiceCreated: (invoice: ContractorInvoice) => void;
}

export const AddContractorInvoiceModal: React.FC<AddContractorInvoiceModalProps> = ({
  isOpen,
  onClose,
  contractors,
  onInvoiceCreated,
}) => {
  const { success, error } = useToast();
  const [contractorId, setContractorId] = useState(contractors[0]?.contractorId || '');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV/2026-10/${Math.floor(10 + Math.random() * 90)}`);
  const [serviceDescription, setServiceDescription] = useState('');
  const [grossAmount, setGrossAmount] = useState<number>(50000);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedContractor = contractors.find((c) => c.contractorId === contractorId) || contractors[0];
  const tdsRate = selectedContractor ? selectedContractor.tdsRate : 10;
  const tdsSection = selectedContractor ? selectedContractor.tdsSection : '194J (10%)';

  const tdsAmount = Math.round((grossAmount || 0) * (tdsRate / 100));
  const netPayable = Math.max(0, (grossAmount || 0) - tdsAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContractor) {
      error('No Contractor Selected', 'Please select a registered contractor.');
      return;
    }
    if (!serviceDescription || grossAmount <= 0) {
      error('Invalid Amount', 'Please provide a valid service description and billing amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newInvoice = await contractorService.createInvoice({
        contractorId: selectedContractor.contractorId,
        contractorName: selectedContractor.name,
        invoiceDate,
        serviceDescription,
        grossAmount: Number(grossAmount),
        tdsSection,
        tdsRate,
      });

      onInvoiceCreated(newInvoice);
      success('Invoice Generated & Approved', `Net ₹${netPayable.toLocaleString('en-IN')} approved under Section ${tdsSection}.`);
      onClose();
      setServiceDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Contractor Payout / Invoice"
      description="Record consultant bill with automated Section 194C / 194J statutory TDS deduction."
      maxWidth="xl"
    >
      {contractors.length === 0 ? (
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <span className="text-xl">⚠️</span>
          </div>
          <p className="font-bold text-slate-800 text-sm">No Registered Contractors</p>
          <p className="text-xs text-slate-500">
            Before recording invoices, please onboard your first contractor or freelance consultant under the Directory tab.
          </p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Select Payee / Contractor *
          </label>
          <select
            value={contractorId}
            onChange={(e) => setContractorId(e.target.value)}
            className="w-full px-3 h-[38px] text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          >
            {contractors.map((c) => (
              <option key={c.contractorId} value={c.contractorId}>
                {c.name} ({c.contractorId}) — {c.tdsSection}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Invoice Reference Number *
            </label>
            <input
              type="text"
              required
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-3 h-[38px] text-xs font-mono rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Invoice Date *
            </label>
            <input
              type="date"
              required
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Service Scope / Milestone Description *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Q3 Security Architecture Audit & Penetration Testing"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Gross Billed Amount (INR) *
          </label>
          <input
            type="number"
            min={1000}
            step={500}
            required
            value={grossAmount}
            onChange={(e) => setGrossAmount(Number(e.target.value))}
            className="w-full px-3 h-[38px] text-sm font-bold font-mono rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>

        {/* Live TDS Calculation Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Gross Invoice Amount:</span>
            <span className="font-mono font-bold text-slate-800">
              ₹{grossAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center text-rose-600">
            <span className="flex items-center gap-1">
              Less TDS ({tdsSection}):
            </span>
            <span className="font-mono font-bold">
              -₹{tdsAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Net Payable Disbursement:</span>
            <span className="font-mono text-emerald-700 text-base">
              ₹{netPayable.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-end gap-2.5">
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            Approve & Queue Payout
          </Button>
        </div>
      </form>
      )}
    </Modal>
  );
};
