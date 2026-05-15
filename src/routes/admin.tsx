import { createFileRoute, redirect } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";
import { TokenInfoType } from "@/types";
import { userKeys } from "@/lib/queryKeys";
import { getUserDetails } from "@/features/users/api/user";
import { AdminPage } from "@/features/admin";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ context }) => {
    if (!context.auth?.user?.token) {
      throw redirect({ to: "/login", search: { redirect: "/admin" } });
    }

    let userId: number;
    try {
      const decoded = jwtDecode<TokenInfoType>(context.auth.user.token);
      userId = Number(decoded.user_id);
    } catch {
      throw redirect({ to: "/" });
    }

    const userDetails = await context.queryClient
      .ensureQueryData({
        queryKey: userKeys.detail(userId),
        queryFn: () => getUserDetails(userId),
      })
      .catch(() => null);

    if (!userDetails?.is_staff) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminPage,
});
