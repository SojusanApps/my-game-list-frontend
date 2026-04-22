# Project Guidelines for AI Agents

Instructions for AI coding agents working on the **My Game List Frontend**.

## Build and Test

- **Dev**: `pnpm dev` (regenerates API client + starts dev server). Requires `openapi.json` from backend.
- **Build**: `pnpm build`
- **Test**: `pnpm test` / `pnpm coverage`
- **Lint/Format**: `pnpm lint` / `pnpm format`

## Routing & State

- **Routing**: TanStack Router v1 (file-based in `src/routes/`). Use `beforeLoad` for auth checks.
- **State**: TanStack Query v5. Keys defined in `src/lib/queryKeys.ts`. Use `useAppMutation` for mutations to auto-handle toasts.
- **Auth**: JWT in `localStorage`. Managed in `src/features/auth/context/AuthProvider.tsx`. Custom events (`auth:updated`, `auth:logout`) sync across tabs.

## Styling (Mantine + CSS Modules)

- **Primary**: Mantine props (`p=`, `bg=`, `c=`, `style={{}}`).
- **Custom/Hover**: CSS Modules (camelCase classes). Never add component styles to `src/index.css`.
- **Colors**: Use variables from `src/css/colors.css` (e.g., `var(--color-primary-200)`).
- **Class Merging**: Always use `cn()` from `src/utils/cn.ts`.

## Components & Forms

- **Buttons**: Use our custom wrapper at `src/components/ui/Button.tsx`.
- **Forms**: Use `@mantine/form` + `mantine-form-zod-resolver` (NOT React Hook Form).
- **Inputs**: Spread `getInputProps('field')` directly onto Mantine inputs. Errors display automatically.
- **Pages**: Must default export and include `<PageMeta title="..." />`.

## API Layer

- **DO NOT** edit `src/client/` (auto-generated).
- Always use `handleApiError()` from `src/utils/apiUtils.ts` to parse Django REST Framework responses.
