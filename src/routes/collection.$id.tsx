import { createFileRoute, notFound } from "@tanstack/react-router";
import CollectionPage from "@/features/collections/pages/CollectionPage";
import { idSchema } from "@/lib/validation";
import { collectionKeys } from "@/lib/queryKeys";
import { getCollectionDetail } from "@/features/collections/api/collection";

export const Route = createFileRoute("/collection/$id")({
  beforeLoad: ({ params }) => {
    const parsedId = idSchema.safeParse(params.id);
    if (!parsedId.success) {
      throw notFound();
    }
  },
  loader: async ({ context: { queryClient }, params }) => {
    try {
      await queryClient.ensureQueryData({
        queryKey: collectionKeys.detail(Number(params.id)),
        queryFn: () => getCollectionDetail(Number(params.id)),
      });
    } catch {
      throw notFound();
    }
  },
  component: CollectionPage,
});
