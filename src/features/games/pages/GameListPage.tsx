import * as React from "react";
import { useParams, Navigate } from "react-router-dom";
import ItemOverlay from "@/components/ui/ItemOverlay";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { StatusEnum, PaginatedGameListList } from "@/client";
import { useGetUserDetails } from "@/features/users/hooks/userQueries";
import { useGameListInfiniteQuery } from "../hooks/useGameListQueries";
import { useInView } from "react-intersection-observer";
import { idSchema } from "@/lib/validation";
import { PageMeta } from "@/components/ui/PageMeta";
import { GridList } from "@/components/ui/GridList";
import { Skeleton } from "@/components/ui/Skeleton";

export default function GameListPage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const userId = parsedId.data;
  const { ref: observerTargetRef, inView } = useInView({ threshold: 1 });
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

  React.useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, selectedGameStatus]);

  return (
    <div className="py-8">
      <PageMeta title={pageTitle} />
      <div className="flex flex-col gap-8 max-w-[70%] mt-2 mx-auto">
        <p className="text-3xl mx-auto text-text-900">
          <strong className="text-secondary-950">{userDetails?.username}</strong>&apos;s Game List
        </p>
        <div className="join mx-auto shadow-sm">
          <input
            className="join-item btn min-w-32"
            value="all"
            type="radio"
            name="options"
            aria-label="ALL"
            onChange={() => setSelectedGameStatus(null)}
          />
          <input
            className="join-item btn min-w-32"
            value={StatusEnum.C}
            type="radio"
            name="options"
            aria-label="Completed"
            onChange={() => setSelectedGameStatus(StatusEnum.C)}
          />
          <input
            className="join-item btn min-w-32"
            value={StatusEnum.PTP}
            type="radio"
            name="options"
            aria-label="Plan to Play"
            onChange={() => setSelectedGameStatus(StatusEnum.PTP)}
          />
          <input
            className="join-item btn min-w-32"
            value={StatusEnum.P}
            type="radio"
            name="options"
            aria-label="Playing"
            onChange={() => setSelectedGameStatus(StatusEnum.P)}
          />
          <input
            className="join-item btn min-w-32"
            value={StatusEnum.D}
            type="radio"
            name="options"
            aria-label="Dropped"
            onChange={() => setSelectedGameStatus(StatusEnum.D)}
          />
          <input
            className="join-item btn min-w-32"
            value={StatusEnum.OH}
            type="radio"
            name="options"
            aria-label="On Hold"
            onChange={() => setSelectedGameStatus(StatusEnum.OH)}
          />
        </div>
        <div>
          {isLoading && !isFetchingNextPage ? (
            <GridList>
              {Array.from({ length: 14 }).map((_, i) => (
                <Skeleton key={i} className="aspect-264/374 w-full" />
              ))}
            </GridList>
          ) : (
            <GridList>
              {gameListResults?.pages
                .map((page: PaginatedGameListList) => page?.results)
                .flat()
                .map(gameListItem => (
                  <ItemOverlay
                    key={gameListItem.id}
                    className="w-full"
                    name={gameListItem.title}
                    itemPageUrl={`/game/${gameListItem.game_id}`}
                    itemCoverUrl={getIGDBImageURL(gameListItem.game_cover_image, IGDBImageSize.COVER_BIG_264_374)}
                  />
                ))}
            </GridList>
          )}
          {isFetchingNextPage && (
            <GridList className="mt-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="aspect-264/374 w-full" />
              ))}
            </GridList>
          )}
          {errorFetchingData && <p className="text-error text-center mt-4">Error: {errorFetchingData.message}</p>}
          {hasNextPage && <div ref={observerTargetRef} className="h-10" />}
        </div>
      </div>
    </div>
  );
}
