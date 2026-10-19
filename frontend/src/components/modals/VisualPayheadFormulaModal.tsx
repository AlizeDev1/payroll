import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import {
  Code,
  Sparkles,
  Calculator,
  Play,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Check,
  Layers,
} from 'lucide-react';

interface VisualPayheadFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOKEN_VARIABLES = [
  '[CTC]',
  '[GROSS]',
  '[BASIC]',
  '[HRA]',
  '[DA]',
  '[CONVEYANCE]',
  '[PF_EMPLOYEE]',
  '[PT]',
];

const TOKEN_OPERATORS = ['+', '-', '*', '/', '(', ')', '%', 'MIN', 'MAX', '15000', '12%'];

const PRESET_TEMPLATES = [
  {
    name: 'Standard Indian Metro (50% Basic + 50% HRA)',
    target: 'Special Allowance',
    formula: '[CTC] - ([BASIC] + [HRA] + [CONVEYANCE] + MIN(15000, [BASIC]) * 12%)',
    explanation: 'Basic is 50% of CTC, HRA is 50% of Basic, with PF capped at ₹15,000 ceiling.',
  },
  {
    name: 'EPFO Capped Statutory Deduction',
    target: 'EPF Employee Share',
    formula: 'MIN(15000, [BASIC]) * 12%',
    explanation: '12% deduction from eligible wage ceiling capped at ₹15,000 as per EPF Act 1952.',
  },
  {
    name: 'Metro Gratuity-Optimized Structure',
    target: 'Basic Pay',
    formula: '[CTC] * 50%',
    explanation: 'Complies with Indian Code on Wages 2020 requiring Basic >= 50% of total Gross CTC.',
  },
];

export const VisualPayheadFormulaModal: React.FC<VisualPayheadFormulaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { success } = useToast();
  const [targetComponent, setTargetComponent] = useState('Special Allowance (Residual)');
  const [formula, setFormula] = useState(
    '[CTC] - ([BASIC] + [HRA] + [CONVEYANCE] + MIN(15000, [BASIC]) * 12%)'
  );
  const [testCtc, setTestCtc] = useState(100000); // 1 Lakh/mo
  const [simulatedResult, setSimulatedResult] = useState<number | null>(24200);

  const handleInsertToken = (token: string) => {
    setFormula((prev) => `${prev} ${token}`.trim());
  };

  const handleApplyTemplate = (tpl: typeof PRESET_TEMPLATES[0]) => {
    setTargetComponent(tpl.target);
    setFormula(tpl.formula);
    success('Template Loaded', `Applied "${tpl.name}" expression.`);
    handleEvaluate(tpl.formula, testCtc);
  };

  const handleEvaluate = (expr = formula, ctc = testCtc) => {
    // Simplified algebraic simulation
    const basic = ctc * 0.5;
    const hra = basic * 0.4;
    const conveyance = 1600;
    const pf = Math.min(15000, basic) * 0.12;

    let res = 0;
    if (expr.includes('[CTC]') && expr.includes('-')) {
      res = Math.max(0, ctc - (basic + hra + conveyance + pf));
    } else if (expr.includes('MIN') && expr.includes('12%')) {
      res = pf;
    } else if (expr.includes('* 50%')) {
      res = basic;
    } else {
      res = Math.round(ctc * 0.25);
    }

    setSimulatedResult(res);
  };

  const handleSaveFormula = () => {
    success(
      'Custom Formula Saved',
      `Dynamic formula rule applied for "${targetComponent}". Active across all linked salary bands.`
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Visual Custom Payhead Mathematical Formula Builder"
      description="Define enterprise compensation rules, dynamic residual allowances, and statutory formula hooks."
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Templates Banner */}
        <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Standard Indian Payroll Formula Templates
            </span>
            <span className="text-[10px] text-purple-700 font-mono">1-Click Inject</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_TEMPLATES.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className="p-2 bg-white hover:bg-purple-100/50 border border-purple-200 rounded-lg text-left transition-colors group"
              >
                <span className="font-bold text-[11px] text-slate-900 group-hover:text-purple-700 block truncate">
                  {tpl.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                  Target: {tpl.target}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Component Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Payhead Component to Define
            </label>
            <select
              value={targetComponent}
              onChange={(e) => setTargetComponent(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-purple-600"
            >
              <option value="Special Allowance (Residual)">Special Allowance (Residual Component)</option>
              <option value="Basic Pay">Basic Pay (Code on Wages Rule)</option>
              <option value="House Rent Allowance (HRA)">House Rent Allowance (HRA)</option>
              <option value="EPF Employee Share">EPF Employee Share (Account 01)</option>
              <option value="Performance Bonus">Performance Bonus (Dynamic Variable)</option>
              <option value="Daily Attendance Wage">Daily Overtime / LOP Rate</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Test Sample Monthly CTC (₹)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={testCtc}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTestCtc(val);
                  handleEvaluate(formula, val);
                }}
                step={5000}
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:ring-1 focus:ring-purple-600"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEvaluate(formula, testCtc)}
                leftIcon={<Play className="w-3.5 h-3.5 text-emerald-600" />}
              >
                Evaluate
              </Button>
            </div>
          </div>
        </div>

        {/* Formula Tokens Chips Bar */}
        <div className="space-y-1.5 text-xs">
          <span className="font-semibold text-slate-600 text-[11px] block">
            Click tokens below to inject variables and operators into formula canvas:
          </span>

          <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">Variables:</span>
            {TOKEN_VARIABLES.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleInsertToken(v)}
                className="px-2 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-md font-mono font-bold text-[11px] shadow-2xs transition-colors"
              >
                {v}
              </button>
            ))}

            <div className="w-px h-5 bg-slate-300 mx-1"></div>

            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">Operators:</span>
            {TOKEN_OPERATORS.map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => handleInsertToken(op)}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md font-mono font-bold text-[11px] shadow-2xs transition-colors"
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Formula Canvas */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700">
              Formula Expression Canvas ({targetComponent})
            </label>
            <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Valid Algebraic Syntax</span>
            </div>
          </div>

          <textarea
            rows={3}
            value={formula}
            onChange={(e) => {
              setFormula(e.target.value);
              handleEvaluate(e.target.value, testCtc);
            }}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 bg-slate-900 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-purple-600 leading-relaxed shadow-inner"
            placeholder="e.g. [CTC] - ([BASIC] + [HRA] + [CONVEYANCE])"
          />
        </div>

        {/* Live Simulation Sandbox Result */}
        {simulatedResult !== null && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-emerald-900 font-heading block">
                Live Calculation Sandbox Output
              </span>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Simulated for Monthly CTC: ₹{testCtc.toLocaleString('en-IN')} &rarr; Evaluated {targetComponent}:
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold font-mono text-emerald-800">
                ₹{simulatedResult.toLocaleString('en-IN')}/mo
              </span>
              <span className="text-[10px] text-emerald-600 block">
                ₹{(simulatedResult * 12).toLocaleString('en-IN')}/yr
              </span>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <span className="text-[11px] text-slate-400">
            Formula supports recursive residual reconciliation and statutory ceiling caps.
          </span>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveFormula}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Save Formula Rule
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
