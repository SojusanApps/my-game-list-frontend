import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFriendshipRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendships,
  deleteFriendship,
  FriendshipFriendshipRequestsListDataQuery,
  FriendshipFriendshipRequestsCreateDataBody,
  FriendshipFriendshipRequestsAcceptCreateDataPath,
  FriendshipFriendshipRequestsRejectCreateDataPath,
  FriendshipFriendshipsListDataQuery,
  FriendshipFriendshipsDestroyDataPath,
} from "../api/friendship";
import { friendshipKeys } from "@/lib/queryKeys";

export const useGetFriendshipRequests = (query?: FriendshipFriendshipRequestsListDataQuery) => {
  return useQuery({
    queryKey: friendshipKeys.requestList(query),
    queryFn: () => getFriendshipRequests(query),
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: FriendshipFriendshipRequestsCreateDataBody) => sendFriendRequest(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendshipKeys.requests,
      });
    },
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (path: FriendshipFriendshipRequestsAcceptCreateDataPath) => acceptFriendRequest(path),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendshipKeys.requests,
      });
      queryClient.invalidateQueries({
        queryKey: friendshipKeys.all,
      });
    },
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (path: FriendshipFriendshipRequestsRejectCreateDataPath) => rejectFriendRequest(path),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendshipKeys.requests,
      });
    },
  });
};

export const useGetFriendships = (query?: FriendshipFriendshipsListDataQuery) => {
  return useQuery({
    queryKey: friendshipKeys.list(query),
    queryFn: () => getFriendships(query),
  });
};

export const useDeleteFriendship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (path: FriendshipFriendshipsDestroyDataPath) => deleteFriendship(path),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendshipKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: friendshipKeys.requests,
      });
    },
  });
};
