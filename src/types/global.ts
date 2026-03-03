export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// ============================================================
// Redux State Management Types
// ============================================================

/**
 * Standard async state pattern for Redux slices
 * Tracks loading, data, error, and last update timestamp
 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

/**
 * Initial state for AsyncState
 */
export const initialAsyncState = {
  data: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
} as const;

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

/**
 * Default pagination parameters
 */
export const defaultPagination: PaginationParams = {
  page: 1,
  pageSize: 10,
};

/**
 * Paginated list response structure
 */
export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * CRUD operation types
 */
export type CrudOperation = 'create' | 'read' | 'update' | 'delete' | 'list';

/**
 * API request configuration options
 */
export interface ApiRequestConfig {
  showGlobalLoading?: boolean;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * Entity state pattern for normalized data
 * Useful for managing collections of entities by ID
 */
export interface EntityState<T> {
  byId: Record<string, T>;
  allIds: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Create an empty entity state
 */
export const createEmptyEntityState = <T>(): EntityState<T> => ({
  byId: {},
  allIds: [],
  isLoading: false,
  error: null,
});
