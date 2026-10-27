import { CompanyDocument, SystemNotification } from '../types';
import { MOCK_DOCUMENTS, MOCK_NOTIFICATIONS } from '../data/mockData';
import { apiClient } from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

let documents: CompanyDocument[] = [...MOCK_DOCUMENTS];
let notifications: SystemNotification[] = [...MOCK_NOTIFICATIONS];

export const documentService = {
  async getDocuments(category?: string): Promise<CompanyDocument[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<CompanyDocument[]>('/documents', category && category !== 'All' ? { category } : undefined);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 60));
    if (!category || category === 'All') return [...documents];
    return documents.filter((d) => d.category === category);
  },

  async uploadDocument(doc: Omit<CompanyDocument, 'id' | 'uploadedDate' | 'status'>): Promise<CompanyDocument> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<CompanyDocument>('/documents', doc);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
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
    if (!USE_MOCK) {
      try {
        await apiClient.delete(`/documents/${id}`);
        return true;
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 80));
    documents = documents.filter((d) => d.id !== id);
    return true;
  },

  async getNotifications(): Promise<SystemNotification[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<SystemNotification[]>('/documents/notifications');
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 40));
    return [...notifications];
  },

  async markNotificationRead(id: string): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.patch(`/documents/notifications/${id}/read`);
        return;
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    const item = notifications.find((n) => n.id === id);
    if (item) item.read = true;
  },

  async markAllNotificationsRead(): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.patch('/documents/notifications/read-all');
        return;
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    notifications.forEach((n) => (n.read = true));
  },
};
