import { CompanyDocument, SystemNotification } from '../types';
import { MOCK_DOCUMENTS, MOCK_NOTIFICATIONS } from '../data/mockData';

let documents: CompanyDocument[] = [...MOCK_DOCUMENTS];
let notifications: SystemNotification[] = [...MOCK_NOTIFICATIONS];

export const documentService = {
  async getDocuments(category?: string): Promise<CompanyDocument[]> {
    await new Promise((res) => setTimeout(res, 60));
    if (!category || category === 'All') return [...documents];
    return documents.filter((d) => d.category === category);
  },

  async uploadDocument(doc: Omit<CompanyDocument, 'id' | 'uploadedDate' | 'status'>): Promise<CompanyDocument> {
    await new Promise((res) => setTimeout(res, 100));
    const newDoc: CompanyDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedDate: new Date().toISOString().split('T')[0],
      status: 'Verified',
    };
    documents.unshift(newDoc);
    return newDoc;
  },

  async deleteDocument(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 80));
    documents = documents.filter((d) => d.id !== id);
    return true;
  },

  async getNotifications(): Promise<SystemNotification[]> {
    await new Promise((res) => setTimeout(res, 40));
    return [...notifications];
  },

  async markNotificationRead(id: string): Promise<void> {
    const item = notifications.find((n) => n.id === id);
    if (item) item.read = true;
  },

  async markAllNotificationsRead(): Promise<void> {
    notifications.forEach((n) => (n.read = true));
  },
};
