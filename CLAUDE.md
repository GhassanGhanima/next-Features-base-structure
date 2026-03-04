# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server (http://localhost:3000)

# Build & Production
npm run build        # Create production build
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## Architecture

This is a **Next.js 16** app using **App Router** with a **feature-based architecture**. Code is organized by business domain rather than technical layer.

### Project Structure

```
src/
├── app/                    # Next.js App Router (routes)
│   ├── (main)/            # Route group with shared layout (Header/Footer)
│   ├── api/               # API routes
│   └── globals.css
├── components/
│   ├── layout/            # Layout components (Header, Footer)
│   ├── providers/         # Provider components (Redux, etc.)
│   └── ui/
│       ├── mui/           # MUI wrapper components (use in server components)
│       └── [tailwind]     # Tailwind-based UI components
├── core/                  # Core infrastructure
│   ├── api/               # API client (apiClient) and types
│   └── config/            # Environment configuration (Zod-validated)
├── features/              # Feature-based modules (core pattern)
│   ├── auth/              # Authentication feature
│   ├── posts/             # Posts feature (manual Redux implementation)
│   ├── comments/          # Example feature using Redux factory
│   └── shared/            # Shared feature components & UI state
├── lib/                   # Utility functions
│   ├── redux-factory/     # Generic Redux slice/hooks factory
│   └── utils.ts           # cn(), formatDate(), truncate()
├── store/                 # Global Redux store configuration
│   ├── index.ts           # Store setup, root reducer, wrapper
│   └── hooks.ts           # Typed useAppDispatch, useAppSelector
├── theme/                 # MUI theme configuration
│   ├── index.ts           # Main theme with typography, shadows, z-index
│   └── palette.ts         # Colors mapped from Tailwind tokens
├── types/                 # Global type definitions
└── tailwind.config.ts     # Tailwind with sharedClasses export
```

### Feature Pattern

Each feature in `src/features/` follows this structure:

```
feature-name/
├── components/            # Feature-specific components
├── hooks/                 # Feature-specific React hooks
├── redux/                 # Redux slice (manual or factory-generated)
├── services/              # API calls / business logic (wrappers around apiClient)
├── types/                 # Feature-specific TypeScript types
└── index.ts               # Public API exports
```

**Key pattern**: Export from `index.ts` files. Import from `@/features/feature-name/section`, not from nested paths.

---

## Redux + State Management

This project uses **Redux Toolkit** with a **custom factory system** to eliminate code duplication.

### Redux Factory System (IMPORTANT)

**Location**: `src/lib/redux-factory/`

The factory generates complete Redux slices with:
- CRUD operations (create, read, update, delete, deleteMany)
- Pagination (page, pageSize, total)
- Search, sort, filters
- Loading states (isLoading, isCreating, isUpdating, isDeleting)
- Error handling

**Creating a new feature with the factory** (~30 lines total):

```typescript
// 1. Define types
// src/features/users/types/user.types.ts
interface User { id: string; name: string; email: string; }

// 2. Generate Redux slice
// src/features/users/redux/users.slice.ts
import { createCrudSlice } from '@/lib/redux-factory';
export const usersSlice = createCrudSlice({
  name: 'users',
  endpoint: '/users',
});

// 3. Generate hooks
// src/features/users/hooks/index.ts
import { createCrudHooks } from '@/lib/redux-factory';
import { usersSlice } from '../redux/users.slice';
export const { useList: useUsers, useEntity: useUser } = createCrudHooks({
  slice: usersSlice,
  sliceName: 'users',
});

// 4. Add reducer to store (src/store/index.ts)
// users: usersSlice.reducer,

// 5. Use in component
const { items, isLoading, create, update, remove, changePage } = useUsers();
```

**Factory exports**:
- `createCrudSlice(config)` - Generates Redux slice (takes `{ name, endpoint }`)
- `createCrudHooks(config)` - Generates hooks (useList, useEntity)
- `createApiService(endpoint)` - Lightweight wrapper around apiClient (optional)
- `createNestedApiService(getEndpoint)` - For nested resources like `/posts/:id/comments`

### Manual Redux Pattern (Alternative)

Some features (like `posts`) use manual Redux slices instead of the factory. This gives more control but requires more boilerplate. See `src/features/posts/` for an example. The factory is preferred for new features.

### Store Configuration

**File**: `src/store/index.ts`

The store uses:
- Redux Toolkit with `configureStore`
- `next-redux-wrapper` for Next.js SSR compatibility
- Combined reducers from each feature
- Typed hooks (`useAppDispatch`, `useAppSelector`)
- Redux DevTools in development

---

## Data Fetching & API

### API Client

**File**: `src/core/api/api-client.ts`

Singleton `apiClient` handles all HTTP requests:

```typescript
import { apiClient } from '@/core/api';

// Paginated list
const result = await apiClient.getList<Post>('/posts', { pageNumber: 1, pageSize: 10 });
// Returns: { data, pageNumber, pageSize, totalItems, totalPages, hasNextPage, ... }

// Single item
const post = await apiClient.getById<Post>('/posts', '123');

// Create
const newPost = await apiClient.create<Post>('/posts', { title: '...' });

// Update
const updated = await apiClient.update<Post>('/posts', '123', { title: '...' });

// Delete
await apiClient.delete('/posts', '123');
```

The client automatically:
- Includes `auth_token` from localStorage for auth
- Handles JSON serialization
- Throws on error responses

### Environment Configuration

**File**: `src/core/config/env.ts`

Environment variables are validated with Zod:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:3001/api`)

---

## Styling

This project uses a **hybrid approach**: Tailwind CSS + Material UI (MUI).

### Tailwind CSS
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **Custom config**: `tailwind.config.ts` includes extended color palette and sharedClasses
- **Utility**: `cn()` from `@/lib/utils` merges clsx + tailwind-merge
- **Dark mode**: Uses `class` strategy (add `dark` class to `<html>`)

### Material UI (MUI)
- **MUI v7** with Emotion styling
- **Theme**: `src/theme/` maps Tailwind colors to MUI palette
- **Wrapper components**: `src/components/ui/mui/` provides client wrappers for use in server components
- **Available wrappers**: MuiButton, MuiCard, MuiCardContent, MuiCardActions, MuiTextField, MuiTypography, MuiStack, MuiBox, MuiChip, MuiAlert

---

## Type Definitions

**Files**: `src/types/global.ts`, `src/core/api/api-client.ts`

Key types:
- `AsyncState<T>` - Loading state pattern (data, isLoading, error, lastUpdated)
- `PaginationParams` - Pagination parameters (pageNumber, pageSize, searchTerm, sortBy, sortOrder)
- `PagedResult<T>` - Paginated API response (data, pageNumber, pageSize, totalItems, totalPages, hasNextPage, hasPreviousPage)
- `EntityState<T>` - Normalized entity state (byId, allIds, isLoading, error)
- `ApiResponse<T>` - Standard API response wrapper
- `ApiError` - Error shape

---

## Path Aliases

Configured in `tsconfig.json`:
- `@/*` → `./src/*`

Prefer `@/features/...` or `@/lib/...` over relative paths.

---

## Root Layout

**File**: `src/app/layout.tsx`

Wraps the app with:
- `ReduxProvider` - Redux store provider (client component)
- `AppRouterCacheProvider` - MUI Next.js integration
- `ThemeProvider` - MUI theme from `@/theme`
- `CssBaseline` - MUI CSS normalization
