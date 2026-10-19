import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { Employee } from '../../types';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Trash2,
} from 'lucide-react';

interface BulkImportEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeesImported: (newEmployees: Employee[]) => void;
}

interface ParsedEmployeeRow {
  rowNum: number;
  data: Partial<Employee>;
  isValid: boolean;
  errors: string[];
}

export const BulkImportEmployeesModal: React.FC<BulkImportEmployeesModalProps> = ({
  isOpen,
  onClose,
  onEmployeesImported,
}) => {
  const { success, error } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedEmployeeRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleCsvTemplate = `firstName,lastName,email,phone,departmentName,designationTitle,joiningDate,employmentType,salary,panNumber,aadhaarNumber,bankName,accountNumber,ifscCode,uanNumber,taxRegime
Ramesh,Gupta,ramesh.gupta@alizesoftware.com,+91 98450 99112,Engineering,Senior Software Engineer,2026-10-01,Full-Time,145000,ABCDE1234F,901234567890,HDFC Bank,50100492817261,HDFC0000240,100987654321,New Regime (115BAC)
Deepa,Nambiar,deepa.n@alizesoftware.com,+91 98765 43210,Human Resources,HR Executive,2026-10-05,Full-Time,65000,BCDEF2345G,890123456789,ICICI Bank,000201598471,ICIC0000002,100987654322,New Regime (115BAC)
Sunil,Kashyap,sunil.k@alizesoftware.com,+91 97660 11223,Finance & Accounts,Senior Accountant,2026-10-08,Full-Time,92000,CDEFG3456H,789012345678,State Bank of India,30992817482,SBIN0004031,100987654323,Old Regime
Meera,Pillai,meera.p@alizesoftware.com,+91 99880 33445,Marketing,Content Strategist,2026-10-10,Full-Time,75000,DEFGH4567I,678901234567,Axis Bank,918020048192847,UTIB0000034,100987654324,New Regime (115BAC)
Kiran,Verma,kiran.v@alizesoftware.com,+91 98450 66778,Engineering,DevOps Specialist,2026-10-12,Full-Time,130000,EFGHI5678J,567890123456,Kotak Mahindra Bank,7819204918,KKBK0000421,100987654325,New Regime (115BAC)`;

  const downloadTemplate = () => {
    const blob = new Blob([sampleCsvTemplate], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'alize_employee_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Template Downloaded', 'alize_employee_import_template.csv saved to downloads.');
  };

  const parseCsvContent = (content: string) => {
    const lines = content
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length <= 1) {
      error('Empty CSV File', 'No employee data rows detected.');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim());
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const rows: ParsedEmployeeRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const rowData: Record<string, any> = {};

      headers.forEach((header, idx) => {
        rowData[header] = values[idx] || '';
      });

      const errors: string[] = [];

      if (!rowData.firstName) errors.push('First name required');
      if (!rowData.lastName) errors.push('Last name required');
      if (!rowData.email || !emailRegex.test(rowData.email)) errors.push('Valid corporate email required');
      if (!rowData.panNumber || !panRegex.test(rowData.panNumber.toUpperCase())) {
        errors.push('Valid 10-char PAN required (e.g. ABCDE1234F)');
      }
      if (!rowData.salary || isNaN(Number(rowData.salary)) || Number(rowData.salary) <= 0) {
        errors.push('Positive gross salary required');
      }

      rows.push({
        rowNum: i,
        data: {
          firstName: rowData.firstName,
          lastName: rowData.lastName,
          email: rowData.email,
          phone: rowData.phone || '+91 98000 00000',
          departmentName: rowData.departmentName || 'Engineering',
          designationTitle: rowData.designationTitle || 'Software Engineer',
          joiningDate: rowData.joiningDate || new Date().toISOString().split('T')[0],
          employmentType: (rowData.employmentType as any) || 'Full-Time',
          status: 'Active',
          workLocation: 'Bengaluru Tech Hub',
          salary: Number(rowData.salary) || 60000,
          ctcAnnual: (Number(rowData.salary) || 60000) * 12,
          dateOfBirth: '1995-05-15',
          gender: 'Male',
          address: 'Alize Residency, Bellandur',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560103',
          bankName: rowData.bankName || 'HDFC Bank',
          accountNumber: rowData.accountNumber || '50100291827461',
          ifscCode: rowData.ifscCode ? rowData.ifscCode.toUpperCase() : 'HDFC0000240',
          panNumber: rowData.panNumber ? rowData.panNumber.toUpperCase() : 'ABCDE1234F',
          aadhaarNumber: rowData.aadhaarNumber || '901234567890',
          uanNumber: rowData.uanNumber || '100987654321',
          taxRegime: rowData.taxRegime === 'Old Regime' ? 'Old Regime' : 'New Regime (115BAC)',
          avatar: `https://images.unsplash.com/photo-${1534528741775 + i * 1000}?auto=format&fit=crop&w=150&q=80`,
        },
        isValid: errors.length === 0,
        errors,
      });
    }

    setParsedRows(rows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsvContent(text);
    };
    reader.readAsText(uploadedFile);
  };

  const handleLoadDemoCsv = () => {
    parseCsvContent(sampleCsvTemplate);
    success('Demo CSV Loaded', 'Populated 5 sample employees for preview.');
  };

  const handleCommitImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      error('No Valid Rows', 'Please fix validation errors or load valid employee records.');
      return;
    }

    setIsProcessing(true);
    try {
      const newEmployees: Employee[] = validRows.map((r, idx) => ({
        ...(r.data as Employee),
        id: `emp-import-${Date.now()}-${idx}`,
        employeeId: `EMP${String(100 + idx + Math.floor(Math.random() * 800))}`,
        departmentId: 'dept-eng',
        designationId: 'desig-swe',
      }));

      onEmployeesImported(newEmployees);
      success('Employees Imported Successfully', `Added ${newEmployees.length} staff members to workforce directory.`);
      onClose();
      setParsedRows([]);
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const errorCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Import Employees via CSV"
      description="Upload enterprise workforce dataset with automatic column mapping and statutory validation."
      maxWidth="3xl"
    >
      <div className="space-y-5">
        {/* Step 1: Upload Controls / Demo Action */}
        <div className="p-4 rounded-xl border border-dashed border-purple-300 bg-purple-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xs font-bold text-slate-900 font-heading flex items-center gap-1.5 justify-center sm:justify-start">
              <FileSpreadsheet className="w-4 h-4 text-[#6D28D9]" /> Upload CSV File or Load Demo
            </h4>
            <p className="text-[11px] text-slate-500">
              Download our official CSV template or test immediately with 1-click sample data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={downloadTemplate}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="text-xs font-semibold"
            >
              Get Template (.csv)
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleLoadDemoCsv}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              className="text-xs font-semibold border-purple-200 hover:bg-purple-50"
            >
              Load Demo CSV (5 Staff)
            </Button>

            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6D28D9] text-white text-xs font-bold hover:bg-[#5B21B6] transition-colors shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                Browse File
              </span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Validation Status Strip */}
        {parsedRows.length > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-700">
                Total Rows Parsed: <strong className="font-mono">{parsedRows.length}</strong>
              </span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Valid: <strong className="font-mono">{validCount}</strong>
              </span>
              {errorCount > 0 && (
                <span className="font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Errors: <strong className="font-mono">{errorCount}</strong>
                </span>
              )}
            </div>
            {file && <span className="font-mono text-[11px] text-slate-400">{file.name}</span>}
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedRows.length > 0 && (
          <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse financial-table text-xs">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Employee Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>PAN</th>
                  <th className="text-right">Monthly Gross</th>
                  <th>Tax Regime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.map((row) => (
                  <tr key={row.rowNum} className={row.isValid ? 'hover:bg-slate-50' : 'bg-rose-50/40'}>
                    <td>
                      {row.isValid ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Valid
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded cursor-help"
                          title={row.errors.join('; ')}
                        >
                          <AlertCircle className="w-3 h-3 text-rose-600" /> Error
                        </span>
                      )}
                    </td>
                    <td className="font-semibold text-slate-800">
                      {row.data.firstName} {row.data.lastName}
                    </td>
                    <td className="font-mono text-[11px] text-slate-600">{row.data.email}</td>
                    <td className="text-slate-600">{row.data.departmentName}</td>
                    <td className="font-mono font-bold text-slate-800">{row.data.panNumber}</td>
                    <td className="text-right font-mono font-bold text-slate-900">
                      ₹{row.data.salary?.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        {row.data.taxRegime}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              setParsedRows([]);
              setFile(null);
            }}
            disabled={parsedRows.length === 0}
            className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Data
          </button>

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={validCount === 0}
              onClick={handleCommitImport}
              isLoading={isProcessing}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="bg-[#6D28D9] hover:bg-[#5B21B6]"
            >
              Commit Import ({validCount} Staff)
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
