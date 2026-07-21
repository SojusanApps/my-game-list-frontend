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

### Report

A user-filed complaint against another user's content (a review, translation suggestion, game list note, collection, or collection item note) or profile field (avatar or username). Carries a lifecycle `status` (`pending` → `accepted`/`rejected` by staff) and a `reported_value` snapshot of the offending text taken at submission time. A user may hold at most one pending Report per target at a time; different users may each file their own independently against the same target. The reported user is never shown reports filed against them — reporters are only visible to staff, to protect reporters from retaliation.
*Avoid*: complaint, flag (as a noun)

### Moderation (masking)

The effect of an accepted Report: the flagged field is never deleted or edited, only masked. From then on, everyone except the content's owner and staff sees a fixed placeholder string in place of the real value; the owner and staff always see the real value. There is no boolean moderation flag exposed anywhere in the API — the frontend renders whatever string a field contains and never tries to detect or badge moderation state from it.
*Avoid*: is_moderated, moderated flag

### Warning

The consequence issued to a user when staff accept a Report against them. Three Warnings, from any combination of report types, auto-bans the user.

### Banned User

A user with three accumulated Warnings. Being banned only changes what *other people* see when viewing that user's content — every one of their moderation-eligible fields across every content type is masked for other viewers, even items that were never individually reported. The owner and staff still see everything real (except a flagged avatar — see below). Banned users keep full write access everywhere; there is no write-time restriction tied to being banned.

### Avatar moderation exception

The one case where masking has no owner/staff exemption: once an avatar Report is accepted, `gravatar_url` returns empty for literally everyone, including the flagged user viewing their own profile and staff.

### Game List Comparison

A side-by-side view of two users' game lists, keyed by `first_user_id`/`second_user_id` (backend: `GET /game-lists/{first_user_id}/compare/{second_user_id}/`). Games are matched by Game identity, independent of each user's status — a Completed entry for one user and a Plan to Play entry for the other still count as the same game. The comparison splits into three sections, always in this order: **Both Have** (the game appears on both lists — each user's own status/score shown independently), **Only {first_user}**, **Only {second_user}**. Comparison is permissionless like a game list itself — any logged-in user can compare any two other users, not just themselves; there is no friendship or ownership restriction. The primary entry point is a "Compare" button on another user's profile page (`UserProfilePage`, hidden on your own profile), which always opens the comparison with the current user as `first_user_id` and the viewed profile as `second_user_id` — but the URL itself does not enforce that pairing.
