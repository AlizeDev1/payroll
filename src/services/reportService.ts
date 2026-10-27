import { apiClient } from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

export interface ReportItem {
  id: string;
  title: string;
  category: 'Payroll' | 'Statutory' | 'Attendance' | 'Leave' | 'Finance';
  description: string;
  frequency: string;
  formats: ('PDF' | 'Excel' | 'CSV')[];
  icon: string;
}

export const AVAILABLE_REPORTS: ReportItem[] = [
  {
    id: 'rep-01',
    title: 'Payroll Register (Monthly Master)',
    category: 'Payroll',
    description: 'Comprehensive month-wise master register with gross earnings, all statutory deductions and net payout breakdown.',
    frequency: 'Monthly',
    formats: ['PDF', 'Excel', 'CSV'],
    icon: 'FileSpreadsheet',
  },
  {
    id: 'rep-02',
    title: 'Salary Summary & Variance Report',
    category: 'Payroll',
    description: 'Department-level salary budget comparison and month-on-month variance analytics.',
    frequency: 'Monthly',
    formats: ['PDF', 'Excel'],
    icon: 'TrendingUp',
  },
  {
    id: 'rep-03',
    title: 'Attendance Muster Roll (Form 25)',
    category: 'Attendance',
    description: 'Statutory compliance attendance register showing daily shift logs, late check-ins, and overtime hours.',
    frequency: 'Monthly',
    formats: ['PDF', 'Excel'],
    icon: 'CalendarCheck',
  },
  {
    id: 'rep-04',
    title: 'Leave Balance & Encashment Report',
    category: 'Leave',
    description: 'Annual opening balance, leaves availed, pending quota, and year-end encashment provisions.',
    frequency: 'Monthly / Annual',
    formats: ['Excel', 'CSV'],
    icon: 'CalendarDays',
  },
  {
    id: 'rep-05',
    title: 'Provident Fund (EPFO ECR / Form 3A)',
    category: 'Statutory',
    description: 'EPFO-compliant Electronic Challan Return format with UAN mapping, employee & employer contributions.',
    frequency: 'Monthly',
    formats: ['Excel', 'CSV'],
    icon: 'ShieldCheck',
  },
  {
    id: 'rep-06',
    title: 'ESIC Monthly Return Statement',
    category: 'Statutory',
    description: 'Monthly employee state insurance filing sheet with IP number mapping and contribution breakdown.',
    frequency: 'Monthly',
    formats: ['Excel', 'CSV'],
    icon: 'Activity',
  },
  {
    id: 'rep-07',
    title: 'TDS Salary Computation (Form 24Q / 16)',
    category: 'Statutory',
    description: 'Quarterly tax deduction statement under Section 192, regime election, and taxable bracket summary.',
    frequency: 'Quarterly',
    formats: ['PDF', 'Excel'],
    icon: 'Receipt',
  },
  {
    id: 'rep-08',
    title: 'Department-wise Cost Center Report',
    category: 'Finance',
    description: 'Workforce expense allocation by functional business unit for management accounting.',
    frequency: 'Monthly',
    formats: ['PDF', 'Excel', 'CSV'],
    icon: 'PieChart',
  },
  {
    id: 'rep-09',
    title: 'Overtime & Incentives Register',
    category: 'Payroll',
    description: 'Approved overtime hours worked, rate multipliers, and project performance bonuses.',
    frequency: 'Monthly',
    formats: ['Excel', 'CSV'],
    icon: 'Clock',
  },
  {
    id: 'rep-10',
    title: 'Reimbursements & Claims Summary',
    category: 'Finance',
    description: 'Category-wise expense approvals across Travel, Broadband, Food, and Fuel with bill attachments audit.',
    frequency: 'Monthly',
    formats: ['Excel', 'CSV'],
    icon: 'FileText',
  },
  {
    id: 'rep-11',
    title: 'Staff Loans & Advances Ledger',
    category: 'Finance',
    description: 'Active loan balances, monthly EMI recovery schedule, and interest waivers ledger.',
    frequency: 'Monthly',
    formats: ['Excel', 'PDF'],
    icon: 'DollarSign',
  },
  {
    id: 'rep-12',
    title: 'Employee Headcount & Diversity Report',
    category: 'Attendance',
    description: 'Headcount metrics, gender ratios, average tenure, and attrition distribution across teams.',
    frequency: 'Quarterly',
    formats: ['PDF', 'Excel'],
    icon: 'Users',
  },
];

export const reportService = {
  async getAvailableReports(): Promise<ReportItem[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<ReportItem[]>('/reports');
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 40));
    return [...AVAILABLE_REPORTS];
  },

  async generateReport(reportId: string, options: {
    format: 'PDF' | 'Excel' | 'CSV';
    dateRange: string;
    department?: string;
    employeeId?: string;
  }): Promise<{ success: boolean; downloadUrl: string; filename: string }> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<{ success: boolean; downloadUrl: string; filename: string }>('/reports/generate', {
          reportId,
          ...options,
        });
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    // Simulate generation latency
    await new Promise((res) => setTimeout(res, 600));
    const report = AVAILABLE_REPORTS.find((r) => r.id === reportId);
    const titleSlug = (report?.title || 'Report').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const filename = `${titleSlug}_${options.dateRange.replace(/\s+/g, '_')}.${options.format.toLowerCase()}`;
    return {
      success: true,
      downloadUrl: `#generated-${filename}`,
      filename,
    };
  },
};
