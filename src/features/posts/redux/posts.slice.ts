import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/core/api';
import type { Post } from '../types';

/**
 * Posts State Interface
 */
interface PostsState {
  items: Post[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

/**
 * Initial posts state
 */
const initialState: PostsState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

// ============================================================
// Async Thunks
// ============================================================

/**
 * Fetch posts with pagination
 */
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params: { pageNumber?: number; pageSize?: number; searchTerm?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}) => {
    return await apiClient.getList<Post>('/posts', params);
  }
);

/**
 * Fetch a single post by ID
 */
export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: string) => {
    return await apiClient.getById<Post>('/posts', id);
  }
);

/**
 * Create a new post
 */
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await apiClient.create<Post>('/posts', data);
  }
);

/**
 * Update an existing post
 */
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, data }: { id: string; data: Partial<Omit<Post, 'id' | 'createdAt'>> }) => {
    return await apiClient.update<Post>('/posts', id, data);
  }
);

/**
 * Delete a post
 */
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string) => {
    await apiClient.delete('/posts', id);
    return id;
  }
);

/**
 * Delete multiple posts
 */
export const deleteManyPosts = createAsyncThunk(
  'posts/deleteManyPosts',
  async (ids: string[]) => {
    await Promise.all(ids.map(id => apiClient.delete('/posts', id)));
    return ids;
  }
);

// ============================================================
// Slice
// ============================================================

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    setSearch: (state, action) => {
      // Search term would need to be stored in state if needed
      state.page = 1;
    },
    setSorting: (state, action) => {
      // Sort params would need to be stored in state if needed
      state.page = 1;
    },
    setPagination: (state, action) => {
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
    },
    setSelectedPostId: (state, action) => {
      // Would need to be added to state if needed
    },
    clearSelectedPostId: (state) => {
      // Would need to be added to state if needed
    },
    clearListError: (state) => {
      state.error = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
    },
    resetPostsState: () => initialState,
  },
  extraReducers: (builder) => {
    // ============================================================
    // Fetch Posts
    // ============================================================
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.total = action.payload.totalItems;
        state.page = action.payload.pageNumber;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      });

    // ============================================================
    // Fetch Post By ID (not storing in byId cache anymore)
    // ============================================================
    builder
      .addCase(fetchPostById.fulfilled, (state, action) => {
        // Update in list if exists
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch post';
      });

    // ============================================================
    // Create Post
    // ============================================================
    builder
      .addCase(createPost.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message || 'Failed to create post';
      });

    // ============================================================
    // Update Post
    // ============================================================
    builder
      .addCase(updatePost.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || 'Failed to update post';
      });

    // ============================================================
    // Delete Post
    // ============================================================
    builder
      .addCase(deletePost.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.items = state.items.filter(p => p.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message || 'Failed to delete post';
      });

    // ============================================================
    // Delete Many Posts
    // ============================================================
    builder
      .addCase(deleteManyPosts.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteManyPosts.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.items = state.items.filter(p => !action.payload.includes(p.id));
        state.total -= action.payload.length;
      })
      .addCase(deleteManyPosts.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message || 'Failed to delete posts';
      });
  },
});

// Export actions
export const {
  setPagination,
  setPage,
  setPageSize,
  setSearch,
  setSorting,
  setSelectedPostId,
  clearSelectedPostId,
  clearListError,
  clearAllErrors,
  resetPostsState,
} = postsSlice.actions;

// Export reducer
export default postsSlice.reducer;

// Export selectors
export const selectPostsList = (state: { posts: PostsState }) => state.posts;
export const selectPostsById = (state: { posts: PostsState }) => state.posts;
export const selectPostsPagination = (state: { posts: PostsState }) => ({
  page: state.posts.page,
  pageSize: state.posts.pageSize,
});
export const selectSelectedPostId = (state: { posts: PostsState }) => null;
export const selectIsDeleting = (state: { posts: PostsState }) => state.posts.isDeleting;
export const selectIsUpdating = (state: { posts: PostsState }) => state.posts.isUpdating;

// Memoized selectors for common use cases
export const selectPostsItems = (state: { posts: PostsState }) => state.posts.items;
export const selectPostsTotal = (state: { posts: PostsState }) => state.posts.total;
export const selectPostsIsLoading = (state: { posts: PostsState }) => state.posts.isLoading;
export const selectPostsError = (state: { posts: PostsState }) => state.posts.error;

// Export type
export type { PostsState };
