import { FieldEnum, TranslationSuggestionStatusEnum, type TranslationSuggestion } from "@/client/types.gen";

export const PROPOSED_VALUE_MAX_LENGTH: Record<FieldEnum, number> = {
  [FieldEnum.TITLE]: 255,
  [FieldEnum.SUMMARY]: 2000,
};

export type ProposedValueError = "required" | "tooLong";

export function validateProposedValue(field: FieldEnum, value: string): ProposedValueError | null {
  if (value.trim().length === 0) {
    return "required";
  }
  if (value.length > PROPOSED_VALUE_MAX_LENGTH[field]) {
    return "tooLong";
  }
  return null;
}

export function findOwnPendingSuggestion(
  suggestions: TranslationSuggestion[],
  currentUserId: number,
  field: FieldEnum,
): TranslationSuggestion | undefined {
  return suggestions.find(
    suggestion =>
      suggestion.submitted_by.id === currentUserId &&
      suggestion.field === field &&
      suggestion.status === TranslationSuggestionStatusEnum.PENDING,
  );
}

export function canWithdraw(suggestion: TranslationSuggestion, currentUserId: number | null): boolean {
  return (
    currentUserId !== null &&
    suggestion.submitted_by.id === currentUserId &&
    suggestion.status === TranslationSuggestionStatusEnum.PENDING
  );
}

export function canModerate(suggestion: TranslationSuggestion, isStaff: boolean): boolean {
  return isStaff && suggestion.status === TranslationSuggestionStatusEnum.PENDING;
}

export interface SuggestionFilterState {
  status?: TranslationSuggestionStatusEnum | "all";
  game?: number;
  submittedBy?: number;
  page?: number;
}

export interface SuggestionListQuery {
  status?: string;
  game?: string;
  submitted_by?: string;
  page?: number;
}

export function buildSuggestionFilters(state: SuggestionFilterState): SuggestionListQuery {
  const query: SuggestionListQuery = { page: state.page };
  if (state.status === undefined) {
    query.status = TranslationSuggestionStatusEnum.PENDING;
  } else if (state.status !== "all") {
    query.status = state.status;
  }
  if (state.game !== undefined) {
    query.game = String(state.game);
  }
  if (state.submittedBy !== undefined) {
    query.submitted_by = String(state.submittedBy);
  }
  return query;
}
