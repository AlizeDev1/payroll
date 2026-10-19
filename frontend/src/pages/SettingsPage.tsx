import React, { useState } from 'react';
import {
  Building2,
  Receipt,
  Coins,
  CalendarDays,
  CalendarCheck,
  Calendar,
  ShieldCheck,
  Mail,
  Lock,
  Save,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { COMPANY_INFO } from '../data/mockData';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<string>('Company Profile');

  const [companyData, setCompanyData] = useState({
    name: COMPANY_INFO.name,
    pan: COMPANY_INFO.pan,
    tan: COMPANY_INFO.tan,
    cin: COMPANY_INFO.cin,
    pfEstCode: COMPANY_INFO.pfEstCode,
    esiCode: COMPANY_INFO.esiCode,
    address: COMPANY_INFO.address,
    city: COMPANY_INFO.city,
    state: COMPANY_INFO.state,
    pincode: COMPANY_INFO.pincode,
    email: COMPANY_INFO.email,
    phone: COMPANY_INFO.phone,
    website: COMPANY_INFO.website,
  });

  const [payrollSettings, setPayrollSettings] = useState({
    payCycleDay: 31,
    payCutoffDay: 25,
    tdsRegimeDefault: 'New Regime (115BAC)',
    autoPayslipEmail: true,
    roundNetSalary: true,
    directBankGateway: 'HDFC Corporate Banking (API Direct)',
  });

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    success('Settings Saved', 'Company profile and statutory codes updated.');
  };

  const handleSavePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    success('Payroll Rules Saved', 'Monthly disbursement cycle parameters saved.');
  };

  const settingsTabs = [
    { name: 'Company Profile', icon: Building2 },
    { name: 'Payroll Settings', icon: Receipt },
    { name: 'Salary Components', icon: Coins },
    { name: 'Leave Policies', icon: CalendarDays },
    { name: 'Attendance Shifts', icon: CalendarCheck },
    { name: 'Holiday Calendar', icon: Calendar },
    { name: 'Statutory Codes', icon: ShieldCheck },
    { name: 'Email & Alerts', icon: Mail },
    { name: 'Security & 2FA', icon: Lock },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Settings"
        subtitle="Manage company statutory registrations, payroll rules, attendance shifts, and email dispatch."
        breadcrumb={['Overview', 'System', 'Settings']}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Sidebar Tabs */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] p-2 shadow-[0_1px_3px_rgba(15,23,42,0.04)] space-y-1 h-fit">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-xs font-semibold transition-colors text-left ${
                  activeTab === tab.name
                    ? 'bg-purple-50 text-[#6D28D9] dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-3">
          {/* Tab 1: Company Profile */}
          {activeTab === 'Company Profile' && (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                Company Legal Identity
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Appears on employee payslips, tax certificates, and statutory government filing sheets.
              </p>

              <form onSubmit={handleSaveCompany} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Entity Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyData.name}
                      onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                      className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Corporate PAN Number
                    </label>
                    <input
                      type="text"
                      value={companyData.pan}
                      onChange={(e) => setCompanyData({ ...companyData, pan: e.target.value })}
                      className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tax Deduction Account Number (TAN)
                    </label>
                    <input
                      type="text"
                      value={companyData.tan}
                      onChange={(e) => setCompanyData({ ...companyData, tan: e.target.value })}
                      className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Corporate Identity Number (CIN/LLPIN)
                    </label>
                    <input
                      type="text"
                      value={companyData.cin}
                      onChange={(e) => setCompanyData({ ...companyData, cin: e.target.value })}
                      className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      value={companyData.email}
                      onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                      className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Registered Headquarters Address
                    </label>
                    <input
                      type="text"
                      value={companyData.address}
                      onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                      className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      City & State
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={companyData.city}
                        onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                        className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                      />
                      <input
                        type="text"
                        value={companyData.state}
                        onChange={(e) => setCompanyData({ ...companyData, state: e.target.value })}
                        className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={companyData.pincode}
                      onChange={(e) => setCompanyData({ ...companyData, pincode: e.target.value })}
                      className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    Save Company Profile
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Payroll Settings */}
          {activeTab === 'Payroll Settings' && (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                Payroll Cycle Configuration
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Determine payroll cut-off dates, payment gateways, and payslip dispatch schedules.
              </p>

              <form onSubmit={handleSavePayroll} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Pay Cycle End Day
                    </label>
                    <select
                      value={payrollSettings.payCycleDay}
                      onChange={(e) =>
                        setPayrollSettings({ ...payrollSettings, payCycleDay: Number(e.target.value) })
                      }
                      className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    >
                      <option value={31}>Last Day of the Month (Default)</option>
                      <option value={30}>30th of the Month</option>
                      <option value={25}>25th of the Month</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Attendance & Reimbursement Cutoff Day
                    </label>
                    <select
                      value={payrollSettings.payCutoffDay}
                      onChange={(e) =>
                        setPayrollSettings({ ...payrollSettings, payCutoffDay: Number(e.target.value) })
                      }
                      className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    >
                      <option value={25}>25th of the Month</option>
                      <option value={20}>20th of the Month</option>
                      <option value={28}>28th of the Month</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Direct Corporate Disbursement Gateway
                    </label>
                    <select
                      value={payrollSettings.directBankGateway}
                      onChange={(e) =>
                        setPayrollSettings({ ...payrollSettings, directBankGateway: e.target.value })
                      }
                      className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                    >
                      <option value="HDFC Corporate Banking (API Direct)">HDFC Corporate Banking (API Direct NEFT/RTGS)</option>
                      <option value="ICICI Corporate Banking (Bulk File)">ICICI Corporate Banking (Bulk Host-to-Host)</option>
                      <option value="State Bank of India (SBI e-Pay)">State Bank of India (SBI Corporate e-Pay)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={payrollSettings.autoPayslipEmail}
                      onChange={(e) =>
                        setPayrollSettings({ ...payrollSettings, autoPayslipEmail: e.target.checked })
                      }
                      className="rounded-[4px] text-[#6D28D9] focus:ring-[#6D28D9]"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Automatically email PDF payslip to employees immediately upon payroll approval</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={payrollSettings.roundNetSalary}
                      onChange={(e) =>
                        setPayrollSettings({ ...payrollSettings, roundNetSalary: e.target.checked })
                      }
                      className="rounded-[4px] text-[#6D28D9] focus:ring-[#6D28D9]"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Round Net Payable take-home salary to the nearest rupee</span>
                  </label>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    Save Payroll Rules
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: Statutory Codes */}
          {activeTab === 'Statutory Codes' && (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                Statutory Authority Establishment Credentials
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Required for electronic challan returns (EPFO ECR, ESIC, and PT Karnataka).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-[8px] border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">EPFO Establishment Code:</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">{COMPANY_INFO.pfEstCode}</p>
                  <span className="text-[10px] text-[#15803D] mt-1.5 block font-medium">Active · Unified Portal Verified</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-[8px] border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">ESIC Sub-Code:</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">{COMPANY_INFO.esiCode}</p>
                  <span className="text-[10px] text-[#15803D] mt-1.5 block font-medium">Active · Shram Suvidha Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for other tabs */}
          {activeTab !== 'Company Profile' && activeTab !== 'Payroll Settings' && activeTab !== 'Statutory Codes' && (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] p-8 shadow-[0_1px_3px_rgba(15,23,42,0.04)] text-center space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {activeTab} Preferences
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Configurations for {activeTab.toLowerCase()} are preconfigured to standard Indian IT corporate benchmarks.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => success('Updated', `${activeTab} configuration synchronized.`)}
              >
                Apply Default Standard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
