import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  CalendarDays,
  CreditCard,
  Download,
  ArrowUpRight,
  Calendar,
  FileWarning,
  ShieldCheck,
  CheckCircle2,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ExportReportModal } from '../components/modals/ExportReportModal';
import { AVAILABLE_REPORTS } from '../services/reportService';
import { usePageSeo } from '../hooks/usePageSeo';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  usePageSeo({
    title: 'Workforce Operations Dashboard | Alize Payroll',
    description: 'Executive payroll metrics, real-time muster roll statistics, statutory compliance events, and department salary distributions.',
    canonicalPath: '/dashboard',
  });

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // Quick statutory activity items
  const recentActivities = [
    {
      id: 'act-1',
      title: 'October 2026 Payroll Run Authorized',
      subtitle: 'Batch ALIZE/PAY/2026-10/0091 approved for 86 employees',
      user: 'Jayanth R (Admin)',
      time: '12 mins ago',
      icon: CreditCard,
    },
    {
      id: 'act-2',
      title: 'New Employee Profile Created',
      subtitle: 'Rohan Deshmukh assigned to Human Resources (EMP005)',
      user: 'Sneha Reddy (HR)',
      time: '1 hour ago',
      icon: Users,
    },
    {
      id: 'act-3',
      title: 'Privilege Leave Approved',
      subtitle: 'Ananya Sundaram granted 5 days leave from 12 Oct',
      user: 'Vikram Malhotra',
      time: '3 hours ago',
      icon: CalendarDays,
    },
    {
      id: 'act-4',
      title: 'Salary Structure Band A Revised',
      subtitle: 'Special allowance formula recalculated for senior tech staff',
      user: 'Rajesh Kulkarni',
      time: 'Yesterday',
      icon: ShieldCheck,
    },
    {
      id: 'act-5',
      title: '86 Payslips Generated',
      subtitle: 'Digital payslip PDFs published to Employee Self-Service',
      user: 'Automated Pipeline',
      time: 'Yesterday',
      icon: CheckCircle2,
    },
  ];

  const upcomingEvents = [
    {
      title: 'Monthly Salary Disbursement Batch',
      date: '31 Oct 2026',
      desc: 'Scheduled direct corporate NEFT/RTGS transfer batch',
      icon: CreditCard,
      badge: 'Payout Day',
    },
    {
      title: 'EPFO & ESIC Electronic Challan',
      date: '15 Nov 2026',
      desc: 'Mandatory statutory remittance deadline for Oct contributions',
      icon: Calendar,
      badge: 'Statutory',
    },
    {
      title: 'Karnataka Professional Tax (PT)',
      date: '20 Nov 2026',
      desc: 'Form 5 monthly return submission to Commercial Taxes Dept',
      icon: ShieldCheck,
      badge: 'State Tax',
    },
    {
      title: 'Biometric Attendance Device Audit',
      date: '28 Oct 2026',
      desc: 'Bellandur facility hardware log reconciliation',
      icon: FileWarning,
      badge: 'Audit',
    },
  ];

  // Monthly payroll trend data (Amounts in INR) with comparison baseline
  const payrollMonths = [
    { month: 'May 26', amount: 1680000, target: 1650000, heightPct: 68 },
    { month: 'Jun 26', amount: 1720000, target: 1700000, heightPct: 73 },
    { month: 'Jul 26', amount: 1750000, target: 1740000, heightPct: 77 },
    { month: 'Aug 26', amount: 1780000, target: 1770000, heightPct: 82 },
    { month: 'Sep 26', amount: 1810000, target: 1800000, heightPct: 87 },
    { month: 'Oct 26', amount: 1842500, target: 1820000, heightPct: 100 },
  ];

  // Department Distribution data
  const departments = [
    { name: 'Engineering', count: 42, pct: '48.8%', color: 'bg-[#6D28D9]' },
    { name: 'Marketing', count: 11, pct: '12.8%', color: 'bg-indigo-600' },
    { name: 'Sales & BD', count: 10, pct: '11.6%', color: 'bg-sky-600' },
    { name: 'Finance & Accounts', count: 9, pct: '10.5%', color: 'bg-emerald-600' },
    { name: 'Human Resources', count: 8, pct: '9.3%', color: 'bg-amber-600' },
    { name: 'Operations', count: 6, pct: '7.0%', color: 'bg-slate-500' },
  ];

  const adminGreeting = currentUser?.name ? currentUser.name.split(' ')[0] : 'Admin';

  return (
    <div className="space-y-6">
      {/* Top Section with Explicit Enterprise Hierarchy */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E5E7EB] dark:border-[#1F2937]">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
            Good morning, {adminGreeting}
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            Here's your workforce overview for October 2026.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            October 2026 Cycle
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setExportModalOpen(true)}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Register
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/payroll')}
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
          >
            Manage Payroll Run
          </Button>
        </div>
      </div>

      {/* PRIMARY METRICS: Strict 4-Column Grid */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-0.5">
          Primary Metrics
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <StatCard
            title="Total Employees"
            value="86"
            change="+8.2% from last month"
            isPositive={true}
            icon={Users}
            description="Active workforce"
          />
          <StatCard
            title="Present Today"
            value="79"
            subValue="91.8%"
            isPositive={true}
            icon={CheckCircle}
            description="75 in-office · 4 WFH"
          />
          <StatCard
            title="On Leave"
            value="5"
            subValue="Staff"
            icon={CalendarDays}
            description="3 Casual · 2 Privilege"
          />
          <StatCard
            title="Monthly Payroll"
            value="₹18,42,500"
            change="+5.4% budgeted"
            isPositive={true}
            icon={CreditCard}
            accent={true}
            description="Net payable for Oct"
          />
        </div>
      </div>

      {/* Charts Section: Sophisticated Charts with Thin Lines, Subtle Grid, Muted Colors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* 1. Monthly Payroll Overview Chart */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
                Monthly Net Payroll Disbursement
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Trailing 6-month disbursement trend (INR)</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#6D28D9] dark:text-purple-400 tabular-nums">
                ₹18.42 Lakhs
              </span>
              <p className="text-[10px] text-[#15803D] font-medium">+9.6% YoY</p>
            </div>
          </div>

          {/* Clean Legend */}
          <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#6D28D9]" />
              <span>Actual Disbursed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 dark:bg-slate-700" />
              <span>Previous / Target</span>
            </span>
          </div>

          {/* Sophisticated Bar Chart with Subtle Grid */}
          <div className="relative h-44 pt-3 pb-2 border-b border-[#E5E7EB] dark:border-[#1F2937]">
            {/* Subtle Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-3 border-b border-dashed border-slate-100 dark:border-slate-800 pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-100 dark:border-slate-800 pointer-events-none" />

            <div className="h-full flex items-end justify-between gap-3 relative z-10">
              {payrollMonths.map((m) => {
                const isHovered = hoveredMonth === m.month;
                const isCurrent = m.month.includes('Oct');
                return (
                  <div
                    key={m.month}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredMonth(m.month)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    <div
                      className={`text-[10px] font-mono tabular-nums transition-opacity ${
                        isHovered || isCurrent
                          ? 'opacity-100 text-slate-900 dark:text-slate-100 font-semibold'
                          : 'opacity-0 text-slate-400'
                      }`}
                    >
                      ₹{(m.amount / 100000).toFixed(2)}L
                    </div>
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Comparison Target Bar */}
                      <div
                        style={{ height: `${(m.target / 1842500) * 85}%` }}
                        className="w-2.5 rounded-t bg-slate-200 dark:bg-slate-800 transition-all duration-200"
                        title={`Target: ₹${(m.target / 100000).toFixed(2)}L`}
                      />
                      {/* Actual Bar */}
                      <div
                        style={{ height: `${m.heightPct * 0.9}%` }}
                        className={`w-3.5 rounded-t transition-all duration-200 ${
                          isCurrent
                            ? 'bg-[#6D28D9]'
                            : 'bg-slate-400/80 dark:bg-slate-600 group-hover:bg-[#6D28D9]/70'
                        }`}
                        title={`Actual: ₹${(m.amount / 100000).toFixed(2)}L`}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-medium truncate ${
                        isCurrent
                          ? 'text-[#6D28D9] dark:text-purple-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3">
            <span>
              Average Monthly Run:{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-mono">₹17.47L</strong>
            </span>
            <span className="text-[#15803D] font-semibold font-mono tabular-nums flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Budget Variance: +1.2%
            </span>
          </div>
        </div>

        {/* 2. Today's Attendance Synchronization */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
                  Today's Attendance Status
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Live biometric synchronization (Bellandur Hub)</p>
              </div>
              <Badge variant="success">91.8% Present</Badge>
            </div>

            {/* Attendance Progress Bars */}
            <div className="space-y-3 my-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Present (Biometric Device / Office)
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    75 Staff (87.2%)
                  </span>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#15803D] rounded" style={{ width: '87.2%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Work From Home (Approved)
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    4 Staff (4.6%)
                  </span>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#0369A1] rounded" style={{ width: '4.6%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    On Leave (CL / SL / PL)
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    5 Staff (5.8%)
                  </span>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#B45309] rounded" style={{ width: '5.8%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Unexcused Absence (LOP Risk)
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    2 Staff (2.4%)
                  </span>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#B91C1C] rounded" style={{ width: '2.4%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#1F2937] flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Shift Window: 09:30 AM – 06:30 PM IST</span>
            <button
              onClick={() => navigate('/attendance')}
              className="text-[#6D28D9] dark:text-purple-400 font-semibold hover:underline"
            >
              View Full Muster Roll →
            </button>
          </div>
        </div>

        {/* 3. Department Distribution */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
                Department Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Headcount distribution across divisions</p>
            </div>
            <button
              onClick={() => navigate('/departments')}
              className="text-xs text-[#6D28D9] dark:text-purple-400 font-medium hover:underline"
            >
              Manage Units
            </button>
          </div>

          {/* Department Breakdown Rows */}
          <div className="space-y-2.5">
            {departments.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2 h-2 rounded-xs ${dept.color} shrink-0`} />
                  <span className="text-slate-700 dark:text-slate-300 truncate font-medium">
                    {dept.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-slate-500 font-mono tabular-nums">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{dept.count}</span>
                  <span className="text-slate-400 w-12 text-right">{dept.pct}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Bar Split */}
          <div className="w-full h-2 rounded overflow-hidden flex mt-4 bg-slate-100 dark:bg-slate-800">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className={`${dept.color} h-full`}
                style={{ width: dept.pct }}
                title={`${dept.name}: ${dept.count} (${dept.pct})`}
              />
            ))}
          </div>
        </div>

        {/* 4. Statutory Compliance Health */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
                Indian Statutory Compliance Health
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Statutory filings status & challan records</p>
            </div>
            <Badge variant="success">All Filings Active</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs mb-3">
            <div className="p-2.5 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-lg border border-[#E5E7EB] dark:border-[#1F2937]">
              <span className="text-slate-500 text-[11px]">EPFO Electronic Challan (ECR)</span>
              <p className="font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">TRRN Verified</p>
              <p className="text-[11px] text-[#15803D] font-mono mt-0.5">₹3,09,600 remitted</p>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-lg border border-[#E5E7EB] dark:border-[#1F2937]">
              <span className="text-slate-500 text-[11px]">ESIC Monthly Statement</span>
              <p className="font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">CRN Processed</p>
              <p className="text-[11px] text-[#15803D] font-mono mt-0.5">₹50,400 remitted</p>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-lg border border-[#E5E7EB] dark:border-[#1F2937]">
              <span className="text-slate-500 text-[11px]">Professional Tax (Karnataka)</span>
              <p className="font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">KAR-PT-2026-90</p>
              <p className="text-[11px] text-[#15803D] font-mono mt-0.5">86 employees mapped</p>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-lg border border-[#E5E7EB] dark:border-[#1F2937]">
              <span className="text-slate-500 text-[11px]">TDS 24Q (Salary Sec 192)</span>
              <p className="font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">ITNS-281 Deposited</p>
              <p className="text-[11px] text-[#15803D] font-mono mt-0.5">₹1,42,000 deposited</p>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs border-t border-[#E5E7EB] dark:border-[#1F2937]">
            <span className="text-slate-500">Annualized Attrition: 2.1% (Low Risk)</span>
            <button
              onClick={() => navigate('/tax')}
              className="text-[#6D28D9] dark:text-purple-400 font-semibold hover:underline"
            >
              Open Compliance Center →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Recent Audit Trail & Activities */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
              Recent Audit Trail & Activities
            </h3>
            <span className="text-xs text-slate-400 font-medium font-mono">System Log</span>
          </div>

          <div className="space-y-3.5">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-md bg-[#F8FAFC] dark:bg-slate-800 border border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {act.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 tabular-nums font-mono">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 truncate mt-0.5 text-[12px]">
                      {act.subtitle}
                    </p>
                    <span className="text-[10px] text-slate-400">Authorized by {act.user}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Regulatory & Payout Milestones */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
              Upcoming Regulatory & Payout Milestones
            </h3>
            <span className="text-xs text-slate-400 font-medium">Next 30 Days</span>
          </div>

          <div className="space-y-2.5">
            {upcomingEvents.map((evt, idx) => {
              const Icon = evt.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F8FAFC] dark:bg-slate-900/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-[#6D28D9] shrink-0 border border-purple-100 dark:border-purple-900/40">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {evt.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{evt.desc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-900 dark:text-slate-100 font-mono">{evt.date}</p>
                    <span className="text-[10px] text-[#6D28D9] dark:text-purple-400 font-semibold">
                      {evt.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        report={AVAILABLE_REPORTS[0]}
      />
    </div>
  );
};
