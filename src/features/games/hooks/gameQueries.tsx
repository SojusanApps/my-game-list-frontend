import {
  getGenresAllValues,
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
  getGameMediaAllValues,
  getCompaniesList,
  GameCompaniesListDataQuery,
  getPlatformsAllValues,
} from "../api/game";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { GameList, PaginatedGameList, PaginatedGameListList } from "@/client";
import { gameKeys, gameListKeys, gameReviewKeys } from "@/lib/queryKeys";

export const useGetGenresAllValues = () => {
  return useQuery({
    queryKey: gameKeys.genres,
    queryFn: getGenresAllValues,
    staleTime: Infinity,
  });
};

export const useGetGameMediasAllValues = () => {
  return useQuery({
    queryKey: gameKeys.medias,
    queryFn: getGameMediaAllValues,
    staleTime: Infinity,
  });
};

export const useGetPlatformsAllValues = () => {
  return useQuery({
    queryKey: gameKeys.platforms,
    queryFn: getPlatformsAllValues,
    staleTime: Infinity,
  });
};

export const useGetGamesList = (
  query?: GameGamesListDataQuery,
  options?: Omit<UseQueryOptions<unknown, Error, PaginatedGameList>, "queryKey" | "queryFn">,
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

export const useGetGamesDetails = (id: number) => {
  return useQuery({
    queryKey: gameKeys.detail(id),
    queryFn: () => getGamesDetail(id),
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

  return useMutation({
    mutationFn: (body: GameListCreateDataBody) => createGameList(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gameListKeys.all,
      });
    },
  });
};

export const usePartialUpdateGameList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: GameListPartialUpdateDataBody }) => partialUpdateGameList(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gameListKeys.all,
      });
    },
  });
};

export const useDeleteGameList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteGameList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gameListKeys.all,
      });
    },
  });
};

export const useGetCompaniesList = (query?: GameCompaniesListDataQuery) => {
  return useQuery({
    queryKey: gameKeys.companyList(query),
    queryFn: () => getCompaniesList(query),
  });
};
