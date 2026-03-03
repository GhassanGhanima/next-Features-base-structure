'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';

/**
 * Redux Provider Component
 *
 * Wraps the app with Redux Provider for client-side state management
 * Use this in layout files or _app.tsx
 *
 * @example
 * import { ReduxProvider } from '@/components/providers/ReduxProvider';
 *
 * export default function RootLayout({ children }) {
 *   return <ReduxProvider>{children}</ReduxProvider>;
 * }
 */
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
