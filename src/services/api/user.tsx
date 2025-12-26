import { UserService, UserUsersCreateData, UserUsersListData } from "@/client";
import StatusCode from "@/helpers/StatusCode";

export type UserUsersListDataQuery = UserUsersListData["query"];

export const getUserLists = async (query?: UserUsersListDataQuery) => {
  const { data, response } = await UserService.userUsersList({ query });
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching users");
  }
  return data;
};

export const getUserDetails = async (id: number) => {
  const { data, response } = await UserService.userUsersRetrieve({ path: { id } });
  if (response.status !== StatusCode.OK || !data) {
    throw new Error("Error fetching user");
  }
  return data;
};

export type UserUsersCreateDataBody = UserUsersCreateData["body"];
export const createUser = async (body: UserUsersCreateDataBody) => {
  const { data, response } = await UserService.userUsersCreate({ body });
  if (response.status !== StatusCode.CREATED || !data) {
    throw new Error("Error creating user");
  }
  return data;
};
