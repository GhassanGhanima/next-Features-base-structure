import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { CrudSliceResult, CrudState, EntityWithId } from './types';

/**
 * Hook configuration
 */
export interface CrudHooksConfig<T extends EntityWithId> {
  slice: CrudSliceResult<T>;
  sliceName: string;
}

/**
 * List hook result
 */
export interface CrudListHookResult<T extends EntityWithId> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isBusy: boolean;
  error: string | null;
  changePage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  remove: (id: string) => Promise<any>;
  removeMany: (ids: string[]) => Promise<any>;
  refresh: () => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Entity hook result
 */
export interface CrudEntityHookResult<T> {
  entity: T | null;
  isLoading: boolean;
  error: string | null;
  fetch: () => void;
}

/**
 * Creates CRUD hooks for a feature
 *
 * @example
 * const { useList: usePosts, useEntity: usePost } = createCrudHooks({
 *   slice: postsSlice,
 *   sliceName: 'posts',
 * });
 */
export function createCrudHooks<T extends EntityWithId>(
  config: CrudHooksConfig<T>
) {
  const { slice, sliceName } = config;

  // ============================================================
  // useList Hook
  // ============================================================

  const useList = (): CrudListHookResult<T> => {
    const dispatch = useAppDispatch();

    const state = useAppSelector((state: any) => state[sliceName]) as CrudState<T>;

    const {
      items,
      total,
      page,
      pageSize,
      isLoading,
      isCreating,
      isUpdating,
      isDeleting,
      error,
    } = state;

    const isBusy = isLoading || isCreating || isUpdating || isDeleting;

    const changePage = useCallback(
      (newPage: number) => {
        dispatch(slice.actions.setPage(newPage));
        dispatch(slice.thunks.fetch({ pageNumber: newPage, pageSize }));
      },
      [dispatch, pageSize]
    );

    const changePageSize = useCallback(
      (newPageSize: number) => {
        dispatch(slice.actions.setPageSize(newPageSize));
        dispatch(slice.thunks.fetch({ pageNumber: 1, pageSize: newPageSize }));
      },
      [dispatch]
    );

    const create = useCallback(
      (data: any) => dispatch(slice.thunks.create(data)),
      [dispatch]
    );

    const update = useCallback(
      (id: string, data: any) => dispatch(slice.thunks.update({ id, data })),
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
      dispatch(slice.thunks.fetch({ pageNumber: page, pageSize }));
    }, [dispatch, page, pageSize]);

    const clearError = useCallback(() => {
      dispatch(slice.actions.clearErrors());
    }, [dispatch]);

    const reset = useCallback(() => {
      dispatch(slice.actions.resetState());
    }, [dispatch]);

    return {
      items,
      total,
      page,
      pageSize,
      isLoading,
      isCreating,
      isUpdating,
      isDeleting,
      isBusy,
      error,
      changePage,
      changePageSize,
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

  const useEntity = (id: string | undefined): CrudEntityHookResult<T> => {
    const dispatch = useAppDispatch();
    const state = useAppSelector((s: any) => s[sliceName]) as CrudState<T>;
    const entity = state.items.find((x: T) => x.id === id) || null;

    const fetch = useCallback(() => {
      if (id) {
        dispatch(slice.thunks.fetchById(id));
      }
    }, [dispatch, id]);

    return {
      entity,
      isLoading: state.isLoading,
      error: state.error,
      fetch,
    };
  };

  // ============================================================
  // Return Result
  // ============================================================

  return {
    useList,
    useEntity,
  };
}
