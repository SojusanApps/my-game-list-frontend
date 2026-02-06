import StatusCode from "@/utils/StatusCode";
import { handleApiError } from "@/utils/apiUtils";
import {
  CollectionService,
  CollectionCollectionsListData,
  CollectionCollectionsCreateData,
  CollectionCollectionsPartialUpdateData,
  CollectionCollectionItemsListData,
  CollectionCollectionItemsCreateData,
  CollectionCollectionItemsPartialUpdateData,
  CollectionWritable,
} from "@/client";

export type CollectionCollectionsListDataQuery = CollectionCollectionsListData["query"];

export const getCollectionsList = async (query?: CollectionCollectionsListDataQuery) => {
  const { data, response } = await CollectionService.collectionCollectionsList({ query });
  if (response?.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching collections");
  }
  return data;
};

export const getCollectionDetail = async (id: number) => {
  const { data, response } = await CollectionService.collectionCollectionsRetrieve({ path: { id } });
  if (response?.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching collection details");
  }
  return data;
};

export type CollectionCollectionsCreateDataBody = CollectionCollectionsCreateData["body"];

export const createCollection = async (body: CollectionCollectionsCreateDataBody) => {
  const { data, response } = await CollectionService.collectionCollectionsCreate({ body });
  if (response?.status !== StatusCode.CREATED || !data) {
    return await handleApiError(response, "Error creating collection");
  }
  return data;
};

export type CollectionCollectionsPartialUpdateDataBody = CollectionCollectionsPartialUpdateData["body"];

export const updateCollection = async (id: number, body: CollectionCollectionsPartialUpdateDataBody) => {
  const { data, response } = await CollectionService.collectionCollectionsPartialUpdate({ path: { id }, body });
  if (response?.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error updating collection");
  }
  return data;
};

export const deleteCollection = async (id: number) => {
  const { response } = await CollectionService.collectionCollectionsDestroy({ path: { id } });
  if (response?.status !== StatusCode.NO_CONTENT) {
    return await handleApiError(response, "Error deleting collection");
  }
};

export type CollectionCollectionItemsListDataQuery = CollectionCollectionItemsListData["query"];

export const getCollectionItems = async (query?: CollectionCollectionItemsListDataQuery) => {
  const { data, response } = await CollectionService.collectionCollectionItemsList({ query });
  if (response?.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching collection items");
  }
  return data;
};

export type CollectionCollectionItemsCreateDataBody = CollectionCollectionItemsCreateData["body"];

export const addCollectionItem = async (body: CollectionCollectionItemsCreateDataBody) => {
  const { data, response } = await CollectionService.collectionCollectionItemsCreate({ body });
  if (response?.status !== StatusCode.CREATED || !data) {
    return await handleApiError(response, "Error adding item to collection");
  }
  return data;
};

export const removeCollectionItem = async (id: number) => {
  const { response } = await CollectionService.collectionCollectionItemsDestroy({ path: { id } });
  if (response?.status !== StatusCode.NO_CONTENT) {
    return await handleApiError(response, "Error removing item from collection");
  }
};

export type CollectionCollectionItemsPartialUpdateDataBody = CollectionCollectionItemsPartialUpdateData["body"];

export const updateCollectionItem = async (id: number, body: CollectionCollectionItemsPartialUpdateDataBody) => {
  const { data, response } = await CollectionService.collectionCollectionItemsPartialUpdate({ path: { id }, body });
  if (response?.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error updating collection item");
  }
  return data;
};

export const reorderCollectionItems = async (
  id: number,
  items: { id: number; order: number; description?: string }[],
) => {
  const { data, response } = await CollectionService.collectionCollectionsReorderItemsCreate({
    path: { id },
    body: items as unknown as CollectionWritable,
  });

  if (!response || (response.status !== StatusCode.OK && response.status !== StatusCode.NO_CONTENT)) {
    return await handleApiError(response, "Error reordering collection items");
  }

  return data || { id };
};
