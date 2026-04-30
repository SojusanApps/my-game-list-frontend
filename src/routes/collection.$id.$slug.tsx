import { createFileRoute, notFound } from "@tanstack/react-router";
import CollectionPage from "@/features/collections/pages/CollectionPage";
import { idSchema, slugSchema } from "@/lib/validation";
import { collectionKeys } from "@/lib/queryKeys";
import { getCollectionDetail } from "@/features/collections/api/collection";

export const Route = createFileRoute("/collection/$id/$slug")({
  beforeLoad: ({ params }) => {
    const parsedId = idSchema.safeParse(params.id);
    const parsedSlug = slugSchema.safeParse(params.slug);
    if (!parsedId.success || !parsedSlug.success) {
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
