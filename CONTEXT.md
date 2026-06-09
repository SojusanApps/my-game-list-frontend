# My Game List Frontend — Domain Context

## Glossary

### Auth Session

The authenticated identity of the current browser user, consisting of a JWT access token, a refresh token, and the user's email address. Stored in `localStorage` under the key `user` via Zustand's `persist` middleware. A null auth session means the user is unauthenticated.

### Auth Store (`useAuthStore`)

The Zustand store that owns the Auth Session. It is the single source of truth for authentication state. All reads and writes to the Auth Session go through this store — never directly via `localStorage`. Available both inside React (via the `useAuth()` hook) and outside React (via `useAuthStore.getState()`).

### Access Token

A short-lived JWT included as a `Bearer` token on every authenticated API request. Decoded to extract `user_id` and `is_staff`. Automatically refreshed via the Refresh Token when a `401` response is received.

### Refresh Token

A longer-lived token used to obtain a new Access Token without re-entering credentials. Sent to `POST /token/refresh/`. If the refresh fails, the Auth Session is cleared and the user is redirected to `/login`.

### Route Guard

A TanStack Router `beforeLoad` callback that checks `context.auth.user` and throws a `redirect` to `/login` if the Auth Session is null. Used on all protected routes.

### Client Setup

The `clientSetup.tsx` module that configures the generated API client (`@hey-api/openapi-ts`) with the base URL, auth header injection, and the token-refresh / retry interceptor logic. It reads from and writes to the Auth Store via the utility functions in `authUtils.ts`.
