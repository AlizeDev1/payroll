import { Contractor, ContractorInvoice } from '../types';
import { MOCK_CONTRACTORS, MOCK_CONTRACTOR_INVOICES } from '../data/mockData';

let contractors: Contractor[] = [...MOCK_CONTRACTORS];
let invoices: ContractorInvoice[] = [...MOCK_CONTRACTOR_INVOICES];

export const contractorService = {
  async getContractors(): Promise<Contractor[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...contractors]), 120));
  },

  async addContractor(
    data: Omit<Contractor, 'id' | 'contractorId' | 'totalBilled' | 'totalTdsDeducted'>
  ): Promise<Contractor> {
    const nextNum = contractors.length + 1;
    const newContractor: Contractor = {
      ...data,
      id: `cont-${String(nextNum).padStart(3, '0')}`,
      contractorId: `CTR${String(nextNum).padStart(3, '0')}`,
      totalBilled: 0,
      totalTdsDeducted: 0,
    };
    contractors.unshift(newContractor);
    return newContractor;
  },

  async getInvoices(): Promise<ContractorInvoice[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...invoices]), 120));
  },

  async createInvoice(
    data: Omit<ContractorInvoice, 'id' | 'invoiceNumber' | 'tdsAmount' | 'netPayable' | 'status'>
  ): Promise<ContractorInvoice> {
    const nextNum = invoices.length + 1;
    const tdsAmount = Math.round(data.grossAmount * (data.tdsRate / 100));
    const netPayable = data.grossAmount - tdsAmount;

    const newInvoice: ContractorInvoice = {
      ...data,
      id: `inv-${String(nextNum).padStart(3, '0')}`,
      invoiceNumber: `INV/2026-10/${String(nextNum).padStart(2, '0')}`,
      tdsAmount,
      netPayable,
      status: 'Approved',
    };

    invoices.unshift(newInvoice);

    // Update contractor aggregates
    const cIndex = contractors.findIndex((c) => c.contractorId === data.contractorId);
    if (cIndex !== -1) {
      contractors[cIndex].totalBilled += data.grossAmount;
      contractors[cIndex].totalTdsDeducted += tdsAmount;
    }

    return newInvoice;
  },

  async markInvoicePaid(id: string): Promise<ContractorInvoice> {
    const index = invoices.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Invoice not found');
    invoices[index] = {
      ...invoices[index],
      status: 'Paid',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentReference: `CMS/NEFT/BANK/${Date.now().toString().slice(-6)}`,
    };
    return invoices[index];
  },
};
