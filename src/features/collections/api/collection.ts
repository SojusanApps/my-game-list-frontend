import StatusCode from "@/utils/StatusCode";
import { handleApiError } from "@/utils/apiUtils";
import { CollectionService, CollectionCollectionsListData, CollectionCollectionsCreateData } from "@/client";

export type CollectionCollectionsListDataQuery = CollectionCollectionsListData["query"];

export const getCollectionsList = async (query?: CollectionCollectionsListDataQuery) => {
  const { data, response } = await CollectionService.collectionCollectionsList({ query });
  if (!response || response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching collections");
  }
  return data;
};

export const getCollectionDetail = async (id: number) => {
  const { data, response } = await CollectionService.collectionCollectionsRetrieve({ path: { id } });
  if (!response || response.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching collection details");
  }
  return data;
};

export type CollectionCollectionsCreateDataBody = CollectionCollectionsCreateData["body"];

export const createCollection = async (body: CollectionCollectionsCreateDataBody) => {
  const { data, response } = await CollectionService.collectionCollectionsCreate({ body });
  if (!response || response.status !== StatusCode.CREATED || !data) {
    return await handleApiError(response, "Error creating collection");
  }
  return data;
};
