import {
  StatutoryCompliance,
  TaxDeclaration,
  FullAndFinalSettlement,
} from '../types';
import {
  MOCK_STATUTORY_COMPLIANCE,
  MOCK_TAX_DECLARATIONS,
  MOCK_FULL_AND_FINAL,
} from '../data/mockData';

let statutoryData: StatutoryCompliance[] = [...MOCK_STATUTORY_COMPLIANCE];
let taxDeclarations: TaxDeclaration[] = [...MOCK_TAX_DECLARATIONS];
let fullAndFinal: FullAndFinalSettlement[] = [...MOCK_FULL_AND_FINAL];

export const complianceService = {
  async getStatutorySummary(): Promise<StatutoryCompliance[]> {
    await new Promise((res) => setTimeout(res, 60));
    return [...statutoryData];
  },

  async getTaxDeclarations(): Promise<TaxDeclaration[]> {
    await new Promise((res) => setTimeout(res, 60));
    return [...taxDeclarations];
  },

  async updateTaxDeclarationStatus(id: string, status: 'Pending' | 'Approved' | 'Rejected', reviewer: string): Promise<TaxDeclaration> {
    await new Promise((res) => setTimeout(res, 80));
    const index = taxDeclarations.findIndex((td) => td.id === id);
    if (index === -1) throw new Error('Declaration not found');
    taxDeclarations[index] = {
      ...taxDeclarations[index],
      status,
      reviewedBy: reviewer,
    };
    return taxDeclarations[index];
  },

  async getFullAndFinalSettlements(): Promise<FullAndFinalSettlement[]> {
    await new Promise((res) => setTimeout(res, 60));
    return [...fullAndFinal];
  },

  async createSettlement(data: Omit<FullAndFinalSettlement, 'id'>): Promise<FullAndFinalSettlement> {
    await new Promise((res) => setTimeout(res, 100));
    const item: FullAndFinalSettlement = {
      ...data,
      id: `fnf-${Date.now()}`,
    };
    fullAndFinal.unshift(item);
    return item;
  },

  async updateSettlementStatus(id: string, status: 'Pending' | 'Under Review' | 'Approved' | 'Settled'): Promise<FullAndFinalSettlement> {
    await new Promise((res) => setTimeout(res, 80));
    const index = fullAndFinal.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('Settlement not found');
    fullAndFinal[index] = {
      ...fullAndFinal[index],
      status,
      settledDate: status === 'Settled' ? new Date().toISOString().split('T')[0] : fullAndFinal[index].settledDate,
    };
    return fullAndFinal[index];
  },
};
