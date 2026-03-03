import { z } from 'zod';

/**
 * Post validation schemas
 */

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
});

export const updatePostSchema = createPostSchema.partial();

export const postQuerySchema = z.object({
  pageNumber: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(10),
  searchTerm: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * inferred types
 */
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostQueryParams = z.infer<typeof postQuerySchema>;
