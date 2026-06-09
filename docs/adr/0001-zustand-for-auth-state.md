# ADR 0001: Zustand for Auth Session State

**Status:** Accepted
**Date:** 2026-06-09

## Context

Auth state was managed with a React Context (`AuthProvider`) backed by `useState`. Keeping React state in sync with `localStorage` required a custom event bus: `setStoredUser` dispatched `auth:updated` and `clearStoredUser` dispatched `auth:logout`; the `AuthProvider` effect listened to both and called `setUser(getStoredUser())`. The token-refresh interceptor in `clientSetup.tsx` also read `localStorage` directly, bypassing React entirely — meaning state updates from outside React were invisible to components until the next event round-trip.

## Decision

Use **Zustand** with the `persist` middleware as the single owner of the Auth Session.

- The `useAuthStore` store is the canonical source of truth.
- `login()` and `logout()` are the only write paths; they update both in-memory state and `localStorage` atomically via `persist`.
- `useAuthStore.getState()` is used outside React (token-refresh interceptor, route guards via TanStack Router context) — no hooks, no event bus.
- `useAuth()` is a thin wrapper around `useAuthStore()` that preserves the existing public API (`{ user, login, logout }`).
- `AuthProvider` (React Context component) is deleted; `App.tsx` no longer wraps the tree in a provider.
- A legacy-aware custom storage adapter in `authStore.ts` migrates the old raw-user `localStorage` format to the Zustand persist envelope on first read, so existing sessions survive the upgrade.

## Alternatives considered

**Keep React Context, drop the event bus** — would require threading setState callbacks into `clientSetup.tsx`, which has no React lifecycle. Not feasible without introducing a module-level singleton anyway (which is what Zustand gives us).

**React Context + `useSyncExternalStore`** — more boilerplate than Zustand with no meaningful advantage for this use case.

## Consequences

- The `auth:updated` and `auth:logout` custom events are removed entirely.
- `getStoredUser`, `setStoredUser`, `clearStoredUser` in `authUtils.ts` are thin wrappers over `useAuthStore.getState()` — kept for `clientSetup.tsx` callsite compatibility.
- All future global state (e.g., UI preferences, feature flags) should use Zustand stores following the same pattern.
- Tab synchronisation for logout/login now relies on Zustand's `persist` + `localStorage` events rather than manual `globalThis.dispatchEvent`.
