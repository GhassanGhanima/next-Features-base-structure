import { createSlice, createAsyncThunk, combineReducers, isAnyOf } from '@reduxjs/toolkit';
import type {
  CrudSliceConfig,
  CrudSliceResult,
  CrudState,
  createInitialCrudState,
  EntityWithId,
} from './types';
import type { AppDispatch, RootState } from '@/store';

/**
 * Creates a complete Redux slice with CRUD operations
 *
 * @param config - Configuration for the slice
 * @returns CrudSliceResult with reducer, thunks, actions, and selectors
 *
 * @example
 * const postsSlice = createCrudSlice<Post, CreatePostInput, UpdatePostInput>({
 *   name: 'posts',
 *   apiService: postsApi,
 * });
 */
export function createCrudSlice<
  TEntity extends EntityWithId,
  TCreateInput,
  TUpdateInput
>(config: CrudSliceConfig<TEntity, TCreateInput, TUpdateInput>): CrudSliceResult<
  TEntity,
  TCreateInput,
  TUpdateInput
> {
  const {
    name,
    apiService,
    initialState: initialStateOverride,
    enableCache = true,
    enableOptimisticUpdates = true,
    transforms,
    actionNames,
  } = config;

  // Build initial state
  const initialState: CrudState<TEntity> = {
    ...(createInitialCrudState() as CrudState<TEntity>),
    ...initialStateOverride,
  };

  // ============================================================
  // Async Thunks
  // ============================================================

  const fetchThunk = createAsyncThunk(
    `${name}/${actionNames?.fetch || 'fetch'}`,
    async (params: any = {}) => {
      return await apiService.list(params);
    }
  );

  const fetchByIdThunk = createAsyncThunk(
    `${name}/${actionNames?.fetchById || 'fetchById'}`,
    async (id: string) => {
      return await apiService.getById(id);
    }
  );

  const createThunk = createAsyncThunk(
    `${name}/${actionNames?.create || 'create'}`,
    async (data: TCreateInput) => {
      const result = await apiService.create(data);
      return transforms?.afterCreate ? transforms.afterCreate(result) : result;
    }
  );

  const updateThunk = createAsyncThunk(
    `${name}/${actionNames?.update || 'update'}`,
    async ({ id, data }: { id: string | number; data: TUpdateInput }) => {
      const result = await apiService.update(id, data);
      return transforms?.afterUpdate ? transforms.afterUpdate(result) : result;
    }
  );

  const deleteThunk = createAsyncThunk(
    `${name}/${actionNames?.delete || 'delete'}`,
    async (id: string | number) => {
      await apiService.delete(id);
      transforms?.afterDelete?.(id);
      return id;
    }
  );

  const deleteManyThunk = createAsyncThunk(
    `${name}/${actionNames?.deleteMany || 'deleteMany'}`,
    async (ids: (string | number)[]) => {
      if (apiService.deleteMany) {
        await apiService.deleteMany(ids);
      } else {
        await Promise.all(ids.map((id) => apiService.delete(id)));
      }
      return ids;
    }
  );

  // ============================================================
  // Slice
  // ============================================================

  const slice = createSlice({
    name,
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
        state.pagination.page = 1;
      },
      setSearch: (state, action) => {
        state.pagination.search = action.payload;
        state.pagination.page = 1;
      },
      setSorting: (state, action) => {
        state.pagination.sortBy = action.payload.sortBy;
        state.pagination.sortOrder = action.payload.sortOrder;
      },

      // Selection actions
      setSelectedId: (state, action) => {
        state.selectedId = action.payload;
      },
      clearSelectedId: (state) => {
        state.selectedId = null;
      },

      // Utility actions
      clearErrors: (state) => {
        state.list.error = null;
        Object.values(state.byId).forEach((entityState) => {
          entityState.error = null;
        });
      },
      resetState: () => initialState,
    },
    extraReducers: (builder) => {
      // ------------------------------------------------------------
      // Fetch List
      // ------------------------------------------------------------
      builder
        .addCase(fetchThunk.pending, (state) => {
          state.list.isLoading = true;
          state.list.error = null;
        })
        .addCase(fetchThunk.fulfilled, (state, action) => {
          state.list.isLoading = false;
          state.list.data = action.payload;
          state.list.lastUpdated = Date.now();
          state.pagination.page = action.payload.page;
          state.pagination.pageSize = action.payload.pageSize;
        })
        .addCase(fetchThunk.rejected, (state, action) => {
          state.list.isLoading = false;
          state.list.error = action.error.message || 'Failed to fetch items';
        });

      // ------------------------------------------------------------
      // Fetch By ID
      // ------------------------------------------------------------
      builder
        .addCase(fetchByIdThunk.pending, (state, action) => {
          if (!enableCache) return;
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
        .addCase(fetchByIdThunk.fulfilled, (state, action) => {
          if (!enableCache) return;
          const entity = action.payload;
          state.byId[entity.id] = {
            data: entity,
            isLoading: false,
            error: null,
            lastUpdated: Date.now(),
          };
        })
        .addCase(fetchByIdThunk.rejected, (state, action) => {
          if (!enableCache) return;
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
          state.byId[id].error = action.error.message || 'Failed to fetch item';
        });

      // ------------------------------------------------------------
      // Create
      // ------------------------------------------------------------
      builder
        .addCase(createThunk.pending, (state) => {
          state.isCreating = true;
        })
        .addCase(createThunk.fulfilled, (state, action) => {
          state.isCreating = false;
          const entity = action.payload;

          // Add to beginning of list
          if (state.list.data) {
            state.list.data.items.unshift(entity);
            state.list.data.total += 1;
          }

          // Add to cache
          if (enableCache) {
            state.byId[entity.id] = {
              data: entity,
              isLoading: false,
              error: null,
              lastUpdated: Date.now(),
            };
          }
        })
        .addCase(createThunk.rejected, (state, action) => {
          state.isCreating = false;
          state.list.error = action.error.message || 'Failed to create item';
        });

      // ------------------------------------------------------------
      // Update
      // ------------------------------------------------------------
      builder
        .addCase(updateThunk.pending, (state) => {
          state.isUpdating = true;
        })
        .addCase(updateThunk.fulfilled, (state, action) => {
          state.isUpdating = false;
          const entity = action.payload;

          // Update in list
          if (state.list.data) {
            const index = state.list.data.items.findIndex((e) => e.id === entity.id);
            if (index !== -1) {
              state.list.data.items[index] = entity;
            }
          }

          // Update in cache
          if (enableCache && state.byId[entity.id]) {
            state.byId[entity.id].data = entity;
            state.byId[entity.id].lastUpdated = Date.now();
          }
        })
        .addCase(updateThunk.rejected, (state, action) => {
          state.isUpdating = false;
          state.list.error = action.error.message || 'Failed to update item';
        });

      // ------------------------------------------------------------
      // Delete
      // ------------------------------------------------------------
      builder
        .addCase(deleteThunk.pending, (state) => {
          state.isDeleting = true;
        })
        .addCase(deleteThunk.fulfilled, (state, action) => {
          state.isDeleting = false;
          const id = action.payload;

          // Remove from list
          if (state.list.data) {
            state.list.data.items = state.list.data.items.filter((e) => e.id !== id);
            state.list.data.total -= 1;
          }

          // Remove from cache
          if (enableCache) {
            delete state.byId[id];
          }

          // Clear selection if this was selected
          if (state.selectedId === id) {
            state.selectedId = null;
          }
        })
        .addCase(deleteThunk.rejected, (state, action) => {
          state.isDeleting = false;
          state.list.error = action.error.message || 'Failed to delete item';
        });

      // ------------------------------------------------------------
      // Delete Many
      // ------------------------------------------------------------
      builder
        .addCase(deleteManyThunk.pending, (state) => {
          state.isDeleting = true;
        })
        .addCase(deleteManyThunk.fulfilled, (state, action) => {
          state.isDeleting = false;
          const ids = action.payload;

          // Remove from list
          if (state.list.data) {
            state.list.data.items = state.list.data.items.filter((e) => !ids.includes(e.id));
            state.list.data.total -= ids.length;
          }

          // Remove from cache
          if (enableCache) {
            ids.forEach((id) => delete state.byId[id]);
          }

          // Clear selection if selected was deleted
          if (state.selectedId && ids.includes(state.selectedId)) {
            state.selectedId = null;
          }
        })
        .addCase(deleteManyThunk.rejected, (state, action) => {
          state.isDeleting = false;
          state.list.error = action.error.message || 'Failed to delete items';
        });
    },
  });

  // ============================================================
  // Selectors
  // ============================================================

  const selectList = (state: RootState) => state[name as keyof RootState] as CrudState<TEntity>?.list;
  const selectById = (state: RootState, id: string) =>
    (state[name as keyof RootState] as CrudState<TEntity>)?.byId[id];
  const selectPagination = (state: RootState) =>
    (state[name as keyof RootState] as CrudState<TEntity>)?.pagination;
  const selectSelectedId = (state: RootState) =>
    (state[name as keyof RootState] as CrudState<TEntity>)?.selectedId;
  const selectIsDeleting = (state: RootState) =>
    (state[name as keyof RootState] as CrudState<TEntity>)?.isDeleting;
  const selectIsUpdating = (state: RootState) =>
    (state[name as keyof RootState] as CrudState<TEntity>)?.isUpdating;
  const selectIsCreating = (state: RootState) =>
    (state[name as keyof RootState] as CrudState<TEntity>)?.isCreating;
  const selectItems = (state: RootState) => selectList(state)?.data?.items || [];
  const selectTotal = (state: RootState) => selectList(state)?.data?.total || 0;
  const selectIsLoading = (state: RootState) => selectList(state)?.isLoading || false;
  const selectError = (state: RootState) => selectList(state)?.error || null;

  // ============================================================
  // Return Result
  // ============================================================

  return {
    reducer: slice.reducer,
    name,
    thunks: {
      fetch: fetchThunk,
      fetchById: fetchByIdThunk,
      create: createThunk,
      update: updateThunk,
      delete: deleteThunk,
      deleteMany: deleteManyThunk,
    },
    actions: {
      setPagination: slice.actions.setPagination,
      setPage: slice.actions.setPage,
      setPageSize: slice.actions.setPageSize,
      setSearch: slice.actions.setSearch,
      setSorting: slice.actions.setSorting,
      setSelectedId: slice.actions.setSelectedId,
      clearSelectedId: slice.actions.clearSelectedId,
      clearErrors: slice.actions.clearErrors,
      resetState: slice.actions.resetState,
    },
    selectors: {
      selectList,
      selectById,
      selectPagination,
      selectSelectedId,
      selectIsDeleting,
      selectIsUpdating,
      selectIsCreating,
      selectItems,
      selectTotal,
      selectIsLoading,
      selectError,
    },
  };
}

/**
 * Type helper to extract the state from a CrudSliceResult
 */
export type CrudStateFromSlice<TSliceResult> = TSliceResult extends CrudSliceResult<
  infer TEntity,
  any,
  any
>
  ? CrudState<TEntity>
  : never;
