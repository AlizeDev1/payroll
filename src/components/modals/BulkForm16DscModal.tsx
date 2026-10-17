import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import { MOCK_EMPLOYEES, COMPANY_INFO } from '../../data/mockData';
import {
  FileCheck2,
  Key,
  ShieldCheck,
  Send,
  Download,
  CheckCircle2,
  Loader2,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';

import { Employee } from '../../types';

interface BulkForm16DscModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees?: Employee[];
}

export const BulkForm16DscModal: React.FC<BulkForm16DscModalProps> = ({
  isOpen,
  onClose,
  employees,
}) => {
  const { success } = useToast();
  const activeEmployees = employees && employees.length > 0 ? employees : (MOCK_EMPLOYEES || []);
  const totalEmployees = activeEmployees.length;

  const [assessmentYear, setAssessmentYear] = useState('AY 2026-27 (FY 2025-26)');
  const [dscToken, setDscToken] = useState('eMudhra Class 3 Crypto Token #EMD-99124');
  const [pin, setPin] = useState('849201');
  const [includePartA, setIncludePartA] = useState(true);
  const [includePartB, setIncludePartB] = useState(true);
  const [emailDispatch, setEmailDispatch] = useState(true);
  const [essPublish, setEssPublish] = useState(true);

  // Signing progress state
  const [isSigning, setIsSigning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [signedCount, setSignedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleStartBatchSigning = () => {
    if (totalEmployees === 0) return;
    setIsSigning(true);
    setProgress(0);
    setSignedCount(0);
    setIsComplete(false);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      const count = Math.min(totalEmployees, Math.round((current / 20) * totalEmployees));
      setSignedCount(count);
      setProgress(Math.round((current / 20) * 100));

      if (current >= 20) {
        clearInterval(interval);
        setIsSigning(false);
        setIsComplete(true);
        success(
          'Batch DSC Signing Complete',
          `Successfully signed & generated Form 16 Part A & B for all ${totalEmployees} employees.`
        );
      }
    }, 150);
  };

  const handleDownloadSample = () => {
    success(
      'Sample Form 16 Downloaded',
      'FORM_16_Rahul_Sharma_AY2026-27_Signed.pdf with embedded Class 3 DSC certificate.'
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Form 16 (Part A & B) Digital Signature (DSC) Engine"
      description="Cryptographically sign Section 203 TDS certificates using Class 3 USB/PFX tokens and batch dispatch to staff."
      maxWidth="xl"
    >
      {totalEmployees === 0 ? (
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <span className="text-xl">⚠️</span>
          </div>
          <p className="font-bold text-slate-800 text-sm">No Active Employees</p>
          <p className="text-xs text-slate-500">
            Cannot sign Form 16 certificates because no active employees were found in the database.
          </p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
        {/* Certificate Authority Banner */}
        <div className="p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50/40 border border-purple-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 font-heading">
                  Active Cryptographic DSC Token Connected
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Hardware Token Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 font-mono">
                Signatory: Rajesh Kulkarni (VP Finance) · TAN: <strong className="text-purple-700">{COMPANY_INFO.tan}</strong> · Cert Validity: 2028-11-30
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assessment Year</label>
            <select
              value={assessmentYear}
              onChange={(e) => setAssessmentYear(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-purple-600"
            >
              <option value="AY 2026-27 (FY 2025-26)">AY 2026-27 (FY 2025-26)</option>
              <option value="AY 2025-26 (FY 2024-25)">AY 2025-26 (FY 2024-25)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detected DSC Certificate</label>
            <select
              value={dscToken}
              onChange={(e) => setDscToken(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-purple-600 truncate"
            >
              <option value="eMudhra Class 3 Crypto Token #EMD-99124">
                eMudhra Class 3 (#EMD-99124)
              </option>
              <option value="Capricorn Class 3 Enterprise #CAP-41829">
                Capricorn Class 3 (#CAP-41829)
              </option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Token Hardware PIN</label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 6-digit PIN"
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:ring-1 focus:ring-purple-600"
              />
              <Key className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Options Row */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includePartA}
              onChange={(e) => setIncludePartA(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="font-medium text-slate-800">TRACES Part A</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includePartB}
              onChange={(e) => setIncludePartB(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="font-medium text-slate-800">Salary Part B</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={essPublish}
              onChange={(e) => setEssPublish(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="font-medium text-slate-800">Auto-Publish to ESS</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={emailDispatch}
              onChange={(e) => setEmailDispatch(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="font-medium text-slate-800">Email & WhatsApp</span>
          </label>
        </div>

        {/* Signing Execution Box */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 font-heading">
                Batch Cryptographic Signing Status
              </h4>
              <p className="text-[11px] text-slate-500">
                Target: {totalEmployees} employee Form 16 packets. PDF password format: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-purple-700">PAN_FIRST4 + DDMM</code>
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleStartBatchSigning}
              disabled={isSigning}
              leftIcon={isSigning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            >
              {isSigning ? 'Signing in Progress...' : 'Start Batch DSC Sign'}
            </Button>
          </div>

          {/* Progress Bar */}
          {(isSigning || isComplete) && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">
                  {isComplete ? 'All Form 16 Certificates Successfully Signed & Verified' : `Cryptographically signing with SHA-256 RSA token...`}
                </span>
                <span className="font-mono font-bold text-purple-700">
                  {signedCount} / {totalEmployees} ({progress}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-emerald-500 transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>{totalEmployees} Form 16 packets generated</strong> with valid cryptographic stamps. Published to Employee Self-Service portal.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSample}
                leftIcon={<Download className="w-3.5 h-3.5 text-purple-600" />}
              >
                Sample PDF
              </Button>
            </div>
          )}
        </div>

        {/* Employee Roster Quick Preview */}
        <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2 px-3">Employee</th>
                <th className="py-2 px-3">PAN Number</th>
                <th className="py-2 px-3">TDS (Sec 192)</th>
                <th className="py-2 px-3">Tax Regime</th>
                <th className="py-2 px-3 text-center">DSC Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_EMPLOYEES.map((emp, idx) => (
                <tr key={emp.employeeId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2 px-3 font-medium text-slate-900">
                    {emp.firstName} {emp.lastName}
                    <span className="block text-[10px] text-slate-400 font-mono">{emp.employeeId}</span>
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-700">
                    {emp.panNumber || `ABCDE${1000 + idx}F`}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-700">
                    ₹{((emp.salary || 60000) * 0.08 * 12).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {emp.taxRegime.includes('New') ? '115BAC' : 'Old'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    {isComplete ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Signed & Valid
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <span className="text-[11px] text-slate-400">
            Complies with Section 203 of the Income Tax Act, 1961 and ITD Rules 1962 (Form 16 / 12BA).
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        </div>
      )}
    </Modal>
  );
};
