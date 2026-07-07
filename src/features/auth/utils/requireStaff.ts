import { redirect } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";
import { TokenInfoType } from "@/types";
import { userKeys } from "@/lib/queryKeys";
import { getUserDetails } from "@/features/users/api/user";
import type { MyRouterContext } from "@/routes/__root";

interface RequireStaffArgs {
  context: MyRouterContext;
  location: { pathname: string };
}

/**
 * Route guard for `beforeLoad`: redirects to login (preserving the return path) when
 * signed out, or to home when signed in but not staff.
 */
export async function requireStaff({ context, location }: Readonly<RequireStaffArgs>): Promise<void> {
  if (!context.auth?.user?.token) {
    throw redirect({ to: "/login", search: { redirect: location.pathname } });
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
}
