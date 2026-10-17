import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { EssBotWidget } from '../common/EssBotWidget';

import { ErrorBoundary } from '../common/ErrorBoundary';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 antialiased font-sans flex flex-col selection:bg-[#6D28D9] selection:text-white">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main content wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 min-w-0 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Navbar onOpenMobile={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Floating WhatsApp & Slack ESS Assistant */}
      <EssBotWidget />
    </div>
  );
};
