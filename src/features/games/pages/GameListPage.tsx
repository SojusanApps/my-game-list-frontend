import * as React from "react";
import { useParams } from "react-router-dom";

import ItemOverlay from "@/components/ItemOverlay/ItemOverlay";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { StatusEnum } from "@/client";
import { useGetUserDetails } from "@/features/users/hooks/userQueries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getGameListsList } from "../api/game";
import { useInView } from "react-intersection-observer";

type FetchItemsQueryKey = ["game-list-results", string, StatusEnum];

const fetchItems = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: (string | undefined | null)[];
}) => {
  const [, id, selectedGameStatus] = queryKey as FetchItemsQueryKey;
  const query = { page: pageParam, user: +id, status: selectedGameStatus ? [selectedGameStatus] : undefined };
  const data = await getGameListsList(query);
  return data;
};

export default function GameListPage(): React.JSX.Element {
  const { id } = useParams();
  const { ref: observerTargetRef, inView } = useInView({ threshold: 1 });
  const { data: userDetails } = useGetUserDetails(+id!);
  const [selectedGameStatus, setSelectedGameStatus] = React.useState<StatusEnum | null>(null);

  const {
    data: gameListResults,
    error: errorFetchingData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["game-list-results", id, selectedGameStatus],
    queryFn: fetchItems,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.next !== null && lastPage.next !== undefined) {
        return lastPageParam + 1;
      }
      return null;
    },
  });

  React.useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, selectedGameStatus]);

  return (
    <div>
      <div className="flex flex-col gap-8 max-w-[60%] mt-2 mx-auto">
        <p className="text-3xl mx-auto">
          <strong className="text-secondary-950">{userDetails?.username}</strong>&apos;s Game List
        </p>
        <div className="join mx-auto">
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
          <div className="grid grid-cols-7 gap-1">
            {gameListResults?.pages
              .map(page => page?.results)
              .flat()
              .map(gameListItem => (
                <div key={gameListItem.id}>
                  <ItemOverlay
                    className="flex-none"
                    name={gameListItem.title}
                    itemPageUrl={`/game/${gameListItem.game_id}`}
                    itemCoverUrl={getIGDBImageURL(gameListItem.game_cover_image, IGDBImageSize.COVER_BIG_264_374)}
                  />
                </div>
              ))}
          </div>
          {isLoading && <p>Loading ...</p>}
          {errorFetchingData && <p>Error: {errorFetchingData.message}</p>}
          {hasNextPage && <div ref={observerTargetRef} />}
        </div>
      </div>
    </div>
  );
}
