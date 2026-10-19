import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  Coins,
  Receipt,
  FileSpreadsheet,
  HandCoins,
  CreditCard,
  ShieldAlert,
  FileCheck2,
  BarChart3,
  UserMinus,
  FolderLock,
  Bell,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Handshake,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = currentUser?.role || 'Company Admin';

  const navSections: NavSection[] = React.useMemo(() => {
    if (userRole === 'Employee') {
      return [
        {
          title: 'OVERVIEW',
          items: [
            { name: 'Self-Service Home', href: '/dashboard', icon: LayoutDashboard },
          ],
        },
        {
          title: 'MY TIME & LEAVES',
          items: [
            { name: 'My Attendance', href: '/attendance', icon: CalendarCheck },
            { name: 'Apply Leave', href: '/leaves', icon: CalendarDays },
          ],
        },
        {
          title: 'MY COMPENSATION',
          items: [
            { name: 'My Payslips', href: '/payslips', icon: FileSpreadsheet },
            { name: 'Claim Reimbursement', href: '/reimbursements', icon: HandCoins },
            { name: 'Tax Regime & 80C', href: '/tax/declarations', icon: FileCheck2 },
          ],
        },
        {
          title: 'RESOURCES',
          items: [
            { name: 'Company Documents', href: '/documents', icon: FolderLock },
            { name: 'Notifications', href: '/notifications', icon: Bell },
          ],
        },
      ];
    }

    if (userRole === 'Accountant') {
      return [
        {
          title: 'OVERVIEW',
          items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ],
        },
        {
          title: 'PAYROLL & CLAIMS',
          items: [
            { name: 'Payroll Registers', href: '/payroll', icon: Receipt },
            { name: 'Employee Payslips', href: '/payslips', icon: FileSpreadsheet },
            { name: 'Expense Claims', href: '/reimbursements', icon: HandCoins },
            { name: 'Salary Advances', href: '/loans', icon: CreditCard },
          ],
        },
        {
          title: 'STATUTORY AUDIT',
          items: [
            { name: 'Tax & Statutory', href: '/tax', icon: ShieldAlert },
            { name: 'Section 115BAC / 80C', href: '/tax/declarations', icon: FileCheck2 },
            { name: 'Financial Reports', href: '/reports', icon: BarChart3 },
          ],
        },
        {
          title: 'SYSTEM',
          items: [
            { name: 'Audit Documents', href: '/documents', icon: FolderLock },
            { name: 'Notifications', href: '/notifications', icon: Bell },
          ],
        },
      ];
    }

    if (userRole === 'HR Manager') {
      return [
        {
          title: 'OVERVIEW',
          items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ],
        },
        {
          title: 'WORKFORCE',
          items: [
            { name: 'Employees', href: '/employees', icon: Users },
            { name: 'Contractors', href: '/contractors', icon: Handshake },
            { name: 'Departments', href: '/departments', icon: Building2 },
            { name: 'Designations', href: '/designations', icon: Briefcase },
            { name: 'Attendance Muster', href: '/attendance', icon: CalendarCheck },
            { name: 'Leave Tracker', href: '/leaves', icon: CalendarDays },
          ],
        },
        {
          title: 'OFFBOARDING & PAY',
          items: [
            { name: 'Payslips', href: '/payslips', icon: FileSpreadsheet },
            { name: 'Full & Final (F&F)', href: '/full-and-final', icon: UserMinus },
          ],
        },
        {
          title: 'SYSTEM',
          items: [
            { name: 'HR Documents', href: '/documents', icon: FolderLock },
            { name: 'Notifications', href: '/notifications', icon: Bell },
          ],
        },
      ];
    }

    if (userRole === 'Payroll Manager') {
      return [
        {
          title: 'OVERVIEW',
          items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ],
        },
        {
          title: 'TIME & INPUTS',
          items: [
            { name: 'Employees', href: '/employees', icon: Users },
            { name: 'Attendance Inputs', href: '/attendance', icon: CalendarCheck },
            { name: 'Leave Deductions', href: '/leaves', icon: CalendarDays },
          ],
        },
        {
          title: 'PAYROLL ENGINE',
          items: [
            { name: 'Salary Structures', href: '/salary-structures', icon: Coins },
            { name: 'Process Payroll', href: '/payroll', icon: Receipt },
            { name: 'Payslips & Bank Batches', href: '/payslips', icon: FileSpreadsheet },
            { name: 'Reimbursements', href: '/reimbursements', icon: HandCoins },
            { name: 'Loans & EMI', href: '/loans', icon: CreditCard },
          ],
        },
        {
          title: 'COMPLIANCE & REPORTS',
          items: [
            { name: 'Tax & Statutory', href: '/tax', icon: ShieldAlert },
            { name: 'Tax Declarations', href: '/tax/declarations', icon: FileCheck2 },
            { name: 'Payroll Reports', href: '/reports', icon: BarChart3 },
            { name: 'Full & Final', href: '/full-and-final', icon: UserMinus },
          ],
        },
        {
          title: 'SYSTEM',
          items: [
            { name: 'Documents', href: '/documents', icon: FolderLock },
            { name: 'Notifications', href: '/notifications', icon: Bell },
          ],
        },
      ];
    }

    // Default: Company Admin & Super Admin (Full Suite Access)
    return [
      {
        title: 'OVERVIEW',
        items: [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ],
      },
      {
        title: 'WORKFORCE',
        items: [
          { name: 'Employees', href: '/employees', icon: Users },
          { name: 'Contractors', href: '/contractors', icon: Handshake },
          { name: 'Departments', href: '/departments', icon: Building2 },
          { name: 'Designations', href: '/designations', icon: Briefcase },
          { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
          { name: 'Leave', href: '/leaves', icon: CalendarDays },
        ],
      },
      {
        title: 'PAYROLL',
        items: [
          { name: 'Salary Structures', href: '/salary-structures', icon: Coins },
          { name: 'Payroll', href: '/payroll', icon: Receipt },
          { name: 'Payslips', href: '/payslips', icon: FileSpreadsheet },
          { name: 'Reimbursements', href: '/reimbursements', icon: HandCoins },
          { name: 'Loans', href: '/loans', icon: CreditCard },
        ],
      },
      {
        title: 'COMPLIANCE',
        items: [
          { name: 'Tax & Statutory', href: '/tax', icon: ShieldAlert },
          { name: 'Tax Declarations', href: '/tax/declarations', icon: FileCheck2 },
        ],
      },
      {
        title: 'REPORTS',
        items: [
          { name: 'Reports', href: '/reports', icon: BarChart3 },
          { name: 'Full & Final', href: '/full-and-final', icon: UserMinus },
        ],
      },
      {
        title: 'SYSTEM',
        items: [
          { name: 'Documents', href: '/documents', icon: FolderLock },
          { name: 'Notifications', href: '/notifications', icon: Bell },
          { name: 'Users & Roles', href: '/users', icon: ShieldCheck },
          { name: 'Settings', href: '/settings', icon: Settings },
        ],
      },
    ];
  }, [userRole]);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container: 256px desktop width, clean white surface, thin border */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-[#111827] border-r border-[#E5E7EB] dark:border-[#1F2937] transition-all duration-200 select-none ${
          collapsed ? 'w-20' : 'w-[256px]'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header with visual hierarchy */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5E7EB] dark:border-[#1F2937] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#6D28D9] flex items-center justify-center text-white font-bold tracking-tight shrink-0 shadow-[0_1px_2px_rgba(109,40,217,0.3)]">
              <span className="text-sm font-black font-heading">A</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-heading leading-tight">
                  ALIZE
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#6D28D9] dark:text-purple-400 uppercase leading-none">
                  PAYROLL
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle sidebar width"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close sidebar"
              aria-label="Close mobile sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-4 scrollbar-thin">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-0.5">
              {!collapsed ? (
                <p className="px-2.5 pt-2 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  {section.title}
                </p>
              ) : (
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-1.5" />
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors duration-150 ${
                        isActive
                          ? 'bg-[#F3E8FF] text-[#6D28D9] dark:bg-purple-950/50 dark:text-purple-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                      } ${collapsed ? 'justify-center px-2' : ''}`
                    }
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom User Area */}
        <div className="p-3 border-t border-[#E5E7EB] dark:border-[#1F2937] shrink-0 bg-[#F8FAFC]/60 dark:bg-slate-900/40">
          {!collapsed ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                title={`${currentUser.name} (${currentUser.role})`}
              />
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
