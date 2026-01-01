# GEMINI.md - Project Context

This file provides context and instructions for AI agents working on the **My Game List Frontend** project.

## Project Overview

- **Purpose:** A modern, responsive web application for gamers to track game collections, write reviews, and connect with friends.
- **Architecture:** Feature-based modular structure (`src/features/`).
- **Tech Stack:**
    - **Frontend:** React 19, TypeScript, Vite.
    - **Styling:** Tailwind CSS, DaisyUI, `class-variance-authority` (CVA).
    - **State Management & Data Fetching:** TanStack Query (React Query) v5.
    - **Routing:** React Router DOM v7.
    - **API Client:** Generated using `@hey-api/openapi-ts` from a backend `openapi.json` definition.
    - **Forms:** React Hook Form with Zod validation.
    - **Testing:** Vitest with React Testing Library.

## Building and Running

### Development
1. **Prerequisites:** Ensure `openapi.json` is available in the root (usually copied from the backend).
2. **Commands:**
    - `npm install`: Install dependencies.
    - `npm run dev`: Regenerates API client and starts Vite dev server.
    - `npm run openapi-ts`: Manually regenerate the API client.

### Production
- `npm run build`: Type-checks and builds the application.
- `npm run preview`: Previews the production build locally.

### Quality Control
- `npm run test`: Runs unit and integration tests.
- `npm run coverage`: Runs tests with coverage reports.
- `npm run lint`: Checks for linting errors.
- `npm run format`: Formats code with Prettier.

## Development Conventions

### Directory Structure
- `src/assets/`: Static assets.
- `src/client/`: **GENERATED** API client. Do not edit files here manually.
- `src/components/layout/`: Global layout components (TopBar, Footer).
- `src/components/ui/`: Reusable primitive components (Button, Input, etc.).
- `src/features/`: Domain-specific features (auth, games, users, notifications).
    - `components/`: Feature-specific UI.
    - `hooks/`: Feature-specific TanStack Query hooks.
    - `pages/`: Page-level components.
    - `api/`: Manual API wrappers if needed.
    - `routes.tsx`: Feature route fragments.
- `src/config/`: App configuration (env).
- `src/hooks/`: Global utility hooks.
- `src/utils/`: Global utility functions, constants, and theme helpers.

### Coding Patterns
- **Styling:** Use Tailwind CSS classes. For reusable components, use `class-variance-authority` (CVA) and the `cn` utility (`src/utils/cn.ts`).
- **Data Fetching:** Prefer custom hooks using `useQuery` or `useInfiniteQuery` from `@tanstack/react-query`. Define query keys in `src/lib/queryKeys.ts`.
- **Forms:** Use `react-hook-form` with `zod` for schema-based validation.
- **Routing:** Define routes within features and export them as fragments to be consumed by `src/App.tsx`.
- **Path Aliases:** Use `@/` to refer to the `src/` directory.

### API Integration
- The API client configuration (base URL, auth headers, interceptors) is handled in `src/clientSetup.tsx`.
- Authentication uses Bearer tokens stored locally, with automatic refresh logic integrated into the fetch client.

## Testing Guidelines
- Use Vitest for unit and integration tests.
- Tests should be located in the `tests/` directory or alongside files using a `.test.ts(x)` suffix (check project specific setup).
- Current setup points to `tests/` directory in `package.json` lint scripts.
