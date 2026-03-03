/**
 * Comments API Service
 *
 * Using the factory to create an API service with mock data
 */

import { createMockApiService } from '@/lib/redux-factory';
import type { Comment } from '../types';

// Mock data
const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    content: 'Great article! Very helpful.',
    author: 'Alice',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    postId: '1',
    content: 'Thanks for sharing this.',
    author: 'Bob',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: '3',
    postId: '2',
    content: 'This is exactly what I was looking for!',
    author: 'Charlie',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
  },
  {
    id: '4',
    postId: '2',
    content: 'Well written and easy to understand.',
    author: 'Diana',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '5',
    postId: '3',
    content: 'I have a question about this topic.',
    author: 'Eve',
    createdAt: '2024-01-17T08:00:00Z',
    updatedAt: '2024-01-17T08:00:00Z',
  },
];

// Create API service with mock data
export const commentsApi = createMockApiService<Comment>(mockComments, {
  delay: 300,
  enableMutations: true,
});

// For real API, use:
// import { createApiService } from '@/lib/redux-factory';
// export const commentsApi = createApiService<Comment>('/comments');
