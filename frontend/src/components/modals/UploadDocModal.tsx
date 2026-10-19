import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { documentService } from '../../services/documentService';
import { CompanyDocument } from '../../types';
import { UploadCloud } from 'lucide-react';

interface UploadDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentUploaded: (doc: CompanyDocument) => void;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({
  isOpen,
  onClose,
  onDocumentUploaded,
}) => {
  const { success } = useToast();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CompanyDocument['category']>('Company Documents');
  const [fileType, setFileType] = useState<CompanyDocument['fileType']>('PDF');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const doc = await documentService.uploadDocument({
        title,
        category,
        fileName: fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.${fileType.toLowerCase()}`,
        fileSize: '1.4 MB',
        fileType,
      });
      onDocumentUploaded(doc);
      success('Document Uploaded', `${title} indexed into ${category}.`);
      onClose();
      setTitle('');
      setFileName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Compliance or Corporate Document"
      description="Upload policy handbooks, tax filings, or employee KYC verification forms."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Document Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Q3 2026 Board Payroll Approval Minutes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CompanyDocument['category'])}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="Company Documents">Company Documents & Policies</option>
              <option value="Tax Documents">Tax Documents (PF / ESI / TDS)</option>
              <option value="Employee Documents">Employee Documents & KYC</option>
              <option value="Payslips">Payslips Register</option>
              <option value="Other">Other Miscellaneous</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              File Extension
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value as CompanyDocument['fileType'])}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            >
              <option value="PDF">PDF (.pdf)</option>
              <option value="XLSX">Excel Spreadsheet (.xlsx)</option>
              <option value="DOCX">Word Document (.docx)</option>
              <option value="IMG">Scanned Image (.png / .jpg)</option>
            </select>
          </div>
        </div>

        <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-[8px] p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
          <UploadCloud className="w-8 h-8 text-[#6D28D9] dark:text-purple-400 mx-auto mb-1.5" />
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Choose file or drag and drop
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Supports PDF, XLSX, DOCX up to 25MB</p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Upload Document
          </Button>
        </div>
      </form>
    </Modal>
  );
};
