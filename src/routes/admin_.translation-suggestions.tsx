import { createFileRoute } from "@tanstack/react-router";
import { requireStaff } from "@/features/auth";
import { AdminTranslationSuggestionsPage } from "@/features/admin";

export const Route = createFileRoute("/admin_/translation-suggestions")({
  beforeLoad: requireStaff,
  component: AdminTranslationSuggestionsPage,
});
