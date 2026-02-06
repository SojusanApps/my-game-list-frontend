import * as React from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import {
  getCollectionsList,
  createCollection,
  getCollectionDetail,
  getCollectionItems,
  updateCollection,
  deleteCollection,
  addCollectionItem,
  removeCollectionItem,
  updateCollectionItem,
  reorderCollectionItems,
} from "../api/collection";
import { collectionKeys } from "@/lib/queryKeys";
import { useGetFriendshipsInfiniteQuery } from "@/features/users/hooks/friendshipQueries";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { TokenInfoType } from "@/types";

const fetchCollections = async ({ pageParam = 1, queryKey }: { pageParam?: number; queryKey: readonly unknown[] }) => {
  const [, , userId, filters] = queryKey as [string, string, number, object];
  const query = {
    page: pageParam,
    user: userId,
    ...filters,
  };
  return await getCollectionsList(query);
};

export const useCollectionsInfiniteQuery = (userId?: number, filters: object = {}) => {
  return useInfiniteQuery({
    queryKey: collectionKeys.infinite(userId ?? -1, filters),
    queryFn: fetchCollections,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.next !== null && lastPage.next !== undefined) {
        return lastPageParam + 1;
      }
      return null;
    },
    enabled: !!userId,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.all });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Parameters<typeof updateCollection>[1] }) =>
      updateCollection(id, body),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
};

export const useCollectionDetail = (id?: number) => {
  return useQuery({
    queryKey: collectionKeys.detail(id ?? -1),
    queryFn: () => getCollectionDetail(id!),
    enabled: !!id,
  });
};

const fetchCollectionItems = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: readonly unknown[];
}) => {
  const [, , collectionId, filters] = queryKey as [string, string, number, object];
  const query = {
    page: pageParam,
    collection: collectionId,
    ...filters,
  };
  return await getCollectionItems(query);
};

export const useCollectionItemsInfiniteQuery = (collectionId?: number, filters: object = {}) => {
  return useInfiniteQuery({
    queryKey: collectionKeys.items(collectionId ?? -1, filters),
    queryFn: fetchCollectionItems,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.next !== null && lastPage.next !== undefined) {
        return lastPageParam + 1;
      }
      return null;
    },
    enabled: !!collectionId,
  });
};

export const useAddCollectionItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCollectionItem,
    onSuccess: data => {
      // Invalidate all item lists for this collection regardless of filters
      queryClient.invalidateQueries({ queryKey: [...collectionKeys.all, "items", data.collection] });
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(data.collection) });
    },
  });
};

export const useRemoveCollectionItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId }: { itemId: number; collectionId: number }) => removeCollectionItem(itemId),
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: [...collectionKeys.all, "items", collectionId] });
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(collectionId) });
    },
  });
};

export const useUpdateCollectionItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Parameters<typeof updateCollectionItem>[1] }) =>
      updateCollectionItem(id, body),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [...collectionKeys.all, "items", data.collection] });
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(data.collection) });
    },
  });
};

export const useReorderCollectionItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      collectionId,
      items,
    }: {
      collectionId: number;
      items: { id: number; order: number; description?: string }[];
    }) => reorderCollectionItems(collectionId, items),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [...collectionKeys.all, "items", data.id] });
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(data.id) });
    },
  });
};

export const useFriendSearch = (searchTerm: string) => {
  const { user } = useAuth();
  const currentUserId = React.useMemo(() => {
    if (!user) return undefined;
    try {
      const decoded = jwtDecode<TokenInfoType>(user.token);
      return decoded.user_id;
    } catch {
      return undefined;
    }
  }, [user]);

  // Use a query object that always includes user to trigger initial load
  const query = React.useMemo(
    () => ({
      user: currentUserId,
      friend_username: searchTerm || undefined, // Keep as friend_username if that's what the user expected, or try friend__username
      search: searchTerm || undefined, // Also try standard search parameter
    }),
    [currentUserId, searchTerm],
  );

  return useGetFriendshipsInfiniteQuery(query);
};
