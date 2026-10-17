import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import {
  Zap,
  Building,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  KeyRound,
  RefreshCw,
} from 'lucide-react';

interface ConnectedBankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  employeeCount: number;
  onDisbursementSuccess: (utr: string) => void;
}

export const ConnectedBankingModal: React.FC<ConnectedBankingModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  employeeCount,
  onDisbursementSuccess,
}) => {
  const { success, error } = useToast();
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);

  const corporateBalance = 4580000;
  const postBalance = corporateBalance - totalAmount;

  const handleAutoFillOtp = () => {
    setOtp('829104');
    success('OTP Auto-filled', 'Corporate authorization token 829104 inserted.');
  };

  const handleAuthorizeDisbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      error('2FA Authorization Required', 'Please enter a 6-digit corporate authorization token.');
      return;
    }

    setIsProcessing(true);
    setCurrentStage(1);

    // Multi-stage simulated execution
    setTimeout(() => {
      setCurrentStage(2);
      setTimeout(() => {
        setCurrentStage(3);
        setTimeout(() => {
          const utrNumber = `CMS/HDFC/IMPS/${Date.now().toString().slice(-8)}`;
          setIsProcessing(false);
          setCurrentStage(0);
          setOtp('');
          onDisbursementSuccess(utrNumber);
          success(
            'Batch Disbursed via Connected Banking',
            `Transferred ₹${totalAmount.toLocaleString('en-IN')} to ${employeeCount} accounts. UTR: ${utrNumber}`
          );
          onClose();
        }, 900);
      }, 900);
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚡ 1-Click Connected Banking Batch Disbursal"
      description="Direct API integration with RazorpayX & ICICI / HDFC Corporate Banking rails."
      maxWidth="xl"
    >
      <form onSubmit={handleAuthorizeDisbursement} className="space-y-4">
        {/* Source Corporate Account Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50/80 via-white to-slate-50 border border-purple-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#6D28D9] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 font-heading block">
                  HDFC Corporate Netbanking API
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Primary Current A/C · •••• 9102
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              API Connected (Active)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Available Balance</span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                ₹{corporateBalance.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
              <span className="text-[10px] text-[#6D28D9] font-semibold block uppercase">Batch Payout</span>
              <span className="font-mono font-extrabold text-[#6D28D9] text-sm">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Post-Balance</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                ₹{postBalance.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Transfer Protocol Specs */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Transfer Protocol:</span>
            <span className="font-semibold text-slate-800 font-mono">Instant 24x7 IMPS / Direct NEFT</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Recipient Beneficiaries:</span>
            <span className="font-semibold text-slate-800">{employeeCount} Salaried Employees</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Penny Drop Verification:</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Bank Names Matched
            </span>
          </div>
        </div>

        {/* 2FA Token Input with 1-click Auto-fill */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#6D28D9]" /> Corporate 2FA Security Token *
            </label>
            <button
              type="button"
              onClick={handleAutoFillOtp}
              className="text-[11px] font-semibold text-[#6D28D9] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Auto-fill Demo Token (829104)
            </button>
          </div>
          <input
            type="text"
            required
            maxLength={6}
            placeholder="Enter 6-digit token"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 h-[42px] text-center tracking-[0.3em] font-mono text-base font-extrabold rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>

        {/* Multi-Stage Animated Processing Indicator */}
        {isProcessing && (
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#6D28D9] font-bold">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Direct Bank Execution Pipeline Active</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-600">
              <p className={currentStage >= 1 ? 'text-emerald-700 font-bold' : ''}>
                {currentStage >= 1 ? '✓' : '○'} Stage 1: HMAC-SHA256 Token Encryption & Signature Check
              </p>
              <p className={currentStage >= 2 ? 'text-emerald-700 font-bold' : ''}>
                {currentStage >= 2 ? '✓' : '○'} Stage 2: Handshake with RBI Payment Clearing Gateway
              </p>
              <p className={currentStage >= 3 ? 'text-emerald-700 font-bold' : ''}>
                {currentStage >= 3 ? '✓' : '○'} Stage 3: Disbursing {employeeCount} Bank Accounts in Parallel...
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-200 flex justify-end gap-2.5">
          <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isProcessing}
            rightIcon={<Zap className="w-3.5 h-3.5" />}
            className="bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] font-bold shadow-xs"
          >
            Authorize & Disburse ₹{totalAmount.toLocaleString('en-IN')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
