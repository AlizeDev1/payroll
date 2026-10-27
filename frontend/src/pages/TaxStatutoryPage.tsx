import React, { useState, useEffect } from 'react';
import {
  Download,
  AlertCircle,
  FileCode,
  FileCheck2,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SkeletonCard } from '../components/common/Skeleton';
import { EpfoEcrGeneratorModal } from '../components/modals/EpfoEcrGeneratorModal';
import { BulkForm16DscModal } from '../components/modals/BulkForm16DscModal';
import { complianceService } from '../services/complianceService';
import { StatutoryCompliance } from '../types';
import { COMPANY_INFO } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { triggerFileDownload } from '../utils/exportUtils';

export const TaxStatutoryPage: React.FC = () => {
  const { success } = useToast();
  const [compliances, setCompliances] = useState<StatutoryCompliance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEcrModalOpen, setIsEcrModalOpen] = useState(false);
  const [isDscModalOpen, setIsDscModalOpen] = useState(false);

  useEffect(() => {
    complianceService.getStatutorySummary().then((data) => {
      setCompliances(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tax & Statutory Compliance Dashboard"
        subtitle="Manage EPFO, ESIC, State Professional Tax, and Income Tax (TDS Section 192) remittances."
        breadcrumb={['Alize Software Services', 'Compliance', 'Tax & Statutory']}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDscModalOpen(true)}
              leftIcon={<FileCheck2 className="w-3.5 h-3.5 text-purple-600" />}
            >
              Bulk Form 16 DSC
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEcrModalOpen(true)}
              leftIcon={<FileCode className="w-3.5 h-3.5" />}
            >
              ⚡ Generate Official EPFO ECR
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const statutoryContent = `ESTABLISHMENT COMPLIANCE RETURN PACK\n=====================================\nCompany: ${COMPANY_INFO.name}\nEPFO Establishment Code: ${COMPANY_INFO.pfEstCode}\nESIC Code: ${COMPANY_INFO.esiCode}\nPeriod: October 2026\nGenerated: ${new Date().toISOString()}\n\nSUMMARY:\n1. EPFO Account 01 (Employee + Employer): ₹3,42,800\n2. EPFO Account 02 (Admin Charges): ₹14,280\n3. EPFO Account 10 (EPS): ₹2,10,400\n4. EPFO Account 21 (EDLI): ₹12,650\n5. ESIC Total Remittance: ₹68,400\n6. Professional Tax (Karnataka): ₹17,200\n7. Income Tax TDS (Section 192): ₹4,85,600\n\nStatus: Pre-validated & Ready for EPFO Unified Portal Gateway Upload.`;
                triggerFileDownload('statutory_compliance_pack_oct_2026.txt', statutoryContent, 'text/plain');
                success('Compliance Pack Downloaded', 'Exported EPFO ECR + ESIC return files (.txt).');
              }}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Statutory Pack
            </Button>
          </div>
        }
      />

      {/* Statutory Disclaimer Alert */}
      <div className="p-4 bg-[#F5F3FF]/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-xl flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
        <AlertCircle className="w-4 h-4 text-[#6D28D9] dark:text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 font-heading">
            Indian Statutory Compliance Architecture
          </span>
          <p className="mt-0.5 text-slate-500 dark:text-slate-400 leading-relaxed text-[12px]">
            Registered under Establishment Code: <code className="font-mono font-bold text-[#6D28D9] dark:text-purple-300">{COMPANY_INFO.pfEstCode}</code> (EPFO) and ESIC Code: <code className="font-mono font-bold text-[#6D28D9] dark:text-purple-300">{COMPANY_INFO.esiCode}</code>. Values reflect active wage thresholds for Karnataka State.
          </p>
        </div>
      </div>

      {/* 6 Statutory Compliance Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {compliances.map((comp) => (
            <div
              key={comp.category}
              className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3.5">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide font-heading">
                      {comp.category}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Due Date: {comp.dueDate}
                    </span>
                  </div>
                  <Badge variant={comp.status === 'Compliant' ? 'success' : 'purple'}>
                    {comp.status}
                  </Badge>
                </div>

                <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Covered Staff:</span>
                    <span className="font-bold font-mono text-[11px] text-slate-900 dark:text-slate-100">{comp.registeredEmployees} Employees</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Employee Contribution:</span>
                    <span className="font-mono font-semibold tabular-nums text-[11px] text-slate-800 dark:text-slate-200">
                      ₹{comp.employeeContribution.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Employer Contribution:</span>
                    <span className="font-mono font-semibold tabular-nums text-[11px] text-slate-800 dark:text-slate-200">
                      ₹{comp.employerContribution.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800 font-bold">
                    <span className="text-[11px] text-slate-900 dark:text-slate-100">Total Remittance Payable:</span>
                    <span className="font-mono text-[#6D28D9] dark:text-purple-300 tabular-nums text-xs">
                      ₹{comp.totalRemittance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-1 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono text-[10px]">Challan: {comp.lastChallanNo}</span>
                <button
                  onClick={() => success('Challan Downloaded', `Downloaded receipt for ${comp.category}`)}
                  className="text-[#6D28D9] dark:text-purple-400 font-semibold hover:underline text-[11px]"
                >
                  Challan PDF →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Statutory Summaries Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* EPFO Breakdown */}
        <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide font-heading">
              EPFO Provident Fund Summary (Form 3A / 6A)
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEcrModalOpen(true)}
                className="px-2.5 py-1 text-[11px] font-bold text-[#6D28D9] bg-purple-50 hover:bg-purple-100 rounded-md border border-purple-200 transition-colors"
              >
                View ECR 2.0 File →
              </button>
              <Badge variant="success">100% Remitted</Badge>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Employee Provident Fund Act 1952. 12% deduction from eligible employee wage ceiling of ₹15,000, matched by 12% employer contribution (3.67% EPF + 8.33% EPS + 0.5% Admin Charges).
          </p>
          <div className="p-3 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl text-xs space-y-1.5 font-mono border border-[#E5E7EB] dark:border-[#1F2937]">
            <div className="flex justify-between">
              <span className="text-slate-500">Account 01 (EPF Share):</span>
              <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">₹2,11,570</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account 10 (EPS Pension Fund):</span>
              <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">₹89,970</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account 02 & 21 (Admin & EDLI):</span>
              <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">₹8,060</span>
            </div>
          </div>
        </div>

        {/* Income Tax TDS Section 192 Breakdown */}
        <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide font-heading">
              Income Tax TDS (Section 192 / Form 24Q)
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDscModalOpen(true)}
                className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
              >
                ⚡ Bulk Form 16 DSC Sign →
              </button>
              <Badge variant="success">Quarterly Regular</Badge>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Withheld at source as per annualized income tax slab computation after factoring in Regime 115BAC deductions and investment declarations.
          </p>
          <div className="p-3 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl text-xs space-y-1.5 font-mono border border-[#E5E7EB] dark:border-[#1F2937]">
            <div className="flex justify-between">
              <span className="text-slate-500">Staff under New Tax Regime (115BAC):</span>
              <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">72 Employees (83.7%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Staff under Old Tax Regime:</span>
              <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">14 Employees (16.3%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ITNS-281 Challan Status:</span>
              <span className="text-[#15803D] font-bold">Deposited with RBI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Multi-State Labor Welfare Fund (LWF) & PT Slabs Architecture */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-heading">
              Multi-State Labor Welfare Fund (LWF) & Professional Tax Engine
            </h4>
            <p className="text-xs text-slate-500">
              State-specific statutory deduction schedules, act references, and remittance rules.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-purple-50 text-[#6D28D9] font-mono font-bold text-xs border border-purple-200">
            5 Indian State Slabs Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Karnataka */}
          <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-200 space-y-2">
            <span className="font-bold text-[#6D28D9] block font-heading">Karnataka (Active)</span>
            <div className="text-[11px] space-y-1 text-slate-700">
              <p><strong>PT:</strong> ₹200/mo (Gross &gt; ₹15k)</p>
              <p><strong>LWF EE:</strong> ₹20 / yr (Dec)</p>
              <p><strong>LWF ER:</strong> ₹40 / yr (Dec)</p>
              <p className="text-[10px] text-slate-500 pt-1">Act 1965 · Due Jan 15</p>
            </div>
          </div>

          {/* Maharashtra */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block font-heading">Maharashtra</span>
            <div className="text-[11px] space-y-1 text-slate-700">
              <p><strong>PT:</strong> ₹200/mo (Feb ₹300)</p>
              <p><strong>LWF EE:</strong> ₹12 / cycle (Jun, Dec)</p>
              <p><strong>LWF ER:</strong> ₹36 / cycle (Jun, Dec)</p>
              <p className="text-[10px] text-slate-500 pt-1">Bombay Act 1953 · Bi-annual</p>
            </div>
          </div>

          {/* Tamil Nadu */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block font-heading">Tamil Nadu</span>
            <div className="text-[11px] space-y-1 text-slate-700">
              <p><strong>PT:</strong> Bi-annual slab</p>
              <p><strong>LWF EE:</strong> ₹10 / yr (Dec)</p>
              <p><strong>LWF ER:</strong> ₹20 / yr (Dec)</p>
              <p className="text-[10px] text-slate-500 pt-1">TN LWF Act 1972 · Due Jan 31</p>
            </div>
          </div>

          {/* Gujarat */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block font-heading">Gujarat</span>
            <div className="text-[11px] space-y-1 text-slate-700">
              <p><strong>PT:</strong> ₹200/mo (Gross &gt; ₹12k)</p>
              <p><strong>LWF EE:</strong> ₹6 / cycle (Jun, Dec)</p>
              <p><strong>LWF ER:</strong> ₹12 / cycle (Jun, Dec)</p>
              <p className="text-[10px] text-slate-500 pt-1">Gujarat LWF Act · Bi-annual</p>
            </div>
          </div>

          {/* Delhi NCR */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block font-heading">Delhi NCR</span>
            <div className="text-[11px] space-y-1 text-slate-700">
              <p><strong>PT:</strong> Nil (No PT)</p>
              <p><strong>LWF EE:</strong> ₹0.75 / cycle</p>
              <p><strong>LWF ER:</strong> ₹2.25 / cycle</p>
              <p className="text-[10px] text-slate-500 pt-1">Delhi LWF Rules · Bi-annual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Official EPFO ECR Generator Modal */}
      <EpfoEcrGeneratorModal
        isOpen={isEcrModalOpen}
        onClose={() => setIsEcrModalOpen(false)}
        wageMonth="October 2026"
      />

      {/* Bulk Form 16 DSC Batch Signer Modal */}
      <BulkForm16DscModal
        isOpen={isDscModalOpen}
        onClose={() => setIsDscModalOpen(false)}
      />
    </div>
  );
};
