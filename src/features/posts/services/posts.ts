import { Post } from '../types';
import type { PaginationParams, PaginatedList } from '@/types/global';

// In-memory mock data storage
let mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Feature-Based Architecture',
    excerpt: 'Learn how to structure your Next.js applications for scalability and maintainability.',
    content: 'Full content would go here...',
    author: 'Jane Developer',
    createdAt: '2023-10-15T12:00:00Z',
    updatedAt: '2023-10-15T12:00:00Z',
  },
  {
    id: '2',
    title: 'Building Reusable React Components',
    excerpt: 'Best practices for creating components that can be shared across features.',
    content: 'Full content would go here...',
    author: 'Alex Engineer',
    createdAt: '2023-10-12T10:30:00Z',
    updatedAt: '2023-10-12T10:30:00Z',
  },
  {
    id: '3',
    title: 'State Management in Feature-Based Apps',
    excerpt: 'Exploring different approaches to managing state in a modular application.',
    content: 'Full content would go here...',
    author: 'Sam Architect',
    createdAt: '2023-10-08T14:15:00Z',
    updatedAt: '2023-10-08T14:15:00Z',
  },
  {
    id: '4',
    title: 'Redux Toolkit Best Practices',
    excerpt: 'How to effectively use Redux Toolkit in your Next.js application.',
    content: 'Full content would go here...',
    author: 'Jane Developer',
    createdAt: '2023-10-05T09:00:00Z',
    updatedAt: '2023-10-05T09:00:00Z',
  },
  {
    id: '5',
    title: 'TypeScript for React Developers',
    excerpt: 'A comprehensive guide to TypeScript in React applications.',
    content: 'Full content would go here...',
    author: 'Alex Engineer',
    createdAt: '2023-10-01T16:45:00Z',
    updatedAt: '2023-10-01T16:45:00Z',
  },
];

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get paginated list of posts
 */
export async function getPosts(params: PaginationParams = { page: 1, pageSize: 10 }): Promise<PaginatedList<Post>> {
  await delay();

  let filteredPosts = [...mockPosts];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredPosts = filteredPosts.filter(
      p => p.title.toLowerCase().includes(searchLower) || p.excerpt.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    filteredPosts.sort((a, b) => {
      const aVal = (a as any)[params.sortBy!];
      const bVal = (b as any)[params.sortBy!];
      if (params.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  // Apply pagination
  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / params.pageSize);
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const items = filteredPosts.slice(startIndex, endIndex);

  return {
    items,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages,
    hasMore: params.page < totalPages,
  };
}

/**
 * Get a single post by ID
 */
export async function getPostById(id: string): Promise<Post | null> {
  await delay();
  return mockPosts.find(post => post.id === id) || null;
}

/**
 * Create a new post
 */
export async function createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
  await delay();

  const newPost: Post = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockPosts.unshift(newPost);
  return newPost;
}

/**
 * Update an existing post
 */
export async function updatePost(id: string, data: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post> {
  await delay();

  const index = mockPosts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Post with id ${id} not found`);
  }

  const updatedPost: Post = {
    ...mockPosts[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockPosts[index] = updatedPost;
  return updatedPost;
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<void> {
  await delay();

  const index = mockPosts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Post with id ${id} not found`);
  }

  mockPosts.splice(index, 1);
}

/**
 * Reset mock posts (for testing)
 */
export function resetMockPosts() {
  mockPosts = [
    {
      id: '1',
      title: 'Getting Started with Feature-Based Architecture',
      excerpt: 'Learn how to structure your Next.js applications for scalability and maintainability.',
      content: 'Full content would go here...',
      author: 'Jane Developer',
      createdAt: '2023-10-15T12:00:00Z',
      updatedAt: '2023-10-15T12:00:00Z',
    },
    {
      id: '2',
      title: 'Building Reusable React Components',
      excerpt: 'Best practices for creating components that can be shared across features.',
      content: 'Full content would go here...',
      author: 'Alex Engineer',
      createdAt: '2023-10-12T10:30:00Z',
      updatedAt: '2023-10-12T10:30:00Z',
    },
    {
      id: '3',
      title: 'State Management in Feature-Based Apps',
      excerpt: 'Exploring different approaches to managing state in a modular application.',
      content: 'Full content would go here...',
      author: 'Sam Architect',
      createdAt: '2023-10-08T14:15:00Z',
      updatedAt: '2023-10-08T14:15:00Z',
    },
  ];
}
