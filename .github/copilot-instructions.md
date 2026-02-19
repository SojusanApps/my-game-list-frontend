# Project Guidelines for AI Agents

Instructions for AI coding agents working on the **My Game List Frontend** project.

## Project Overview

A React 19 + TypeScript frontend for tracking game collections, reviews, and social connections. Feature-based architecture with auto-generated API client from OpenAPI spec.

**Key Technologies:** React 19, TypeScript, Vite, TanStack Query v5, React Router v7, Mantine v8, @mantine/form + Zod, OpenAPI-TS

## Build and Test

```bash
# Development (regenerates API client + starts dev server)
pnpm dev

# Production build
pnpm build

# Run tests
pnpm test

# Coverage report
pnpm coverage

# Lint and format
pnpm lint
pnpm format
```

**Prerequisites:** Ensure `openapi.json` exists in root (auto-copied from `../my-game-list-backend/` on `pnpm dev`)

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

The primary styling approach uses **Mantine** components with their built-in props. Follow this priority order:

1. **Mantine props** — `variant=`, `color=`, `size=`, `p=`, `m=`, `c=`, `bg=`, inline `style={{}}`, etc.
2. **CSS Modules** — for pseudo-selectors, hover states, and child selectors (see CSS Modules section below)
3. **`className` with CSS module classes** — always use `cn()` from [src/utils/cn.ts](../src/utils/cn.ts) when merging multiple class names

**Example:**

```typescript
import { Box, Text } from '@mantine/core';

export function MyComponent() {
  return (
    <Box p={16} bg="var(--color-background-200)" style={{ borderRadius: 12 }}>
      <Text c="var(--color-text-700)" fw={500}>Content</Text>
    </Box>
  );
}
```

- Colors: Use semantic CSS variables from [src/css/colors.css](../src/css/colors.css) (`--color-primary-*`, `--color-text-*`, `--color-background-*`)
- Responsive: Mobile-first with Mantine responsive object syntax (`{ base: ..., sm: ..., md: ... }`)
- The custom `Button` component in [src/components/ui/Button.tsx](../src/components/ui/Button.tsx) wraps Mantine's `Button` with a semantic variant/size API — use it for all button elements

### Custom Styles: CSS Modules

> **CRITICAL:** Mantine recommends CSS Modules as the preferred styling approach. **Never add component-specific styles to `src/index.css`**. Only truly global styles (`:root`, `body`, scrollbars) belong there.

For any custom styles that cannot be expressed via Mantine props or inline `style={{}}`, create a **CSS Module** co-located with the component:

```
src/features/[feature]/components/
  ├── MyComponent.tsx
  └── MyComponent.module.css   ← co-located, scoped styles
```

**Pattern:**

```typescript
// MyComponent.module.css
.card {
  background: var(--color-background-200);
  border-radius: 12px;
  transition: background 200ms;
}
.card:hover {
  background: var(--color-background-300);
}

// MyComponent.tsx
import styles from './MyComponent.module.css';

export function MyComponent() {
  return <Box className={styles.card}>...</Box>;
}
```

**Key rules:**

- Use **camelCase** class names in CSS modules (e.g. `.navLink`, not `.nav-link`)
- Use CSS variables from [src/css/colors.css](../src/css/colors.css) inside CSS modules — never hardcode colors
- For **pseudo-selectors and child selectors** (hover, `:hover .child`), CSS modules are the only correct approach — do not handle these with inline styles or `useHover`
- Prefer Mantine props (`style={{}}`, `c=`, `bg=`, `p=`, etc.) over CSS modules for simple, one-off values
- Only reach for a CSS module when the styling requires selectors that inline styles can't express

**Existing CSS Modules** (reference for patterns):

- [src/components/layout/TopBar.module.css](../src/components/layout/TopBar.module.css) — nav links, logo, user menu button
- [src/features/collections/components/TierList/GameCard.module.css](../src/features/collections/components/TierList/GameCard.module.css) — complex hover-reveal patterns
- [src/features/collections/components/RankingList/RankingRow.module.css](../src/features/collections/components/RankingList/RankingRow.module.css) — hover-reveal patterns
- [src/features/games/pages/GameListPage.module.css](../src/features/games/pages/GameListPage.module.css) — status filter button variants

### Form Components

Use `@mantine/form` with Zod validation via `mantine-form-zod-resolver`. See [src/features/auth/components/LoginForm.tsx](../src/features/auth/components/LoginForm.tsx) and [src/features/auth/components/RegisterForm.tsx](../src/features/auth/components/RegisterForm.tsx) for reference.

**Pattern:**

```typescript
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { notifications } from '@mantine/notifications';
import { TextInput, PasswordInput } from '@mantine/core';

const validationSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export function MyForm() {
  const form = useForm<ValidationSchema>({
    initialValues: { email: '', password: '' },
    validate: zod4Resolver(validationSchema),
  });

  const onSubmit = async (data: ValidationSchema) => {
    try {
      // Handle submission
      notifications.show({ title: 'Success', message: 'Done!', color: 'green' });
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Something went wrong', color: 'red' });
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)} noValidate>
      <TextInput label="Email" {...form.getInputProps('email')} />
      <PasswordInput label="Password" {...form.getInputProps('password')} />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

**Key rules:**

- Use `useForm` from `@mantine/form` — **not** React Hook Form
- Use `zod4Resolver` from `mantine-form-zod-resolver` — **not** `@hookform/resolvers/zod`
- Always spread `{...form.getInputProps('fieldName')}` onto Mantine inputs — this handles value, onChange, and error display automatically
- For checkboxes, pass `{ type: 'checkbox' }`: `{...form.getInputProps('remember', { type: 'checkbox' })}`
- Always add `noValidate` to `<form>` to prevent browser-native validation UI
- Use `notifications.show()` from `@mantine/notifications` for feedback — **not** `react-hot-toast`
- Mantine inputs display field errors automatically via `getInputProps` — no separate `FormError` component needed

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

- Features export routes as JSX fragments (see [src/features/games/routes.tsx](../src/features/games/routes.tsx))
- Page components use `<PageMeta title="..." />` for SEO
- Protected routes wrapped in `<RequireAuth />` (see [src/features/auth/components/RequireAuth.tsx](../src/features/auth/components/RequireAuth.tsx))

### API Integration

**CRITICAL:** `src/client/` contains **GENERATED CODE** - never edit manually. Regenerate via `pnpm openapi-ts`.

**API Layer Pattern** (see [src/features/games/api/game.tsx](../src/features/games/api/game.tsx)):

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

- Always use `handleApiError()` from [src/utils/apiUtils.ts](../src/utils/apiUtils.ts)
- Compare status codes using constants from [src/utils/StatusCode.ts](../src/utils/StatusCode.ts)
- Export query parameter types: `export type MyQueryParams = MyApiData["query"];`

### React Query Patterns

Define hierarchical query keys in [src/lib/queryKeys.ts](../src/lib/queryKeys.ts):

```typescript
export const gameKeys = {
  all: ["games"] as const,
  lists: () => [...gameKeys.all, "list"] as const,
  list: (filters: string) => [...gameKeys.lists(), { filters }] as const,
  details: () => [...gameKeys.all, "detail"] as const,
  detail: (id: number) => [...gameKeys.details(), id] as const,
};
```

**Query Hooks** (see [src/features/games/hooks/gameQueries.tsx](../src/features/games/hooks/gameQueries.tsx)):

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

**Mutations** (use `useAppMutation` from [src/hooks/useAppMutation.ts](../src/hooks/useAppMutation.ts)):

```typescript
import { notifications } from "@mantine/notifications";

const mutation = useAppMutation({
  mutationFn: updateGame,
  onSuccess: data => {
    queryClient.invalidateQueries({ queryKey: gameKeys.detail(data.id) });
    notifications.show({ title: "Success", message: "Game updated", color: "green" });
  },
});
```

- `useAppMutation` automatically shows error toasts
- Always invalidate related queries after mutations
- Use specific invalidation over broad cache clearing

### Authentication & Security

**Token Flow** (see [src/clientSetup.tsx](../src/clientSetup.tsx)):

1. JWT tokens stored in `localStorage` (`{ email, token, refreshToken }`)
2. Custom fetch client auto-injects: `Authorization: Bearer ${token}`
3. On 401 response → automatic token refresh → retry request
4. Refresh failure → force logout → redirect to login

**Auth Context** ([src/features/auth/context/AuthProvider.tsx](../src/features/auth/context/AuthProvider.tsx)):

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
- **Form errors:** Displayed automatically by Mantine inputs via `getInputProps` — no separate error component needed
- **User feedback:** `notifications.show()` from `@mantine/notifications`
- **Error formats handled:**
  - String errors
  - `{ detail: "..." }`
  - Field validation: `{ "field": ["error message"] }`

## Project Conventions

### Page Components

See [src/features/games/pages/HomePage.tsx](../src/features/games/pages/HomePage.tsx) for reference:

```typescript
export default function MyPage() {
  const { data, isLoading } = useGetData();

  return (
    <>
      <PageMeta title="Page Title" />
      <Stack gap={32}>
        {isLoading ? <Skeleton /> : <Content data={data} />}
      </Stack>
    </>
  );
}
```

- Export as `default`
- Include `<PageMeta />` for SEO
- Use Mantine layout components (`Stack`, `Box`, `SimpleGrid`) for page structure
- Loading states → Mantine `Skeleton` components

### Environment Configuration

Runtime validation in [src/config/env.ts](../src/config/env.ts) using Zod. Fails fast with descriptive errors if required env vars missing.

```typescript
VITE_API_URL=http://localhost:8000
```

### Routing Setup

Main router in [src/App.tsx](../src/App.tsx) imports feature routes:

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
- Run: `pnpm test` (watch mode) or `pnpm coverage`

---

**Last Updated:** 2025-07-08
