import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/features/auth";
import { z } from "zod";

export const Route = createFileRoute("/register")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: RegisterPage,
});
