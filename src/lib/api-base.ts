import { fetcher } from './api';
import type { PaginationParams, PaginatedList, ListParams, ListParamsProperty } from '@/types/global';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Parameters for list requests with pagination
 */
export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

/**
 * Base API class providing CRUD operations
 * Extend this class for feature-specific API services
 *
 * @example
 * class PostsApi extends ApiBase<Post> {
 *   constructor() {
 *     super('/posts');
 *   }
 * }
 *
 * const postsApi = new PostsApi();
 * const posts = await postsApi.list({ page: 1, pageSize: 10 });
 */
export class ApiBase<T extends { id: string | number }> {
  constructor(
    private endpoint: string,
    private baseUrl: string = BASE_URL
  ) {}

  /**
   * Build query string from params
   */
  private buildQueryString(params: ListParams): string {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    // Add filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Get full URL for endpoint
   */
  private getUrl(path: string = ''): string {
    return `${this.baseUrl}${this.endpoint}${path}`;
  }

  /**
   * List items with pagination
   *
   * @param params - Pagination and filter parameters
   * @returns Paginated list of items
   */
  async list(params: ListParams = {}): Promise<PaginatedList<T>> {
    const queryString = this.buildQueryString(params);
    const url = this.getUrl(queryString);

    const response = await fetcher<{
      items: T[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }>(url);

    return {
      ...response,
      hasMore: response.page < response.totalPages,
    };
  }

  /**
   * Get a single item by ID
   *
   * @param id - Item ID
   * @returns The item
   */
  async getById(id: string | number): Promise<T> {
    return fetcher<T>(this.getUrl(`/${id}`));
  }

  /**
   * Get multiple items by IDs
   *
   * @param ids - Array of item IDs
   * @returns Array of items
   */
  async getByIds(ids: (string | number)[]): Promise<T[]> {
    const queryString = `?ids=${ids.join(',')}`;
    return fetcher<T[]>(this.getUrl(queryString));
  }

  /**
   * Create a new item
   *
   * @param data - Item data
   * @returns Created item
   */
  async create(data: Omit<T, 'id'>): Promise<T> {
    return fetcher<T>(this.getUrl(), {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Update an existing item
   *
   * @param id - Item ID
   * @param data - Partial item data to update
   * @returns Updated item
   */
  async update(id: string | number, data: Partial<Omit<T, 'id'>>): Promise<T> {
    return fetcher<T>(this.getUrl(`/${id}`), {
      method: 'PATCH',
      body: data,
    });
  }

  /**
   * Replace an entire item
   *
   * @param id - Item ID
   * @param data - Complete item data
   * @returns Updated item
   */
  async replace(id: string | number, data: T): Promise<T> {
    return fetcher<T>(this.getUrl(`/${id}`), {
      method: 'PUT',
      body: data,
    });
  }

  /**
   * Delete an item
   *
   * @param id - Item ID
   * @returns Void on success
   */
  async delete(id: string | number): Promise<void> {
    return fetcher<void>(this.getUrl(`/${id}`), {
      method: 'DELETE',
    });
  }

  /**
   * Delete multiple items
   *
   * @param ids - Array of item IDs to delete
   * @returns Void on success
   */
  async deleteMany(ids: (string | number)[]): Promise<void> {
    return fetcher<void>(this.getUrl(), {
      method: 'DELETE',
      body: { ids },
    });
  }

  /**
   * Bulk create items
   *
   * @param items - Array of items to create
   * @returns Created items
   */
  async bulkCreate(items: Omit<T, 'id'>[]): Promise<T[]> {
    return fetcher<T[]>(this.getUrl('/bulk'), {
      method: 'POST',
      body: { items },
    });
  }

  /**
   * Bulk update items
   *
   * @param updates - Array of { id, data } objects
   * @returns Updated items
   */
  async bulkUpdate(
    updates: Array<{ id: string | number; data: Partial<Omit<T, 'id'>> }>
  ): Promise<T[]> {
    return fetcher<T[]>(this.getUrl('/bulk'), {
      method: 'PATCH',
      body: { updates },
    });
  }
}

/**
 * Factory function to create API instances
 *
 * @example
 * export const postsApi = createApi<Post>('/posts');
 */
export function createApi<T extends { id: string | number }>(
  endpoint: string,
  baseUrl?: string
): ApiBase<T> {
  return new ApiBase<T>(endpoint, baseUrl);
}

// Export list params type for convenience
export type { ListParams };
