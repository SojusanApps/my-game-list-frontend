import * as React from "react";
import { useParams, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Collection } from "@/client";
import { useGetUserDetails } from "@/features/users/hooks/userQueries";
import { useCollectionsInfiniteQuery } from "../hooks/useCollectionQueries";
import { idSchema } from "@/lib/validation";
import { PageMeta } from "@/components/ui/PageMeta";
import { GridList } from "@/components/ui/GridList";
import { Skeleton } from "@/components/ui/Skeleton";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import { Button } from "@/components/ui/Button";
import CollectionCard from "../components/CollectionCard";
import CreateCollectionModal from "../components/CreateCollectionModal";
import { cn } from "@/utils/cn";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { TokenInfoType } from "@/types";

export default function CollectionsPage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);
  const userId = parsedId.success ? parsedId.data : undefined;

  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data: userDetails, isLoading: isUserLoading } = useGetUserDetails(userId);

  const currentUserId = React.useMemo(() => {
    if (!user) return undefined;
    try {
      const decoded = jwtDecode<TokenInfoType>(user.token);
      return decoded.user_id;
    } catch {
      return undefined;
    }
  }, [user]);

  const isOwner = React.useMemo(() => {
    const effectiveUserId = userId || userDetails?.id;
    if (!currentUserId || !effectiveUserId) return false;
    return Number(currentUserId) === Number(effectiveUserId);
  }, [currentUserId, userId, userDetails]);

  const skeletonIds = React.useMemo(() => Array.from({ length: 8 }).map((_, i) => `skeleton-${i}`), []);

  const [isFavoriteFilter, setIsFavoriteFilter] = React.useState<boolean | null>(null);

  const {
    data: collectionsResults,
    error: errorFetchingData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCollectionsInfiniteQuery(userId, isFavoriteFilter !== null ? { is_favorite: isFavoriteFilter } : {});

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const pageTitle = isUserLoading ? "Loading Collections..." : `${userDetails?.username}'s Collections`;

  const allItems = collectionsResults?.pages.flatMap(page => page.results) || [];

  const filters = [
    { id: null, label: "ALL", emoji: "📂" },
    { id: true, label: "FAVORITES", emoji: "❤️" },
  ];

  return (
    <div className="py-12 min-h-screen">
      <PageMeta title={pageTitle} />
      <div className="flex flex-col gap-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-text-900 tracking-tight text-center">
              <span className="text-primary-600">{userDetails?.username}</span>&apos;s Collections
            </h1>
            {isOwner && (
              <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mt-1">Owner View</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
              {filters.map(filter => (
                <button
                  key={filter.label}
                  onClick={() => setIsFavoriteFilter(filter.id)}
                  className={cn(
                    "px-6 py-2.5 text-xs md:text-sm font-black rounded-full border transition-all duration-300 shadow-sm uppercase tracking-wider",
                    isFavoriteFilter === filter.id
                      ? "bg-primary-600 text-white border-primary-600 shadow-primary-200/50"
                      : "bg-white text-text-600 border-background-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50",
                  )}
                >
                  <span className="mr-2">{filter.emoji}</span>
                  {filter.label}
                </button>
              ))}
            </div>

            {isOwner && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto px-8 py-2.5 font-black uppercase tracking-wider rounded-full shadow-lg shadow-primary-100"
              >
                Create Collection
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-background-200 p-6 md:p-8 min-h-212.5">
          {isLoading && !isFetchingNextPage ? (
            <GridList columnCount={4}>
              {skeletonIds.map(skeletonId => (
                <Skeleton key={skeletonId} className="aspect-[3/4] w-full rounded-3xl" />
              ))}
            </GridList>
          ) : (
            <VirtualGridList
              items={allItems}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              className="h-200"
              columnCount={4}
              rowHeight={450}
              renderItem={(collection: Collection) => <CollectionCard key={collection.id} collection={collection} />}
            />
          )}
          {errorFetchingData && (
            <div className="bg-error-50 border border-error-200 rounded-xl p-4 mt-4">
              <p className="text-error-600 text-center font-medium">Error: {errorFetchingData.message}</p>
            </div>
          )}
          {!isLoading && allItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-background-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">📂</span>
              </div>
              <h3 className="text-lg font-bold text-text-900">No collections found</h3>
              <p className="text-text-500 max-w-xs mt-2">This user hasn&apos;t created any collections yet.</p>
              {isOwner && (
                <Button variant="outline" onClick={() => setIsModalOpen(true)} className="mt-6 font-bold">
                  Create your first collection
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && <CreateCollectionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
