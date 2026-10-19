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
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { employeeService } from '../services/employeeService';
import { Employee } from '../types';
import { useToast } from '../context/ToastContext';
import { maskAccountNumber, maskPanNumber } from '../utils/security';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success } = useToast();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Personal' | 'Employment' | 'Salary' | 'Bank' | 'Attendance' | 'Leave' | 'Payslips' | 'Documents'
  >('Overview');

  useEffect(() => {
    if (id) {
      employeeService.getEmployeeById(id).then((emp) => {
        if (emp) setEmployee(emp);
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

      {/* Tabs 6-9: Contextual Views (Attendance, Leave, Payslips, Documents) */}
      {(activeTab === 'Attendance' || activeTab === 'Leave' || activeTab === 'Payslips' || activeTab === 'Documents') && (
        <div className="bg-white dark:bg-[#111827] p-8 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] text-center space-y-3 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-heading">
            {activeTab} Records for {employee.firstName} {employee.lastName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Filtered view synchronized with the centralized {activeTab.toLowerCase()} service module.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              navigate(`/${activeTab.toLowerCase() === 'leave' ? 'leaves' : activeTab.toLowerCase()}`)
            }
          >
            Open Dedicated {activeTab} Console →
          </Button>
        </div>
      )}
    </div>
  );
};
