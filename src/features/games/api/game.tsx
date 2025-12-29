import StatusCode from "@/utils/StatusCode";
import { handleApiError } from "@/utils/apiUtils";
import {
  GameService,
  GameGamesListData,
  GameCompaniesListData,
  GameGameListsListData,
  GameGameReviewsListData,
  GameGameListsCreateData,
  GameGameListsPartialUpdateData,
  GamePlatformsListData,
  GameGenresListData,
  GameGameMediasListData,
} from "@/client";

export type GameCompaniesListDataQuery = GameCompaniesListData["query"];
export type GameGamesListDataQuery = GameGamesListData["query"];
export type GameGameListsListDataQuery = GameGameListsListData["query"];
export type GameGameReviewsListDataQuery = GameGameReviewsListData["query"];
export type GamePlatformsListDataQuery = GamePlatformsListData["query"];
export type GameGenresListDataQuery = GameGenresListData["query"];

export const getGenresList = async (query?: GameGenresListDataQuery) => {
  const { data, response } = await GameService.gameGenresList({ query });
  if (response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching genres");
  }
  return data;
};

export const getPlatformsList = async (query?: GamePlatformsListDataQuery) => {
  const { data, response } = await GameService.gamePlatformsList({ query });
  if (response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching platforms");
  }
  return data;
};

export const getCompaniesList = async (query?: GameCompaniesListDataQuery) => {
  const { data, response } = await GameService.gameCompaniesList({ query });
  if (response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching companies");
  }
  return data;
};

export const getGamesList = async (query?: GameGamesListDataQuery) => {
  const { data, response } = await GameService.gameGamesList({
    query,
    querySerializer: { array: { explode: true, style: "form" } },
  });
  if (response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching games");
  }
  return data;
};

export const getGamesDetail = async (id: number) => {
  const { data, response } = await GameService.gameGamesRetrieve({ path: { id } });
  if (response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching game details");
  }
  return data;
};

export const getGameListsList = async (query?: GameGameListsListDataQuery) => {
  const { data, response } = await GameService.gameGameListsList({ query });
  if (response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching game list");
  }
  return data;
};

export const getGameListByFilters = async (query?: GameGameListsListDataQuery) => {
  const data = await getGameListsList(query);
  if (data.count > 1) {
    throw new Error("Multiple game list entries found for these filters");
  }
  return data.count === 0 ? null : data.results[0];
};

export const deleteGameList = async (id: number) => {
  const { response } = await GameService.gameGameListsDestroy({ path: { id } });
  if (response.status !== StatusCode.NO_CONTENT) {
    return await handleApiError(response, "Error deleting game list entry");
  }
};

export type GameListCreateDataBody = GameGameListsCreateData["body"];
export const createGameList = async (body: GameListCreateDataBody) => {
  const { data, response } = await GameService.gameGameListsCreate({ body });
  if (response.status !== StatusCode.CREATED || !data) {
    return await handleApiError(response, "Error creating game list entry");
  }
  return data;
};

export type GameListPartialUpdateDataBody = GameGameListsPartialUpdateData["body"];
export const partialUpdateGameList = async (id: number, body: GameListPartialUpdateDataBody) => {
  const { data, response } = await GameService.gameGameListsPartialUpdate({ path: { id }, body });
  if (response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error updating game list entry");
  }
  return data;
};

export const getGameReviewsList = async (query?: GameGameReviewsListDataQuery) => {
  const { data, response } = await GameService.gameGameReviewsList({ query });
  if (response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching game reviews");
  }
  return data;
};

export const getGameReviewsDetail = async (id: number) => {
  const { data, response } = await GameService.gameGameReviewsRetrieve({ path: { id } });
  if (response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching game review details");
  }
  return data;
};

export type GameGameMediasListDataQuery = GameGameMediasListData["query"];
export const getGameMediaList = async (query?: GameGameMediasListDataQuery) => {
  const { data, response } = await GameService.gameGameMediasList({ query });
  if (response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching game medias");
  }
  return data;
};
