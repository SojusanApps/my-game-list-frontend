import { createUser, getUserDetails, UserUsersCreateDataBody } from "@/services/api/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserDetails = (id: number) => {
  return useQuery({
    queryKey: ["users", "detail", id],
    queryFn: () => getUserDetails(id),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UserUsersCreateDataBody) => createUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
