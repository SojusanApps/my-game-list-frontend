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
} from "../services/api/game";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { GameList, PaginatedGameList, PaginatedGameListList } from "../client";

export const useGetGenresAllValues = () => {
  return useQuery({
    queryKey: ["genres", "all-values"],
    queryFn: getGenresAllValues,
  });
};

export const useGetGameMediasAllValues = () => {
  return useQuery({
    queryKey: ["game-medias", "all-values"],
    queryFn: getGameMediaAllValues,
  });
};

export const useGetPlatformsAllValues = () => {
  return useQuery({
    queryKey: ["platforms", "all-values"],
    queryFn: getPlatformsAllValues,
  });
};

export const useGetGamesList = (
  query?: GameGamesListDataQuery,
  options?: Omit<UseQueryOptions<unknown, Error, PaginatedGameList>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["games", "list", query],
    queryFn: async () => {
      const data = await getGamesList(query);
      return data;
    },
    ...options,
  });
};

export const useGetGamesDetails = (id: number) => {
  return useQuery({
    queryKey: ["games", "detail", id],
    queryFn: () => getGamesDetail(id),
  });
};

export const useGetGameReviewsList = (query?: GameGameReviewsListDataQuery) => {
  return useQuery({
    queryKey: ["game-reviews", "list", query],
    queryFn: () => getGameReviewsList(query),
  });
};

export const useGetGameReviewsDetail = (id: number) => {
  return useQuery({
    queryKey: ["game-reviews", "detail", id],
    queryFn: () => getGameReviewsDetail(id),
  });
};

export const useGetGameListsList = (
  query?: GameGameListsListDataQuery,
  options?: Omit<UseQueryOptions<unknown, Error, PaginatedGameListList>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["game-lists", "list", query],
    queryFn: () => getGameListsList(query),
    ...options,
  });
};

export const useGetGameListByFilters = (
  query?: GameGameListsListDataQuery,
  options?: Omit<UseQueryOptions<unknown, Error, GameList>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["game-lists", "by-filters", query],
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
        queryKey: ["game-lists"],
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
        queryKey: ["game-lists"],
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
        queryKey: ["game-lists"],
      });
    },
  });
};

export const useGetCompaniesList = (query?: GameCompaniesListDataQuery) => {
  return useQuery({
    queryKey: ["companies", "list", query],
    queryFn: () => getCompaniesList(query),
  });
};
