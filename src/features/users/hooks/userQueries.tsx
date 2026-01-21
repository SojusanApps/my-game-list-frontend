import { createUser, getUserDetails, UserUsersCreateDataBody } from "../api/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/queryKeys";
import { useAppMutation } from "@/hooks/useAppMutation";

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
