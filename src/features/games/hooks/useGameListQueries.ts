import { useInfiniteQuery } from "@tanstack/react-query";
import { getGameListsList } from "../api/game";
import { gameListKeys } from "@/lib/queryKeys";
import { StatusEnum } from "@/client";

const fetchGameListItems = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: readonly unknown[];
}) => {
  const [, , userId, status] = queryKey as [string, string, number, StatusEnum | null];
  const query = {
    page: pageParam,
    user: userId,
    status: status ? [status] : undefined,
  };
  return await getGameListsList(query);
};

export const useGameListInfiniteQuery = (userId: number, status: StatusEnum | null) => {
  return useInfiniteQuery({
    queryKey: gameListKeys.infinite(userId, status),
    queryFn: fetchGameListItems,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.next !== null && lastPage.next !== undefined) {
        return (lastPageParam as number) + 1;
      }
      return null;
    },
  });
};
