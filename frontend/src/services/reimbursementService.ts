import { ReimbursementClaim, ClaimStatus } from '../types';
import { MOCK_REIMBURSEMENTS } from '../data/mockData';
import { apiClient } from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

let claims: ReimbursementClaim[] = [...MOCK_REIMBURSEMENTS];

export const reimbursementService = {
  async getClaims(status?: ClaimStatus | 'All'): Promise<ReimbursementClaim[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<ReimbursementClaim[]>('/reimbursements', status && status !== 'All' ? { status } : undefined);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 60));
    if (!status || status === 'All') return [...claims];
    return claims.filter((c) => c.status === status);
  },

  async submitClaim(claim: Omit<ReimbursementClaim, 'id' | 'claimId' | 'status' | 'submittedDate'>): Promise<ReimbursementClaim> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<ReimbursementClaim>('/reimbursements', claim);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 100));
    const newClaim: ReimbursementClaim = {
      ...claim,
      id: `claim-${Date.now()}`,
      claimId: `EXP-2026-${Math.floor(800 + Math.random() * 200)}`,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    claims.unshift(newClaim);
    return newClaim;
  },

  async updateClaimStatus(id: string, status: ClaimStatus, approvedBy: string, remarks?: string): Promise<ReimbursementClaim> {
    if (!USE_MOCK) {
      try {
        return await apiClient.patch<ReimbursementClaim>(`/reimbursements/${id}/status`, {
          status,
          approvedBy,
          remarks,
        });
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 80));
    const index = claims.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Claim not found');
    claims[index] = {
      ...claims[index],
      status,
      approvedBy,
      approvalRemarks: remarks,
    };
    return claims[index];
  },
};
