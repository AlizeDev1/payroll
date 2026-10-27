import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { EntityProvider } from './context/EntityContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { MultiEntityConsolidatedModal } from './components/modals/MultiEntityConsolidatedModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { EmployeeDetailPage } from './pages/EmployeeDetailPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { DesignationsPage } from './pages/DesignationsPage';
import { ContractorsPage } from './pages/ContractorsPage';
import { AttendancePage } from './pages/AttendancePage';
import { LeavePage } from './pages/LeavePage';
import { SalaryStructuresPage } from './pages/SalaryStructuresPage';
import { PayrollPage } from './pages/PayrollPage';
import { PayslipsPage } from './pages/PayslipsPage';
import { ReimbursementsPage } from './pages/ReimbursementsPage';
import { LoansPage } from './pages/LoansPage';
import { TaxStatutoryPage } from './pages/TaxStatutoryPage';
import { TaxDeclarationsPage } from './pages/TaxDeclarationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { FullAndFinalPage } from './pages/FullAndFinalPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { UsersRolesPage } from './pages/UsersRolesPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <EntityProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Marketing Landing & Auth */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected / SaaS Application Layout */}
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/employees" element={<EmployeesPage />} />
                  <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                  <Route path="/departments" element={<DepartmentsPage />} />
                  <Route path="/designations" element={<DesignationsPage />} />
                  <Route path="/contractors" element={<ContractorsPage />} />
                  <Route path="/attendance" element={<AttendancePage />} />
                  <Route path="/leaves" element={<LeavePage />} />
                  <Route path="/salary-structures" element={<SalaryStructuresPage />} />
                  <Route path="/payroll" element={<PayrollPage />} />
                  <Route path="/payslips" element={<PayslipsPage />} />
                  <Route path="/reimbursements" element={<ReimbursementsPage />} />
                  <Route path="/loans" element={<LoansPage />} />
                  <Route path="/tax" element={<TaxStatutoryPage />} />
                  <Route path="/tax/declarations" element={<TaxDeclarationsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/full-and-final" element={<FullAndFinalPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/users" element={<UsersRolesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>

              {/* Multi-Entity Consolidated CFO Modal */}
              <MultiEntityConsolidatedModal />
            </BrowserRouter>
          </EntityProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
