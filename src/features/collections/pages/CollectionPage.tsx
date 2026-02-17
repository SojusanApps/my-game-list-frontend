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
import { CollectionItem, ModeEnum, TypeEnum } from "@/client";
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

  const handleDeleteItem = React.useCallback(
    (itemId: number, gameTitle: string) => {
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
    },
    [collectionId, removeCollectionItem],
  );

  const allItems = React.useMemo(
    () => (collection?.type === TypeEnum.NOR ? itemsResults?.pages.flatMap(page => page.results) || [] : []),
    [itemsResults, collection?.type],
  );
  const totalCount = itemsResults?.pages[0]?.count ?? 0;

  const renderView = () => {
    if (!collection) return null;

    switch (collection.type) {
      case TypeEnum.TIE:
        return <TierListView collectionId={collectionId!} isOwner={canEdit} onRemove={handleDeleteItem} />;
      case TypeEnum.RNK:
        return <RankingListView collectionId={collectionId!} isOwner={canEdit} onRemove={handleDeleteItem} />;
      case TypeEnum.NOR:
      default:
        return isItemsLoading && !isFetchingNextPage ? (
          <GridList columnCount={8}>
            {skeletonIds.map(skeletonId => (
              <Skeleton key={skeletonId} className="aspect-264/374 w-full rounded-xl" />
            ))}
          </GridList>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 bg-linear-to-r from-primary-50 to-secondary-50 p-4 rounded-2xl border border-primary-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-black text-primary-600 leading-none">{totalCount}</div>
                  <div className="text-xs font-semibold text-text-500 uppercase tracking-wider mt-0.5">Total Games</div>
                </div>
              </div>
            </div>

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
          </>
        );
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

        <div
          className={cn(
            "rounded-2xl min-h-212.5 transition-all outline-hidden",
            collection?.type === TypeEnum.NOR || !collection?.type
              ? "bg-white shadow-sm border border-background-200 p-6 md:p-8"
              : "",
          )}
        >
          {renderView()}

          {!isItemsLoading && collection?.type === TypeEnum.NOR && allItems.length === 0 && (
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
