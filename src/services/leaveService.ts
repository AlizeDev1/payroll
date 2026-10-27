import { LeaveRequest, LeaveStatus } from '../types';
import { MOCK_LEAVES } from '../data/mockData';
import { apiClient } from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

let leaves: LeaveRequest[] = [...MOCK_LEAVES];

export const leaveService = {
  async getLeaves(status?: LeaveStatus | 'All'): Promise<LeaveRequest[]> {
    if (!USE_MOCK) {
      try {
        const result = await apiClient.get<LeaveRequest[]>('/leaves');
        if (!status || status === 'All') return result;
        return result.filter((l) => l.status === status);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 60));
    if (!status || status === 'All') return [...leaves];
    return leaves.filter((l) => l.status === status);
  },

  async applyLeave(data: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>): Promise<LeaveRequest> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<LeaveRequest>('/leaves', data);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 100));
    const newLeave: LeaveRequest = {
      ...data,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    leaves.unshift(newLeave);
    return newLeave;
  },

  async updateLeaveStatus(id: string, status: LeaveStatus, reviewedBy: string, comments?: string): Promise<LeaveRequest> {
    if (!USE_MOCK) {
      try {
        return await apiClient.patch<LeaveRequest>(`/leaves/${id}/status`, {
          status,
          reviewedBy,
          comments,
        });
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 80));
    const index = leaves.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Leave request not found');
    leaves[index] = {
      ...leaves[index],
      status,
      reviewedBy,
      reviewedDate: new Date().toISOString().split('T')[0],
      comments,
    };
    return leaves[index];
  },
};
