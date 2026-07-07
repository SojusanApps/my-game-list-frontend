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

### Import Source

The origin of a game import on the Import page: currently Steam (fetch a Steam profile's library) or Title (paste a list of game titles). Each source has its own flow, but both end by submitting the chosen games to bulk create.

### Title Import

Importing games by pasting free-text game titles, one per line. Titles are matched against the catalogue in Batches; the user resolves each title to a game (or not) before the import is created.

### Batch (Title Import)

A group of at most 10 titles matched in a single title-import request. The user resolves one Batch fully before the next is fetched, and may revisit earlier Batches to change picks until the import is submitted.

### Match Candidate

One of up to three catalogue games proposed for an imported title, ranked best first. A candidate already on the user's game list is shown but not selectable.

### Resolved Title

An imported title that has a decision: bound to a chosen game, declared "none of these", or auto-marked unmatched because no candidates were found. Every title on a Batch must be resolved before moving on.

### Unmatched Title

A title with no accepted Match Candidate ("none of these" or zero candidates). Unmatched Titles go to manual resolution, where the user searches the full catalogue; titles left unresolved there are skipped from the import.

### Active Title

During manual resolution, the single Unmatched Title currently being worked on. Selecting it pre-fills the catalogue search with its text; picking a search result binds that game to it.

### Duplicate Merge

When the same game ends up chosen for multiple titles, the user confirms — before configuring the import — that the game will be imported once. Informational only; no re-picking happens.

### Translation Suggestion

A proposal from any logged-in user to correct a game's `title` or `summary` field, covering both minor typo fixes and full retranslations via the same mechanism. Carries a lifecycle `status` (`pending` → `accepted`/`rejected` by an admin, or `withdrawn` by its own submitter) and is visible in full — regardless of status or submitter — to every logged-in user. A user may hold at most one *pending* Translation Suggestion per game+field at a time; different users may each hold their own competing pending suggestion for the same game+field simultaneously.
*Avoid*: translation request, correction, translation proposal

### Suggestion History

The list of all Translation Suggestions for one game and one field (title or summary), shown regardless of status. Title and summary each have their own independent Suggestion History — they are never mixed in one list.
