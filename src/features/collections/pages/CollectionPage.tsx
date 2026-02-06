import * as React from "react";
import { useParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import {
  useCollectionDetail,
  useCollectionItemsInfiniteQuery,
  useRemoveCollectionItem,
} from "../hooks/useCollectionQueries";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { jwtDecode } from "jwt-decode";
import { TokenInfoType } from "@/types";
import { idSchema } from "@/lib/validation";
import { PageMeta } from "@/components/ui/PageMeta";
import { Skeleton } from "@/components/ui/Skeleton";
import { CollectionHeader } from "../components/CollectionHeader";
import CreateCollectionModal from "../components/CreateCollectionModal";
import AddGameToCollectionModal from "../components/AddGameToCollectionModal";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import ItemOverlay from "@/components/ui/ItemOverlay";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import { CollectionItem, ModeEnum } from "@/client";
import { GridList } from "@/components/ui/GridList";
import TrashIcon from "@/components/ui/Icons/Trash";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { TierListView } from "../components/TierList/TierListView";
import { RankingListView } from "../components/RankingList/RankingListView";

export default function CollectionPage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);
  const collectionId = parsedId.success ? parsedId.data : undefined;

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isAddGameModalOpen, setIsAddGameModalOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"grid" | "tier" | "ranking">("grid");
  const { user } = useAuth();

  const {
    data: collection,
    isLoading: isCollectionLoading,
    error: collectionError,
  } = useCollectionDetail(collectionId);

  const {
    data: itemsResults,
    error: itemsError,
    isLoading: isItemsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCollectionItemsInfiniteQuery(collectionId);

  const { mutate: removeCollectionItem } = useRemoveCollectionItem();

  const skeletonIds = React.useMemo(() => Array.from({ length: 12 }).map((_, i) => `skeleton-${i}`), []);

  const isOwner = React.useMemo(() => {
    if (!user || !collection) return false;
    try {
      const decoded = jwtDecode<TokenInfoType>(user.token);
      return Number(decoded.user_id) === Number(collection.user.id);
    } catch {
      return false;
    }
  }, [user, collection]);

  const canEdit = React.useMemo(() => {
    if (isOwner) return true;
    if (!user || !collection) return false;
    try {
      const decoded = jwtDecode<TokenInfoType>(user.token);
      const userId = Number(decoded.user_id);

      return collection.mode === ModeEnum.C && collection.collaborators.some(c => Number(c.id) === userId);
    } catch {
      return false;
    }
  }, [isOwner, user, collection]);

  const handleDeleteItem = (itemId: number, gameTitle: string) => {
    if (!collectionId) return;
    if (confirm(`Are you sure you want to remove ${gameTitle} from this collection?`)) {
      removeCollectionItem(
        { itemId, collectionId },
        {
          onSuccess: () => toast.success("Game removed from collection"),
          onError: () => toast.error("Failed to remove game"),
        },
      );
    }
  };

  const allItems = React.useMemo(() => itemsResults?.pages.flatMap(page => page.results) || [], [itemsResults]);

  const renderView = () => {
    switch (viewMode) {
      case "grid":
        return isItemsLoading && !isFetchingNextPage ? (
          <GridList columnCount={8}>
            {skeletonIds.map(skeletonId => (
              <Skeleton key={skeletonId} className="aspect-264/374 w-full rounded-xl" />
            ))}
          </GridList>
        ) : (
          <VirtualGridList
            items={allItems}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            className="h-200"
            columnCount={8}
            rowHeight={280}
            renderItem={(item: CollectionItem) => (
              <div key={item.id} className="relative group w-full">
                <ItemOverlay
                  className="w-full"
                  name={item.game.title}
                  itemPageUrl={`/game/${item.game.id}`}
                  itemCoverUrl={getIGDBImageURL(item.game.cover_image_id ?? "", IGDBImageSize.COVER_BIG_264_374)}
                />

                {/* Added By Badge - Only show in Collaborative mode */}
                {collection?.mode === ModeEnum.C && (
                  <div className="absolute top-3 left-3 z-30 pointer-events-none">
                    <span className="bg-primary-600/80 text-white text-[8px] px-2 py-1 rounded-md uppercase font-black tracking-wider backdrop-blur-md shadow-lg border border-white/10 w-fit flex items-center gap-1">
                      <span className="opacity-60">BY</span> {item.added_by.username}
                    </span>
                  </div>
                )}

                {canEdit && (
                  <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8 rounded-full shadow-lg"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteItem(item.id, item.game.title);
                      }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          />
        );
      case "tier":
        return <TierListView initialItems={allItems} isOwner={canEdit} />;
      case "ranking":
        return <RankingListView collectionId={collectionId!} initialItems={allItems} isOwner={canEdit} />;
      default:
        return null;
    }
  };

  if (collectionError) {
    return (
      <div className="py-20 flex justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error-600 mb-2">Error Loading Collection</h1>
          <p className="text-text-600">{collectionError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen">
      <PageMeta title={collection?.name ?? "Collection Details"} />
      <div className="flex flex-col gap-10 max-w-7xl mx-auto px-4">
        {/* Header Section */}
        {isCollectionLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-64 rounded-full" />
            <Skeleton className="h-12 w-96 rounded-lg" />
            <Skeleton className="h-4 w-full max-w-2xl rounded-lg" />
          </div>
        ) : (
          collection && (
            <CollectionHeader
              collection={collection}
              onEdit={() => setIsModalOpen(true)}
              onAddGame={() => setIsAddGameModalOpen(true)}
            />
          )
        )}

        {/* View Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-background-50 p-1 rounded-2xl border border-background-100 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                viewMode === "grid"
                  ? "bg-white text-primary-600 shadow-sm border border-background-100"
                  : "text-text-400 hover:text-text-600",
              )}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode("tier")}
              className={cn(
                "px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                viewMode === "tier"
                  ? "bg-white text-secondary-600 shadow-sm border border-background-100"
                  : "text-text-400 hover:text-text-600",
              )}
            >
              Tier List
            </button>
            <button
              onClick={() => setViewMode("ranking")}
              className={cn(
                "px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                viewMode === "ranking"
                  ? "bg-white text-amber-600 shadow-sm border border-background-100"
                  : "text-text-400 hover:text-text-600",
              )}
            >
              Ranking
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div
          className={cn(
            "rounded-2xl min-h-212.5 transition-all outline-hidden",
            viewMode === "grid" ? "bg-white shadow-sm border border-background-200 p-6 md:p-8" : "",
          )}
        >
          {renderView()}

          {!isItemsLoading && allItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-background-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🎮</span>
              </div>
              <h3 className="text-lg font-bold text-text-900">No games in this collection</h3>
              <p className="text-text-500 max-w-xs mt-2">This collection is empty.</p>
            </div>
          )}

          {itemsError && (
            <div className="bg-error-50 border border-error-200 rounded-xl p-4 mt-4">
              <p className="text-error-600 text-center font-medium">Error loading games: {itemsError.message}</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && collection && (
        <CreateCollectionModal onClose={() => setIsModalOpen(false)} initialData={collection} mode="edit" />
      )}

      {isAddGameModalOpen && collection && (
        <AddGameToCollectionModal onClose={() => setIsAddGameModalOpen(false)} collectionId={collection.id} />
      )}
    </div>
  );
}
