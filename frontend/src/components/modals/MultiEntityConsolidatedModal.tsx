import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import { useEntity } from '../../context/EntityContext';
import {
  Building2,
  Users,
  CreditCard,
  ShieldCheck,
  Download,
  ArrowRight,
  Globe,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

export const MultiEntityConsolidatedModal: React.FC = () => {
  const { success } = useToast();
  const { entities, activeEntity, switchEntity, isConsolidatedModalOpen, setIsConsolidatedModalOpen } = useEntity();

  const totalHeadcount = entities.reduce((acc, e) => acc + e.employeeCount, 0);
  const totalMonthlyPayroll = entities.reduce((acc, e) => acc + e.monthlyPayroll, 0);

  const handleDownloadReport = () => {
    success(
      'Consolidated Report Downloaded',
      'Exported Group_Consolidated_Payroll_Statement_Oct_2026.xlsx for all 4 group subsidiaries.'
    );
  };

  return (
    <Modal
      isOpen={isConsolidatedModalOpen}
      onClose={() => setIsConsolidatedModalOpen(false)}
      title="Multi-Entity & Group Corporate Consolidation"
      description="Consolidated payroll, tax remittances, and workforce metrics across all group subsidiaries & holding entities."
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Group KPI Overview Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl">
            <span className="text-[10px] text-purple-700 font-bold uppercase block">Group Headcount</span>
            <span className="text-lg font-bold font-mono text-purple-900">{totalHeadcount}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Across 4 Entities</span>
          </div>

          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
            <span className="text-[10px] text-emerald-800 font-bold uppercase block">Monthly Disbursal</span>
            <span className="text-lg font-bold font-mono text-emerald-900">
              ₹{(totalMonthlyPayroll / 100000).toFixed(2)}L
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">₹1.42 Cr / month</span>
          </div>

          <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl">
            <span className="text-[10px] text-blue-800 font-bold uppercase block">Group Statutory (PF/TDS)</span>
            <span className="text-lg font-bold font-mono text-blue-900">₹36.3L</span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">100% Compliant</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-600 font-bold uppercase block">Corporate Entities</span>
            <span className="text-lg font-bold font-mono text-slate-900">4 Active</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">India & Singapore</span>
          </div>
        </div>

        {/* Subsidiaries Comparative Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 font-heading">
              Subsidiaries & Legal Entities Roster
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              Consolidated FY 2026–27
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Entity Name</th>
                  <th className="py-2.5 px-3">Jurisdiction</th>
                  <th className="py-2.5 px-3 font-mono">Tax & Est. IDs</th>
                  <th className="py-2.5 px-3 text-right">Headcount</th>
                  <th className="py-2.5 px-3 text-right">Monthly Payroll</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entities.map((ent) => {
                  const isCurrent = activeEntity.id === ent.id;

                  return (
                    <tr
                      key={ent.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrent ? 'bg-purple-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            ent.isHQ
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {ent.isHQ ? 'HQ' : ent.code.split('-')[1]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block font-heading">
                              {ent.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {ent.code} · {ent.legalType}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-800 font-medium block">
                          {ent.location}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ent.state}, {ent.country}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-600 space-y-0.5">
                        <div>PAN: <strong className="text-slate-900">{ent.pan}</strong></div>
                        <div>TAN: <strong className="text-purple-700">{ent.tan}</strong></div>
                        <div className="truncate max-w-[130px]">PF: {ent.pfEstCode}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {ent.employeeCount} Staff
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-purple-700">
                        ₹{ent.monthlyPayroll.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Active Context
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              switchEntity(ent.id);
                              success('Corporate Context Switched', `Active workspace changed to ${ent.name}.`);
                              setIsConsolidatedModalOpen(false);
                            }}
                            className="text-[11px] font-bold text-purple-700 hover:text-purple-900 hover:underline px-2 py-1 rounded hover:bg-purple-50 transition-colors"
                          >
                            Switch &rarr;
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

        {/* Group Compliance Health Indicators */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-heading flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Unified Group Statutory Filings Status
            </span>
            <Badge variant="success">All Filings Reconciled</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1 text-slate-600">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase">EPFO Electronic Challan</span>
              <span className="font-bold text-emerald-700">4/4 Remitted</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase">ESIC Monthly Returns</span>
              <span className="font-bold text-emerald-700">4/4 Paid</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase">Quarterly TDS 24Q</span>
              <span className="font-bold text-emerald-700">Q2 Reconciled</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase">State PT Returns</span>
              <span className="font-bold text-emerald-700">KA, MH, TG Done</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadReport}
            leftIcon={<Download className="w-3.5 h-3.5 text-purple-600" />}
          >
            Download Consolidated Statement (.xlsx)
          </Button>

          <Button variant="secondary" size="sm" onClick={() => setIsConsolidatedModalOpen(false)}>
            Close Dashboard
          </Button>
        </div>
      </div>
    </Modal>
  );
};
