import { LoanAdvance } from '../types';
import { MOCK_LOANS } from '../data/mockData';

let loans: LoanAdvance[] = [...MOCK_LOANS];

export const loanService = {
  async getLoans(): Promise<LoanAdvance[]> {
    await new Promise((res) => setTimeout(res, 60));
    return [...loans];
  },

  async applyLoan(data: Omit<LoanAdvance, 'id' | 'loanId' | 'repaidAmount' | 'remainingAmount' | 'remainingMonths' | 'status'>): Promise<LoanAdvance> {
    await new Promise((res) => setTimeout(res, 100));
    const newLoan: LoanAdvance = {
      ...data,
      id: `loan-${Date.now()}`,
      loanId: `L-2026-${Math.floor(100 + Math.random() * 800)}`,
      repaidAmount: 0,
      remainingAmount: data.originalAmount,
      remainingMonths: data.tenureMonths,
      status: 'Active',
    };
    loans.unshift(newLoan);
    return newLoan;
  },
};
