import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { leaveService } from '../../services/leaveService';
import { LeaveRequest, LeaveType, Employee } from '../../types';
import { MOCK_EMPLOYEES } from '../../data/mockData';
import { Users, AlertCircle } from 'lucide-react';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeaveApplied: (leave: LeaveRequest) => void;
  employees?: Employee[];
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  onLeaveApplied,
  employees,
}) => {
  const { success, error } = useToast();
  const activeEmployees = employees && employees.length > 0 ? employees : (MOCK_EMPLOYEES || []);
  const initialEmpId = activeEmployees[0]?.employeeId || '';

  const [employeeId, setEmployeeId] = useState(initialEmpId);
  const [leaveType, setLeaveType] = useState<LeaveType>('Casual Leave');
  const [fromDate, setFromDate] = useState('2026-10-15');
  const [toDate, setToDate] = useState('2026-10-16');
  const [daysCount, setDaysCount] = useState(2);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      error('Please state a reason for leave');
      return;
    }
    const emp = activeEmployees.find((m) => m.employeeId === (employeeId || initialEmpId)) || activeEmployees[0];
    if (!emp) {
      error('No Employee Selected', 'Please ensure an employee is selected.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newLeave = await leaveService.applyLeave({
        employeeId: emp.employeeId,
        employeeName: `${emp.firstName || 'Employee'} ${emp.lastName || ''}`.trim(),
        department: emp.departmentName || 'General',
        avatar: emp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        leaveType,
        fromDate,
        toDate,
        daysCount: Number(daysCount) || 1,
        reason,
      });
      onLeaveApplied(newLeave);
      success('Leave Application Submitted', `Request sent for ${emp.firstName} ${emp.lastName}.`);
      onClose();
      setReason('');
    } catch {
      error('Failed to submit leave', 'An error occurred while processing leave application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasEmployees = activeEmployees.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave"
      description="Submit a leave request for reporting manager approval."
      maxWidth="md"
    >
      {!hasEmployees ? (
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-800 text-sm">No Employees Registered</p>
          <p className="text-xs text-slate-500">
            Before applying leave, please add employees under Workforce Directory.
          </p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Employee
            </label>
            <select
              value={employeeId || initialEmpId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              {activeEmployees.slice(0, 20).map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId}) - {emp.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Leave Type
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="Casual Leave">Casual Leave (Balance: 6)</option>
              <option value="Sick Leave">Sick Leave (Balance: 8)</option>
              <option value="Privilege / Earned Leave">Privilege / Earned Leave (Balance: 14)</option>
              <option value="Compensatory Off">Compensatory Off (Balance: 2)</option>
              <option value="Maternity Leave">Maternity Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Days Requested
            </label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={daysCount}
              onChange={(e) => setDaysCount(Number(e.target.value))}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Reason / Comments *
            </label>
            <textarea
              rows={2}
              placeholder="Specify reason for absence..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Submit Leave Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
