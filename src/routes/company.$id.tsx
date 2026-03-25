import { createFileRoute, notFound } from "@tanstack/react-router";
import { CompanyDetailPage } from "@/features/games";
import { idSchema } from "@/lib/validation";
import { gameKeys } from "@/lib/queryKeys";
import { getCompanyDetail } from "@/features/games/api/game";

export const Route = createFileRoute("/company/$id")({
  beforeLoad: ({ params }) => {
    const parsedId = idSchema.safeParse(params.id);
    if (!parsedId.success) {
      throw notFound();
    }
  },
  loader: async ({ context: { queryClient }, params }) => {
    try {
      await queryClient.ensureQueryData({
        queryKey: gameKeys.companyDetail(Number(params.id)),
        queryFn: () => getCompanyDetail(Number(params.id)),
      });
    } catch {
      throw notFound();
    }
  },
  component: CompanyDetailPage,
});
