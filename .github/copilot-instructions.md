# Project Guidelines for AI Agents

Instructions for AI coding agents working on the **My Game List Frontend** project.

## Project Overview

A React 19 + TypeScript frontend for tracking game collections, reviews, and social connections. Feature-based architecture with auto-generated API client from OpenAPI spec.

**Key Technologies:** React 19, TypeScript, Vite, TanStack Query v5, React Router v7, Tailwind CSS + DaisyUI, React Hook Form + Zod, OpenAPI-TS

## Build and Test

```bash
# Development (regenerates API client + starts dev server)
npm run dev

# Production build
npm run build

# Run tests
npm run test

# Coverage report
npm run coverage

# Lint and format
npm run lint
npm run format
```

**Prerequisites:** Ensure `openapi.json` exists in root (auto-copied from `../my-game-list-backend/` on `npm run dev`)

## Code Style

### Import Patterns

- Use `@/` path alias for all internal imports (configured in `tsconfig.json`)
- Import order: React → Third-party → Internal `@/` → Types → Assets
- Features expose public API via index files (e.g., `@/features/auth`)

**Example:**

```typescript
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import type { Game } from "@/client/types.gen";
```

### Component Styling

Use `class-variance-authority` (CVA) for component variants. See [src/components/ui/Button.tsx](src/components/ui/Button.tsx) as reference.

**Pattern:**

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const variants = cva('base-classes', {
  variants: { variant: { primary: '...', secondary: '...' } },
  defaultVariants: { variant: 'primary' }
});

export const Component = forwardRef<HTMLElement, VariantProps<typeof variants>>(
  ({ variant, className, ...props }, ref) => (
    <element ref={ref} className={cn(variants({ variant }), className)} {...props} />
  )
);
Component.displayName = 'Component';
```

- Always use `cn()` utility from [src/utils/cn.ts](src/utils/cn.ts) to merge classes
- Colors: Use semantic CSS variables from [src/css/colors.css](src/css/colors.css) (`primary-*`, `text-*`, `background-*`)
- Responsive: Mobile-first with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- Set `displayName` for all `forwardRef` components

### Form Components

Use React Hook Form + Zod validation. See [src/features/auth/components/LoginForm.tsx](src/features/auth/components/LoginForm.tsx) for reference.

**Pattern:**

```typescript
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters')
});

type FormData = z.infer<typeof schema>;

export const MyForm = () => {
  const methods = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Handle submission
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <TextFieldInput name="email" label="Email" />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
};
```

- Form inputs access context via `useFormContext()` and wrap with `<Controller>`
- Display errors using `FormError` component from [src/components/ui/Form/FormError.tsx](src/components/ui/Form/FormError.tsx)
- Show toast notifications via `react-hot-toast` for user feedback

## Architecture

### Feature-Based Structure

Each feature in `src/features/` is self-contained:

```
src/features/[feature]/
  ├── api/           # API wrapper functions
  ├── components/    # Feature-specific UI
  ├── hooks/         # TanStack Query hooks
  ├── pages/         # Page components
  ├── routes.tsx     # Route definitions
  └── index.ts       # Public exports
```

**Key principles:**

- Features export routes as JSX fragments (see [src/features/games/routes.tsx](src/features/games/routes.tsx))
- Page components use `<PageMeta title="..." />` for SEO
- Protected routes wrapped in `<RequireAuth />` (see [src/features/auth/components/RequireAuth.tsx](src/features/auth/components/RequireAuth.tsx))

### API Integration

**CRITICAL:** `src/client/` contains **GENERATED CODE** - never edit manually. Regenerate via `npm run openapi-ts`.

**API Layer Pattern** (see [src/features/games/api/game.tsx](src/features/games/api/game.tsx)):

```typescript
import { handleApiError } from "@/utils/apiUtils";
import { StatusCode } from "@/utils/StatusCode";
import { getSomeData } from "@/client";

export const fetchSomething = async (id: number) => {
  const { data, response } = await getSomeData({ path: { id } });

  if (!response || response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Failed to fetch data");
  }

  return data;
};
```

- Always use `handleApiError()` from [src/utils/apiUtils.ts](src/utils/apiUtils.ts)
- Compare status codes using constants from [src/utils/StatusCode.ts](src/utils/StatusCode.ts)
- Export query parameter types: `export type MyQueryParams = MyApiData["query"];`

### React Query Patterns

Define hierarchical query keys in [src/lib/queryKeys.ts](src/lib/queryKeys.ts):

```typescript
export const gameKeys = {
  all: ["games"] as const,
  lists: () => [...gameKeys.all, "list"] as const,
  list: (filters: string) => [...gameKeys.lists(), { filters }] as const,
  details: () => [...gameKeys.all, "detail"] as const,
  detail: (id: number) => [...gameKeys.details(), id] as const,
};
```

**Query Hooks** (see [src/features/games/hooks/gameQueries.tsx](src/features/games/hooks/gameQueries.tsx)):

```typescript
export const useGetGame = (id?: number) => {
  return useQuery({
    queryKey: gameKeys.detail(id!),
    queryFn: () => getGameDetail(id!),
    enabled: !!id,
  });
};

// For paginated data
export const useInfiniteGames = (filters?: GameFilters) => {
  return useInfiniteQuery({
    queryKey: gameKeys.list(JSON.stringify(filters)),
    queryFn: ({ pageParam }) => fetchGames({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: lastPage => (lastPage.next ? lastPage.pageNumber + 1 : undefined),
  });
};
```

**Mutations** (use `useAppMutation` from [src/hooks/useAppMutation.ts](src/hooks/useAppMutation.ts)):

```typescript
const mutation = useAppMutation({
  mutationFn: updateGame,
  onSuccess: data => {
    queryClient.invalidateQueries({ queryKey: gameKeys.detail(data.id) });
    toast.success("Game updated");
  },
});
```

- `useAppMutation` automatically shows error toasts
- Always invalidate related queries after mutations
- Use specific invalidation over broad cache clearing

### Authentication & Security

**Token Flow** (see [src/clientSetup.tsx](src/clientSetup.tsx)):

1. JWT tokens stored in `localStorage` (`{ email, token, refreshToken }`)
2. Custom fetch client auto-injects: `Authorization: Bearer ${token}`
3. On 401 response → automatic token refresh → retry request
4. Refresh failure → force logout → redirect to login

**Auth Context** ([src/features/auth/context/AuthProvider.tsx](src/features/auth/context/AuthProvider.tsx)):

- Global user state with `localStorage` persistence
- Custom events (`auth:updated`, `auth:logout`) for cross-tab sync
- Use `useAuth()` hook to access user/login/logout

**Route Protection:**

```tsx
<Route element={<RequireAuth />}>
  <Route path="/profile" element={<ProfilePage />} />
</Route>
```

### Error Handling

- **API errors:** Centralized in `handleApiError()` - parses Django REST Framework responses
- **Form errors:** Displayed via `FormError` component
- **User feedback:** `react-hot-toast` positioned at `bottom-right`
- **Error formats handled:**
  - String errors
  - `{ detail: "..." }`
  - Field validation: `{ "field": ["error message"] }`

## Project Conventions

### Page Components

See [src/features/games/pages/HomePage.tsx](src/features/games/pages/HomePage.tsx) for reference:

```typescript
export default function MyPage() {
  const { data, isLoading } = useGetData();

  return (
    <>
      <PageMeta title="Page Title" />
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {isLoading ? <Skeleton /> : <Content data={data} />}
      </div>
    </>
  );
}
```

- Export as `default`
- Include `<PageMeta />` for SEO
- Use `animate-in` classes for page transitions
- Loading states → Skeleton components

### Environment Configuration

Runtime validation in [src/config/env.ts](src/config/env.ts) using Zod. Fails fast with descriptive errors if required env vars missing.

```typescript
VITE_API_URL=http://localhost:8000
```

### Routing Setup

Main router in [src/App.tsx](src/App.tsx) imports feature routes:

```tsx
<BrowserRouter>
  <AuthProvider>
    <Layout>
      <Routes>
        {AuthRoutes}
        {GamesRoutes}
        {/* ... other features */}
      </Routes>
    </Layout>
  </AuthProvider>
</BrowserRouter>
```

Feature routes pattern:

```tsx
export const FeatureRoutes = (
  <>
    <Route element={<RequireAuth />}>
      <Route path="/protected" element={<ProtectedPage />} />
    </Route>
    <Route path="/public" element={<PublicPage />} />
  </>
);
```

## Integration Points

- **Backend API:** OpenAPI-generated client requires `openapi.json` in root
- **Authentication:** JWT-based with automatic refresh on 401
- **Real-time:** Custom event system for cross-component/tab sync (`auth:updated`, `auth:logout`)

## Testing

- Framework: Vitest + React Testing Library
- Location: `tests/` directory
- Run: `npm run test` (watch mode) or `npm run coverage`

---

**Last Updated:** 2026-02-10
