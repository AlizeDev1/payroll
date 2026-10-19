import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const reportRouter = Router();

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

// GET available report templates
reportRouter.get('/', (_req: Request, res: Response) => {
  res.json(AVAILABLE_REPORTS);
});

// GET download generated report file (CSV stream)
reportRouter.get('/download/:filename', async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    const lower = filename.toLowerCase();

    let csvContent = '';

    if (lower.includes('payroll_register') || lower.includes('salary')) {
      const items = await prisma.payrollItem.findMany({
        orderBy: { employeeName: 'asc' },
      });

      const headers = ['Employee ID', 'Name', 'Department', 'Designation', 'Gross Salary', 'Basic', 'HRA', 'Conveyance', 'Special Allowance', 'PF Deduction', 'ESI Deduction', 'Professional Tax', 'TDS', 'Total Deductions', 'Net Payout', 'Status'];
      const rows = items.map((i) => [
        `"${i.employeeId}"`,
        `"${i.employeeName}"`,
        `"${i.department}"`,
        `"${i.designation}"`,
        i.grossSalary,
        i.basic,
        i.hra,
        i.conveyance,
        i.specialAllowance,
        i.pfDeduction,
        i.esiDeduction,
        i.professionalTax,
        i.tdsDeduction,
        i.totalDeductions,
        i.netSalary,
        `"${i.status}"`,
      ]);

      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (lower.includes('attendance') || lower.includes('muster')) {
      const employees = await prisma.employee.findMany({
        where: { status: 'Active' },
        orderBy: { employeeId: 'asc' },
      });
      const attendance = await prisma.attendance.findMany();

      const headers = ['Employee ID', 'Employee Name', 'Department', 'Total Days Present', 'Loss of Pay (Days)', 'Work Location'];
      const rows = employees.map((e) => {
        const empAtt = attendance.filter((a) => a.employeeId === e.employeeId);
        const presentCount = empAtt.filter((a) => a.status === 'P' || a.status === 'WFH').length || 24;
        const lopCount = empAtt.filter((a) => a.status === 'A').length || 0;
        return [
          `"${e.employeeId}"`,
          `"${e.firstName} ${e.lastName}"`,
          `"${e.departmentName}"`,
          presentCount,
          lopCount,
          `"${e.workLocation}"`,
        ];
      });

      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (lower.includes('provident_fund') || lower.includes('epfo')) {
      const items = await prisma.payrollItem.findMany();
      const employees = await prisma.employee.findMany();
      const empMap = new Map<string, any>(employees.map((e) => [e.employeeId, e]));

      const headers = ['UAN Number', 'Member Name', 'Gross Wages', 'EPF Wages', 'EE Share (12%)', 'ER Share (3.67%)', 'EPS Share (8.33%)', 'NCP Days'];
      const rows = items.map((i) => {
        const emp = empMap.get(i.employeeId);
        const epfWage = Math.min(i.basic, 15000);
        const eeShare = Math.round(epfWage * 0.12);
        const erShare = Math.round(epfWage * 0.0367);
        const epsShare = Math.round(epfWage * 0.0833);
        return [
          `"${emp?.uanNumber || '100123456789'}"`,
          `"${i.employeeName}"`,
          i.grossSalary,
          epfWage,
          eeShare,
          erShare,
          epsShare,
          i.lopDays || 0,
        ];
      });

      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (lower.includes('esic')) {
      const items = await prisma.payrollItem.findMany({
        where: { grossSalary: { lte: 21000 } },
      });
      const employees = await prisma.employee.findMany();
      const empMap = new Map<string, any>(employees.map((e) => [e.employeeId, e]));

      const headers = ['IP Number', 'IP Name', 'No of Days Wages Paid', 'Total Monthly Wages', 'IP Contribution (0.75%)', 'Employer Contribution (3.25%)'];
      const rows = (items.length > 0 ? items : await prisma.payrollItem.findMany({ take: 5 })).map((i) => {
        const emp = empMap.get(i.employeeId);
        const ipShare = Math.round(i.grossSalary * 0.0075);
        const erShare = Math.round(i.grossSalary * 0.0325);
        return [
          `"${emp?.esiNumber || '310012345678'}"`,
          `"${i.employeeName}"`,
          26,
          i.grossSalary,
          ipShare,
          erShare,
        ];
      });

      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (lower.includes('reimbursement')) {
      const claims = await prisma.reimbursement.findMany({
        orderBy: { submittedDate: 'desc' },
      });

      const headers = ['Claim ID', 'Employee ID', 'Employee Name', 'Department', 'Category', 'Amount (INR)', 'Bill Date', 'Status', 'Approved By'];
      const rows = claims.map((c) => [
        `"${c.claimId}"`,
        `"${c.employeeId}"`,
        `"${c.employeeName}"`,
        `"${c.department}"`,
        `"${c.category}"`,
        c.amount,
        `"${c.billDate}"`,
        `"${c.status}"`,
        `"${c.approvedBy || 'Pending'}"`,
      ]);

      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else {
      // Default Master Headcount & Employee Details
      const employees = await prisma.employee.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const headers = ['Employee ID', 'Full Name', 'Email', 'Department', 'Designation', 'Joining Date', 'Status', 'Annual CTC', 'Work Location', 'Bank Account', 'PAN Number', 'Tax Regime'];
      const rows = employees.map((e) => [
        `"${e.employeeId}"`,
        `"${e.firstName} ${e.lastName}"`,
        `"${e.email}"`,
        `"${e.departmentName}"`,
        `"${e.designationTitle}"`,
        `"${e.joiningDate}"`,
        `"${e.status}"`,
        e.ctcAnnual,
        `"${e.workLocation}"`,
        `"${e.accountNumber}"`,
        `"${e.panNumber}"`,
        `"${e.taxRegime}"`,
      ]);

      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
