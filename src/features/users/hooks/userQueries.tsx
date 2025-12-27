import { createUser, getUserDetails, UserUsersCreateDataBody } from "../api/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/queryKeys";

export const useGetUserDetails = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserDetails(id),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UserUsersCreateDataBody) => createUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
    },
  });
};
