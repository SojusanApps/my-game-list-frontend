import * as React from "react";
import { useParams, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Collection, CollectionCollectionsListData } from "@/client";
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
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";

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
  const [visibilityFilter, setVisibilityFilter] = React.useState<string | null>(null);
  const [modeFilter, setModeFilter] = React.useState<string | null>(null);

  const queryFilters = React.useMemo(() => {
    const filters: Required<CollectionCollectionsListData>["query"] = {};
    if (isFavoriteFilter !== null) filters.is_favorite = isFavoriteFilter;
    if (visibilityFilter !== null) filters.visibility = [visibilityFilter as "FRI" | "PRI" | "PUB"];
    if (modeFilter !== null) filters.mode = [modeFilter as "C" | "S"];
    return filters;
  }, [isFavoriteFilter, visibilityFilter, modeFilter]);

  const {
    data: collectionsResults,
    error: errorFetchingData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCollectionsInfiniteQuery(userId, queryFilters);

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const pageTitle = isUserLoading ? "Loading Collections..." : `${userDetails?.username}'s Collections`;

  const allItems = collectionsResults?.pages.flatMap(page => page.results) || [];

  const favoriteFilters = [
    { id: null, label: "All", emoji: "📂" },
    { id: true, label: "Favorites", emoji: "❤️" },
  ];

  const visibilityOptions = [
    { value: "", label: "Any Visibility" },
    { value: "PUB", label: "Public" },
    { value: "FRI", label: "Friends" },
    { value: "PRI", label: "Private" },
  ];

  const modeOptions = [
    { value: "", label: "Any Mode" },
    { value: "S", label: "Solo" },
    { value: "C", label: "Collaborative" },
  ];

  return (
    <div className="py-12 min-h-screen">
      <PageMeta title={pageTitle} />
      <div className="flex flex-col gap-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-black text-text-900 tracking-tight text-center">
              <span className="text-primary-600">{userDetails?.username}</span>&apos;s Collections
            </h1>
            {isOwner && (
              <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-2 px-3 py-1 bg-primary-50 rounded-full border border-primary-100">
                Owner View
              </span>
            )}
          </div>

          <div className="flex flex-col w-full gap-4">
            <CollapsibleSection title="Filters">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                {/* Favorite Filters */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-black text-text-400 uppercase tracking-widest ml-1">Type</span>
                  <div className="flex flex-wrap gap-2">
                    {favoriteFilters.map(filter => (
                      <button
                        key={String(filter.id)}
                        onClick={() => setIsFavoriteFilter(filter.id)}
                        className={cn(
                          "px-5 py-2 text-xs font-black rounded-xl border transition-all duration-300 uppercase tracking-wider",
                          isFavoriteFilter === filter.id
                            ? "bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200"
                            : "bg-white text-text-500 border-background-200 hover:border-primary-300 hover:text-primary-600",
                        )}
                      >
                        <span className="mr-2">{filter.emoji}</span>
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visibility Filters */}
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="visibility-filter"
                    className="text-[10px] font-black text-text-400 uppercase tracking-widest ml-1"
                  >
                    Visibility
                  </label>
                  <div className="relative">
                    <select
                      id="visibility-filter"
                      value={visibilityFilter || ""}
                      onChange={e => setVisibilityFilter(e.target.value || null)}
                      className="w-full h-11 bg-white border border-background-200 rounded-xl px-4 py-2 text-xs font-black text-text-700 appearance-none focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      {visibilityOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Mode Filters */}
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="mode-filter"
                    className="text-[10px] font-black text-text-400 uppercase tracking-widest ml-1"
                  >
                    Mode
                  </label>
                  <div className="relative">
                    <select
                      id="mode-filter"
                      value={modeFilter || ""}
                      onChange={e => setModeFilter(e.target.value || null)}
                      className="w-full h-11 bg-white border border-background-200 rounded-xl px-4 py-2 text-xs font-black text-text-700 appearance-none focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      {modeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {isOwner && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full md:w-auto px-12 py-4 text-sm font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary-200 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Create New Collection
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-background-200 p-6 md:p-8 min-h-212.5">
          {isLoading && !isFetchingNextPage ? (
            <GridList columnCount={5}>
              {skeletonIds.map(skeletonId => (
                <Skeleton key={skeletonId} className="aspect-3/4 w-full rounded-3xl" />
              ))}
            </GridList>
          ) : (
            <VirtualGridList
              items={allItems}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              className="h-200"
              columnCount={5}
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
