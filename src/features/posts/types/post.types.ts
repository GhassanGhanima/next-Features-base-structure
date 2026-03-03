export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// Re-export from Zod schema for type consistency
// export type { CreatePostInput, UpdatePostInput } from '../schemas/post.schema';

