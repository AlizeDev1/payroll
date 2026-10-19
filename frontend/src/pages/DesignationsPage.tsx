import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonTableRows } from '../components/common/Skeleton';
import { employeeService } from '../services/employeeService';
import { Designation, Department } from '../types';
import { AddDesignationModal } from '../components/modals/AddDesignationModal';
import { useToast } from '../context/ToastContext';

export const DesignationsPage: React.FC = () => {
  const { success } = useToast();
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      employeeService.getDesignations(),
      employeeService.getDepartments(),
    ]).then(([desigs, depts]) => {
      setDesignations(desigs);
      setDepartments(depts);
      setIsLoading(false);
    });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete designation ${title}?`)) {
      await employeeService.deleteDesignation(id);
      setDesignations((prev) => prev.filter((d) => d.id !== id));
      success('Designation Deleted', `${title} removed.`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Designations & Pay Bands"
        subtitle="Standardize job profiles, hierarchy levels, and minimum/maximum salary brackets."
        breadcrumb={['Alize Software Services', 'Workforce', 'Designations']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Designation
          </Button>
        }
      />

      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 border-b border-[#E5E7EB] dark:border-[#1F2937] text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3.5">Designation Title</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Career Band</th>
                <th className="py-3 px-3 text-center">Employees</th>
                <th className="py-3 px-3.5 text-right">Standard Pay Range</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {isLoading ? (
                <SkeletonTableRows rows={6} columns={7} />
              ) : designations.length > 0 ? (
                designations.map((desig) => (
                  <tr
                    key={desig.id}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 transition-colors duration-150 h-13"
                  >
                    <td className="py-2.5 px-3.5 font-semibold text-slate-900 dark:text-slate-100 font-heading">
                      {desig.title}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-medium text-[12px]">
                      {desig.departmentName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-md font-mono font-semibold text-[10px] bg-[#F5F3FF] text-[#6D28D9] dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {desig.level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                      {desig.employeeCount}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200 font-medium">
                      ₹{desig.minSalary.toLocaleString('en-IN')} – ₹{desig.maxSalary.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge variant={desig.status === 'Active' ? 'success' : 'neutral'}>
                        {desig.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => success('Saved', `Designation ${desig.title} updated.`)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          title="Edit Designation"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(desig.id, desig.title)}
                          className="p-1.5 text-slate-400 hover:text-[#B91C1C] dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                          title="Delete Designation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>

          {!isLoading && designations.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={Briefcase}
                title="No designations found"
                description="Establish role hierarchy levels and compensation bands for your organization."
                actionLabel="Add Designation"
                onAction={() => setIsModalOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      <AddDesignationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        departments={departments}
        onDesignationAdded={(newDesig) => setDesignations((prev) => [...prev, newDesig])}
      />
    </div>
  );
};
