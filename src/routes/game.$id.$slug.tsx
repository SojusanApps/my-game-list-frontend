import { createFileRoute, notFound } from "@tanstack/react-router";
import { GameDetailPage } from "@/features/games";
import { slugSchema, idSchema } from "@/lib/validation";
import { gameKeys } from "@/lib/queryKeys";
import { getGamesDetail } from "@/features/games/api/game";

export const Route = createFileRoute("/game/$id/$slug")({
  beforeLoad: ({ params }) => {
    const parsedSlug = slugSchema.safeParse(params.slug);
    const parsedId = idSchema.safeParse(params.id);
    if (!parsedSlug.success || !parsedId.success) {
      throw notFound();
    }
  },
  loader: async ({ context: { queryClient }, params }) => {
    try {
      await queryClient.ensureQueryData({
        queryKey: gameKeys.detail(Number(params.id)),
        queryFn: () => getGamesDetail(Number(params.id)),
      });
    } catch {
      throw notFound();
    }
  },
  component: GameDetailPage,
});
