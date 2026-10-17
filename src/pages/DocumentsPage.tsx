import React, { useState, useEffect } from 'react';
import {
  Upload,
  Download,
  Trash2,
  FileText,
  Plus,
  Search,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { documentService } from '../services/documentService';
import { CompanyDocument } from '../types';
import { UploadDocModal } from '../components/modals/UploadDocModal';
import { useToast } from '../context/ToastContext';

export const DocumentsPage: React.FC = () => {
  const { success } = useToast();
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    documentService.getDocuments().then(setDocuments);
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete document "${title}"?`)) {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      success('Document Deleted', `${title} removed.`);
    }
  };

  const categories = [
    'All',
    'Company Documents',
    'Tax Documents',
    'Employee Documents',
    'Payslips',
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Management Vault"
        subtitle="Secure encrypted repository for employment agreements, statutory returns, policy handbooks, and KYC files."
        breadcrumb={['Overview', 'System', 'Documents']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Upload Document
          </Button>
        }
      />

      {/* Category Pills & Search */}
      <div className="p-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-1 overflow-x-auto p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700/60 w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-[6px] transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[8px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
        {filteredDocs.length === 0 ? (
          <EmptyState
            title="No Documents Found"
            description="No files match your current category or search query."
            actionLabel="Upload New Document"
            onAction={() => setIsUploadModalOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-3.5">Document Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">File Name</th>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Uploaded Date</th>
                  <th className="py-3 px-3 text-center">Verification</th>
                  <th className="py-3 px-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[6px] bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-[#6D28D9] dark:text-purple-300 shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{doc.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-xs">
                      {doc.category}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{doc.fileName}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono tabular-nums text-[11px]">{doc.fileSize}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono tabular-nums text-[11px]">{doc.uploadedDate}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'}>
                        {doc.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() =>
                            success('Download Started', `Saved ${doc.fileName} to local system.`)
                          }
                          className="p-1 text-slate-400 hover:text-[#6D28D9] dark:hover:text-purple-400 rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UploadDocModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentUploaded={(newDoc) => setDocuments((prev) => [newDoc, ...prev])}
      />
    </div>
  );
};
