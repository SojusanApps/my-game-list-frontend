import * as React from "react";
import { useParams, Navigate } from "react-router-dom";
import ItemOverlay from "@/components/ui/ItemOverlay";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { GameList, StatusEnum } from "@/client";
import { useGetUserDetails } from "@/features/users/hooks/userQueries";
import { useGameListInfiniteQuery } from "../hooks/useGameListQueries";
import { idSchema } from "@/lib/validation";
import { PageMeta } from "@/components/ui/PageMeta";
import { GridList } from "@/components/ui/GridList";
import { Skeleton } from "@/components/ui/Skeleton";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import { cn } from "@/utils/cn";

export default function GameListPage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const userId = parsedId.data;
  const { data: userDetails, isLoading: isUserLoading } = useGetUserDetails(userId);
  const [selectedGameStatus, setSelectedGameStatus] = React.useState<StatusEnum | null>(null);

  const pageTitle = isUserLoading ? "Loading Game List..." : `${userDetails?.username}'s Game List`;

  const {
    data: gameListResults,
    error: errorFetchingData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGameListInfiniteQuery(userId, selectedGameStatus);

  const allItems = gameListResults?.pages.flatMap(page => page.results) || [];

  const statuses = [
    {
      id: null,
      label: "ALL",
      styles: "hover:bg-text-100 text-text-600 border-background-300",
      activeStyles: "bg-text-800 text-white border-text-800",
    },
    {
      id: StatusEnum.P,
      label: "Playing",
      styles: "hover:bg-success-50 text-success-700 border-success-200",
      activeStyles: "bg-success-100 text-success-900 border-success-300",
    },
    {
      id: StatusEnum.C,
      label: "Completed",
      styles: "hover:bg-primary-50 text-primary-700 border-primary-200",
      activeStyles: "bg-primary-100 text-primary-900 border-primary-300",
    },
    {
      id: StatusEnum.PTP,
      label: "Plan to Play",
      styles: "hover:bg-background-300 text-text-500 border-background-300",
      activeStyles: "bg-background-400 text-text-900 border-background-500",
    },
    {
      id: StatusEnum.OH,
      label: "On Hold",
      styles: "hover:bg-secondary-50 text-secondary-700 border-secondary-200",
      activeStyles: "bg-secondary-100 text-secondary-900 border-secondary-300",
    },
    {
      id: StatusEnum.D,
      label: "Dropped",
      styles: "hover:bg-error-50 text-error-700 border-error-200",
      activeStyles: "bg-error-100 text-error-900 border-error-300",
    },
  ];

  return (
    <div className="py-12 bg-background-200 min-h-screen">
      <PageMeta title={pageTitle} />
      <div className="flex flex-col gap-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl md:text-4xl font-bold text-text-900 tracking-tight text-center">
            <span className="text-primary-600">{userDetails?.username}</span>&apos;s Game List
          </h1>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {statuses.map(status => (
              <button
                key={String(status.id)}
                onClick={() => setSelectedGameStatus(status.id)}
                className={cn(
                  "px-5 py-2 text-xs md:text-sm font-bold rounded-full border transition-all duration-200 shadow-xs",
                  selectedGameStatus === status.id ? status.activeStyles : cn("bg-white", status.styles),
                )}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-background-200 p-6 md:p-8 min-h-212.5">
          {isLoading && !isFetchingNextPage ? (
            <GridList>
              {Array.from({ length: 21 }).map((_, i) => (
                <Skeleton key={i} className="aspect-264/374 w-full rounded-xl" />
              ))}
            </GridList>
          ) : (
            <VirtualGridList
              items={allItems}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              className="h-200"
              renderItem={(gameListItem: GameList) => (
                <ItemOverlay
                  key={gameListItem.id}
                  className="w-full"
                  name={gameListItem.title}
                  itemPageUrl={`/game/${gameListItem.game_id}`}
                  itemCoverUrl={getIGDBImageURL(gameListItem.game_cover_image, IGDBImageSize.COVER_BIG_264_374)}
                />
              )}
            />
          )}
          {errorFetchingData && (
            <div className="bg-error-50 border border-error-200 rounded-xl p-4 mt-4">
              <p className="text-error-600 text-center font-medium">Error: {errorFetchingData.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
