import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type {
  CrudHooksConfig,
  CrudHooksResult,
  CrudListHookResult,
  CrudEntityHookResult,
  CrudSelectionHookResult,
  EntityWithId,
} from './types';

/**
 * Creates CRUD hooks for a feature
 *
 * @param config - Configuration for the hooks
 * @returns Object with useList, useEntity, and useSelection hooks
 *
 * @example
 * const { useList: usePosts, useEntity: usePost, useSelection } = createCrudHooks({
 *   slice: postsSlice,
 *   sliceName: 'posts',
 * });
 */
export function createCrudHooks<
  TEntity extends EntityWithId,
  TCreateInput,
  TUpdateInput
>(config: CrudHooksConfig<TEntity, TCreateInput, TUpdateInput>): CrudHooksResult {
  const { slice, sliceName, hookNames } = config;

  // ============================================================
  // useList Hook
  // ============================================================

  const useList = (): CrudListHookResult<TEntity> => {
    const dispatch = useAppDispatch();

    // Selectors
    const items = useAppSelector(slice.selectors.selectItems);
    const total = useAppSelector(slice.selectors.selectTotal);
    const isLoading = useAppSelector(slice.selectors.selectIsLoading);
    const isCreating = useAppSelector(slice.selectors.selectIsCreating);
    const isUpdating = useAppSelector(slice.selectors.selectIsUpdating);
    const isDeleting = useAppSelector(slice.selectors.selectIsDeleting);
    const error = useAppSelector(slice.selectors.selectError);
    const pagination = useAppSelector(slice.selectors.selectPagination);

    // Computed values
    const totalPages = Math.ceil(total / pagination.pageSize) || 1;
    const hasMore = pagination.page < totalPages;
    const isBusy = isLoading || isCreating || isUpdating || isDeleting;

    // Actions
    const changePage = useCallback(
      (page: number) => {
        dispatch(slice.actions.setPage(page));
        dispatch(slice.thunks.fetch({ ...pagination, page }));
      },
      [dispatch, pagination]
    );

    const changePageSize = useCallback(
      (pageSize: number) => {
        dispatch(slice.actions.setPageSize(pageSize));
        dispatch(slice.thunks.fetch({ ...pagination, pageSize, page: 1 }));
      },
      [dispatch, pagination]
    );

    const nextPage = useCallback(() => {
      if (pagination.page < totalPages) {
        changePage(pagination.page + 1);
      }
    }, [pagination.page, totalPages, changePage]);

    const prevPage = useCallback(() => {
      if (pagination.page > 1) {
        changePage(pagination.page - 1);
      }
    }, [pagination.page, changePage]);

    const search = useCallback(
      (query: string) => {
        dispatch(slice.actions.setSearch(query));
        dispatch(slice.thunks.fetch({ ...pagination, search: query, page: 1 }));
      },
      [dispatch, pagination]
    );

    const sort = useCallback(
      (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
        dispatch(slice.actions.setSorting({ sortBy, sortOrder }));
        dispatch(slice.thunks.fetch({ ...pagination, sortBy, sortOrder }));
      },
      [dispatch, pagination]
    );

    const create = useCallback(
      (data: TCreateInput) => dispatch(slice.thunks.create(data)),
      [dispatch]
    );

    const update = useCallback(
      (id: string, data: TUpdateInput) => dispatch(slice.thunks.update({ id, data })),
      [dispatch]
    );

    const remove = useCallback(
      (id: string) => dispatch(slice.thunks.delete(id)),
      [dispatch]
    );

    const removeMany = useCallback(
      (ids: string[]) => dispatch(slice.thunks.deleteMany(ids)),
      [dispatch]
    );

    const refresh = useCallback(() => {
      dispatch(slice.thunks.fetch(pagination));
    }, [dispatch, pagination]);

    const clearError = useCallback(() => {
      dispatch(slice.actions.clearErrors());
    }, [dispatch]);

    const reset = useCallback(() => {
      dispatch(slice.actions.resetState());
    }, [dispatch]);

    return {
      items,
      total,
      pagination,
      totalPages,
      hasMore,
      isLoading,
      isCreating,
      isUpdating,
      isDeleting,
      isBusy,
      error,
      changePage,
      changePageSize,
      nextPage,
      prevPage,
      search,
      sort,
      create,
      update,
      remove,
      removeMany,
      refresh,
      clearError,
      reset,
    };
  };

  // ============================================================
  // useEntity Hook
  // ============================================================

  const useEntity = (id: string | undefined): CrudEntityHookResult<TEntity> => {
    const dispatch = useAppDispatch();

    const entityState = useAppSelector((state) =>
      id ? slice.selectors.selectById(state, id) : undefined
    );

    const fetch = useCallback(() => {
      if (id) {
        dispatch(slice.thunks.fetchById(id));
      }
    }, [dispatch, id]);

    return {
      entity: entityState?.data || null,
      isLoading: entityState?.isLoading || false,
      error: entityState?.error || null,
      lastUpdated: entityState?.lastUpdated || null,
      fetch,
    };
  };

  // ============================================================
  // useSelection Hook
  // ============================================================

  const useSelection = (): CrudSelectionHookResult => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toggle = useCallback((id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }, []);

    const isSelected = useCallback(
      (id: string) => selectedIds.has(id),
      [selectedIds]
    );

    const selectAll = useCallback((ids: string[]) => {
      setSelectedIds(new Set(ids));
    }, []);

    const deselectAll = useCallback(() => {
      setSelectedIds(new Set());
    }, []);

    const selectPage = useCallback((items: EntityWithId[]) => {
      setSelectedIds(new Set(items.map((item) => String(item.id))));
    }, []);

    const isAllSelected = useCallback(
      (items: EntityWithId[]) =>
        items.length > 0 && items.every((item) => selectedIds.has(String(item.id))),
      [selectedIds]
    );

    const isSomeSelected = useCallback(
      (items: EntityWithId[]) =>
        items.some((item) => selectedIds.has(String(item.id))),
      [selectedIds]
    );

    return {
      selectedIds: Array.from(selectedIds),
      selectedCount: selectedIds.size,
      toggle,
      isSelected,
      selectAll,
      deselectAll,
      selectPage,
      isAllSelected,
      isSomeSelected,
    };
  };

  // ============================================================
  // Return Result
  // ============================================================

  return {
    useList: hookNames?.useList ? useList : useList,
    useEntity: hookNames?.useEntity ? useEntity : useEntity,
    useSelection: hookNames?.useSelection ? useSelection : useSelection,
  };
}
