import StatusCode from "@/utils/StatusCode";
import {
  GameService,
  GameGamesListData,
  GameCompaniesListData,
  GameGameListsListData,
  GameGameReviewsListData,
  GameGameListsCreateData,
  GameGameListsPartialUpdateData,
} from "@/client";

export type GameCompaniesListDataQuery = GameCompaniesListData["query"];
export type GameGamesListDataQuery = GameGamesListData["query"];
export type GameGameListsListDataQuery = GameGameListsListData["query"];
export type GameGameReviewsListDataQuery = GameGameReviewsListData["query"];

export const getGenresAllValues = async () => {
  const { data, response } = await GameService.gameGenresAllValuesList();
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching genres");
  }
  return data;
};

export const getPlatformsAllValues = async () => {
  const { data, response } = await GameService.gamePlatformsAllValuesList();
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching platforms");
  }
  return data;
};

export const getCompaniesList = async (query?: GameCompaniesListDataQuery) => {
  const { data, response } = await GameService.gameCompaniesList({ query });
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching companies");
  }
  return data;
};

export const getGamesList = async (query?: GameGamesListDataQuery) => {
  const { data, response } = await GameService.gameGamesList({
    query,
    querySerializer: { array: { explode: true, style: "form" } },
  });
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching games");
  }
  return data;
};

export const getGamesDetail = async (id: number) => {
  const { data, response } = await GameService.gameGamesRetrieve({ path: { id } });
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching companies");
  }
  return data;
};

export const getGameListsList = async (query?: GameGameListsListDataQuery) => {
  const { data, response } = await GameService.gameGameListsList({ query });
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching games");
  }
  return data;
};

export const getGameListByFilters = async (query?: GameGameListsListDataQuery) => {
  const data = await getGameListsList(query);
  if (data.count > 1) {
    throw new Error("Error fetching game list by filters");
  }
  return data.count === 0 ? undefined : data.results[0];
};

export const deleteGameList = async (id: number) => {
  const { response } = await GameService.gameGameListsDestroy({ path: { id } });
  if (response.status !== StatusCode.NO_CONTENT) {
    throw new Error("Error deleting game list");
  }
};

export type GameListCreateDataBody = GameGameListsCreateData["body"];
export const createGameList = async (body: GameListCreateDataBody) => {
  const { data, response } = await GameService.gameGameListsCreate({ body });
  if (response.status !== StatusCode.CREATED || !data) {
    throw new Error("Error creating game list");
  }
  return data;
};

export type GameListPartialUpdateDataBody = GameGameListsPartialUpdateData["body"];
export const partialUpdateGameList = async (id: number, body: GameListPartialUpdateDataBody) => {
  const { data, response } = await GameService.gameGameListsPartialUpdate({ path: { id }, body });
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error updating game list");
  }
  return data;
};

export const getGameReviewsList = async (query?: GameGameReviewsListDataQuery) => {
  const { data, response } = await GameService.gameGameReviewsList({ query });
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching game reviews");
  }
  return data;
};

export const getGameReviewsDetail = async (id: number) => {
  const { data, response } = await GameService.gameGameReviewsRetrieve({ path: { id } });
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching game review details");
  }
  return data;
};

export const getGameMediaAllValues = async () => {
  const { data, response } = await GameService.gameGameMediasAllValuesList();
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching game medias");
  }
  return data;
};
