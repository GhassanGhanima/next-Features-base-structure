/**
 * Comment Types
 *
 * Example feature using the Redux factory
 */

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateCommentInput = Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCommentInput = Partial<Omit<Comment, 'id' | 'createdAt'>>;
