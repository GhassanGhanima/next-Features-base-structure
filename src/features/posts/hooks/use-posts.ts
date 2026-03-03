import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { PaginationParams } from '@/types/global';
import {
  fetchPosts,
  fetchPostById,
  setPagination,
  setPage,
  setPageSize,
  setSearch,
  setSorting,
  createPost,
  updatePost,
  deletePost,
  deleteManyPosts,
  clearListError,
  resetPostsState,
  selectPostsItems,
  selectPostsTotal,
  selectPostsIsLoading,
  selectPostsError,
  selectPostsPagination,
  selectIsUpdating,
  selectIsDeleting,
} from '../redux';
import type { CreatePostInput, UpdatePostInput } from '../types';

/**
 * Hook for posts list with pagination
 *
 * @example
 * const { posts, isLoading, fetch, changePage, changePageSize, search } = usePosts();
 */
export function usePosts(initialFetch = true) {
  const dispatch = useAppDispatch();

  // Selectors
  const items = useAppSelector(selectPostsItems);
  const total = useAppSelector(selectPostsTotal);
  const isLoading = useAppSelector(selectPostsIsLoading);
  const error = useAppSelector(selectPostsError);
  const pagination = useAppSelector(selectPostsPagination);
  const isUpdating = useAppSelector(selectIsUpdating);
  const isDeleting = useAppSelector(selectIsDeleting);

  // Fetch posts with current pagination
  const fetch = useCallback(
    (params?: Partial<PaginationParams>) => {
      dispatch(fetchPosts({ ...pagination, ...params }));
    },
    [dispatch, pagination]
  );

  // Initial fetch
  useEffect(() => {
    if (initialFetch && !items.length && !isLoading) {
      fetch();
    }
  }, [initialFetch, items.length, isLoading, fetch]);

  // Pagination helpers
  const changePage = useCallback(
    (page: number) => {
      dispatch(setPage(page));
      dispatch(fetchPosts({ ...pagination, pageNumber: page }));
    },
    [dispatch, pagination]
  );

  const changePageSize = useCallback(
    (pageSize: number) => {
      dispatch(setPageSize(pageSize));
      dispatch(fetchPosts({ ...pagination, pageSize, pageNumber: 1 }));
    },
    [dispatch, pagination]
  );

  const nextPage = useCallback(() => {
    const totalPages = Math.ceil(total / pagination.pageSize);
    if (pagination.page < totalPages) {
      changePage(pagination.page + 1);
    }
  }, [pagination.page, pagination.pageSize, total, changePage]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      changePage(pagination.page - 1);
    }
  }, [pagination.page, changePage]);

  // Search helper
  const search = useCallback(
    (searchQuery: string) => {
      dispatch(setSearch(searchQuery));
      dispatch(fetchPosts({ ...pagination, searchTerm: searchQuery, pageNumber: 1 }));
    },
    [dispatch, pagination]
  );

  // Sort helper
  const sort = useCallback(
    (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
      dispatch(setSorting({ sortBy, sortOrder }));
      dispatch(fetchPosts({ ...pagination, sortBy, sortOrder }));
    },
    [dispatch, pagination]
  );

  // Refresh helper (refetch with current params)
  const refresh = useCallback(() => {
    dispatch(fetchPosts(pagination));
  }, [dispatch, pagination]);

  // CRUD operations
  const create = useCallback(
    (data: CreatePostInput) => dispatch(createPost(data as any)),
    [dispatch]
  );

  const update = useCallback(
    (id: string, data: UpdatePostInput) => dispatch(updatePost({ id, data })),
    [dispatch]
  );

  const remove = useCallback(
    (id: string) => dispatch(deletePost(id)),
    [dispatch]
  );

  const removeMany = useCallback(
    (ids: string[]) => dispatch(deleteManyPosts(ids)),
    [dispatch]
  );

  // Clear error
  const clearError = useCallback(() => {
    dispatch(clearListError());
  }, [dispatch]);

  // Reset state
  const reset = useCallback(() => {
    dispatch(resetPostsState());
  }, [dispatch]);

  return {
    // Data
    posts: items,
    total,
    pagination,
    totalPages: Math.ceil(total / pagination.pageSize),
    hasMore: pagination.page < Math.ceil(total / pagination.pageSize),

    // Loading states
    isLoading,
    isUpdating,
    isDeleting,
    isBusy: isLoading || isUpdating || isDeleting,

    // Error
    error,

    // Actions
    fetch,
    refresh,
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
    clearError,
    reset,
  };
}

/**
 * Hook for a single post by ID
 *
 * @example
 * const { post, isLoading, fetch } = usePost('123');
 */
export function usePost(id: string | undefined) {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPostsItems);
  const isLoading = useAppSelector(selectPostsIsLoading);
  const error = useAppSelector(selectPostsError);

  const post = posts.find(p => p.id === id) || null;

  const fetch = useCallback(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, id]);

  return {
    post,
    isLoading,
    error,
    fetch,
  };
}

/**
 * Hook for posts selection (for bulk operations)
 *
 * @example
 * const { selectedIds, toggle, isSelected, selectAll, deselectAll } = usePostsSelection();
 */
export function usePostsSelection() {
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

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectPage = useCallback(
    (items: Array<{ id: string }>) => {
      setSelectedIds(new Set(items.map((p) => p.id)));
    },
    []
  );

  return {
    selectedIds: Array.from(selectedIds),
    selectedCount: selectedIds.size,
    toggle,
    isSelected,
    selectAll,
    deselectAll,
    selectPage,
    isAllSelected: (items: Array<{ id: string }>) =>
      items.length > 0 && items.every((item) => selectedIds.has(item.id)),
    isSomeSelected: (items: Array<{ id: string }>) =>
      items.some((item) => selectedIds.has(item.id)),
  };
}
