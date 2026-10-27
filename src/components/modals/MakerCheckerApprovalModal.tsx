import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Lock,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  KeyRound,
  Download,
} from 'lucide-react';

interface MakerCheckerApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorized?: () => void;
}

export const MakerCheckerApprovalModal: React.FC<MakerCheckerApprovalModalProps> = ({
  isOpen,
  onClose,
  onAuthorized,
}) => {
  const { success } = useToast();
  const [cfoPin, setCfoPin] = useState('892104');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [stage, setStage] = useState<'pending_cfo' | 'fully_authorized'>('pending_cfo');

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setStage('fully_authorized');
      success(
        'Payroll Authorized by CFO',
        'Batch ALIZE/PAY/2026-10/0091 locked & cryptographically signed for bank disbursal.'
      );
      if (onAuthorized) onAuthorized();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Maker-Checker Dual Approval & Variance Gate"
      description="Enterprise financial segregation of duties: Maker (HR) → Checker (Finance) → Signatory (CFO)."
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* 3-Tier Governance Pipeline */}
        <div className="p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 border border-purple-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 font-heading">
              Financial Authorization Pipeline (Batch #ALIZE-2026-10)
            </span>
            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              ISO 27001 / SOX Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {/* Stage 1: Maker */}
            <div className="p-3 bg-white border border-emerald-300 rounded-xl space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Stage 1 · Maker</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <span className="font-bold text-slate-900 block font-heading">Jayanth R</span>
              <span className="text-[11px] text-slate-500 block">HR Operations Specialist</span>
              <div className="pt-1 text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Submitted Oct 14, 09:15 AM
              </div>
            </div>

            {/* Stage 2: Checker */}
            <div className="p-3 bg-white border border-emerald-300 rounded-xl space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Stage 2 · Checker</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <span className="font-bold text-slate-900 block font-heading">Rajesh Kulkarni</span>
              <span className="text-[11px] text-slate-500 block">Finance Controller</span>
              <div className="pt-1 text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Audited Oct 14, 11:30 AM
              </div>
            </div>

            {/* Stage 3: Signatory */}
            <div className={`p-3 bg-white border rounded-xl space-y-1 shadow-2xs transition-all ${
              stage === 'fully_authorized'
                ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                : 'border-purple-300 ring-2 ring-purple-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Stage 3 · Signatory</span>
                <span className={`w-2 h-2 rounded-full ${stage === 'fully_authorized' ? 'bg-emerald-500' : 'bg-purple-600 animate-ping'}`}></span>
              </div>
              <span className="font-bold text-slate-900 block font-heading">Vikramaditya Roy</span>
              <span className="text-[11px] text-slate-500 block">Chief Financial Officer (CFO)</span>
              <div className="pt-1 text-[10px] font-medium">
                {stage === 'fully_authorized' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Authorized for Release
                  </span>
                ) : (
                  <span className="text-purple-700 font-bold flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-purple-600" />
                    Awaiting 2FA Sign-Off
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Month-on-Month Variance Review Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 font-heading block">
                Month-on-Month Variance Audit (September vs October 2026)
              </span>
              <span className="text-[10px] text-slate-500">
                Pre-disbursal reconciliation threshold: ±10%
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Within Normal Variance (+8.6%)
            </span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/70 text-slate-600 border-b border-slate-200 text-[11px] font-semibold">
              <tr>
                <th className="py-2.5 px-3">Metric Dimension</th>
                <th className="py-2.5 px-3 text-right">September 2026</th>
                <th className="py-2.5 px-3 text-right">October 2026</th>
                <th className="py-2.5 px-3 text-right">Delta / Variance</th>
                <th className="py-2.5 px-3">Audit Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900">Total Eligible Headcount</td>
                <td className="py-2.5 px-3 text-right text-slate-600">84 Staff</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">86 Staff</td>
                <td className="py-2.5 px-3 text-right text-purple-700 font-bold">+2 (+2.4%)</td>
                <td className="py-2.5 px-3 font-sans text-slate-500 text-[10px]">2 New Hires in Backend Tech</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900">Gross Payroll Earnings</td>
                <td className="py-2.5 px-3 text-right text-slate-600">₹19,80,000</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹21,50,000</td>
                <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">+₹1,70,000 (+8.6%)</td>
                <td className="py-2.5 px-3 font-sans text-slate-500 text-[10px]">New hires + OT allowances</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900">Overtime & Shift Hours</td>
                <td className="py-2.5 px-3 text-right text-slate-600">₹24,000</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹80,357</td>
                <td className="py-2.5 px-3 text-right text-amber-700 font-bold">+₹56,357 (+234%)</td>
                <td className="py-2.5 px-3 font-sans text-slate-500 text-[10px]">Quarterly Server Migration Shift</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans font-medium text-slate-900">Statutory Remittances (PF/ESI/PT)</td>
                <td className="py-2.5 px-3 text-right text-slate-600">₹2,88,000</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹3,07,500</td>
                <td className="py-2.5 px-3 text-right text-slate-800 font-bold">+₹19,500 (+6.7%)</td>
                <td className="py-2.5 px-3 font-sans text-slate-500 text-[10px]">Statutory matches wage increase</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-amber-50/30">
                <td className="py-2.5 px-3 font-sans font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Bank Account / IFSC Changes
                </td>
                <td className="py-2.5 px-3 text-right text-slate-600">0 Changes</td>
                <td className="py-2.5 px-3 text-right font-bold text-amber-900">1 Employee</td>
                <td className="py-2.5 px-3 text-right text-amber-800 font-bold">Flagged</td>
                <td className="py-2.5 px-3 font-sans text-emerald-700 font-medium text-[10px]">
                  Verified via Cancelled Cheque (EMP-003)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CFO Sign-off Terminal */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 font-heading block">
                CFO Digital Signature & 2FA Token Release
              </span>
              <p className="text-[11px] text-slate-500">
                Authorizes direct debit from corporate bank account #****9012 (HDFC Bank).
              </p>
            </div>

            {stage !== 'fully_authorized' ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="password"
                    value={cfoPin}
                    onChange={(e) => setCfoPin(e.target.value)}
                    placeholder="Enter 2FA PIN"
                    className="w-32 h-9 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-center tracking-widest focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAuthorize}
                  isLoading={isAuthorizing}
                  leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                >
                  Sign & Authorize Release
                </Button>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                CFO Authorization Locked & Cryptographically Signed
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => success('Exported', 'Downloaded Month_on_Month_Variance_Audit_Report.xlsx')}
            leftIcon={<Download className="w-3.5 h-3.5 text-purple-600" />}
          >
            Download Audit Report (.xlsx)
          </Button>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Gate
          </Button>
        </div>
      </div>
    </Modal>
  );
};
