import { createFileRoute } from "@tanstack/react-router";
import { requireStaff } from "@/features/auth";
import { AdminPage } from "@/features/admin";

export const Route = createFileRoute("/admin")({
  beforeLoad: requireStaff,
  component: AdminPage,
});
