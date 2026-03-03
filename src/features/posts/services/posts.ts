/**
 * Posts API Service
 *
 * Uses real backend API - no more mock data
 */

import { apiClient, type PaginationParams, type PagedResult } from '@/core/api';
import type { Post } from '../types';

export async function getPosts(params?: PaginationParams): Promise<PagedResult<Post>> {
  return apiClient.getList<Post>('/posts', params);
}

export async function getPostById(id: string): Promise<Post> {
  return apiClient.getById<Post>('/posts', id);
}

export async function createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
  return apiClient.create<Post>('/posts', data);
}

export async function updatePost(id: string, data: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post> {
  return apiClient.update<Post>('/posts', id, data);
}

export async function deletePost(id: string): Promise<void> {
  return apiClient.delete('/posts', id);
}
