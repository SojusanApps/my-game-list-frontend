import {
  changePassword,
  changeUsername,
  createUser,
  getUserDetails,
  UserUsersChangePasswordCreateDataBody,
  UserUsersChangeUsernameCreateDataBody,
  UserUsersCreateDataBody,
} from "../api/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/queryKeys";
import { useAppMutation } from "@/hooks/useAppMutation";
import { ApiError } from "@/utils/apiUtils";

export const useGetUserDetails = (id?: number) => {
  return useQuery({
    queryKey: userKeys.detail(id ?? -1),
    queryFn: () => getUserDetails(id as number),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (body: UserUsersCreateDataBody) => createUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
    },
  });
};

export const useChangeUsername = (userId: number) => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (body: UserUsersChangeUsernameCreateDataBody) => changeUsername(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(userId),
      });
    },
    showErrorToast: error => !(error instanceof ApiError && error.fieldErrors),
  });
};

export const useChangePassword = () => {
  return useAppMutation({
    mutationFn: (body: UserUsersChangePasswordCreateDataBody) => changePassword(body),
    showErrorToast: error => !(error instanceof ApiError && error.fieldErrors),
  });
};
