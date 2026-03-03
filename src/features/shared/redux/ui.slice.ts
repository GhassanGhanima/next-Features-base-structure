import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Toast notification
 */
export interface Toast {
  id: string;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Modal state
 */
export interface Modal {
  id: string;
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
  onClose?: () => void;
}

/**
 * UI State Interface
 */
interface UiState {
  toasts: Toast[];
  modals: Record<string, Modal>;
  globalLoading: boolean;
  sidebarOpen: boolean;
  isMobile: boolean;
  theme: 'light' | 'dark';
}

/**
 * Initial UI state
 */
const initialState: UiState = {
  toasts: [],
  modals: {},
  globalLoading: false,
  sidebarOpen: true,
  isMobile: false,
  theme: 'light',
};

/**
 * UI Slice - manages global UI state
 * Handles toasts, modals, loading states, sidebar, theme
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toast actions
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const newToast: Toast = {
        ...action.payload,
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      state.toasts.push(newToast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },

    // Modal actions
    openModal: (state, action: PayloadAction<Omit<Modal, 'isOpen'>>) => {
      state.modals[action.payload.id] = {
        ...action.payload,
        isOpen: true,
      };
    },
    closeModal: (state, action: PayloadAction<string>) => {
      if (state.modals[action.payload]) {
        state.modals[action.payload].isOpen = false;
      }
    },
    closeModalAll: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key].isOpen = false;
      });
    },
    removeModal: (state, action: PayloadAction<string>) => {
      delete state.modals[action.payload];
    },

    // Global loading actions
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    showGlobalLoading: (state) => {
      state.globalLoading = true;
    },
    hideGlobalLoading: (state) => {
      state.globalLoading = false;
    },

    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    // Mobile detection
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },

    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

// Export actions
export const {
  addToast,
  removeToast,
  clearToasts,
  openModal,
  closeModal,
  closeModalAll,
  removeModal,
  setGlobalLoading,
  showGlobalLoading,
  hideGlobalLoading,
  toggleSidebar,
  setSidebarOpen,
  setIsMobile,
  setTheme,
  toggleTheme,
} = uiSlice.actions;

// Export selectors
export const selectToasts = (state: { ui: UiState }) => state.ui.toasts;
export const selectModals = (state: { ui: UiState }) => state.ui.modals;
export const selectGlobalLoading = (state: { ui: UiState }) => state.ui.globalLoading;
export const selectSidebarOpen = (state: { ui: UiState }) => state.ui.sidebarOpen;
export const selectIsMobile = (state: { ui: UiState }) => state.ui.isMobile;
export const selectTheme = (state: { ui: UiState }) => state.ui.theme;

// Export reducer
export default uiSlice.reducer;

/**
 * Toast helper - create a success toast
 */
export const createSuccessToast = (message: string, title?: string) => ({
  message,
  title,
  severity: 'success' as const,
  duration: 4000,
});

/**
 * Toast helper - create an error toast
 */
export const createErrorToast = (message: string, title?: string) => ({
  message,
  title,
  severity: 'error' as const,
  duration: 6000,
});

/**
 * Toast helper - create a warning toast
 */
export const createWarningToast = (message: string, title?: string) => ({
  message,
  title,
  severity: 'warning' as const,
  duration: 5000,
});

/**
 * Toast helper - create an info toast
 */
export const createInfoToast = (message: string, title?: string) => ({
  message,
  title,
  severity: 'info' as const,
  duration: 4000,
});
