import {
  MonthlyPayrollSummary,
  PayrollRecordItem,
  PayslipItem,
  SalaryStructure,
} from '../types';
import {
  MOCK_PAYROLL_SUMMARY,
  MOCK_PAYROLL_ITEMS,
  MOCK_PAYSLIPS,
  MOCK_SALARY_STRUCTURES,
} from '../data/mockData';
import { apiClient } from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

let payrollSummary: MonthlyPayrollSummary = { ...MOCK_PAYROLL_SUMMARY };
let payrollItems: PayrollRecordItem[] = [...MOCK_PAYROLL_ITEMS];
let payslips: PayslipItem[] = [...MOCK_PAYSLIPS];
let salaryStructures: SalaryStructure[] = [...MOCK_SALARY_STRUCTURES];

export const payrollService = {
  async getPayrollSummary(month = 'October 2026'): Promise<MonthlyPayrollSummary> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<MonthlyPayrollSummary>('/payroll/summary', { month });
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 60));
    return { ...payrollSummary, month };
  },

  async getPayrollItems(): Promise<PayrollRecordItem[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<PayrollRecordItem[]>('/payroll/items');
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 80));
    return [...payrollItems];
  },

  async updatePayrollItem(id: string, updates: Partial<PayrollRecordItem>): Promise<PayrollRecordItem> {
    if (!USE_MOCK) {
      try {
        return await apiClient.patch<PayrollRecordItem>(`/payroll/items/${id}`, updates);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 100));
    const index = payrollItems.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Payroll record not found');
    payrollItems[index] = { ...payrollItems[index], ...updates };
    return payrollItems[index];
  },

  async processPayrollRun(stepData: {
    month: string;
    year: number;
    attendanceApproved: boolean;
    salaryReviewed: boolean;
  }): Promise<MonthlyPayrollSummary> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<MonthlyPayrollSummary>('/payroll/process', stepData);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 200));
    payrollSummary = {
      ...payrollSummary,
      month: `${stepData.month} ${stepData.year}`,
      status: 'Paid',
      processedDate: new Date().toISOString().split('T')[0],
      approvedBy: 'Admin Approval (Automated Run)',
    };
    payrollItems = payrollItems.map((item) => ({
      ...item,
      status: 'Paid',
    }));
    return payrollSummary;
  },

  async getPayslips(filters?: { month?: string; department?: string; employeeId?: string }): Promise<PayslipItem[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<PayslipItem[]>('/payroll/payslips', filters as any);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 60));
    let filtered = [...payslips];
    if (filters?.department && filters.department !== 'All') {
      filtered = filtered.filter((p) => p.department === filters.department);
    }
    if (filters?.employeeId) {
      filtered = filtered.filter((p) => p.employeeId === filters.employeeId);
    }
    return filtered;
  },

  async getPayslipById(id: string): Promise<PayslipItem | undefined> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<PayslipItem>(`/payroll/payslips/${id}`);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 40));
    return payslips.find((p) => p.id === id || p.employeeId === id);
  },

  async getSalaryStructures(): Promise<SalaryStructure[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<SalaryStructure[]>('/payroll/structures');
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 60));
    return [...salaryStructures];
  },

  async createSalaryStructure(structure: Omit<SalaryStructure, 'id'>): Promise<SalaryStructure> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<SalaryStructure>('/payroll/structures', structure);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 100));
    const newStructure: SalaryStructure = {
      ...structure,
      id: `struct-${Date.now()}`,
    };
    salaryStructures.push(newStructure);
    return newStructure;
  },

  async updateSalaryStructure(id: string, updates: Partial<SalaryStructure>): Promise<SalaryStructure> {
    if (!USE_MOCK) {
      try {
        return await apiClient.patch<SalaryStructure>(`/payroll/structures/${id}`, updates);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 80));
    const index = salaryStructures.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Structure not found');
    salaryStructures[index] = { ...salaryStructures[index], ...updates };
    return salaryStructures[index];
  },
};
