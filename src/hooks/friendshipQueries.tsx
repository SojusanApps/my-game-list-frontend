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
} from "@/services/api/friendship";

export const useGetFriendshipRequests = (query?: FriendshipFriendshipRequestsListDataQuery) => {
  return useQuery({
    queryKey: ["friendship-requests", query],
    queryFn: () => getFriendshipRequests(query),
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: FriendshipFriendshipRequestsCreateDataBody) => sendFriendRequest(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendship-requests"],
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
        queryKey: ["friendship-requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["friendships"],
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
        queryKey: ["friendship-requests"],
      });
    },
  });
};

export const useGetFriendships = (query?: FriendshipFriendshipsListDataQuery) => {
  return useQuery({
    queryKey: ["friendships", query],
    queryFn: () => getFriendships(query),
  });
};

export const useDeleteFriendship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (path: FriendshipFriendshipsDestroyDataPath) => deleteFriendship(path),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendships"],
      });
      queryClient.invalidateQueries({
        queryKey: ["friendship-requests"], // In case they want to re-add immediately, state should be clear
      });
    },
  });
};
