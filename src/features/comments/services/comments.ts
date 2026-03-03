/**
 * Comments API Service
 *
 * Uses real backend API - no more mock data
 */

import { apiClient, type PaginationParams, type PagedResult } from '@/core/api';
import type { Comment } from '../types';

export async function getComments(params?: PaginationParams): Promise<PagedResult<Comment>> {
  return apiClient.getList<Comment>('/comments', params);
}

export async function getCommentById(id: string): Promise<Comment> {
  return apiClient.getById<Comment>('/comments', id);
}

export async function getCommentsByPostId(postId: string, params?: PaginationParams): Promise<PagedResult<Comment>> {
  // Filter comments by post ID
  return apiClient.getList<Comment>(`/posts/${postId}/comments`, params);
}

export async function createComment(data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
  return apiClient.create<Comment>('/comments', data);
}

export async function updateComment(id: string, data: Partial<Omit<Comment, 'id' | 'createdAt'>>): Promise<Comment> {
  return apiClient.update<Comment>('/comments', id, data);
}

export async function deleteComment(id: string): Promise<void> {
  return apiClient.delete('/comments', id);
}

/**
 * API service object for use with Redux factory
 */
export const commentsApi = {
  list: getComments,
  getById: getCommentById,
  create: createComment,
  update: updateComment,
  delete: deleteComment,
};
