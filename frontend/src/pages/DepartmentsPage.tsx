import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Plus,
  Trash2,
  Edit2,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/Skeleton';
import { employeeService } from '../services/employeeService';
import { Department } from '../types';
import { AddDepartmentModal } from '../components/modals/AddDepartmentModal';
import { useToast } from '../context/ToastContext';

export const DepartmentsPage: React.FC = () => {
  const { success } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    employeeService.getDepartments().then((data) => {
      setDepartments(data);
      setIsLoading(false);
    });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await employeeService.deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      success('Department Removed', `${name} deleted successfully.`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments & Cost Centers"
        subtitle="Manage business units, budget limits and departmental heads."
        breadcrumb={['Alize Software Services', 'Workforce', 'Departments']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Department
          </Button>
        }
      />

      {/* Department Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : departments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center text-[#6D28D9] dark:text-purple-300 font-bold text-xs uppercase tracking-wider font-mono">
                      {dept.code}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">
                        {dept.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">Head: {dept.headName}</span>
                    </div>
                  </div>
                  <Badge variant={dept.status === 'Active' ? 'success' : 'neutral'}>
                    {dept.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Total Workforce</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5 tabular-nums">
                      {dept.employeeCount} Members
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Monthly Budget</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5 tabular-nums">
                      ₹{(dept.budgetMonthly / 100000).toFixed(1)} Lakhs
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3.5 mt-1 text-[11px]">
                <span className="text-slate-500 font-mono text-[10px]">
                  Cost Center: <strong className="text-slate-700 dark:text-slate-300">{dept.code}</strong>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => success('Department Configured', `Settings updated for ${dept.name}`)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-md transition-colors"
                    title="Edit Department"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id, dept.name)}
                    className="p-1.5 text-slate-400 hover:text-[#B91C1C] dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                    title="Delete Department"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No departments found"
          description="Create your first departmental division or operational cost center."
          actionLabel="Add Department"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      <AddDepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDepartmentAdded={(newDept) => setDepartments((prev) => [...prev, newDept])}
      />
    </div>
  );
};
