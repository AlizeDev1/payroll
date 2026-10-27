import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Shield,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { documentService } from '../../services/documentService';
import { SystemNotification, UserRole } from '../../types';
import { EntitySwitcher } from './EntitySwitcher';

interface NavbarProps {
  onOpenMobile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobile }) => {
  const { currentUser, logout, loginAsDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { info, success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    documentService.getNotifications().then(setNotifications);
  }, []);

  // Global shortcut ⌘K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    await documentService.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    success('Notifications marked as read');
  };

  const handleSelectRole = (role: UserRole) => {
    loginAsDemoRole(role);
    setProfileDropdownOpen(false);
    info(`Switched demo role to ${role}`);
  };

  // Breadcrumb mapping
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return { section: 'Overview', page: 'Dashboard' };
    if (path === '/payroll') return { section: 'Payroll', page: 'October 2026' };
    if (path === '/employees') return { section: 'Workforce', page: 'Employees' };
    if (path.startsWith('/employees/')) return { section: 'Workforce', page: 'Employee Profile' };
    if (path === '/departments') return { section: 'Workforce', page: 'Departments' };
    if (path === '/designations') return { section: 'Workforce', page: 'Designations' };
    if (path === '/attendance') return { section: 'Workforce', page: 'Attendance' };
    if (path === '/leaves') return { section: 'Workforce', page: 'Leave Management' };
    if (path === '/salary-structures') return { section: 'Payroll', page: 'Salary Structures' };
    if (path === '/payslips') return { section: 'Payroll', page: 'Payslips' };
    if (path === '/reimbursements') return { section: 'Payroll', page: 'Reimbursements' };
    if (path === '/loans') return { section: 'Payroll', page: 'Loans & Advances' };
    if (path === '/tax') return { section: 'Compliance', page: 'Tax & Statutory' };
    if (path === '/tax/declarations') return { section: 'Compliance', page: 'Tax Declarations' };
    if (path === '/reports') return { section: 'Reports', page: 'Statutory Reports' };
    if (path === '/full-and-final') return { section: 'Reports', page: 'Full & Final' };
    if (path === '/documents') return { section: 'System', page: 'Documents' };
    if (path === '/notifications') return { section: 'System', page: 'Notifications' };
    if (path === '/users') return { section: 'System', page: 'Users & Roles' };
    if (path === '/settings') return { section: 'System', page: 'Settings' };
    return { section: 'Alize Payroll', page: 'Console' };
  };

  const breadcrumb = getBreadcrumb();

  const searchableRoutes = [
    { title: 'Employees Directory', path: '/employees' },
    { title: 'Departments & Org Structure', path: '/departments' },
    { title: 'Designations & Pay Bands', path: '/designations' },
    { title: 'Attendance Muster Roll', path: '/attendance' },
    { title: 'Leave Management & Approvals', path: '/leaves' },
    { title: 'Salary Structures (Components)', path: '/salary-structures' },
    { title: 'Monthly Payroll Processing', path: '/payroll' },
    { title: 'Payslip Generator & Downloads', path: '/payslips' },
    { title: 'Reimbursements & Claims', path: '/reimbursements' },
    { title: 'Loans & Advances Ledger', path: '/loans' },
    { title: 'Tax & Statutory Compliance (PF/ESI/PT)', path: '/tax' },
    { title: 'Tax Declarations (Old vs New)', path: '/tax/declarations' },
    { title: 'Statutory & Payroll Reports', path: '/reports' },
    { title: 'Full & Final Settlements', path: '/full-and-final' },
    { title: 'Document Vault', path: '/documents' },
    { title: 'Users & Permissions Matrix', path: '/users' },
    { title: 'Organization Settings', path: '/settings' },
  ];

  const filteredSearchResults = searchableRoutes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#1F2937] px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-all">
      {/* Left: Mobile menu & Corporate Entity Switcher */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Corporate Subsidiary Switcher */}
        <EntitySwitcher />

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500 truncate">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">{breadcrumb.section}</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold truncate">
            {breadcrumb.page}
          </span>
        </div>
      </div>

      {/* Right Controls: Search, Theme, Notifications, Help, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Global Search Button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-[#F8FAFC] hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 rounded-md border border-[#E5E7EB] dark:border-[#1F2937] transition-colors"
          title="Search modules and actions"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline px-1 py-0.5 text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>


        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-md transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6D28D9] rounded-full ring-2 ring-white dark:ring-[#111827]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] z-50 overflow-hidden">
              <div className="flex items-center justify-between p-3.5 border-b border-[#E5E7EB] dark:border-[#1F2937]">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-heading">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#F5F3FF] text-[#6D28D9] dark:bg-purple-950 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-medium text-[#6D28D9] dark:text-purple-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs transition-colors hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 ${
                      !n.read ? 'bg-purple-50/20 dark:bg-purple-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed text-[12px]">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-2.5 text-center border-t border-[#E5E7EB] dark:border-[#1F2937] bg-[#F8FAFC]/50 dark:bg-slate-900/40">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate('/notifications');
                  }}
                  className="text-xs font-medium text-[#6D28D9] dark:text-purple-400 hover:underline"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Button */}
        <button
          onClick={() => info('Statutory Support', 'Alize Payroll is configured with current Indian statutory regulations: EPFO (12% wage ceiling ₹15,000), ESIC (0.75% / 3.25% ceiling ₹21,000), and Karnataka Professional Tax schedules.')}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-md transition-colors"
          aria-label="Help"
          title="Statutory guidelines & help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Subtle Divider */}
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] z-50 overflow-hidden">
              <div className="p-3 border-b border-[#E5E7EB] dark:border-[#1F2937] bg-[#F8FAFC]/50 dark:bg-slate-900/50">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.email}
                </p>
                <div className="mt-1.5">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#F5F3FF] text-[#6D28D9] dark:bg-purple-950 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              {/* Demo Role Switchers */}
              <div className="p-2 border-b border-[#E5E7EB] dark:border-[#1F2937]">
                <p className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Demo Role
                </p>
                {(['Company Admin', 'HR Manager', 'Payroll Manager', 'Accountant', 'Employee'] as UserRole[]).map(
                  (role) => (
                    <button
                      key={role}
                      onClick={() => handleSelectRole(role)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                        currentUser.role === role
                          ? 'bg-[#F3E8FF] text-[#6D28D9] dark:bg-purple-950/60 dark:text-purple-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-[#F8FAFC] dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        <span>{role}</span>
                      </div>
                      {currentUser.role === role && <Check className="w-3.5 h-3.5 text-[#6D28D9]" />}
                    </button>
                  )
                )}
              </div>

              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('/employees/emp-001');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Organization Settings</span>
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px]"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_12px_40px_rgba(15,23,42,0.15)] overflow-hidden z-10">
            <div className="p-3 border-b border-[#E5E7EB] dark:border-[#1F2937] flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search screen or module (e.g. payroll, tax, leaves)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none placeholder:text-slate-400"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-[11px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 font-mono"
              >
                ESC
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
              {filteredSearchResults.length > 0 ? (
                filteredSearchResults.map((r) => (
                  <button
                    key={r.path}
                    onClick={() => {
                      setSearchOpen(false);
                      navigate(r.path);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-md flex items-center justify-between transition-colors"
                  >
                    <span>{r.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{r.path}</span>
                  </button>
                ))
              ) : (
                <p className="p-4 text-xs text-center text-slate-400">No matching screens found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
