import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""), // NOSONAR
  }),
  component: LoginPage,
});
