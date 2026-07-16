# ADR 0003: Structured Field Errors for Inline Form Validation

**Status:** Accepted
**Date:** 2026-07-16

## Context

Every mutation in this app today shows API errors as one generic toast: `handleApiError` flattens a DRF field-error body (`{"field": ["msg"]}`) into a single joined string, and `useAppMutation` unconditionally shows it via `notifications.show`. No form maps an API error back onto the specific input that caused it. This was fine while errors were rare and generic (e.g. "Error creating game review"), but the username/password change forms return errors tied to a specific field — `current_password` incorrect, `new_password` failing multiple strength rules at once, `username` already taken — where a toast makes the user hunt for which field to fix.

## Decision

`ApiError` (in `src/utils/apiUtils.ts`) now carries an optional `fieldErrors: Record<string, string[]>` alongside its existing flattened `message`, parsed once in `handleApiError` from the same DRF response body. `useAppMutation` gained an opt-in way to suppress its default toast when a mutation's error already has `fieldErrors` it intends to render inline (defaulting to today's always-toast behavior, so every existing caller is unaffected). The username/password change forms use this to call `form.setFieldError` per field instead of showing a toast; other mutations keep the generic toast unchanged.

## Consequences

- `ApiError` now has two representations of the same error (joined `message` string, structured `fieldErrors` map) that must be kept in sync if the parsing logic changes.
- This is now the sanctioned pattern for any future form that wants inline, per-field API error display — reach for `fieldErrors` + `setFieldError` rather than inventing a new parsing scheme.
- Forms that adopt this pattern must handle `fieldErrors` being absent (network errors, `{detail: ...}` bodies, non-JSON bodies) by falling back to the toast, since not every error is field-shaped.
