import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { AsyncState, PaginationParams, defaultPagination } from '@/types/global';
import { Post, CreatePostInput, UpdatePostInput } from '../types';
import * as postsService from '../services/posts';

/**
 * Posts State Interface
 */
interface PostsState {
  // List of posts with pagination
  list: AsyncState<{
    items: Post[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
  }>;

  // Individual posts by ID (for single post views)
  byId: Record<string, AsyncState<Post>>;

  // Current pagination parameters
  pagination: PaginationParams;

  // Selected post ID (for editing/viewing)
  selectedPostId: string | null;

  // Bulk operation state
  isDeleting: boolean;
  isUpdating: boolean;
}

/**
 * Initial posts state
 */
const initialState: PostsState = {
  list: {
    data: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  },
  byId: {},
  pagination: defaultPagination,
  selectedPostId: null,
  isDeleting: false,
  isUpdating: false,
};

// ============================================================
// Async Thunks
// ============================================================

/**
 * Fetch posts with pagination
 */
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params: PaginationParams = defaultPagination) => {
    return await postsService.getPosts(params);
  }
);

/**
 * Fetch a single post by ID
 */
export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: string) => {
    const post = await postsService.getPostById(id);
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }
    return post;
  }
);

/**
 * Create a new post
 */
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (data: CreatePostInput) => {
    return await postsService.createPost(data);
  }
);

/**
 * Update an existing post
 */
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, data }: { id: string; data: UpdatePostInput }) => {
    return await postsService.updatePost(id, data);
  }
);

/**
 * Delete a post
 */
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      await postsService.deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Delete multiple posts
 */
export const deleteManyPosts = createAsyncThunk(
  'posts/deleteManyPosts',
  async (ids: string[]) => {
    await Promise.all(ids.map(id => postsService.deletePost(id)));
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
    // Pagination actions
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1; // Reset to first page
    },
    setSearch: (state, action) => {
      state.pagination.search = action.payload;
      state.pagination.page = 1; // Reset to first page
    },
    setSorting: (state, action) => {
      state.pagination.sortBy = action.payload.sortBy;
      state.pagination.sortOrder = action.payload.sortOrder;
    },

    // Selection actions
    setSelectedPostId: (state, action) => {
      state.selectedPostId = action.payload;
    },
    clearSelectedPostId: (state) => {
      state.selectedPostId = null;
    },

    // Optimistic updates (for immediate UI feedback)
    optimisticallyUpdatePost: (state, action) => {
      const { id, data } = action.payload;
      // Update in list
      if (state.list.data) {
        const index = state.list.data.items.findIndex(p => p.id === id);
        if (index !== -1) {
          state.list.data.items[index] = { ...state.list.data.items[index], ...data };
        }
      }
      // Update in byId cache
      if (state.byId[id]?.data) {
        state.byId[id].data = { ...state.byId[id].data!, ...data };
      }
    },

    // Clear errors
    clearListError: (state) => {
      state.list.error = null;
    },
    clearPostError: (state, action) => {
      const id = action.payload;
      if (state.byId[id]) {
        state.byId[id].error = null;
      }
    },
    clearAllErrors: (state) => {
      state.list.error = null;
      Object.keys(state.byId).forEach(key => {
        state.byId[key].error = null;
      });
    },

    // Reset state
    resetPostsState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ============================================================
    // Fetch Posts
    // ============================================================
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.list.isLoading = true;
        state.list.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.list.isLoading = false;
        state.list.data = action.payload;
        state.list.lastUpdated = Date.now();
        state.pagination.page = action.payload.page;
        state.pagination.pageSize = action.payload.pageSize;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.list.isLoading = false;
        state.list.error = action.error.message || 'Failed to fetch posts';
      });

    // ============================================================
    // Fetch Post By ID
    // ============================================================
    builder
      .addCase(fetchPostById.pending, (state, action) => {
        const id = action.meta.arg;
        if (!state.byId[id]) {
          state.byId[id] = {
            data: null,
            isLoading: true,
            error: null,
            lastUpdated: null,
          };
        } else {
          state.byId[id].isLoading = true;
          state.byId[id].error = null;
        }
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        const id = action.payload.id;
        state.byId[id] = {
          data: action.payload,
          isLoading: false,
          error: null,
          lastUpdated: Date.now(),
        };
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        const id = action.meta.arg;
        if (!state.byId[id]) {
          state.byId[id] = {
            data: null,
            isLoading: false,
            error: null,
            lastUpdated: null,
          };
        }
        state.byId[id].isLoading = false;
        state.byId[id].error = action.error.message || 'Failed to fetch post';
      });

    // ============================================================
    // Create Post
    // ============================================================
    builder
      .addCase(createPost.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Add to beginning of list
        if (state.list.data) {
          state.list.data.items.unshift(action.payload);
          state.list.data.total += 1;
        }
        // Add to byId cache
        state.byId[action.payload.id] = {
          data: action.payload,
          isLoading: false,
          error: null,
          lastUpdated: Date.now(),
        };
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isUpdating = false;
        state.list.error = action.error.message || 'Failed to create post';
      });

    // ============================================================
    // Update Post
    // ============================================================
    builder
      .addCase(updatePost.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Update in list
        if (state.list.data) {
          const index = state.list.data.items.findIndex(p => p.id === action.payload.id);
          if (index !== -1) {
            state.list.data.items[index] = action.payload;
          }
        }
        // Update in byId cache
        if (state.byId[action.payload.id]) {
          state.byId[action.payload.id].data = action.payload;
          state.byId[action.payload.id].lastUpdated = Date.now();
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isUpdating = false;
        state.list.error = action.error.message || 'Failed to update post';
      });

    // ============================================================
    // Delete Post
    // ============================================================
    builder
      .addCase(deletePost.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isDeleting = false;
        const id = action.payload;
        // Remove from list
        if (state.list.data) {
          state.list.data.items = state.list.data.items.filter(p => p.id !== id);
          state.list.data.total -= 1;
        }
        // Remove from byId cache
        delete state.byId[id];
        // Clear selection if this was the selected post
        if (state.selectedPostId === id) {
          state.selectedPostId = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isDeleting = false;
        state.list.error = action.error.message || 'Failed to delete post';
      });

    // ============================================================
    // Delete Many Posts
    // ============================================================
    builder
      .addCase(deleteManyPosts.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteManyPosts.fulfilled, (state, action) => {
        state.isDeleting = false;
        const ids = action.payload;
        // Remove from list
        if (state.list.data) {
          state.list.data.items = state.list.data.items.filter(p => !ids.includes(p.id));
          state.list.data.total -= ids.length;
        }
        // Remove from byId cache
        ids.forEach(id => {
          delete state.byId[id];
        });
        // Clear selection if selected post was deleted
        if (state.selectedPostId && ids.includes(state.selectedPostId)) {
          state.selectedPostId = null;
        }
      })
      .addCase(deleteManyPosts.rejected, (state, action) => {
        state.isDeleting = false;
        state.list.error = action.error.message || 'Failed to delete posts';
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
  optimisticallyUpdatePost,
  clearListError,
  clearPostError,
  clearAllErrors,
  resetPostsState,
} = postsSlice.actions;

// Export reducer
export default postsSlice.reducer;

// Export selectors
export const selectPostsList = (state: { posts: PostsState }) => state.posts.list;
export const selectPostsById = (state: { posts: PostsState }) => state.posts.byId;
export const selectPostsPagination = (state: { posts: PostsState }) => state.posts.pagination;
export const selectSelectedPostId = (state: { posts: PostsState }) => state.posts.selectedPostId;
export const selectIsDeleting = (state: { posts: PostsState }) => state.posts.isDeleting;
export const selectIsUpdating = (state: { posts: PostsState }) => state.posts.isUpdating;

// Memoized selectors for common use cases
export const selectPostsItems = (state: { posts: PostsState }) => state.posts.list.data?.items || [];
export const selectPostsTotal = (state: { posts: PostsState }) => state.posts.list.data?.total || 0;
export const selectPostsIsLoading = (state: { posts: PostsState }) => state.posts.list.isLoading;
export const selectPostsError = (state: { posts: PostsState }) => state.posts.list.error;
