'use client';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createWrapper, MakeStore } from 'next-redux-wrapper';
import postsReducer from '@/features/posts/redux/posts.slice';
import { reducer as commentsReducer } from '@/features/comments/redux';
// import authReducer from '@/features/auth/redux/auth.slice';
import uiReducer from '@/features/shared/redux/ui.slice';

const rootReducer = combineReducers({
  posts: postsReducer,
  comments: commentsReducer,
  // auth: authReducer, // Uncomment when auth slice is created
  ui: uiReducer,
});

export const makeStore: MakeStore<any> = (context) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types from next-redux-wrapper
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });

// Singleton store instance for client-side use
// Note: In Next.js 13+ with app directory, we typically don't need a singleton
// The wrapper handles creating the store per request
const configureAppStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types from next-redux-wrapper
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });

export const store = configureAppStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: process.env.NODE_ENV !== 'production',
});
