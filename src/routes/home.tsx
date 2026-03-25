import { createFileRoute, redirect } from "@tanstack/react-router";
import { HomePage } from "@/features/games";

export const Route = createFileRoute("/home")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.user?.email) {
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: HomePage,
});
