/**
 * API service factory - simplified version
 *
 * Mock services have been removed - use real backend API instead
 */

import { apiClient } from '@/core/api';
import type { PaginationParams, PagedResult } from '@/core/api';
import type { EntityWithId } from './types';

/**
 * Creates an API service object for a feature
 * This is a lightweight wrapper around apiClient for type safety
 *
 * @example
 * export const postsApi = createApiService<Post>('/posts');
 */
export function createApiService<TEntity extends EntityWithId>(endpoint: string) {
  return {
    list: (params?: PaginationParams): Promise<PagedResult<TEntity>> =>
      apiClient.getList<TEntity>(endpoint, params),

    getById: (id: string | number): Promise<TEntity> =>
      apiClient.getById<TEntity>(endpoint, id),

    create: (data: unknown): Promise<TEntity> =>
      apiClient.create<TEntity>(endpoint, data),

    update: (id: string | number, data: unknown): Promise<TEntity> =>
      apiClient.update<TEntity>(endpoint, id, data),

    delete: (id: string | number): Promise<void> =>
      apiClient.delete(endpoint, id),
  };
}

/**
 * Creates an API service for a nested resource
 *
 * @example
 * // For /posts/:postId/comments
 * export const postCommentsApi = createNestedApiService<Comment>(
 *   (postId: string) => `/posts/${postId}/comments`
 * );
 */
export function createNestedApiService<TEntity extends EntityWithId>(
  getEndpoint: (params: any) => string
) {
  return {
    list: (params: any, pagination?: PaginationParams): Promise<PagedResult<TEntity>> =>
      apiClient.getList<TEntity>(getEndpoint(params), pagination),

    getById: (params: any, id: string | number): Promise<TEntity> =>
      apiClient.getById<TEntity>(getEndpoint(params), id),

    create: (params: any, data: unknown): Promise<TEntity> =>
      apiClient.create<TEntity>(getEndpoint(params), data),

    update: (params: any, id: string | number, data: unknown): Promise<TEntity> =>
      apiClient.update<TEntity>(getEndpoint(params), id, data),

    delete: (params: any, id: string | number): Promise<void> =>
      apiClient.delete(getEndpoint(params), id),
  };
}
