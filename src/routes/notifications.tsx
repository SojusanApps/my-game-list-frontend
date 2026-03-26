import { createFileRoute, redirect } from "@tanstack/react-router";
import { NotificationsPage } from "@/features/notifications";

export const Route = createFileRoute("/notifications")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.user?.email) {
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: NotificationsPage,
});
