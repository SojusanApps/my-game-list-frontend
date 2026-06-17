import { createFileRoute, redirect } from "@tanstack/react-router";
import { ImportPage } from "@/features/games";

export const Route = createFileRoute("/import")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.user?.email) {
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: ImportPage,
});
