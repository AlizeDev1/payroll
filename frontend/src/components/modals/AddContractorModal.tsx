import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { contractorService } from '../../services/contractorService';
import { Contractor, ContractorTdsSection } from '../../types';

interface AddContractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContractorAdded: (contractor: Contractor) => void;
}

export const AddContractorModal: React.FC<AddContractorModalProps> = ({
  isOpen,
  onClose,
  onContractorAdded,
}) => {
  const { success, error } = useToast();
  const [name, setName] = useState('');
  const [companyOrTradeName, setCompanyOrTradeName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<Contractor['category']>('Software Architecture');
  const [panNumber, setPanNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [tdsSection, setTdsSection] = useState<ContractorTdsSection>('194J (10%)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTdsRate = (sec: ContractorTdsSection): number => {
    if (sec === '194J (10%)') return 10;
    if (sec === '194C - Individual (1%)') return 1;
    return 2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !panNumber || !accountNumber || !ifscCode) {
      error('Missing Mandatory Fields', 'Please fill in Name, Email, PAN, and Bank Account details.');
      return;
    }

    // Basic PAN format check (5 letters, 4 digits, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber.toUpperCase())) {
      error('Invalid PAN Format', 'PAN must be in standard 10-character format (e.g. ABCDE1234F).');
      return;
    }

    setIsSubmitting(true);
    try {
      const newContractor = await contractorService.addContractor({
        name,
        companyOrTradeName: companyOrTradeName || undefined,
        email,
        phone: phone || '+91 98000 00000',
        category,
        panNumber: panNumber.toUpperCase(),
        gstin: gstin ? gstin.toUpperCase() : undefined,
        bankName,
        accountNumber,
        ifscCode: ifscCode.toUpperCase(),
        tdsSection,
        tdsRate: getTdsRate(tdsSection),
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
      });

      onContractorAdded(newContractor);
      success('Contractor Onboarded', `${name} added under Section ${tdsSection}.`);
      onClose();
      // Reset form
      setName('');
      setCompanyOrTradeName('');
      setEmail('');
      setPhone('');
      setPanNumber('');
      setGstin('');
      setAccountNumber('');
      setIfscCode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Onboard Consultant / Contractor"
      description="Register vendor or independent professional for Section 194C / 194J TDS deductions."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal & Business Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contractor / Payee Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Karthik Ramanathan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company / Trade Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. K-Labs Tech Consulting"
              value={companyOrTradeName}
              onChange={(e) => setCompanyOrTradeName(e.target.value)}
              className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="vendor@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 98450 11223"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="Software Architecture">Software Architecture</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
              <option value="Content & Marketing">Content & Marketing</option>
              <option value="IT Infrastructure">IT Infrastructure</option>
            </select>
          </div>
        </div>

        {/* Statutory & TDS Withholding Section */}
        <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200 space-y-3">
          <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider block font-heading">
            Statutory TDS Withholding Setup
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Permanent Account No (PAN) *
              </label>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="ABCDE1234F"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GSTIN (If Registered)
              </label>
              <input
                type="text"
                maxLength={15}
                placeholder="29ABCDE1234F1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Applicable TDS Section *
              </label>
              <select
                value={tdsSection}
                onChange={(e) => setTdsSection(e.target.value as any)}
                className="w-full px-3 h-[38px] text-xs font-bold rounded-lg border border-purple-300 bg-white text-[#6D28D9] focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              >
                <option value="194J (10%)">194J - Professional (10%)</option>
                <option value="194C - Individual (1%)">194C - Individual (1%)</option>
                <option value="194C - Company (2%)">194C - Company (2%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bank Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bank Name *
            </label>
            <input
              type="text"
              required
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 50100492817261"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              IFSC Code *
            </label>
            <input
              type="text"
              required
              maxLength={11}
              placeholder="HDFC0000240"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              className="w-full px-3 h-[38px] text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] font-mono uppercase"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            Onboard Contractor
          </Button>
        </div>
      </form>
    </Modal>
  );
};
