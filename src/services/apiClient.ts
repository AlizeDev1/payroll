/**
 * Enterprise Production API Client for Alize Payroll & HRMS
 * Engineered for heavy cloud traffic, resilience, and real-time backend communication.
 * Features:
 *  - AbortController timeout protection (prevents connection pool exhaustion)
 *  - Exponential backoff retry strategy for transient network/cloud gateway blips (502/503/504)
 *  - In-flight GET request deduplication (cuts redundant concurrent backend load)
 *  - JWT bearer authorization and automatic token lifecycle parsing
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const DEFAULT_TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private inFlightGets = new Map<string, Promise<any>>();

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('alize_auth_token') || '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token && token !== 'false' && token !== 'true') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number = DEFAULT_TIMEOUT_MS
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async executeWithRetry<T>(
    operation: () => Promise<Response>,
    retries: number = MAX_RETRIES
  ): Promise<T> {
    let lastError: any;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await operation();

        // Retry on transient server gateway errors (502, 503, 504)
        if (!response.ok && [502, 503, 504].includes(response.status) && attempt < retries) {
          await new Promise((res) => setTimeout(res, 300 * Math.pow(2, attempt)));
          continue;
        }

        return await this.handleResponse<T>(response);
      } catch (err: any) {
        lastError = err;
        // Don't retry client-aborted or cancelled requests
        if (err.name === 'AbortError') {
          throw new ApiError('Request timed out. Server under heavy load, please retry.', 408);
        }
        if (attempt < retries) {
          // Exponential jitter wait: 300ms, 600ms
          await new Promise((res) => setTimeout(res, 300 * Math.pow(2, attempt)));
        }
      }
    }
    throw lastError;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, val);
        }
      });
    }

    const cacheKey = url.toString();

    // In-flight deduplication: return existing promise if identical GET request is active
    if (this.inFlightGets.has(cacheKey)) {
      return this.inFlightGets.get(cacheKey)!;
    }

    const requestPromise = this.executeWithRetry<T>(() =>
      this.fetchWithTimeout(cacheKey, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })
    ).finally(() => {
      this.inFlightGets.delete(cacheKey);
    });

    this.inFlightGets.set(cacheKey, requestPromise);
    return requestPromise;
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.executeWithRetry<T>(
      () =>
        this.fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: body ? JSON.stringify(body) : undefined,
        }),
      0 // No automatic POST retry to preserve financial idempotency
    );
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.executeWithRetry<T>(() =>
      this.fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      })
    );
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.executeWithRetry<T>(() =>
      this.fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      })
    );
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.executeWithRetry<T>(() =>
      this.fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      })
    );
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        // Not a JSON error
      }
      const message = errorData?.message || `HTTP ${response.status}: ${response.statusText}`;

      // Handle token expiration: clear session if 401
      if (response.status === 401) {
        localStorage.removeItem('alize_auth_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      throw new ApiError(message, response.status, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
