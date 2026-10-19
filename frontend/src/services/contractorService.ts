import { Contractor, ContractorInvoice } from '../types';
import { MOCK_CONTRACTORS, MOCK_CONTRACTOR_INVOICES } from '../data/mockData';
import { apiClient } from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

let contractors: Contractor[] = [...MOCK_CONTRACTORS];
let invoices: ContractorInvoice[] = [...MOCK_CONTRACTOR_INVOICES];

export const contractorService = {
  async getContractors(): Promise<Contractor[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<Contractor[]>('/contractors');
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    return new Promise((resolve) => setTimeout(() => resolve([...contractors]), 120));
  },

  async addContractor(
    data: Omit<Contractor, 'id' | 'contractorId' | 'totalBilled' | 'totalTdsDeducted'>
  ): Promise<Contractor> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<Contractor>('/contractors', data);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
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
    if (!USE_MOCK) {
      try {
        return await apiClient.get<ContractorInvoice[]>('/contractors/invoices');
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    return new Promise((resolve) => setTimeout(() => resolve([...invoices]), 120));
  },

  async createInvoice(
    data: Omit<ContractorInvoice, 'id' | 'invoiceNumber' | 'tdsAmount' | 'netPayable' | 'status'>
  ): Promise<ContractorInvoice> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<ContractorInvoice>('/contractors/invoices', data);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
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

    const cIndex = contractors.findIndex((c) => c.contractorId === data.contractorId);
    if (cIndex !== -1) {
      contractors[cIndex].totalBilled += data.grossAmount;
      contractors[cIndex].totalTdsDeducted += tdsAmount;
    }

    return newInvoice;
  },

  async markInvoicePaid(id: string): Promise<ContractorInvoice> {
    if (!USE_MOCK) {
      try {
        return await apiClient.patch<ContractorInvoice>(`/contractors/invoices/${id}/paid`);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
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
