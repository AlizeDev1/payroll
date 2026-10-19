import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  UserPlus,
  Download,
  Upload,
  MoreVertical,
  Eye,
  CalendarCheck,
  FileSpreadsheet,
  FolderLock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Badge, BadgeVariant } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonTableRows } from '../components/common/Skeleton';
import { employeeService } from '../services/employeeService';
import { Employee, Department, Designation, EmployeeStatus } from '../types';
import { AddEmployeeModal } from '../components/modals/AddEmployeeModal';
import { BulkImportEmployeesModal } from '../components/modals/BulkImportEmployeesModal';
import { useToast } from '../context/ToastContext';
import { usePageSeo } from '../hooks/usePageSeo';

export const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();

  usePageSeo({
    title: 'Workforce & Employees Directory | Alize Payroll',
    description: 'Manage employee profiles, CTC compensation packages, statutory compliance (PF/ESI/PT), and departmental assignments.',
    canonicalPath: '/employees',
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Add Employee Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empData, deptData, desigData] = await Promise.all([
          employeeService.getEmployees(),
          employeeService.getDepartments(),
          employeeService.getDesignations(),
        ]);
        setEmployees(empData);
        setDepartments(deptData);
        setDesignations(desigData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = () => {
    success('Workforce Directory Exported', 'Downloaded as alize_employees_oct_2026.csv');
  };

  const handleImport = () => {
    success('Bulk Import Initiated', 'Upload CSV template processed successfully.');
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.departmentName === selectedDept;
    const matchesType = selectedType === 'All' || emp.employmentType === selectedType;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadgeVariant = (status: EmployeeStatus): BadgeVariant => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'On Leave':
        return 'warning';
      case 'Probation':
        return 'info';
      case 'Inactive':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees Directory"
        subtitle="Manage your workforce, assignments and compensation packages."
        breadcrumb={['Alize Software Services', 'Workforce', 'Employees']}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsBulkImportOpen(true)}
              leftIcon={<Upload className="w-3.5 h-3.5" />}
            >
              Import CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Add Employee
            </Button>
          </>
        }
      />

      {/* Filter and Search Toolbar */}
      <div className="p-3.5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, EMP ID, or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#D1D5DB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] h-[38px]"
            />
          </div>

          {/* Department filter */}
          <div className="w-full sm:w-44">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#D1D5DB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] h-[38px]"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Employment Type */}
          <div className="w-full sm:w-36">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#D1D5DB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] h-[38px]"
            >
              <option value="All">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Probation">Probation</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          {/* Status */}
          <div className="w-full sm:w-36">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#D1D5DB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] h-[38px]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Probation">Probation</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employee Data Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 border-b border-[#E5E7EB] dark:border-[#1F2937] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-3.5">Employee</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Designation</th>
                <th className="py-3 px-3">Joining Date</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3.5 text-right">Gross Salary</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {isLoading ? (
                <SkeletonTableRows rows={6} columns={8} />
              ) : paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 transition-colors duration-150 h-13"
                  >
                    {/* Employee Profile: Avatar + Name + Employee ID (Section 12 specification) */}
                    <td className="py-2.5 px-3.5">
                      <div
                        className="flex items-center gap-2.5 cursor-pointer group"
                        onClick={() => navigate(`/employees/${emp.id}`)}
                      >
                        <img
                          src={emp.avatar}
                          alt={emp.firstName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#6D28D9] dark:group-hover:text-purple-400 transition-colors truncate">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {emp.departmentName}
                    </td>

                    {/* Designation */}
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                      {emp.designationTitle}
                    </td>

                    {/* Joining Date */}
                    <td className="py-2.5 px-3 text-slate-500 font-mono tabular-nums text-[11px]">
                      {emp.joiningDate}
                    </td>

                    {/* Type */}
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                      {emp.employmentType}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <Badge variant={getStatusBadgeVariant(emp.status)}>
                        {emp.status}
                      </Badge>
                    </td>

                    {/* Salary (Right-aligned, tabular nums, ₹ formatted) */}
                    <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                      ₹{emp.salary.toLocaleString('en-IN')}
                    </td>

                    {/* Actions dropdown */}
                    <td className="py-2.5 px-3 text-center relative">
                      <button
                        onClick={() =>
                          setActiveActionId(activeActionId === emp.id ? null : emp.id)
                        }
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown menu */}
                      {activeActionId === emp.id && (
                        <div className="absolute right-6 top-8 w-44 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] z-20 overflow-hidden py-1 text-left">
                          <button
                            onClick={() => {
                              setActiveActionId(null);
                              navigate(`/employees/${emp.id}`);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>View Profile</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveActionId(null);
                              navigate('/attendance');
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                          >
                            <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                            <span>Attendance Muster</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveActionId(null);
                              navigate('/payslips');
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                            <span>View Payslips</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveActionId(null);
                              navigate('/documents');
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                          >
                            <FolderLock className="w-3.5 h-3.5 text-slate-400" />
                            <span>KYC Documents</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>

          {!isLoading && paginatedEmployees.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={Users}
                title="No employees found"
                description="No workforce members match your active search filters or departmental parameters."
                secondaryActionLabel="Clear Filters"
                onSecondaryAction={() => {
                  setSearchQuery('');
                  setSelectedDept('All');
                  setSelectedType('All');
                  setSelectedStatus('All');
                }}
                actionLabel="Add Employee"
                onAction={() => setIsAddModalOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {paginatedEmployees.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 border-t border-[#E5E7EB] dark:border-[#1F2937] text-xs text-slate-500">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredEmployees.length)} of{' '}
              {filteredEmployees.length} employees
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Modal Wizard */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        departments={departments}
        designations={designations}
        onEmployeeCreated={(newEmp) => {
          setEmployees((prev) => [newEmp, ...prev]);
        }}
      />

      {/* Bulk CSV Import Modal */}
      <BulkImportEmployeesModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onEmployeesImported={(newEmps) => {
          setEmployees((prev) => [...newEmps, ...prev]);
        }}
      />
    </div>
  );
};
