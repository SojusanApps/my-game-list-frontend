import {
  UserService,
  UserUsersChangePasswordCreateData,
  UserUsersChangeUsernameCreateData,
  UserUsersCreateData,
  UserUsersListData,
} from "@/client";
import StatusCode from "@/utils/StatusCode";
import { handleApiError } from "@/utils/apiUtils";

export type UserUsersListDataQuery = UserUsersListData["query"];

export const getUserLists = async (query?: UserUsersListDataQuery) => {
  const { data, response } = await UserService.userUsersList({ query });
  if (response?.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching users");
  }
  return data;
};

export const getUserDetails = async (id: number) => {
  const { data, response } = await UserService.userUsersRetrieve({ path: { id } });
  if (response?.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error fetching user details");
  }
  return data;
};

export type UserUsersCreateDataBody = UserUsersCreateData["body"];
export const createUser = async (body: UserUsersCreateDataBody) => {
  const { data, response } = await UserService.userUsersCreate({ body });
  if (response?.status !== StatusCode.CREATED || !data) {
    return await handleApiError(response, "Error creating user");
  }
  return data;
};

export type UserUsersChangeUsernameCreateDataBody = UserUsersChangeUsernameCreateData["body"];
export const changeUsername = async (body: UserUsersChangeUsernameCreateDataBody) => {
  const { data, response } = await UserService.userUsersChangeUsernameCreate({ body });
  if (response?.status !== StatusCode.OK || !data) {
    return await handleApiError(response, "Error changing username");
  }
  return data;
};

export type UserUsersChangePasswordCreateDataBody = UserUsersChangePasswordCreateData["body"];
export const changePassword = async (body: UserUsersChangePasswordCreateDataBody) => {
  const { response } = await UserService.userUsersChangePasswordCreate({ body });
  if (response?.status !== StatusCode.NO_CONTENT) {
    return await handleApiError(response, "Error changing password");
  }
};
