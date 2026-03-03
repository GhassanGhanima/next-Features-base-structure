import { env } from '../config/env';

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response from the API
 */
export interface PagedResult<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  succeeded: boolean;
}

/**
 * Simple REST API client
 * Handles CRUD operations with proper error handling
 */
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.NEXT_PUBLIC_API_URL;
  }

  /**
   * Get auth token from localStorage (for client-side requests)
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Make an HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Build query string from params
   */
  private buildQueryString(params?: PaginationParams): string {
    if (!params) return '';

    const queryParams = new URLSearchParams();
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Get paginated list
   */
  getList<T>(endpoint: string, params?: PaginationParams): Promise<PagedResult<T>> {
    const queryString = this.buildQueryString(params);
    return this.request<PagedResult<T>>(`${endpoint}${queryString}`);
  }

  /**
   * Get single item by ID
   */
  getById<T>(endpoint: string, id: string | number): Promise<T> {
    return this.request<T>(`${endpoint}/${id}`);
  }

  /**
   * Create new item
   */
  create<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update existing item
   */
  update<T>(endpoint: string, id: string | number, data: unknown): Promise<T> {
    return this.request<T>(`${endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Partial update (PATCH)
   */
  patch<T>(endpoint: string, id: string | number, data: unknown): Promise<T> {
    return this.request<T>(`${endpoint}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete item
   */
  delete(endpoint: string, id: string | number): Promise<void> {
    return this.request<void>(`${endpoint}/${id}`, {
      method: 'DELETE',
    });
  }
}

/**
 * Singleton API client instance
 */
export const apiClient = new ApiClient();
