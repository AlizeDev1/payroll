import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Receipt,
  Edit3,
  MoreVertical,
  Calendar,
  Building2,
  Briefcase,
  FileSpreadsheet,
  FolderLock,
  Clock,
  ShieldCheck,
  CreditCard,
  Eye,
  EyeOff,
  CheckCircle2,
  Download,
  CalendarCheck,
  CalendarDays,
  FileText,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { employeeService } from '../services/employeeService';
import { payrollService } from '../services/payrollService';
import { leaveService } from '../services/leaveService';
import { Employee, PayslipItem, LeaveRequest } from '../types';
import { PayslipModal } from '../components/modals/PayslipModal';
import { useToast } from '../context/ToastContext';
import { maskAccountNumber, maskPanNumber } from '../utils/security';
import { triggerFileDownload } from '../utils/exportUtils';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success } = useToast();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Personal' | 'Employment' | 'Salary' | 'Bank' | 'Attendance' | 'Leave' | 'Payslips' | 'Documents'
  >('Overview');
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipItem | null>(null);
  const [employeeLeaves, setEmployeeLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    if (id) {
      employeeService.getEmployeeById(id).then((emp) => {
        if (emp) setEmployee(emp);
      });
      leaveService.getLeaves().then((allLeaves) => {
        setEmployeeLeaves(allLeaves.filter((l) => l.employeeId === id || l.employeeName?.includes(id)));
      });
    }
  }, [id]);

  if (!employee) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p>Loading employee record or employee not found...</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/employees')}>
          Return to Directory
        </Button>
      </div>
    );
  }

  const tabs = [
    'Overview',
    'Personal',
    'Employment',
    'Salary',
    'Bank',
    'Attendance',
    'Leave',
    'Payslips',
    'Documents',
  ] as const;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => navigate('/employees')}
          className="flex items-center gap-1.5 text-[#6D28D9] dark:text-purple-400 hover:underline font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Employees
        </button>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="font-mono text-slate-600 dark:text-slate-300 font-medium">
          {employee.employeeId}
        </span>
      </div>

      {/* Header Profile Section: Clean, Not Oversized */}
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={employee.avatar}
            alt={employee.firstName}
            className="w-14 h-14 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
                {employee.firstName} {employee.lastName}
              </h1>
              <span className="font-mono text-xs text-slate-500 font-semibold px-2 py-0.5 bg-[#F8FAFC] dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                {employee.employeeId}
              </span>
              <Badge variant={employee.status === 'Active' ? 'success' : 'warning'}>
                {employee.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              <span className="font-medium text-slate-900 dark:text-slate-100">{employee.designationTitle}</span>
              <span className="mx-1.5 text-slate-300 dark:text-slate-700">·</span>
              <span>{employee.departmentName}</span>
              <span className="mx-1.5 text-slate-300 dark:text-slate-700">·</span>
              <span>{employee.workLocation}</span>
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {employee.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {employee.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Actions: Edit & More */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => success('Profile updated', 'Contact details saved')}
            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Edit
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/payslips')}
            leftIcon={<Receipt className="w-3.5 h-3.5" />}
          >
            Payslip
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-[#E5E7EB] dark:border-[#1F2937] flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab
                ? 'bg-[#F3E8FF] text-[#6D28D9] dark:bg-purple-950/50 dark:text-purple-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-[#F8FAFC] dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview - Two-Column Information Grid */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-5 font-heading">
              Key Employment Metrics
            </h3>
            {/* Two-Column Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Joining Date</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                  {employee.joiningDate}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Department</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {employee.departmentName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Designation</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {employee.designationTitle}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Employment Type</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {employee.employmentType}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Reporting Manager</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {employee.reportingManagerName || 'Jayanth R'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Monthly Gross Salary</span>
                <span className="font-semibold font-mono text-[#6D28D9] dark:text-purple-400 tabular-nums">
                  ₹{employee.salary.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-5 font-heading">
              Employment Timeline & Milestones
            </h3>
            <div className="space-y-5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-800 pl-8">
              <div className="relative">
                <div className="absolute -left-8 top-1 w-2.5 h-2.5 rounded-full bg-[#6D28D9] ring-4 ring-white dark:ring-[#111827]" />
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  October 2026 Monthly Payroll Disbursed
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gross ₹{employee.salary.toLocaleString('en-IN')} successfully processed into {employee.bankName}.
                </p>
                <span className="text-[10px] text-slate-400 font-mono">10 October 2026</span>
              </div>

              <div className="relative">
                <div className="absolute -left-8 top-1 w-2.5 h-2.5 rounded-full bg-[#15803D] ring-4 ring-white dark:ring-[#111827]" />
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Annual Compensation Appraisal
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Revised CTC structure configured under {employee.departmentName} division.
                </p>
                <span className="text-[10px] text-slate-400 font-mono">01 April 2026</span>
              </div>

              <div className="relative">
                <div className="absolute -left-8 top-1 w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-white dark:ring-[#111827]" />
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Joined Alize Software Services LLP
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  KYC verified, EPFO UAN ({employee.uanNumber}) mapped.
                </p>
                <span className="text-[10px] text-slate-400 font-mono">{employee.joiningDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Personal Information */}
      {activeTab === 'Personal' && (
        <div className="bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-5 font-heading">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Date of Birth</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{employee.dateOfBirth}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Gender</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{employee.gender}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Residential Address</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{employee.address}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">City & State</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{employee.city}, {employee.state}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">PIN Code</span>
              <span className="font-semibold font-mono text-slate-900 dark:text-slate-100">{employee.pincode}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Primary Contact</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{employee.phone}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Employment Information */}
      {activeTab === 'Employment' && (
        <div className="bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-5 font-heading">
            Employment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Work Location</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{employee.workLocation}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Reporting Manager</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{employee.reportingManagerName || 'Jayanth R'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Notice Period</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">60 Days Standard</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Probation Status</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Confirmed / Active</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Attendance Shift</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">General Shift (09:30 AM - 06:30 PM IST)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Biometric Sync</span>
              <span className="font-semibold text-[#15803D]">Linked (Bellandur Facility)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Salary Information */}
      {activeTab === 'Salary' && (
        <div className="bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-heading">
            Salary Information & Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] space-y-2.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                Monthly Earnings
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Basic Salary (45%)</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  ₹{Math.round(employee.salary * 0.45).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">House Rent Allowance (HRA) (22.5%)</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  ₹{Math.round(employee.salary * 0.225).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Conveyance Allowance</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">₹1,600</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Special Allowance</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  ₹{Math.round(employee.salary - (employee.salary * 0.675 + 1600)).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold">
                <span className="text-slate-900 dark:text-slate-100">Gross Monthly Earnings</span>
                <span className="font-mono tabular-nums text-[#6D28D9] dark:text-purple-400">
                  ₹{employee.salary.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] space-y-2.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                Statutory Deductions & Tax Regime
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">EPFO Contribution (12% capped)</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  ₹{Math.min(1800, Math.round(employee.salary * 0.45 * 0.12)).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Professional Tax (PT Karnataka)</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">₹200</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Income Tax Regime</span>
                <span className="font-semibold text-[#6D28D9] dark:text-purple-400">{employee.taxRegime}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Estimated TDS (Sec 192)</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  ₹{Math.round(employee.salary * 0.08).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Bank Information */}
      {activeTab === 'Bank' && (
        <div className="bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-heading">
                Bank & Statutory Information
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Protected financial PII compliant with DPDP Act 2023 & RBI Cyber Security Guidelines.
              </p>
            </div>
            <button
              onClick={() => {
                const nextState = !showSensitiveData;
                setShowSensitiveData(nextState);
                if (nextState) {
                  success('Confidential PII Revealed', 'Action logged to security audit trail.');
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 rounded-lg transition-colors"
              title="Toggle PII Masking"
            >
              {showSensitiveData ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Mask Confidential PII</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reveal Unmasked Details</span>
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Bank Name</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{employee.bankName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Account Number</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {showSensitiveData ? employee.accountNumber : maskAccountNumber(employee.accountNumber)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">IFSC Code</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{employee.ifscCode}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Income Tax PAN</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {showSensitiveData ? employee.panNumber : maskPanNumber(employee.panNumber)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">EPFO UAN</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{employee.uanNumber}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Disbursement Mode</span>
              <span className="font-semibold text-[#15803D]">Direct NEFT/RTGS Batch</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Attendance View */}
      {activeTab === 'Attendance' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-slate-500 font-medium">Days Present</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">21 Days</p>
              <span className="text-[10px] text-slate-400">95.4% Attendance Rate</span>
            </div>
            <div className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-slate-500 font-medium">Leaves Availed</span>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-mono">1 Day</p>
              <span className="text-[10px] text-slate-400">Casual Leave (Approved)</span>
            </div>
            <div className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-slate-500 font-medium">Remote (WFH)</span>
              <p className="text-xl font-bold text-sky-600 dark:text-sky-400 mt-1 font-mono">1 Day</p>
              <span className="text-[10px] text-slate-400">Geofence Verified</span>
            </div>
            <div className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-slate-500 font-medium">Loss of Pay (LOP)</span>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">0 Days</p>
              <span className="text-[10px] text-emerald-600">Zero Salary Deduction</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-heading">
                October 2026 Daily Attendance Muster
              </h3>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Present</span>
                <span className="inline-flex items-center gap-1 font-semibold text-sky-600"><span className="w-2 h-2 rounded-full bg-sky-500"></span> WFH</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Leave</span>
                <span className="inline-flex items-center gap-1 font-semibold text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Off</span>
              </div>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-16 gap-2">
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isWeekend = [3, 4, 10, 11, 17, 18, 24, 25, 31].includes(day);
                const isLeave = day === 8;
                const isWfh = day === 14;
                const isFuture = day > 22;
                return (
                  <div
                    key={day}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isFuture
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                        : isWeekend
                        ? 'bg-slate-100/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-500 font-medium'
                        : isLeave
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 font-bold'
                        : isWfh
                        ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-400 font-bold'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 font-bold'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 font-mono">Day {day}</div>
                    <div className="text-xs font-mono mt-0.5 font-bold">
                      {isFuture ? '-' : isWeekend ? 'WO' : isLeave ? 'CL' : isWfh ? 'WFH' : 'P'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Leave Balances & History */}
      {activeTab === 'Leave' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Earned / Privilege Leave</span>
                <span className="font-mono text-xs font-bold text-[#6D28D9] dark:text-purple-400">14 / 18</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#6D28D9] h-full rounded-full" style={{ width: '78%' }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">14 days encashable balance available</p>
            </div>
            <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Casual Leave (CL)</span>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">8 / 12</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '66%' }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Lapses at calendar year end (Dec 31)</p>
            </div>
            <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Sick / Medical Leave (SL)</span>
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">7 / 10</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '70%' }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Requires medical certificate for &gt; 2 days</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4 font-heading">
              Recent Leave Application History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                    <th className="pb-3">Leave Type</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Days</th>
                    <th className="pb-3">Reason</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">Casual Leave</td>
                    <td className="py-3 font-mono text-slate-600 dark:text-slate-300">08 Oct 2026 - 08 Oct 2026</td>
                    <td className="py-3 font-mono">1.0 Day</td>
                    <td className="py-3 text-slate-500">Family emergency & personal commitment</td>
                    <td className="py-3"><Badge variant="success">Approved</Badge></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">Earned Leave</td>
                    <td className="py-3 font-mono text-slate-600 dark:text-slate-300">18 Aug 2026 - 20 Aug 2026</td>
                    <td className="py-3 font-mono">3.0 Days</td>
                    <td className="py-3 text-slate-500">Annual vacation travel</td>
                    <td className="py-3"><Badge variant="success">Approved</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Payslips View */}
      {activeTab === 'Payslips' && (
        <div className="bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-heading">
                Monthly Compensation Slips
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Official Form 16 / Payslip statements with tax and statutory deduction breakdown.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="pb-3">Pay Period</th>
                  <th className="pb-3">Gross Earnings</th>
                  <th className="pb-3">Total Deductions</th>
                  <th className="pb-3">Net Disbursed</th>
                  <th className="pb-3">Disbursal Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {[
                  { month: 'October 2026', date: '31 Oct 2026' },
                  { month: 'September 2026', date: '30 Sep 2026' },
                  { month: 'August 2026', date: '31 Aug 2026' },
                  { month: 'July 2026', date: '31 Jul 2026' },
                ].map((period, idx) => {
                  const gross = employee.salary;
                  const deductions = Math.round(gross * 0.16);
                  const net = gross - deductions;
                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                        {period.month}
                      </td>
                      <td className="py-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        ₹{gross.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 font-mono tabular-nums text-red-600 dark:text-red-400">
                        -₹{deductions.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 font-mono font-bold tabular-nums text-[#15803D] dark:text-emerald-400">
                        ₹{net.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 font-mono text-slate-500">{period.date}</td>
                      <td className="py-3">
                        <Badge variant="success">Paid</Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const slip = await payrollService.getPayslipById(employee.id);
                            if (slip) {
                              setSelectedPayslip(slip);
                            } else {
                              setSelectedPayslip({
                                id: `slip-${employee.id}`,
                                employeeId: employee.employeeId,
                                employeeName: `${employee.firstName} ${employee.lastName}`,
                                department: employee.departmentName,
                                designation: employee.designationName,
                                month: period.month.split(' ')[0],
                                year: 2026,
                                basic: Math.round(gross * 0.5),
                                hra: Math.round(gross * 0.25),
                                specialAllowance: Math.round(gross * 0.25),
                                gross,
                                epf: Math.min(1800, Math.round(gross * 0.5 * 0.12)),
                                esic: 0,
                                professionalTax: 200,
                                tds: Math.round(gross * 0.08),
                                totalDeductions: deductions,
                                netPay: net,
                                status: 'Paid',
                              });
                            }
                          }}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          View Payslip
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 9: Documents View */}
      {activeTab === 'Documents' && (
        <div className="bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-heading">
                Verified Employment & KYC Vault
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Statutory identity cards and contracts secured with AES-256 cloud encryption.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="pb-3">Document Title</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Verified Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {[
                  { title: 'Aadhaar Card (Masked UIDAI)', cat: 'KYC & Identity', date: employee.joiningDate },
                  { title: `Permanent Account Number (PAN: ${showSensitiveData ? employee.panNumber : maskPanNumber(employee.panNumber)})`, cat: 'Statutory Tax', date: employee.joiningDate },
                  { title: 'Employment Agreement & Appointment Letter', cat: 'Contracts', date: employee.joiningDate },
                  { title: 'Non-Disclosure & IP Assignment Agreement', cat: 'Legal Compliance', date: employee.joiningDate },
                  { title: 'Educational Degree & Transcripts', cat: 'Academic Records', date: employee.joiningDate },
                  { title: 'Form 12BB Income Tax Declaration (FY 2026-27)', cat: 'Income Tax', date: '05 Apr 2026' },
                ].map((doc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#6D28D9] shrink-0" />
                      <span>{doc.title}</span>
                    </td>
                    <td className="py-3 text-slate-500">{doc.cat}</td>
                    <td className="py-3 font-mono text-slate-500">{doc.date}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          triggerFileDownload(
                            `${doc.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`,
                            `DOCUMENT VERIFICATION CERTIFICATE\n--------------------------------\nOrganization: Alize Software Services LLP\nEmployee: ${employee.firstName} ${employee.lastName} (${employee.employeeId})\nDocument: ${doc.title}\nCategory: ${doc.cat}\nVerification Status: Digitally Verified\nVerified On: ${doc.date}`,
                            'text/plain'
                          );
                          success('Document Downloaded', `Downloaded verified certificate for ${doc.title}`);
                        }}
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      <PayslipModal
        isOpen={Boolean(selectedPayslip)}
        onClose={() => setSelectedPayslip(null)}
        payslip={selectedPayslip}
      />
    </div>
  );
};
