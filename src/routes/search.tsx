import { createFileRoute } from "@tanstack/react-router";
import { SearchEnginePage } from "@/features/games";

export const Route = createFileRoute("/search")({
  component: SearchEnginePage,
});
