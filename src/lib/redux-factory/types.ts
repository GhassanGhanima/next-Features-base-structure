import type { PaginationParams } from '@/core/api';
import type { AsyncThunk } from '@reduxjs/toolkit';

/**
 * Generic entity must have an id field
 */
export type EntityWithId = { id: string | number };

/**
 * Simplified state structure for a CRUD feature
 */
export interface CrudState<T extends EntityWithId> {
  items: T[];
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
 * Configuration for creating a CRUD slice
 */
export interface CrudSliceConfig {
  name: string;
  endpoint: string;
  initialState?: Partial<CrudState<any>>;
}

/**
 * Result object returned by createCrudSlice
 */
export interface CrudSliceResult<T extends EntityWithId> {
  reducer: (state: CrudState<T> | undefined, action: any) => CrudState<T>;
  actions: {
    setPage: (payload: number) => { payload: number; type: string };
    setPageSize: (payload: number) => { payload: number; type: string };
    setSearch: (payload: string) => { payload: string; type: string };
    setSorting: (payload: { sortBy: string; sortOrder: 'asc' | 'desc' }) => { payload: { sortBy: string; sortOrder: 'asc' | 'desc' }; type: string };
    clearErrors: () => { type: string };
    resetState: () => { type: string };
  };
  thunks: {
    fetch: any;
    fetchById: any;
    create: any;
    update: any;
    delete: any;
    deleteMany: any;
  };
}
