import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, type PaginationParams, type PagedResult } from '@/core/api';
import type { CrudSliceConfig, CrudSliceResult, CrudState, EntityWithId } from './types';

/**
 * Create initial state for CRUD slice
 */
const createInitialState = <T extends EntityWithId>(
  override?: Partial<CrudState<T>>
): CrudState<T> => ({
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  ...override,
});

/**
 * Simplified Redux factory for CRUD operations
 * ~150 lines vs ~400 lines of the original
 *
 * @example
 * export const postsSlice = createCrudSlice<Post>({
 *   name: 'posts',
 *   endpoint: '/posts',
 * });
 */
export function createCrudSlice<T extends EntityWithId>(
  config: CrudSliceConfig
): CrudSliceResult<T> {
  const { name, endpoint, initialState: initialStateOverride } = config;

  const initialState = createInitialState<T>(initialStateOverride);

  // ============================================================
  // Async Thunks
  // ============================================================

  const fetch = createAsyncThunk(
    `${name}/fetch`,
    (params: PaginationParams = {}) => apiClient.getList<T>(endpoint, params)
  );

  const fetchById = createAsyncThunk(
    `${name}/fetchById`,
    (id: string) => apiClient.getById<T>(endpoint, id)
  );

  const create = createAsyncThunk(
    `${name}/create`,
    (data: unknown) => apiClient.create<T>(endpoint, data)
  );

  const update = createAsyncThunk(
    `${name}/update`,
    ({ id, data }: { id: string | number; data: unknown }) =>
      apiClient.update<T>(endpoint, id, data)
  );

  const remove = createAsyncThunk(
    `${name}/delete`,
    (id: string | number) => apiClient.delete(endpoint, id)
  );

  const deleteMany = createAsyncThunk(
    `${name}/deleteMany`,
    (ids: (string | number)[]) => Promise.all(ids.map(id => apiClient.delete(endpoint, id)))
  );

  // ============================================================
  // Slice
  // ============================================================

  const slice = createSlice({
    name,
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
        // Store search term - would need to be added to state if needed
        state.page = 1;
      },
      setSorting: (state, action) => {
        // Store sort params - would need to be added to state if needed
        state.page = 1;
      },
      clearErrors: (state) => {
        state.error = null;
      },
      resetState: () => initialState,
    },
    extraReducers: (builder) => {
      // ------------------------------------------------------------
      // Fetch
      // ------------------------------------------------------------
      builder
        .addCase(fetch.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetch.fulfilled, (state, action) => {
          state.isLoading = false;
          state.items = action.payload.data as any;
          state.total = action.payload.totalItems;
          state.page = action.payload.pageNumber;
        })
        .addCase(fetch.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Failed to fetch items';
        });

      // ------------------------------------------------------------
      // Create
      // ------------------------------------------------------------
      builder
        .addCase(create.pending, (state) => {
          state.isCreating = true;
          state.error = null;
        })
        .addCase(create.fulfilled, (state, action) => {
          state.isCreating = false;
          state.items.unshift(action.payload as any);
          state.total += 1;
        })
        .addCase(create.rejected, (state, action) => {
          state.isCreating = false;
          state.error = action.error.message || 'Failed to create item';
        });

      // ------------------------------------------------------------
      // Update
      // ------------------------------------------------------------
      builder
        .addCase(update.pending, (state) => {
          state.isUpdating = true;
          state.error = null;
        })
        .addCase(update.fulfilled, (state, action) => {
          state.isUpdating = false;
          const index = state.items.findIndex(x => x.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload as any;
          }
        })
        .addCase(update.rejected, (state, action) => {
          state.isUpdating = false;
          state.error = action.error.message || 'Failed to update item';
        });

      // ------------------------------------------------------------
      // Delete
      // ------------------------------------------------------------
      builder
        .addCase(remove.pending, (state) => {
          state.isDeleting = true;
          state.error = null;
        })
        .addCase(remove.fulfilled, (state, action) => {
          state.isDeleting = false;
          state.items = state.items.filter(x => x.id !== action.meta.arg);
          state.total -= 1;
        })
        .addCase(remove.rejected, (state, action) => {
          state.isDeleting = false;
          state.error = action.error.message || 'Failed to delete item';
        });

      // ------------------------------------------------------------
      // Delete Many
      // ------------------------------------------------------------
      builder
        .addCase(deleteMany.pending, (state) => {
          state.isDeleting = true;
          state.error = null;
        })
        .addCase(deleteMany.fulfilled, (state, action) => {
          state.isDeleting = false;
          const ids = action.meta.arg;
          state.items = state.items.filter(x => !ids.includes(x.id));
          state.total -= ids.length;
        })
        .addCase(deleteMany.rejected, (state, action) => {
          state.isDeleting = false;
          state.error = action.error.message || 'Failed to delete items';
        });
    },
  });

  return {
    reducer: slice.reducer,
    actions: {
      setPage: slice.actions.setPage,
      setPageSize: slice.actions.setPageSize,
      setSearch: slice.actions.setSearch,
      setSorting: slice.actions.setSorting,
      clearErrors: slice.actions.clearErrors,
      resetState: slice.actions.resetState,
    },
    thunks: {
      fetch,
      fetchById,
      create,
      update,
      delete: remove,
      deleteMany,
    },
  };
}
