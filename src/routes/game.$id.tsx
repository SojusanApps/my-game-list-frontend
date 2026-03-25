import { createFileRoute, notFound } from "@tanstack/react-router";
import { GameDetailPage } from "@/features/games";
import { idSchema } from "@/lib/validation";
import { gameKeys } from "@/lib/queryKeys";
import { getGamesDetail } from "@/features/games/api/game";

export const Route = createFileRoute("/game/$id")({
  beforeLoad: ({ params }) => {
    const parsedId = idSchema.safeParse(params.id);
    if (!parsedId.success) {
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
