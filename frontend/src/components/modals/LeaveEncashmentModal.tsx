import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import { MOCK_EMPLOYEES } from '../../data/mockData';
import { Employee } from '../../types';
import {
  Coins,
  CalendarCheck2,
  Download,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface LeaveEncashmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees?: Employee[];
}

interface EncashmentRecord {
  employeeId: string;
  name: string;
  department: string;
  monthlyBasic: number;
  totalPrivilegeLeaves: number;
  maxCarryForward: number;
  encashableDays: number;
  encashmentPay: number;
  taxExemptUnder10AA: boolean;
}

export const LeaveEncashmentModal: React.FC<LeaveEncashmentModalProps> = ({
  isOpen,
  onClose,
  employees,
}) => {
  const { success } = useToast();
  const activeEmployees = employees && employees.length > 0 ? employees : (MOCK_EMPLOYEES || []);

  const [cycle, setCycle] = useState('Fiscal Year-End (March 2026)');
  const [maxCarryLimit, setMaxCarryLimit] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);

  // Generate records for employees with excess PL
  const records: EncashmentRecord[] = activeEmployees.slice(0, 15).map((emp, idx) => {
    const basic = Math.round(((emp.salary || 60000) * 0.5)); // 50% Basic
    const totalPL = 32 + (idx % 8); // 32 to 39 days accumulated
    const encashable = Math.max(0, totalPL - maxCarryLimit);
    const pay = Math.round((basic / 30) * encashable);

    return {
      employeeId: emp.employeeId,
      name: `${emp.firstName || 'Employee'} ${emp.lastName || ''}`.trim(),
      department: emp.departmentName || 'General',
      monthlyBasic: basic,
      totalPrivilegeLeaves: totalPL,
      maxCarryForward: maxCarryLimit,
      encashableDays: encashable,
      encashmentPay: pay,
      taxExemptUnder10AA: true,
    };
  });

  const totalEncashableDays = records.reduce((acc, r) => acc + r.encashableDays, 0);
  const totalEncashmentPayout = records.reduce((acc, r) => acc + r.encashmentPay, 0);

  const handleExecuteEncashment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsExecuted(true);
      success(
        'Leave Encashment Disbursed',
        `₹${totalEncashmentPayout.toLocaleString('en-IN')} approved for ${records.length} employees. Synced with payroll engine.`
      );
    }, 1000);
  };

  const hasEmployees = activeEmployees.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fiscal Year-End Leave Encashment & Carry-Forward Engine"
      description="Automate unavailed Privilege Leave (PL) encashment payouts under Income Tax Section 10(10AA)."
      maxWidth="xl"
    >
      {!hasEmployees ? (
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-800 text-sm">No Active Employees</p>
          <p className="text-xs text-slate-500">
            Please onboard employees to audit and compute leave encashment balances.
          </p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Encashment Policy Metadata Card */}
          <div className="p-4 bg-gradient-to-r from-amber-50/60 via-purple-50/40 to-emerald-50/60 border border-amber-200/80 rounded-xl space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 font-heading">
                    Section 10(10AA) Statutory Exemption Cap: ₹25,00,000
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Non-government employees leave encashment tax exemption threshold increased as per CBDT Notification.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-600">Cycle:</span>
                <select
                  value={cycle}
                  onChange={(e) => setCycle(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                >
                  <option value="Fiscal Year-End (March 2026)">Fiscal Year-End (March 2026)</option>
                  <option value="Calendar Year-End (Dec 2026)">Calendar Year-End (Dec 2026)</option>
                  <option value="Half-Yearly Cycle (Sep 2026)">Half-Yearly Cycle (Sep 2026)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-amber-200/60">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Total Excess Days:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {totalEncashableDays} Days
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Encashment Liability:</span>
                <span className="font-mono font-bold text-purple-900 text-sm">
                  ₹{totalEncashmentPayout.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Max Carry-Forward:</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <input
                    type="number"
                    min={15}
                    max={45}
                    value={maxCarryLimit}
                    onChange={(e) => setMaxCarryLimit(Number(e.target.value))}
                    className="w-14 px-1.5 py-0.5 text-xs border border-slate-300 rounded font-mono font-bold text-center bg-white"
                  />
                  <span className="text-[11px] text-slate-500">Days</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Tax Exemption:</span>
                <Badge variant="success">100% Exempt (&lt; ₹25L)</Badge>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900 font-heading">
                Eligible Workforce Roster ({records.length} Employees with Excess Leaves)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Auto-Audited Leaves
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200 font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3 font-mono">Basic Salary</th>
                    <th className="py-2.5 px-3 text-center">Accumulated PL</th>
                    <th className="py-2.5 px-3 text-center">Carry-Forward</th>
                    <th className="py-2.5 px-3 text-center">Days Encashed</th>
                    <th className="py-2.5 px-3 text-right">Encashment Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => (
                    <tr key={r.employeeId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-slate-900 block">{r.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{r.employeeId} · {r.department}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        ₹{r.monthlyBasic.toLocaleString('en-IN')}/mo
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                        {r.totalPrivilegeLeaves} d
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                        {r.maxCarryForward} d
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold font-mono text-[11px]">
                          +{r.encashableDays} d
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                        ₹{r.encashmentPay.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Execution State */}
          {isExecuted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong>Encashment Payout Scheduled:</strong> ₹{totalEncashmentPayout.toLocaleString('en-IN')} queued into next payroll batch. Leave balances carried forward to FY 2027.
                </span>
              </div>
              <Badge variant="success">Completed</Badge>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => success('Exported', 'Downloaded Leave_Encashment_Schedule_FY2026.xlsx')}
              leftIcon={<Download className="w-3.5 h-3.5 text-purple-600" />}
            >
              Export Schedule (.xlsx)
            </Button>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteEncashment}
                isLoading={isProcessing}
                disabled={isExecuted || totalEncashableDays === 0}
                className="bg-purple-600 hover:bg-purple-700"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {isExecuted ? 'Batch Executed' : `Disburse Encashment (₹${totalEncashmentPayout.toLocaleString('en-IN')})`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
