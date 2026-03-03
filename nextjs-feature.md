# Template 04 — Next.js Feature-Based
> KeyLife Software House | Version 1.0
> Stack: Next.js 15 · App Router · TypeScript · Server Components · Server Actions · Prisma/Drizzle · Zod · Zustand · Tailwind · Vitest · Playwright

---

## Table of Contents
1. [When to Use](#1-when-to-use)
2. [Architecture Decisions](#2-architecture-decisions)
3. [Solution Structure](#3-solution-structure)
4. [Step-by-Step Build Guide](#4-step-by-step-build-guide)
5. [Module System](#5-module-system)
6. [Feature Guide](#6-feature-guide)
7. [Configuration Reference](#7-configuration-reference)
8. [Checklists](#8-checklists)
9. [Claude Rules](#9-claude-rules)

---

## 1. When to Use

| Scenario | Use This Template |
|---|---|
| Public-facing website with SEO | ✅ |
| Customer portal (mixed SSR/SPA) | ✅ |
| Marketing site + dashboard in one | ✅ |
| E-commerce storefront | ✅ |
| Rapid full-stack product | ✅ |
| Admin-only back-office | ❌ Use Angular template |
| Complex enterprise internal tool | ❌ Use Angular + .NET template |

---

## 2. Architecture Decisions

### Server-First Rule
```
Default: Server Component (async, fetch data directly, no bundle impact)
Upgrade to Client Component ONLY when needing:
  - useState / useReducer
  - useEffect
  - Browser APIs (window, localStorage)
  - Event listeners
  - Third-party client-only libraries
```

### Rendering Strategy Per Use Case
| Page Type | Strategy | Why |
|---|---|---|
| Landing / marketing | Static (SSG) | Best performance, CDN cache |
| Blog / docs | Static + ISR | Fresh content, fast |
| User dashboard | Dynamic Server Component | User-specific, no cache |
| Product list | Static + ISR | Fast, refreshes on schedule |
| User data mutations | Server Actions | Type-safe, no API route needed |
| Real-time features | Client Component + SWR | Live updates |
| External API proxy | Route Handler | Protect keys, custom logic |

### Feature Isolation Rule
```
Feature A NEVER imports from Feature B's internals
Correct: import { UserCard } from '@/features/users'  (barrel)
Wrong:   import { UserCard } from '@/features/users/components/UserCard'
```

---

## 3. Solution Structure

```
{AppName}/
│
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (auth)/                       # Route group — no layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/                  # Route group — shared layout
│   │   │   ├── layout.tsx                # Dashboard layout (sidebar, header)
│   │   │   ├── page.tsx                  # /  → dashboard home
│   │   │   └── [feature]/                # e.g. /products, /users
│   │   │       └── page.tsx              # Thin — just mounts Feature component
│   │   │
│   │   ├── api/                          # Route Handlers (BFF / webhooks)
│   │   │   └── [feature]/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx                    # Root layout
│   │   └── globals.css
│   │
│   ├── features/                         # ALL business logic here
│   │   └── {feature-name}/
│   │       ├── index.ts                  # Barrel — public API only
│   │       ├── components/
│   │       │   ├── {Feature}Page.tsx         # Smart: data fetching (server)
│   │       │   ├── {Feature}List.tsx          # Presentational
│   │       │   ├── {Feature}Form.tsx          # Client component (interactive)
│   │       │   └── {Feature}Card.tsx          # Presentational
│   │       ├── hooks/
│   │       │   ├── use-{feature}.ts           # Client-side data hook
│   │       │   └── use-{feature}-form.ts      # Form state hook
│   │       ├── server/
│   │       │   ├── {feature}.actions.ts       # Server Actions (mutations)
│   │       │   ├── {feature}.queries.ts       # DB queries (server-only)
│   │       │   └── {feature}.service.ts       # Business logic (server-only)
│   │       ├── store/
│   │       │   └── {feature}.store.ts         # Zustand (client state only)
│   │       ├── types/
│   │       │   └── {feature}.types.ts
│   │       ├── schemas/
│   │       │   └── {feature}.schema.ts        # Zod — shared client + server
│   │       └── __tests__/
│   │           ├── {feature}.actions.test.ts
│   │           └── {Feature}Page.test.tsx
│   │
│   ├── core/
│   │   ├── auth/
│   │   │   ├── auth.config.ts             # NextAuth config
│   │   │   └── auth.ts                    # Auth helpers
│   │   ├── db/
│   │   │   ├── client.ts                  # Prisma client singleton
│   │   │   └── schema.prisma              # or Drizzle schema
│   │   ├── api/
│   │   │   ├── api-client.ts              # Typed fetch (client-side)
│   │   │   └── api-response.ts            # Response helpers
│   │   └── config/
│   │       └── env.ts                     # Type-safe env (T3 env style)
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/                        # shadcn/ui components
│   │   │   ├── layout/
│   │   │   └── feedback/                  # Loading, Error, Empty states
│   │   ├── hooks/
│   │   │   ├── use-debounce.ts
│   │   │   └── use-pagination.ts
│   │   └── utils/
│   │       ├── cn.ts                      # className utility
│   │       └── format.ts
│   │
│   └── middleware.ts                      # Auth + i18n routing
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── TEMPLATE.md
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 4. Step-by-Step Build Guide

### Step 1 — Create Project

```bash
npx create-next-app@latest {app-name} \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd {app-name}

# Core dependencies
npm install next-auth@beta              # auth
npm install prisma @prisma/client       # DB ORM
npm install zod                         # validation
npm install zustand                     # client state
npm install @t3-oss/env-nextjs          # type-safe env
npm install @upstash/ratelimit          # rate limiting
npm install sharp                       # image optimization

# UI
npm install class-variance-authority clsx tailwind-merge  # shadcn prerequisites
npx shadcn@latest init

# Dev dependencies
npm install -D vitest @vitejs/plugin-react
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test
npm install -D @types/node

# Init Prisma
npx prisma init --datasource-provider mysql
```

### Step 2 — Environment Configuration (type-safe)

**File: `src/core/config/env.ts`**
```typescript
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV:         z.enum(['development', 'staging', 'production']),
    DATABASE_URL:     z.string().url(),
    NEXTAUTH_SECRET:  z.string().min(32),
    NEXTAUTH_URL:     z.string().url(),

    // Optional modules
    REDIS_URL:          z.string().url().optional(),
    UPLOADTHING_SECRET: z.string().optional(),
    SMTP_HOST:          z.string().optional(),
    SMTP_PORT:          z.coerce.number().optional(),
    SMTP_USER:          z.string().optional(),
    SMTP_PASS:          z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL:  z.string().url(),
    NEXT_PUBLIC_APP_NAME: z.string().default('App'),
  },
  runtimeEnv: {
    NODE_ENV:             process.env.NODE_ENV,
    DATABASE_URL:         process.env.DATABASE_URL,
    NEXTAUTH_SECRET:      process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL:         process.env.NEXTAUTH_URL,
    REDIS_URL:            process.env.REDIS_URL,
    UPLOADTHING_SECRET:   process.env.UPLOADTHING_SECRET,
    SMTP_HOST:            process.env.SMTP_HOST,
    SMTP_PORT:            process.env.SMTP_PORT,
    SMTP_USER:            process.env.SMTP_USER,
    SMTP_PASS:            process.env.SMTP_PASS,
    NEXT_PUBLIC_APP_URL:  process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
});
```

### Step 3 — Database Setup (Prisma)

**File: `prisma/schema.prisma`**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// Base fields added to all models
// Prisma doesn't support inheritance but we document this as a standard

model Product {
  id          String   @id @default(cuid())
  name        String   @db.VarChar(200)
  description String?  @db.Text
  price       Decimal  @db.Decimal(18, 4)
  stock       Int      @default(0)
  isActive    Boolean  @default(true)

  // Audit — add to ALL models
  createdBy   String
  createdAt   DateTime @default(now())
  updatedBy   String?
  updatedAt   DateTime @updatedAt
  deletedBy   String?
  deletedAt   DateTime?    // soft delete

  @@index([name])
  @@index([deletedAt])
  @@map("products")
}
```

```bash
# Migration commands
npx prisma migrate dev --name init          # create + apply migration (dev)
npx prisma migrate deploy                   # apply in production
npx prisma studio                           # visual DB browser
npx prisma generate                         # regenerate client after schema change
npx prisma db push                          # push schema without migration (prototyping)
```

**File: `src/core/db/client.ts`**
```typescript
import { PrismaClient } from '@prisma/client';

// Singleton pattern — prevents multiple connections in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

### Step 4 — Authentication (NextAuth v5)

**File: `src/core/auth/auth.config.ts`**
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '../db/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = z.object({
          email:    z.string().email(),
          password: z.string().min(1),
        }).safeParse(credentials);

        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email, deletedAt: null },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role; }
      return token;
    },
    session({ session, token }) {
      if (token) { session.user.id = token.id as string; session.user.role = token.role as string; }
      return session;
    },
  },
  pages: { signIn: '/login' },
});
```

**File: `src/middleware.ts`**
```typescript
import { auth } from './core/auth/auth.config';
import { NextResponse } from 'next/server';

export default auth(req => {
  const isPublic = req.nextUrl.pathname.startsWith('/login') ||
                   req.nextUrl.pathname.startsWith('/register');

  if (!req.auth && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (req.auth && isPublic) {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Step 5 — Shared API Response (matches backend)

**File: `src/core/api/api-response.ts`**
```typescript
// Standard response contract — matches .NET / Node.js backends

export type ApiResponse<T> = {
  succeeded: boolean;
  message?: string;
  statusCode: number;
  data?: T;
  brokenRules?: ValidationError[];
};

export type PagedResult<T> = {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ValidationError = {
  propertyName: string;
  message: string;
};

// Server Action result type
export type ActionResult<T = void> =
  | { success: true;  data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

### Step 6 — Root Layout & App Setup

**File: `src/app/layout.tsx`**
```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`, default: process.env.NEXT_PUBLIC_APP_NAME! },
  description: 'Your app description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

---

## 5. Module System

### How to Add a Module

Modules are feature additions toggled via `.env` variables.

### Module: File Upload (UploadThing)

```bash
npm install uploadthing @uploadthing/react
```

```typescript
// src/core/upload/uploadthing.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '../auth/auth.config';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error('Unauthorized');
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, userId: metadata.userId };
    }),
} satisfies FileRouter;
```

### Module: Email (React Email + Nodemailer)

```bash
npm install nodemailer react-email @react-email/components
```

```typescript
// src/core/email/email.service.ts
import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

export async function sendEmail({ to, subject, html }: {
  to: string; subject: string; html: string;
}) {
  await transporter.sendMail({ from: env.SMTP_USER, to, subject, html });
}
```

### Module: Rate Limiting (Upstash Redis)

```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
// src/core/rate-limit/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

// Usage in Server Action or Route Handler:
// const { success } = await rateLimiter.limit(ip);
// if (!success) return { success: false, error: 'Too many requests' };
```

---

## 6. Feature Guide

### Step-by-Step: Adding Any New Feature

```
Every feature follows this exact order:
1. Types + Zod schemas
2. DB queries (server-only)
3. Server Actions (mutations)
4. Server Component (page, fetches data)
5. Client Components (interactive parts)
6. Hook (if client-side data needed)
7. Register page.tsx in app/(dashboard)/
8. Barrel export in index.ts
```

#### Complete Feature Example: "Products"

```typescript
// ── 1. Types + Schemas ────────────────────────────────────────
// src/features/products/types/product.types.ts
export type Product = {
  id:          string;
  name:        string;
  description: string | null;
  price:       number;
  stock:       number;
  isActive:    boolean;
  createdAt:   Date;
};

export type ProductListParams = {
  pageNumber?: number;
  pageSize?:   number;
  searchTerm?: string;
  isActive?:   boolean;
};

// src/features/products/schemas/product.schema.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name:        z.string().min(1, 'Name is required').max(200),
  description: z.string().max(1000).optional(),
  price:       z.coerce.number().positive('Price must be positive'),
  stock:       z.coerce.number().int().min(0),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ── 2. DB Queries (server-only) ───────────────────────────────
// src/features/products/server/product.queries.ts
import 'server-only';   // IMPORTANT — prevents import in client components
import { db } from '@/core/db/client';
import type { ProductListParams } from '../types/product.types';

export async function getProducts(params: ProductListParams) {
  const page     = Math.max(1, params.pageNumber ?? 1);
  const pageSize = Math.min(params.pageSize ?? 20, 100);
  const skip     = (page - 1) * pageSize;

  const where = {
    deletedAt: null,
    isActive:  params.isActive,
    name:      params.searchTerm ? { contains: params.searchTerm } : undefined,
  };

  const [data, totalItems] = await Promise.all([
    db.product.findMany({
      where,
      skip,
      take:    pageSize,
      orderBy: { createdAt: 'desc' },
      select:  { id: true, name: true, price: true, stock: true, isActive: true },
    }),
    db.product.count({ where }),
  ]);

  return {
    data,
    totalItems,
    pageNumber: page,
    pageSize,
    totalPages: Math.ceil(totalItems / pageSize),
    hasNextPage:     page < Math.ceil(totalItems / pageSize),
    hasPreviousPage: page > 1,
  };
}

export async function getProductById(id: string) {
  return db.product.findFirst({ where: { id, deletedAt: null } });
}

// ── 3. Server Actions (mutations) ─────────────────────────────
// src/features/products/server/product.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/core/auth/auth.config';
import { db } from '@/core/db/client';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import type { ActionResult } from '@/core/api/api-response';

export async function createProductAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  // 1. Auth check — always first
  const session = await auth();
  if (!session?.user) return { success: false, error: 'Unauthorized' };

  // 2. Validate
  const parsed = createProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 3. Business logic
  const product = await db.product.create({
    data: {
      ...parsed.data,
      createdBy: session.user.id,
    },
  });

  // 4. Revalidate cache
  revalidatePath('/products');

  return { success: true, data: { id: product.id } };
}

export async function updateProductAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: 'Unauthorized' };

  const parsed = updateProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const existing = await db.product.findFirst({ where: { id, deletedAt: null } });
  if (!existing) return { success: false, error: 'Product not found' };

  await db.product.update({
    where: { id },
    data: { ...parsed.data, updatedBy: session.user.id },
  });

  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  return { success: true };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: 'Unauthorized' };

  await db.product.update({
    where: { id },
    data: { deletedAt: new Date(), deletedBy: session.user.id },
  });

  revalidatePath('/products');
  return { success: true };
}

// ── 4. Server Component (page — fetches data) ─────────────────
// src/features/products/components/ProductsPage.tsx
import { Suspense } from 'react';
import { getProducts } from '../server/product.queries';
import { ProductsList } from './ProductsList';
import { ProductsListSkeleton } from './ProductsListSkeleton';
import type { ProductListParams } from '../types/product.types';

// This is a SERVER component — no 'use client' — runs on server only
interface Props {
  searchParams: ProductListParams;
}

export async function ProductsPage({ searchParams }: Props) {
  const result = await getProducts(searchParams);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <a href="/products/new" className="btn-primary">Add Product</a>
      </div>

      <Suspense fallback={<ProductsListSkeleton />}>
        <ProductsList initialData={result} />
      </Suspense>
    </div>
  );
}

// ── 5. Client Components (interactive) ────────────────────────
// src/features/products/components/ProductsList.tsx
'use client';

import { useState, useTransition } from 'react';
import { deleteProductAction } from '../server/product.actions';
import type { Product } from '../types/product.types';
import type { PagedResult } from '@/core/api/api-response';

interface Props {
  initialData: PagedResult<Pick<Product, 'id' | 'name' | 'price' | 'stock' | 'isActive'>>;
}

export function ProductsList({ initialData }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteProductAction(id);
      if (!result.success) alert(result.error);
    });
  }

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-start p-3">Name</th>
            <th className="text-start p-3">Price</th>
            <th className="text-start p-3">Stock</th>
            <th className="text-start p-3">Status</th>
            <th className="text-start p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {initialData.data.map(product => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{product.name}</td>
              <td className="p-3">${product.price}</td>
              <td className="p-3">{product.stock}</td>
              <td className="p-3">{product.isActive ? 'Active' : 'Inactive'}</td>
              <td className="p-3 flex gap-2">
                <a href={`/products/${product.id}`} className="btn-sm">Edit</a>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={isPending}
                  className="btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Form Component (client — handles submission) ───────────────
// src/features/products/components/ProductForm.tsx
'use client';

import { useActionState } from 'react';
import { createProductAction, updateProductAction } from '../server/product.actions';
import type { Product } from '../types/product.types';

interface Props {
  product?: Product;
}

export function ProductForm({ product }: Props) {
  const isEdit = Boolean(product);

  const action = isEdit
    ? updateProductAction.bind(null, product!.id)
    : createProductAction;

  const [state, formAction, isPending] = useActionState(action, null);

  function getFieldError(field: string): string | undefined {
    return state?.success === false ? state.fieldErrors?.[field]?.[0] : undefined;
  }

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          name="name"
          defaultValue={product?.name}
          className={`input ${getFieldError('name') ? 'input-error' : ''}`}
        />
        {getFieldError('name') && (
          <p className="text-sm text-red-600 mt-1">{getFieldError('name')}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price *</label>
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price}
          className={`input ${getFieldError('price') ? 'input-error' : ''}`}
        />
        {getFieldError('price') && (
          <p className="text-sm text-red-600 mt-1">{getFieldError('price')}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stock</label>
        <input name="stock" type="number" defaultValue={product?.stock ?? 0} className="input" />
      </div>

      {state?.success === false && !state.fieldErrors && (
        <div className="bg-red-50 text-red-700 p-3 rounded">{state.error}</div>
      )}

      <button type="submit" disabled={isPending} className="btn-primary w-full">
        {isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}

// ── 6. Page wiring ────────────────────────────────────────────
// src/app/(dashboard)/products/page.tsx
import { ProductsPage } from '@/features/products';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Products' };

export default function Page({
  searchParams,
}: {
  searchParams: { pageNumber?: string; searchTerm?: string }
}) {
  return <ProductsPage searchParams={searchParams} />;
}

// src/app/(dashboard)/products/[id]/page.tsx
import { ProductForm } from '@/features/products';
import { getProductById } from '@/features/products/server/product.queries';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();
  return <ProductForm product={product} />;
}

// ── 7. Barrel ─────────────────────────────────────────────────
// src/features/products/index.ts
export { ProductsPage } from './components/ProductsPage';
export { ProductForm }  from './components/ProductForm';
export type { Product, CreateProductInput } from './types/product.types';
// DO NOT export: queries, services, internal utils
```

### Writing Tests

```typescript
// src/features/products/__tests__/product.actions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProductAction } from '../server/product.actions';

// Mock auth
vi.mock('@/core/auth/auth.config', () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: 'user-1', email: 'test@test.com' } }),
}));

// Mock prisma
vi.mock('@/core/db/client', () => ({
  db: {
    product: {
      create: vi.fn().mockResolvedValue({ id: 'prod-1', name: 'Test' }),
    }
  }
}));

describe('createProductAction', () => {
  it('should create product with valid input', async () => {
    const formData = new FormData();
    formData.set('name', 'Test Product');
    formData.set('price', '10.99');
    formData.set('stock', '5');

    const result = await createProductAction(formData);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data?.id).toBe('prod-1');
  });

  it('should return validation error for missing name', async () => {
    const formData = new FormData();
    formData.set('price', '10.99');

    const result = await createProductAction(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.name).toBeDefined();
    }
  });
});
```

---

## 7. Configuration Reference

**`.env.local`**
```bash
# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MyApp

# Database
DATABASE_URL="mysql://root:@localhost:3306/myapp_db"

# Auth
NEXTAUTH_SECRET=replace-with-minimum-32-character-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Optional — add when module enabled
REDIS_URL=
UPLOADTHING_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

**`next.config.ts`**
```typescript
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.uploadthing.com' },
    ],
  },
  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options',           value: 'DENY' },
        { key: 'X-Content-Type-Options',    value: 'nosniff' },
        { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],
};

export default config;
```

---

## 8. Checklists

### New Feature
- [ ] Types defined in `types/`
- [ ] Zod schemas in `schemas/` (shared client + server)
- [ ] DB queries in `server/` with `import 'server-only'`
- [ ] Server Actions in `server/` — auth check first, then validate, then act
- [ ] Server Component for page (async, fetches data)
- [ ] Client Components only where interactivity needed (`'use client'`)
- [ ] Route registered in `app/(dashboard)/` or `app/(auth)/`
- [ ] Barrel export in `index.ts`
- [ ] Tests for Server Actions

### New DB Model (Prisma)
- [ ] Add model to `prisma/schema.prisma`
- [ ] Include all audit fields: createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt
- [ ] Run `npx prisma migrate dev --name add_{model}`
- [ ] Run `npx prisma generate`

### Pre-Deployment
- [ ] All `.env` vars set in production environment
- [ ] `DATABASE_URL` points to production DB
- [ ] `NEXTAUTH_SECRET` is strong and set
- [ ] `NEXT_PUBLIC_APP_URL` is production URL
- [ ] Prisma migrations applied: `npx prisma migrate deploy`
- [ ] Bundle size within budget limits

---

## 9. Claude Rules

```
RULES FOR CLAUDE WHEN WORKING ON THIS TEMPLATE:

1.  SERVER-FIRST — default to Server Components. Add 'use client' only when needed.
2.  Features are ISOLATED — import only from feature barrel (index.ts).
3.  Server Actions are the ONLY mutation method — no separate API routes for CRUD.
4.  Server Actions ALWAYS check auth FIRST, then validate, then act.
5.  DB queries in server/ files with 'import server-only' at top.
6.  'use client' components handle UI interaction ONLY — no direct DB access.
7.  Zod schemas live in schemas/ — shared between client and server.
8.  SOFT DELETE — set deletedAt = new Date(), never db.delete().
9.  ALL Prisma models include audit fields (createdBy, createdAt, etc.).
10. Run revalidatePath() after every mutation Server Action.
11. Type ALL form data — use FormData + Zod.parse, never cast manually.
12. ActionResult<T> return type on all Server Actions.
13. Loading state: use Suspense + skeleton components for all async data.
14. Check .env and env.ts for active modules before generating module code.
15. Feature order: Types/Schema → Queries → Actions → Server Page →
    Client Components → Page wiring → Barrel → Tests.
```
