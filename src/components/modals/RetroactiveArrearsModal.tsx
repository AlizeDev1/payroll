import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import { MOCK_EMPLOYEES } from '../../data/mockData';
import { Employee } from '../../types';
import {
  History,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  AlertCircle,
} from 'lucide-react';

interface RetroactiveArrearsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArrearsInjected?: (employeeId: string, amount: number) => void;
  employees?: Employee[];
}

export const RetroactiveArrearsModal: React.FC<RetroactiveArrearsModalProps> = ({
  isOpen,
  onClose,
  onArrearsInjected,
  employees,
}) => {
  const { success, error } = useToast();
  const activeEmployees = employees && employees.length > 0 ? employees : (MOCK_EMPLOYEES || []);
  const initialEmpId = activeEmployees[0]?.employeeId || '';

  const [selectedEmpId, setSelectedEmpId] = useState(initialEmpId);
  const [currentCtc, setCurrentCtc] = useState(85000);
  const [revisedCtc, setRevisedCtc] = useState(100000);
  const [retroMonthsCount, setRetroMonthsCount] = useState(3); // July, Aug, Sep
  const [isInjected, setIsInjected] = useState(false);

  const selectedEmp = activeEmployees.find((e) => e.employeeId === (selectedEmpId || initialEmpId)) || activeEmployees[0];
  const monthlyHike = Math.max(0, revisedCtc - currentCtc);
  const totalGrossArrears = monthlyHike * retroMonthsCount;
  const estimatedTdsDelta = Math.round(totalGrossArrears * 0.12); // ~12% tax slab
  const netArrearsPayable = totalGrossArrears - estimatedTdsDelta;

  const pastMonths = [
    { name: 'July 2026', oldGross: currentCtc, revisedGross: revisedCtc, deltaGross: monthlyHike, deltaTds: Math.round(monthlyHike * 0.12), netDelta: Math.round(monthlyHike * 0.88) },
    { name: 'August 2026', oldGross: currentCtc, revisedGross: revisedCtc, deltaGross: monthlyHike, deltaTds: Math.round(monthlyHike * 0.12), netDelta: Math.round(monthlyHike * 0.88) },
    { name: 'September 2026', oldGross: currentCtc, revisedGross: revisedCtc, deltaGross: monthlyHike, deltaTds: Math.round(monthlyHike * 0.12), netDelta: Math.round(monthlyHike * 0.88) },
  ].slice(0, retroMonthsCount);

  const handleInjectArrears = () => {
    if (!selectedEmp) {
      error('No Employee Selected', 'Please select an employee first.');
      return;
    }
    setIsInjected(true);
    if (onArrearsInjected) {
      onArrearsInjected(selectedEmp.employeeId, netArrearsPayable);
    }
    success(
      'Retroactive Arrears Injected',
      `+₹${netArrearsPayable.toLocaleString('en-IN')} net arrears added to ${selectedEmp.firstName}'s October payslip.`
    );
  };

  const hasEmployees = activeEmployees.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Retroactive Pay & Arrears Calculation Engine"
      description="Compute backdated salary revisions, retroactive PF caps, and multi-month TDS Section 192 adjustments."
      maxWidth="xl"
    >
      {!hasEmployees ? (
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-800 text-sm">No Active Employees</p>
          <p className="text-xs text-slate-500">
            Please add employees to compute and disburse retroactive pay arrears.
          </p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Banner */}
          <div className="p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50/30 border border-purple-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <History className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 font-heading">
                  Retrospective Hike Reconciliation
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Target Pay Cycle: <strong className="text-purple-700">October 2026 Batch</strong> · Tax rules: Section 89(1) Relief
                </p>
              </div>
            </div>
            <Badge variant="purple">Multi-Month Delta</Badge>
          </div>

          {/* Configuration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Employee</label>
              <select
                value={selectedEmpId || initialEmpId}
                onChange={(e) => {
                  setSelectedEmpId(e.target.value);
                  setIsInjected(false);
                }}
                className="w-full h-9 px-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-purple-600 truncate"
              >
                {activeEmployees.slice(0, 20).map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.firstName} {emp.lastName} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Monthly Gross (₹)</label>
              <input
                type="number"
                value={currentCtc}
                onChange={(e) => setCurrentCtc(Number(e.target.value))}
                className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Revised Monthly Gross (₹)</label>
              <input
                type="number"
                value={revisedCtc}
                onChange={(e) => setRevisedCtc(Number(e.target.value))}
                className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Retrospective Period</label>
              <select
                value={retroMonthsCount}
                onChange={(e) => setRetroMonthsCount(Number(e.target.value))}
                className="w-full h-9 px-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-purple-600"
              >
                <option value={1}>1 Month (Sep 2026)</option>
                <option value={2}>2 Months (Aug - Sep 2026)</option>
                <option value={3}>3 Months (Jul - Sep 2026)</option>
              </select>
            </div>
          </div>

          {/* Metric KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly Delta</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                +₹{monthlyHike.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
              <span className="text-[10px] text-purple-700 uppercase font-semibold block">Gross Arrears Due</span>
              <span className="font-mono font-bold text-purple-900 text-sm">
                ₹{totalGrossArrears.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <span className="text-[10px] text-amber-800 uppercase font-semibold block">TDS Section 192 (12%)</span>
              <span className="font-mono font-bold text-amber-900 text-sm">
                -₹{estimatedTdsDelta.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Net Arrears Disbursal</span>
              <span className="font-mono font-bold text-emerald-900 text-base">
                ₹{netArrearsPayable.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Month-by-Month Reconciliation Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-2.5 bg-slate-100/70 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Month-Wise Compensation Reconciliation Breakdown</span>
              <span className="text-[11px] text-slate-500 font-mono">
                Formula: (Revised_Gross - Paid_Gross) * Months
              </span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Retrospective Month</th>
                  <th className="py-2.5 px-3 text-right">Original Gross</th>
                  <th className="py-2.5 px-3 text-right">Revised Gross</th>
                  <th className="py-2.5 px-3 text-right">Gross Arrears</th>
                  <th className="py-2.5 px-3 text-right">Statutory TDS (12%)</th>
                  <th className="py-2.5 px-3 text-right">Net Arrears Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {pastMonths.map((m) => (
                  <tr key={m.name} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {m.name}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">₹{m.oldGross.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹{m.revisedGross.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-purple-700">+₹{m.deltaGross.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right text-amber-700">-₹{m.deltaTds.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">₹{m.netDelta.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-mono font-bold text-xs">
                <tr>
                  <td className="py-2.5 px-3 font-sans text-slate-900">Total Consolidated Arrears:</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">
                    ₹{(currentCtc * retroMonthsCount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-900">
                    ₹{(revisedCtc * retroMonthsCount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right text-purple-700">
                    +₹{totalGrossArrears.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-700">
                    -₹{estimatedTdsDelta.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 text-sm">
                    ₹{netArrearsPayable.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Tax relief calculation conforms to Form 10E Annexure I.
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleInjectArrears}
                disabled={isInjected || !selectedEmp}
                className="bg-emerald-600 hover:bg-emerald-700"
                leftIcon={isInjected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              >
                {isInjected ? 'Arrears Injected to October Run' : 'Inject Arrears into October Pay Run'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
