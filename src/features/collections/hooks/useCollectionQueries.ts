import * as React from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { getCollectionsList, createCollection } from "../api/collection";
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
