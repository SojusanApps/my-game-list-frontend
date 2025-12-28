import { createUser, getUserDetails, UserUsersCreateDataBody } from "../api/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/queryKeys";
import { useAppMutation } from "@/hooks/useAppMutation";

export const useGetUserDetails = (id: number) => {
  // To ensure id is a number
  const idParsed = Number(id);

  return useQuery({
    queryKey: userKeys.detail(idParsed),
    queryFn: () => getUserDetails(idParsed),
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
