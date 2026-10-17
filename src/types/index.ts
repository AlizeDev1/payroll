export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern' | 'Probation';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Inactive';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  departmentId: string;
  departmentName: string;
  designationId: string;
  designationTitle: string;
  reportingManagerId?: string;
  reportingManagerName?: string;
  joiningDate: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  workLocation: string;
  salary: number; // Monthly gross or CTC
  ctcAnnual: number;
  // Personal
  dateOfBirth: string;
  gender: Gender;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact?: string;
  // Bank & Statutory
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  aadhaarNumber: string;
  uanNumber: string;
  esiNumber?: string;
  taxRegime: 'New Regime (115BAC)' | 'Old Regime';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  headId: string;
  employeeCount: number;
  budgetMonthly: number;
  status: 'Active' | 'Inactive';
}

export interface Designation {
  id: string;
  title: string;
  departmentId: string;
  departmentName: string;
  level: string; // L1, L2, L3, Lead, Director
  employeeCount: number;
  minSalary: number;
  maxSalary: number;
  status: 'Active' | 'Inactive';
}

export type AttendanceStatus = 'P' | 'A' | 'L' | 'H' | 'WFH' | 'WO' | 'HD'; // Present, Absent, Late, Holiday, WFH, Week Off, Half Day

export interface DayAttendance {
  date: string;
  dayNumber: number;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  hoursWorked?: number;
}

export interface EmployeeMonthlyAttendance {
  employeeId: string;
  employeeName: string;
  department: string;
  avatar: string;
  month: string; // '2026-10'
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  halfDays: number;
  wfhDays: number;
  days: { [day: number]: AttendanceStatus };
}

export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Privilege / Earned Leave' | 'Maternity Leave' | 'Compensatory Off';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  avatar: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  comments?: string;
}

export interface SalaryComponent {
  id: string;
  name: string;
  type: 'Earning' | 'Deduction';
  calculationType: 'Fixed' | 'Percentage' | 'Formula';
  value: number; // Amount or percentage
  percentageOf?: string; // e.g., 'Basic'
  isTaxable: boolean;
  isStatutory: boolean;
}

export interface SalaryStructure {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  basicPct: number;
  hraPct: number;
  conveyance: number;
  specialAllowance: number;
  pfApplicable: boolean;
  esiApplicable: boolean;
  ptApplicable: boolean;
  lwfApplicable?: boolean;
  lwfState?: string;
  lwfEmployeeAmount?: number;
  status: 'Active' | 'Draft';
}

export type PayrollStatus = 'Draft' | 'Processing' | 'Pending Approval' | 'Approved' | 'Paid';

export interface PayrollRecordItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  bankAccount: string;
  grossSalary: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  bonus: number;
  incentives: number;
  overtime: number;
  overtimeHours?: number;
  totalEarnings: number;
  // Deductions
  pfDeduction: number;
  esiDeduction: number;
  professionalTax: number;
  lwfDeduction?: number;
  tdsDeduction: number;
  lopDays: number;
  lopDeduction: number;
  loanRecovery: number;
  totalDeductions: number;
  netSalary: number;
  status: 'Paid' | 'Approved' | 'Pending' | 'Hold';
  paymentDate?: string;
  paymentMode: 'Bank Transfer (NEFT/RTGS)' | 'UPI' | 'Cheque';
}

export interface MonthlyPayrollSummary {
  month: string; // 'October 2026'
  year: number;
  monthIndex: number; // 9 for Oct
  status: PayrollStatus;
  totalEmployees: number;
  grossAmount: number;
  totalEarnings: number;
  totalDeductions: number;
  netPayable: number;
  processedDate?: string;
  approvedBy?: string;
  paymentReference?: string;
}

export interface PayslipItem {
  id: string;
  payrollId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  joiningDate: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  uanNumber: string;
  esiNumber?: string;
  month: string;
  year: number;
  workedDays: number;
  lopDays: number;
  totalDays: number;
  basic: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  bonus: number;
  incentives: number;
  overtime: number;
  overtimeHours?: number;
  totalEarnings: number;
  pf: number;
  esi: number;
  pt: number;
  lwf?: number;
  tds: number;
  lop: number;
  loanDeduction: number;
  totalDeductions: number;
  netSalary: number;
  netSalaryInWords: string;
  generatedDate: string;
  status: 'Generated' | 'Sent' | 'Downloaded';
}

export type ReimbursementCategory = 'Travel' | 'Food' | 'Medical' | 'Internet' | 'Fuel' | 'Other';
export type ClaimStatus = 'Pending' | 'Approved' | 'Rejected' | 'Paid';

export interface ReimbursementClaim {
  id: string;
  claimId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: ReimbursementCategory;
  amount: number;
  billDate: string;
  submittedDate: string;
  description: string;
  receiptAttachment?: string;
  status: ClaimStatus;
  approvedBy?: string;
  approvalRemarks?: string;
}

export interface LoanAdvance {
  id: string;
  loanId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  loanType: 'Personal Loan' | 'Salary Advance' | 'Emergency Aid' | 'Equipment Advance';
  originalAmount: number;
  repaidAmount: number;
  remainingAmount: number;
  monthlyDeduction: number;
  tenureMonths: number;
  remainingMonths: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Pending Approval' | 'Closed';
}

export interface StatutoryCompliance {
  category: 'Provident Fund (PF)' | 'ESI' | 'Professional Tax (PT)' | 'TDS (Section 192)' | 'Labour Welfare Fund' | 'Gratuity';
  status: 'Compliant' | 'Pending Filing' | 'Audit Ready';
  registeredEmployees: number;
  employeeContribution: number;
  employerContribution: number;
  totalRemittance: number;
  dueDate: string;
  lastChallanNo: string;
  lastFilingDate: string;
}

export interface TaxDeclaration {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  financialYear: string; // e.g. 'FY 2026-27'
  taxRegime: 'New Regime (115BAC)' | 'Old Regime';
  section80C: number;
  section80D: number;
  hraExemption: number;
  homeLoanInterest: number;
  otherDeductions: number;
  totalDeclaredDeductions: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
  reviewedBy?: string;
}

export interface FullAndFinalSettlement {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  resignationDate: string;
  lastWorkingDay: string;
  noticePeriodDays: number;
  shortfallDays: number;
  unpaidSalary: number;
  leaveEncashmentDays: number;
  leaveEncashmentAmount: number;
  gratuityAmount: number;
  bonusIncentive: number;
  totalPayableEarnings: number;
  noticeRecovery: number;
  loanBalanceRecovery: number;
  taxDeduction: number;
  otherDeductions: number;
  netSettlementAmount: number;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Settled';
  settledDate?: string;
}

export interface CompanyDocument {
  id: string;
  title: string;
  category: 'Employee Documents' | 'Payslips' | 'Tax Documents' | 'Company Documents' | 'Other';
  employeeId?: string;
  employeeName?: string;
  fileName: string;
  fileSize: string;
  uploadedDate: string;
  status: 'Verified' | 'Pending Review' | 'Archived';
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG';
}

export interface SystemNotification {
  id: string;
  type: 'Payroll' | 'Leave' | 'Attendance' | 'Reimbursement' | 'Document' | 'System';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'normal' | 'high';
}

export type UserRole = 'Super Admin' | 'Company Admin' | 'HR Manager' | 'Payroll Manager' | 'Accountant' | 'Employee';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
  avatar: string;
}

export interface RolePermissions {
  role: UserRole;
  description: string;
  permissions: {
    employees: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    attendance: { view: boolean; mark: boolean; approve: boolean };
    leave: { view: boolean; apply: boolean; approve: boolean };
    payroll: { view: boolean; process: boolean; approve: boolean; payout: boolean };
    payslips: { view: boolean; generate: boolean; download: boolean };
    reports: { view: boolean; export: boolean };
    settings: { view: boolean; edit: boolean };
    documents: { view: boolean; upload: boolean; delete: boolean };
  };
}

// --- Phase 1: Contractor & Freelancer Payments (TDS 194C / 194J) ---
export type ContractorTdsSection = '194J (10%)' | '194C - Individual (1%)' | '194C - Company (2%)';
export type ContractorStatus = 'Active' | 'Inactive';

export interface Contractor {
  id: string;
  contractorId: string;
  name: string;
  companyOrTradeName?: string;
  email: string;
  phone: string;
  category: 'Software Architecture' | 'UI/UX Design' | 'Legal & Compliance' | 'Content & Marketing' | 'IT Infrastructure';
  panNumber: string;
  gstin?: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  tdsSection: ContractorTdsSection;
  tdsRate: number; // 10, 1, or 2
  totalBilled: number;
  totalTdsDeducted: number;
  status: ContractorStatus;
  joinedDate: string;
}

export interface ContractorInvoice {
  id: string;
  invoiceNumber: string;
  contractorId: string;
  contractorName: string;
  invoiceDate: string;
  serviceDescription: string;
  grossAmount: number;
  tdsSection: ContractorTdsSection;
  tdsRate: number;
  tdsAmount: number;
  netPayable: number;
  status: 'Paid' | 'Approved' | 'Pending Approval' | 'Rejected';
  paymentDate?: string;
  paymentReference?: string;
}

// --- Phase 1: Automated Overtime Engine ---
export interface EmployeeOvertimeRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  multiplier: number; // 1.5 for regular OT, 2.0 for weekend/holiday
  totalOtPay: number;
  status: 'Approved' | 'Pending Review';
}

