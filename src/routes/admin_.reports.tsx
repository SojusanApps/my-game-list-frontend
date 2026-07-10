import { createFileRoute } from "@tanstack/react-router";
import { requireStaff } from "@/features/auth";
import { AdminReportsPage } from "@/features/admin";

export const Route = createFileRoute("/admin_/reports")({
  beforeLoad: requireStaff,
  component: AdminReportsPage,
});
