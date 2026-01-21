import {
  getGenresList,
  getGamesList,
  GameGamesListDataQuery,
  getGamesDetail,
  getGameReviewsDetail,
  GameGameReviewsListDataQuery,
  getGameReviewsList,
  GameGameListsListDataQuery,
  getGameListsList,
  deleteGameList,
  createGameList,
  GameListCreateDataBody,
  GameListPartialUpdateDataBody,
  partialUpdateGameList,
  getGameListByFilters,
  getGameMediaList,
  getCompaniesList,
  getCompanyDetail,
  GameCompaniesListDataQuery,
  getPlatformsList,
  getGameEnginesList,
  getGameModesList,
  getGameStatusesList,
  getGameTypesList,
  getPlayerPerspectivesList,
} from "../api/game";
import { useInfiniteQuery, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { GameList, PaginatedGameSimpleListList, PaginatedGameListList } from "@/client";
import { gameKeys, gameListKeys, gameReviewKeys, userKeys } from "@/lib/queryKeys";

export const useGetPlatformsInfiniteQuery = (name?: string) => {
  return useInfiniteQuery({
    queryKey: gameKeys.platformsInfinite(name),
    queryFn: ({ pageParam = 1 }) => getPlatformsList({ name, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};

export const useGetGameEnginesInfiniteQuery = (name?: string) => {
  return useInfiniteQuery({
    queryKey: gameKeys.enginesInfinite(name),
    queryFn: ({ pageParam = 1 }) => getGameEnginesList({ name, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};

export const useGetGameModesInfiniteQuery = (name?: string) => {
  return useInfiniteQuery({
    queryKey: gameKeys.modesInfinite(name),
    queryFn: ({ pageParam = 1 }) => getGameModesList({ name, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};

export const useGetGameStatusesInfiniteQuery = (status?: string) => {
  return useInfiniteQuery({
    queryKey: gameKeys.statusesInfinite(status),
    queryFn: ({ pageParam = 1 }) => getGameStatusesList({ status, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};

export const useGetGameTypesInfiniteQuery = (type?: string) => {
  return useInfiniteQuery({
    queryKey: gameKeys.typesInfinite(type),
    queryFn: ({ pageParam = 1 }) => getGameTypesList({ type, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};

export const useGetPlayerPerspectivesInfiniteQuery = (name?: string) => {
  return useInfiniteQuery({
    queryKey: gameKeys.perspectivesInfinite(name),
    queryFn: ({ pageParam = 1 }) => getPlayerPerspectivesList({ name, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};
import { useAppMutation } from "@/hooks/useAppMutation";

export const useGetGenresInfiniteQuery = (name?: string) => {
  return useInfiniteQuery({
    queryKey: gameKeys.genresInfinite(name),
    queryFn: ({ pageParam = 1 }) => getGenresList({ name, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};

export const useGetGameMediasInfiniteQuery = (name?: string) => {
  return useInfiniteQuery({
    queryKey: gameKeys.mediasInfinite(name),
    queryFn: ({ pageParam = 1 }) => getGameMediaList({ name, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};

export const useGetGamesList = (
  query?: GameGamesListDataQuery,
  options?: Omit<UseQueryOptions<unknown, Error, PaginatedGameSimpleListList>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: gameKeys.list(query),
    queryFn: async () => {
      const data = await getGamesList(query);
      return data;
    },
    ...options,
  });
};

export const useGetGamesDetails = (id?: number) => {
  return useQuery({
    queryKey: gameKeys.detail(id ?? -1),
    queryFn: () => getGamesDetail(id as number),
    enabled: !!id,
  });
};

export const useGetGameReviewsList = (query?: GameGameReviewsListDataQuery) => {
  return useQuery({
    queryKey: gameReviewKeys.list(query),
    queryFn: () => getGameReviewsList(query),
  });
};

export const useGetGameReviewsDetail = (id: number) => {
  return useQuery({
    queryKey: gameReviewKeys.detail(id),
    queryFn: () => getGameReviewsDetail(id),
  });
};

export const useGetGameListsList = (
  query?: GameGameListsListDataQuery,
  options?: Omit<UseQueryOptions<unknown, Error, PaginatedGameListList>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: gameListKeys.list(query),
    queryFn: () => getGameListsList(query),
    ...options,
  });
};

export const useGetGameListByFilters = (
  query?: GameGameListsListDataQuery,
  options?: Omit<UseQueryOptions<GameList | null, Error, GameList | null>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: gameListKeys.byFilters(query),
    queryFn: () => getGameListByFilters(query),
    ...options,
  });
};

export const useCreateGameList = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (body: GameListCreateDataBody) => createGameList(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gameListKeys.all,
      });
      // Also invalidate user details to update statistics
      queryClient.invalidateQueries({
        queryKey: userKeys.details(),
      });
    },
  });
};

export const usePartialUpdateGameList = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: ({ id, body }: { id: number; body: GameListPartialUpdateDataBody }) => partialUpdateGameList(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gameListKeys.all,
      });
      // Also invalidate user details to update statistics
      queryClient.invalidateQueries({
        queryKey: userKeys.details(),
      });
    },
  });
};

export const useDeleteGameList = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (id: number) => deleteGameList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gameListKeys.all,
      });
      // Also invalidate user details to update statistics
      queryClient.invalidateQueries({
        queryKey: userKeys.details(),
      });
    },
  });
};

export const useGetCompaniesInfiniteQuery = (name?: string) => {
  return useInfiniteQuery({
    queryKey: gameKeys.companiesInfinite(name),
    queryFn: ({ pageParam = 1 }) => getCompaniesList({ name, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};

export const useGetCompaniesList = (query?: GameCompaniesListDataQuery) => {
  return useQuery({
    queryKey: gameKeys.companyList(query),
    queryFn: () => getCompaniesList(query),
  });
};

export const useGetCompanyDetail = (id?: number) => {
  return useQuery({
    queryKey: gameKeys.companyDetail(id ?? -1),
    queryFn: () => getCompanyDetail(id as number),
    enabled: !!id,
  });
};
