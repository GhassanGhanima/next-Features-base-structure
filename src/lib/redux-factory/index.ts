/**
 * Redux Factory - Generic CRUD Redux slices and hooks
 *
 * This module provides factory functions to generate Redux slices and hooks
 * for any feature with full CRUD + pagination support.
 *
 * @example
 * // 1. Create API service
 * export const postsApi = createApiService<Post>('/posts');
 *
 * // 2. Generate Redux slice
 * export const postsSlice = createCrudSlice<Post, CreatePostInput, UpdatePostInput>({
 *   name: 'posts',
 *   apiService: postsApi,
 * });
 *
 * // 3. Generate hooks
 * export const { useList: usePosts, useEntity: usePost } = createCrudHooks({
 *   slice: postsSlice,
 *   sliceName: 'posts',
 * });
 */

// Factory functions
export { createCrudSlice } from './createCrudSlice';
export { createCrudHooks } from './createCrudHooks';
export { createApiService, createNestedApiService } from './createApiService';

// Types
export * from './types';
