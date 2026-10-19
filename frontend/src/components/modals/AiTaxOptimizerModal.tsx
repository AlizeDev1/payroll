import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import { MOCK_EMPLOYEES } from '../../data/mockData';
import { Employee } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Layers,
  Zap,
  AlertCircle,
} from 'lucide-react';

interface AiTaxOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyOptimization?: (employeeId: string, newRegime: 'New Regime (115BAC)' | 'Old Regime') => void;
  employees?: Employee[];
}

interface TaxCalculation {
  grossAnnual: number;
  // New Regime
  newStdDeduction: number;
  newTaxableIncome: number;
  newTax: number;
  newCess: number;
  newTotalTax: number;
  // Old Regime
  oldStdDeduction: number;
  old80C: number;
  old80D: number;
  oldHra: number;
  oldTotalDeductions: number;
  oldTaxableIncome: number;
  oldTax: number;
  oldCess: number;
  oldTotalTax: number;
  // Comparison
  recommendedRegime: 'New Regime (115BAC)' | 'Old Regime';
  annualSavings: number;
}

export const AiTaxOptimizerModal: React.FC<AiTaxOptimizerModalProps> = ({
  isOpen,
  onClose,
  onApplyOptimization,
  employees,
}) => {
  const { success } = useToast();
  const activeEmployees = employees && employees.length > 0 ? employees : (MOCK_EMPLOYEES || []);
  const initialEmpId = activeEmployees[0]?.employeeId || '';

  const [selectedEmpId, setSelectedEmpId] = useState<string>(initialEmpId);
  const [tab, setTab] = useState<'individual' | 'batch'>('individual');
  const [appliedList, setAppliedList] = useState<Record<string, 'New Regime (115BAC)' | 'Old Regime'>>({});

  const calculateTax = (annualGross: number, declared80C = 150000, declared80D = 25000, hra = 120000): TaxCalculation => {
    // New Regime (FY 2024-25 / 2025-26 rules)
    const newStdDeduction = 75000;
    const newTaxableIncome = Math.max(0, annualGross - newStdDeduction);
    let newTax = 0;
    if (newTaxableIncome <= 300000) {
      newTax = 0;
    } else if (newTaxableIncome <= 700000) {
      newTax = (newTaxableIncome - 300000) * 0.05;
    } else if (newTaxableIncome <= 1000000) {
      newTax = 20000 + (newTaxableIncome - 700000) * 0.10;
    } else if (newTaxableIncome <= 1200000) {
      newTax = 50000 + (newTaxableIncome - 1000000) * 0.15;
    } else if (newTaxableIncome <= 1500000) {
      newTax = 80000 + (newTaxableIncome - 1200000) * 0.20;
    } else {
      newTax = 140000 + (newTaxableIncome - 1500000) * 0.30;
    }

    // 87A rebate up to 7L taxable in New Regime
    if (newTaxableIncome <= 700000) {
      newTax = 0;
    }
    const newCess = Math.round(newTax * 0.04);
    const newTotalTax = newTax + newCess;

    // Old Regime
    const oldStdDeduction = 50000;
    const capped80C = Math.min(150000, declared80C);
    const capped80D = Math.min(25000, declared80D);
    const oldTotalDeductions = oldStdDeduction + capped80C + capped80D + hra;
    const oldTaxableIncome = Math.max(0, annualGross - oldTotalDeductions);

    let oldTax = 0;
    if (oldTaxableIncome <= 250000) {
      oldTax = 0;
    } else if (oldTaxableIncome <= 500000) {
      oldTax = (oldTaxableIncome - 250000) * 0.05;
    } else if (oldTaxableIncome <= 1000000) {
      oldTax = 12500 + (oldTaxableIncome - 500000) * 0.20;
    } else {
      oldTax = 112500 + (oldTaxableIncome - 1000000) * 0.30;
    }

    if (oldTaxableIncome <= 500000) {
      oldTax = 0;
    }
    const oldCess = Math.round(oldTax * 0.04);
    const oldTotalTax = oldTax + oldCess;

    const recommendedRegime = newTotalTax <= oldTotalTax ? 'New Regime (115BAC)' : 'Old Regime';
    const annualSavings = Math.abs(oldTotalTax - newTotalTax);

    return {
      grossAnnual: annualGross,
      newStdDeduction,
      newTaxableIncome,
      newTax,
      newCess,
      newTotalTax,
      oldStdDeduction,
      old80C: capped80C,
      old80D: capped80D,
      oldHra: hra,
      oldTotalDeductions,
      oldTaxableIncome,
      oldTax,
      oldCess,
      oldTotalTax,
      recommendedRegime,
      annualSavings,
    };
  };

  const selectedEmp = activeEmployees.find((e) => e.employeeId === (selectedEmpId || initialEmpId)) || activeEmployees[0];
  const annualGross = selectedEmp ? (selectedEmp.ctcAnnual || (selectedEmp.salary * 12)) : 600000;
  const computation = calculateTax(annualGross, 150000, 25000, 120000);

  const handleApplySingle = (regime: 'New Regime (115BAC)' | 'Old Regime') => {
    if (!selectedEmp) return;
    setAppliedList((prev) => ({ ...prev, [selectedEmp.employeeId]: regime }));
    if (onApplyOptimization) {
      onApplyOptimization(selectedEmp.employeeId, regime);
    }
    success(
      'Tax Regime Updated',
      `${selectedEmp.firstName} ${selectedEmp.lastName} shifted to ${regime}. Annual savings: ₹${computation.annualSavings.toLocaleString('en-IN')}`
    );
  };

  const handleBatchApply = () => {
    const newApplied: Record<string, 'New Regime (115BAC)' | 'Old Regime'> = {};
    activeEmployees.forEach((emp) => {
      const calc = calculateTax(emp.ctcAnnual || (emp.salary * 12));
      newApplied[emp.employeeId] = calc.recommendedRegime;
      if (onApplyOptimization) {
        onApplyOptimization(emp.employeeId, calc.recommendedRegime);
      }
    });
    setAppliedList(newApplied);
    success(
      'Fleet Tax Optimization Applied',
      `Optimized tax regimes for all ${activeEmployees.length} employees with maximal tax savings.`
    );
  };

  const hasEmployees = activeEmployees.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Dynamic Tax Regime Optimizer (Section 115BAC)"
      description="Simulate New Regime vs Old Regime with Budget FY 2024-25 slab rules & automated deduction auditing."
      maxWidth="xl"
    >
      {!hasEmployees ? (
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-800 text-sm">No Active Employees</p>
          <p className="text-xs text-slate-500">
            Please onboard employees to run AI tax regime simulations and optimizations.
          </p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setTab('individual')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tab === 'individual'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                Single Employee Deep Dive
              </button>
              <button
                onClick={() => setTab('batch')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tab === 'batch'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                Batch Fleet Optimization ({activeEmployees.length} Staff)
              </button>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Budget 2024-25 Slabs + ₹75k Standard Deduction
            </span>
          </div>

          {tab === 'individual' ? (
            <div className="space-y-4">
              {/* Employee Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm border border-purple-200">
                    {selectedEmp?.firstName?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-heading">
                      {selectedEmp?.firstName} {selectedEmp?.lastName}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      ID: {selectedEmp?.employeeId} · {selectedEmp?.departmentName} · Gross CTC: ₹{(annualGross).toLocaleString('en-IN')}/yr
                    </p>
                  </div>
                </div>

                <select
                  value={selectedEmpId || initialEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="h-9 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-purple-600"
                >
                  {activeEmployees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId}) — ₹{(emp.ctcAnnual || (emp.salary * 12)).toLocaleString('en-IN')}/yr
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Recommendation Banner */}
              <div className="p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 border border-purple-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 font-heading">
                        AI Recommended Regime:
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-600 text-white font-mono">
                        {computation.recommendedRegime}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Net Tax Savings: <strong className="text-emerald-700 font-mono">+₹{computation.annualSavings.toLocaleString('en-IN')} / year</strong> under optimal tax slab rules.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplySingle('Old Regime')}
                    className="text-xs h-8"
                  >
                    Elect Old Regime
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApplySingle('New Regime (115BAC)')}
                    className="text-xs h-8 bg-purple-600 hover:bg-purple-700"
                  >
                    Apply 115BAC
                  </Button>
                </div>
              </div>

              {/* Side-by-Side Slabs Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Card 1: New Regime */}
                <div className="p-4 rounded-xl border-2 border-purple-300 bg-purple-50/20 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-purple-200">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-slate-900 text-xs">New Tax Regime (Section 115BAC)</span>
                    </div>
                    <Badge variant="purple">Default FY26</Badge>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Annual Gross Salary:</span>
                      <span className="font-mono font-medium">₹{computation.grossAnnual.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Standard Deduction (Section 16):</span>
                      <span className="font-mono font-bold">-₹{computation.newStdDeduction.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Exemptions (80C, 80D, HRA):</span>
                      <span>Not Allowed in 115BAC</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-800 font-semibold">
                      <span>Net Taxable Income:</span>
                      <span className="font-mono">₹{computation.newTaxableIncome.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Computed Slab Tax:</span>
                      <span className="font-mono">₹{computation.newTax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Health & Education Cess (4%):</span>
                      <span className="font-mono">₹{computation.newCess.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-purple-200 font-bold text-sm text-purple-900">
                      <span>Total Tax Liability:</span>
                      <span className="font-mono text-purple-700">₹{computation.newTotalTax.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Old Regime */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-slate-600" />
                      <span className="font-bold text-slate-900 text-xs">Old Tax Regime (Chapter VI-A)</span>
                    </div>
                    <Badge variant="neutral">Optional</Badge>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Annual Gross Salary:</span>
                      <span className="font-mono font-medium">₹{computation.grossAnnual.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Standard Deduction:</span>
                      <span className="font-mono font-medium">-₹{computation.oldStdDeduction.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Section 80C Deductions (PPF, ELSS):</span>
                      <span className="font-mono font-medium">-₹{computation.old80C.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Section 80D Health Insurance:</span>
                      <span className="font-mono font-medium">-₹{computation.old80D.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>HRA Exemption (Section 10(13A)):</span>
                      <span className="font-mono font-medium">-₹{computation.oldHra.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-800 font-semibold">
                      <span>Net Taxable Income:</span>
                      <span className="font-mono">₹{computation.oldTaxableIncome.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Computed Slab Tax:</span>
                      <span className="font-mono">₹{computation.oldTax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Health & Education Cess (4%):</span>
                      <span className="font-mono">₹{computation.oldCess.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-amber-200 font-bold text-sm text-amber-900">
                      <span>Total Tax Liability:</span>
                      <span className="font-mono text-amber-700">₹{computation.oldTotalTax.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Batch Table */
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-purple-900 font-heading">
                    Total Organization Tax Delta Analysis
                  </h4>
                  <p className="text-[11px] text-purple-700">
                    Simulating all {activeEmployees.length} staff across engineering, product, sales, and operations.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBatchApply}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Auto-Optimize All Eligible
                </Button>
              </div>

              <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Employee</th>
                      <th className="py-2.5 px-3">Gross CTC</th>
                      <th className="py-2.5 px-3">New Regime Tax</th>
                      <th className="py-2.5 px-3">Old Regime Tax</th>
                      <th className="py-2.5 px-3">AI Recommendation</th>
                      <th className="py-2.5 px-3 text-right">Potential Savings</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeEmployees.map((emp) => {
                      const gross = emp.ctcAnnual || (emp.salary * 12);
                      const c = calculateTax(gross);
                      const isApplied = appliedList[emp.employeeId] !== undefined;

                      return (
                        <tr key={emp.employeeId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2 px-3 font-medium text-slate-900">
                            {emp.firstName} {emp.lastName}
                            <span className="block text-[10px] text-slate-400 font-mono">{emp.employeeId}</span>
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-700">
                            ₹{gross.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-700">
                            ₹{c.newTotalTax.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-700">
                            ₹{c.oldTotalTax.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.recommendedRegime.includes('New')
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {c.recommendedRegime.includes('New') ? '115BAC New' : 'Old Regime'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">
                            {c.annualSavings > 0 ? `+₹${c.annualSavings.toLocaleString('en-IN')}` : '₹0'}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {isApplied ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Applied
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setAppliedList((prev) => ({ ...prev, [emp.employeeId]: c.recommendedRegime }));
                                  if (onApplyOptimization) {
                                    onApplyOptimization(emp.employeeId, c.recommendedRegime);
                                  }
                                  success('Regime Updated', `${emp.firstName} shifted to ${c.recommendedRegime}`);
                                }}
                                className="text-[11px] text-purple-600 hover:text-purple-800 font-bold hover:underline"
                              >
                                Optimize
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
            <span>Section 115BAC default regime rule applies automatically unless opt-out Form 10-IEA filed.</span>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
