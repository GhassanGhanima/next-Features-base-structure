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
│   └── ui/                # Reusable UI components (Button, Card, Input)
├── features/              # Feature-based modules (core pattern)
│   ├── auth/              # Authentication feature
│   ├── posts/             # Posts feature
│   └── shared/            # Shared feature components
├── lib/                   # Utility functions
│   ├── api.ts             # fetcher wrapper
│   └── utils.ts           # cn(), formatDate(), truncate()
├── types/                 # Global type definitions
└── tailwind.config.ts     # Tailwind with sharedClasses export
```

### Feature Pattern

Each feature in `src/features/` follows this structure:

```
feature-name/
├── components/            # Feature-specific components
├── hooks/                 # Feature-specific React hooks
├── services/              # API calls / business logic
├── types/                 # Feature-specific TypeScript types
└── index.ts               # Public API exports
```

**Example**: `src/features/posts/hooks/use-posts.ts` uses `src/features/posts/services/posts.ts` to fetch data and returns typed `Post[]`.

**Key pattern**: Export from `index.ts` files. Import from `@/features/feature-name/section`, not from nested paths.

### Styling

- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **Custom config**: `tailwind.config.ts` includes:
  - Extended color palette (primary, secondary, accent, neutral, success, warning, error)
  - Spacing, typography, shadows, animations, z-index scales
  - **`sharedClasses` export**: Pre-configured class strings for consistent styling
- **Utility**: `cn()` from `@/lib/utils` merges clsx + tailwind-merge
- **Dark mode**: Uses `class` strategy (add `dark` class to `<html>`)

### Data Fetching

Use the `fetcher<T>()` from `@/lib/api` for API calls:

```typescript
import { fetcher } from '@/lib/api';

const data = await fetcher<Post>('/api/posts', { method: 'GET' });
```

Base URL comes from `NEXT_PUBLIC_API_URL` env var.

### Type Definitions

- Global types in `src/types/global.ts`:
  - `ApiResponse<T>` - Standard API response wrapper
  - `PaginatedResponse<T>` - Paginated data
  - `ApiError` - Error shape

### Path Aliases

Configured in `tsconfig.json`:
- `@/*` → `./src/*`

Prefer `@/features/...` or `@/lib/...` over relative paths.

### Authentication

NextAuth.js v4 configured at `src/app/api/auth/[...nextauth]/route.ts`. Auth feature includes:
- `useAuth()` hook in `src/features/auth/hooks/`
- Sign-in component in `src/features/auth/components/`
