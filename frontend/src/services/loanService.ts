import { LoanAdvance } from '../types';
import { MOCK_LOANS } from '../data/mockData';
import { apiClient } from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

let loans: LoanAdvance[] = [...MOCK_LOANS];

export const loanService = {
  async getLoans(): Promise<LoanAdvance[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<LoanAdvance[]>('/loans');
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 60));
    return [...loans];
  },

  async applyLoan(data: Omit<LoanAdvance, 'id' | 'loanId' | 'repaidAmount' | 'remainingAmount' | 'remainingMonths' | 'status'>): Promise<LoanAdvance> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<LoanAdvance>('/loans', {
          ...data,
          principalAmount: data.originalAmount,
          monthlyEmi: data.monthlyDeduction,
          disbursedDate: data.startDate,
        });
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
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
