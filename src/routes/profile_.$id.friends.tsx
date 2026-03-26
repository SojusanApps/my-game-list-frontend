import { createFileRoute, notFound } from "@tanstack/react-router";
import { UserFriendsPage } from "@/features/users";
import { idSchema } from "@/lib/validation";
import { userKeys } from "@/lib/queryKeys";
import { getUserDetails } from "@/features/users/api/user";

export const Route = createFileRoute("/profile_/$id/friends")({
  beforeLoad: ({ params }) => {
    const parsedId = idSchema.safeParse(params.id);
    if (!parsedId.success) {
      throw notFound();
    }
  },
  loader: async ({ context: { queryClient }, params }) => {
    try {
      await queryClient.ensureQueryData({
        queryKey: userKeys.detail(Number(params.id)),
        queryFn: () => getUserDetails(Number(params.id)),
      });
    } catch {
      throw notFound();
    }
  },
  component: UserFriendsPage,
});
