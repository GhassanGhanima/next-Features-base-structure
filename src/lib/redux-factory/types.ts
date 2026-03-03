import { AsyncState, PaginationParams, PaginatedList, defaultPagination } from '@/types/global';
import type { AsyncThunk, ThunkDispatch } from '@reduxjs/toolkit';

/**
 * Generic entity must have an id field
 */
export type EntityWithId = { id: string | number };

/**
 * State structure for a CRUD feature
 */
export interface CrudState<TEntity extends EntityWithId> {
  // List of entities with pagination
  list: AsyncState<PaginatedList<TEntity>>;

  // Individual entities cached by ID
  byId: Record<string, AsyncState<TEntity>>;

  // Current pagination parameters
  pagination: PaginationParams;

  // Currently selected entity ID
  selectedId: string | null;

  // Bulk operation states
  isDeleting: boolean;
  isUpdating: boolean;
  isCreating: boolean;
}

/**
 * Initial state for a CRUD feature
 */
export const createInitialCrudState = <T extends EntityWithId>(): CrudState<T> => ({
  list: {
    data: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  },
  byId: {},
  pagination: defaultPagination,
  selectedId: null,
  isDeleting: false,
  isUpdating: false,
  isCreating: false,
});

/**
 * Configuration for creating a CRUD slice
 */
export interface CrudSliceConfig<
  TEntity extends EntityWithId,
  TCreateInput,
  TUpdateInput
> {
  /**
   * Name of the feature (used for Redux action types)
   */
  name: string;

  /**
   * API service instance that extends ApiBase
   */
  apiService: {
    list: (params?: PaginationParams) => Promise<PaginatedList<TEntity>>;
    getById: (id: string | number) => Promise<TEntity>;
    create: (data: TCreateInput) => Promise<TEntity>;
    update: (id: string | number, data: TUpdateInput) => Promise<TEntity>;
    delete: (id: string | number) => Promise<void>;
    deleteMany?: (ids: (string | number)[]) => Promise<void>;
  };

  /**
   * Optional initial state overrides
   */
  initialState?: Partial<CrudState<TEntity>>;

  /**
   * Enable entity caching by ID
   * @default true
   */
  enableCache?: boolean;

  /**
   * Enable optimistic updates
   * @default true
   */
  enableOptimisticUpdates?: boolean;

  /**
   * Custom transform functions for API responses
   */
  transforms?: {
    afterCreate?: (entity: TEntity) => TEntity;
    afterUpdate?: (entity: TEntity) => TEntity;
    afterDelete?: (id: string | number) => void;
  };

  /**
   * Custom action name overrides
   */
  actionNames?: {
    fetch?: string;
    fetchById?: string;
    create?: string;
    update?: string;
    delete?: string;
    deleteMany?: string;
  };
}

/**
 * Result object returned by createCrudSlice
 */
export interface CrudSliceResult<
  TEntity extends EntityWithId,
  TCreateInput,
  TUpdateInput
> {
  /**
   * Redux reducer
   */
  reducer: (state: CrudState<TEntity> | undefined, action: any) => CrudState<TEntity>;

  /**
   * Slice name
   */
  name: string;

  /**
   * Async thunks for CRUD operations
   */
  thunks: {
    fetch: AsyncThunk<PaginatedList<TEntity>, PaginationParams | undefined>;
    fetchById: AsyncThunk<TEntity, string>;
    create: AsyncThunk<TEntity, TCreateInput>;
    update: AsyncThunk<TEntity, { id: string | number; data: TUpdateInput }>;
    delete: AsyncThunk<string | number, string | number>;
    deleteMany: AsyncThunk<(string | number)[], (string | number)[]>;
  };

  /**
   * Action creators for synchronous actions
   */
  actions: {
    setPagination: (params: PaginationParams) => { payload: PaginationParams; type: string };
    setPage: (page: number) => { payload: number; type: string };
    setPageSize: (pageSize: number) => { payload: number; type: string };
    setSearch: (search: string) => { payload: string; type: string };
    setSorting: (sorting: { sortBy: string; sortOrder: 'asc' | 'desc' }) => { payload: { sortBy: string; sortOrder: 'asc' | 'desc' }; type: string };
    setSelectedId: (id: string | null) => { payload: string | null; type: string };
    clearSelectedId: () => { type: string };
    clearErrors: () => { type: string };
    resetState: () => { type: string };
  };

  /**
   * Selector functions
   */
  selectors: {
    selectList: (state: Record<string, any>) => AsyncState<PaginatedList<TEntity>>;
    selectById: (state: Record<string, any>, id: string) => AsyncState<TEntity> | undefined;
    selectPagination: (state: Record<string, any>) => PaginationParams;
    selectSelectedId: (state: Record<string, any>) => string | null;
    selectIsDeleting: (state: Record<string, any>) => boolean;
    selectIsUpdating: (state: Record<string, any>) => boolean;
    selectIsCreating: (state: Record<string, any>) => boolean;
    selectItems: (state: Record<string, any>) => TEntity[];
    selectTotal: (state: Record<string, any>) => number;
    selectIsLoading: (state: Record<string, any>) => boolean;
    selectError: (state: Record<string, any>) => string | null;
  };
}

/**
 * Configuration for creating CRUD hooks
 */
export interface CrudHooksConfig<
  TEntity extends EntityWithId,
  TCreateInput,
  TUpdateInput
> {
  /**
   * The CRUD slice result from createCrudSlice
   */
  slice: CrudSliceResult<TEntity, TCreateInput, TUpdateInput>;

  /**
   * Slice name (for Redux state selector)
   */
  sliceName: string;

  /**
   * Custom hook name overrides
   */
  hookNames?: {
    useList?: string;
    useEntity?: string;
    useSelection?: string;
  };
}

/**
 * Result object returned by createCrudHooks
 */
export interface CrudHooksResult {
  /**
   * Hook for list with pagination
   */
  useList: () => CrudListHookResult<any>;

  /**
   * Hook for single entity
   */
  useEntity: (id: string | undefined) => CrudEntityHookResult<any>;

  /**
   * Hook for selection
   */
  useSelection: () => CrudSelectionHookResult;
}

/**
 * Return type for useList hook
 */
export interface CrudListHookResult<TEntity extends EntityWithId> {
  // Data
  items: TEntity[];
  total: number;
  pagination: PaginationParams;
  totalPages: number;
  hasMore: boolean;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isBusy: boolean;

  // Error
  error: string | null;

  // Pagination actions
  changePage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Search & sort
  search: (query: string) => void;
  sort: (sortBy: string, sortOrder?: 'asc' | 'desc') => void;

  // CRUD actions
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  remove: (id: string) => Promise<any>;
  removeMany: (ids: string[]) => Promise<any>;

  // Utility
  refresh: () => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Return type for useEntity hook
 */
export interface CrudEntityHookResult<TEntity extends EntityWithId> {
  entity: TEntity | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  fetch: () => void;
}

/**
 * Return type for useSelection hook
 */
export interface CrudSelectionHookResult {
  selectedIds: string[];
  selectedCount: number;
  toggle: (id: string) => void;
  isSelected: (id: string) => boolean;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;
  selectPage: (items: EntityWithId[]) => void;
  isAllSelected: (items: EntityWithId[]) => boolean;
  isSomeSelected: (items: EntityWithId[]) => boolean;
}

/**
 * API service configuration
 */
export interface ApiServiceConfig<TEntity extends EntityWithId> {
  /**
   * Enable request/response caching
   */
  enableCache?: boolean;

  /**
   * Transform request data before sending
   */
  transformRequest?: (data: any) => any;

  /**
   * Transform response data
   */
  transformResponse?: (data: any) => TEntity;

  /**
   * Default pagination size
   */
  defaultPageSize?: number;

  /**
   * Custom headers
   */
  headers?: Record<string, string>;
}
