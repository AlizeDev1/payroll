import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Coins,
  ShieldCheck,
  Plus,
  Receipt,
  Download,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import { contractorService } from '../services/contractorService';
import { Contractor, ContractorInvoice } from '../types';
import { AddContractorModal } from '../components/modals/AddContractorModal';
import { AddContractorInvoiceModal } from '../components/modals/AddContractorInvoiceModal';
import { usePageSeo } from '../hooks/usePageSeo';

export const ContractorsPage: React.FC = () => {
  const { success } = useToast();

  usePageSeo({
    title: 'Contractors & Freelancer Payouts (TDS 194C / 194J) | Alize Payroll',
    description: 'Manage independent contractors, milestone payouts, TDS deduction under Section 194C / 194J, and quarterly Form 26Q filing.',
    canonicalPath: '/contractors',
  });

  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [invoices, setInvoices] = useState<ContractorInvoice[]>([]);
  const [activeTab, setActiveTab] = useState<'invoices' | 'directory' | 'tds26q'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddContractorOpen, setIsAddContractorOpen] = useState(false);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);

  useEffect(() => {
    Promise.all([contractorService.getContractors(), contractorService.getInvoices()]).then(
      ([cList, iList]) => {
        setContractors(cList);
        setInvoices(iList);
      }
    );
  }, []);

  const totalGrossInvoiced = invoices.reduce((acc, inv) => acc + inv.grossAmount, 0);
  const totalTdsDeducted = invoices.reduce((acc, inv) => acc + inv.tdsAmount, 0);
  const totalNetPayable = invoices.reduce((acc, inv) => acc + inv.netPayable, 0);

  const section194JInvoices = invoices.filter((i) => i.tdsSection.startsWith('194J'));
  const total194JGross = section194JInvoices.reduce((acc, i) => acc + i.grossAmount, 0);
  const total194JTds = section194JInvoices.reduce((acc, i) => acc + i.tdsAmount, 0);

  const section194CInvoices = invoices.filter((i) => i.tdsSection.startsWith('194C'));
  const total194CGross = section194CInvoices.reduce((acc, i) => acc + i.grossAmount, 0);
  const total194CTds = section194CInvoices.reduce((acc, i) => acc + i.tdsAmount, 0);

  const handlePayInvoice = async (invoiceId: string) => {
    const updated = await contractorService.markInvoicePaid(invoiceId);
    setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? updated : inv)));
    success('Payout Disbursed', `Direct NEFT transfer initiated for ${updated.contractorName}.`);
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.contractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContractors = contractors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.panNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contractors & Freelancer Payouts"
        subtitle="Manage independent consultants with automated Section 194C / 194J TDS deductions and Form 26Q compliance."
        breadcrumb={['Alize Software Services', 'Workforce', 'Contractors']}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                success('Form 26Q Exported', 'Downloaded quarterly Form 26Q contractor TDS report (.xlsx).')
              }
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Form 26Q
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAddInvoiceOpen(true)}
              leftIcon={<Receipt className="w-3.5 h-3.5" />}
            >
              Record Invoice
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddContractorOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Onboard Contractor
            </Button>
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Consultants"
          value={`${contractors.length} Payees`}
          change={`${contractors.filter((c) => c.status === 'Active').length} Active for Payouts`}
          icon={Users}
        />
        <StatCard
          title="Gross Billed (Oct 2026)"
          value={`₹${totalGrossInvoiced.toLocaleString('en-IN')}`}
          change={`Across ${invoices.length} Milestone Invoices`}
          icon={Briefcase}
        />
        <StatCard
          title="TDS Withheld (194C / 194J)"
          value={`₹${totalTdsDeducted.toLocaleString('en-IN')}`}
          change="Form 26Q Deposit Ready"
          icon={ShieldCheck}
        />
        <StatCard
          title="Net Payout Disbursed"
          value={`₹${totalNetPayable.toLocaleString('en-IN')}`}
          change="Direct Bank Transfers"
          icon={Coins}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3 text-xs font-bold font-heading border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'invoices'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            Invoices & Payouts ({invoices.length})
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`py-3 text-xs font-bold font-heading border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'directory'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Contractor Directory ({contractors.length})
          </button>

          <button
            onClick={() => setActiveTab('tds26q')}
            className={`py-3 text-xs font-bold font-heading border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'tds26q'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Form 26Q Statutory Summary
          </button>
        </nav>
      </div>

      {/* Tab 1: Invoices & Payouts */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by invoice number, contractor or scope..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 h-[36px] text-xs rounded-lg border border-slate-200 bg-[#F8FAFC] text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Showing {filteredInvoices.length} invoices
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse financial-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Contractor / Payee</th>
                    <th>Milestone Scope</th>
                    <th className="text-right">Gross Amount</th>
                    <th>TDS Section</th>
                    <th className="text-right">TDS Withheld</th>
                    <th className="text-right">Net Payable</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-slate-400">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                        <p className="font-semibold text-slate-600">No contractor invoices found</p>
                        <p className="text-xs text-slate-400 mt-1">Invoices booked or synchronized from ERP will display here.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                        <td>
                          <span className="font-semibold text-slate-800 block">{inv.contractorName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{inv.contractorId}</span>
                        </td>
                        <td className="max-w-xs text-slate-600 truncate" title={inv.serviceDescription}>
                          {inv.serviceDescription}
                        </td>
                        <td className="text-right font-mono font-semibold tabular-nums text-slate-900">
                          ₹{inv.grossAmount.toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#6D28D9] border border-purple-200 font-mono">
                            {inv.tdsSection}
                          </span>
                        </td>
                        <td className="text-right font-mono font-bold tabular-nums text-rose-600">
                          -₹{inv.tdsAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="text-right font-mono font-bold tabular-nums text-emerald-700 text-sm">
                          ₹{inv.netPayable.toLocaleString('en-IN')}
                        </td>
                        <td>
                          <Badge
                            variant={inv.status === 'Paid' ? 'success' : inv.status === 'Approved' ? 'info' : 'warning'}
                          >
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="text-right">
                          {inv.status === 'Paid' ? (
                            <span className="text-[11px] font-mono text-slate-400">Paid & Synced</span>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handlePayInvoice(inv.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 h-[28px] text-[11px] font-semibold"
                            >
                              Disburse
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Contractor Directory */}
      {activeTab === 'directory' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse financial-table">
              <thead>
                <tr>
                  <th>CTR ID</th>
                  <th>Contractor / Entity Name</th>
                  <th>Category</th>
                  <th>PAN & GSTIN</th>
                  <th>Bank Details</th>
                  <th>TDS Section</th>
                  <th className="text-right">Total Billed</th>
                  <th className="text-right">TDS Withheld</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredContractors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                      <p className="font-semibold text-slate-600">No registered contractors</p>
                      <p className="text-xs text-slate-400 mt-1">Add freelancers, legal consultants, or retainers to get started.</p>
                    </td>
                  </tr>
                ) : (
                  filteredContractors.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="font-mono font-bold text-slate-900">{c.contractorId}</td>
                      <td>
                        <span className="font-semibold text-slate-900 block">{c.name}</span>
                        {c.companyOrTradeName && (
                          <span className="text-[10px] text-slate-500">{c.companyOrTradeName}</span>
                        )}
                      </td>
                      <td className="font-medium text-slate-700">{c.category}</td>
                      <td>
                        <span className="font-mono font-bold text-slate-800 block">{c.panNumber}</span>
                        {c.gstin ? (
                          <span className="font-mono text-[10px] text-slate-400">{c.gstin}</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Unregistered</span>
                        )}
                      </td>
                      <td>
                        <span className="text-slate-800 font-semibold block">{c.bankName}</span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {c.accountNumber} · {c.ifscCode}
                        </span>
                      </td>
                      <td>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#6D28D9] border border-purple-200 font-mono">
                          {c.tdsSection}
                        </span>
                      </td>
                      <td className="text-right font-mono font-bold tabular-nums text-slate-900">
                        ₹{c.totalBilled.toLocaleString('en-IN')}
                      </td>
                      <td className="text-right font-mono font-bold tabular-nums text-rose-600">
                        ₹{c.totalTdsDeducted.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <Badge variant="success">{c.status}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Form 26Q Statutory TDS Summary */}
      {activeTab === 'tds26q' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Section 194J Card */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 font-heading">
                  Section 194J · Fees for Professional / Technical Services
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-[#6D28D9] font-mono">
                  10% Flat TDS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Covers software architects, UI/UX designers, legal counsel, and chartered accountants.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Payments</span>
                  <p className="text-lg font-bold font-mono text-slate-800 mt-0.5">₹{total194JGross.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-200">
                  <span className="text-[10px] text-[#6D28D9] uppercase font-semibold">TDS Deducted (10%)</span>
                  <p className="text-lg font-bold font-mono text-[#6D28D9] mt-0.5">₹{total194JTds.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Due Date: 7th November 2026 · ITNS 281 Challan Ready
              </div>
            </div>

            {/* Section 194C Card */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 font-heading">
                  Section 194C · Payments to Contractors & Sub-Contractors
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 font-mono">
                  1% / 2% TDS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Covers IT infrastructure AMC vendors (2% Company) and individual content freelancers (1% Individual).
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Payments</span>
                  <p className="text-lg font-bold font-mono text-slate-800 mt-0.5">₹{total194CGross.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-200">
                  <span className="text-[10px] text-indigo-700 uppercase font-semibold">TDS Deducted</span>
                  <p className="text-lg font-bold font-mono text-indigo-700 mt-0.5">₹{total194CTds.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Due Date: 7th November 2026 · ITNS 281 Challan Ready
              </div>
            </div>
          </div>

          {/* Form 26Q Export & TDS Certificate Push */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50 to-white border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">
                Quarterly Form 26Q Electronic Filing Package
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Generate NSDL-compliant e-TDS return file with automatic PAN verification and BSR code mapping.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                success('Form 26Q Package Ready', 'Exported alize_tds_form26q_q2_2026.txt for NSDL RPU utility.')
              }
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="bg-[#6D28D9] hover:bg-[#5B21B6] whitespace-nowrap"
            >
              Generate e-TDS Return
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddContractorModal
        isOpen={isAddContractorOpen}
        onClose={() => setIsAddContractorOpen(false)}
        onContractorAdded={(newC) => setContractors((prev) => [newC, ...prev])}
      />

      <AddContractorInvoiceModal
        isOpen={isAddInvoiceOpen}
        onClose={() => setIsAddInvoiceOpen(false)}
        contractors={contractors}
        onInvoiceCreated={(newInv) => setInvoices((prev) => [newInv, ...prev])}
      />
    </div>
  );
};
