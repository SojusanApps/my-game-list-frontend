import { LocalStorageUserType } from "@/types";
import { TokenService } from "@/client";
import StatusCode from "@/utils/StatusCode";
import { useAuthStore } from "../store/authStore";

export const getStoredUser = (): LocalStorageUserType | null => {
  return useAuthStore.getState().user;
};

export const setStoredUser = (user: LocalStorageUserType) => {
  useAuthStore.getState().login(user);
};

export const clearStoredUser = () => {
  useAuthStore.getState().logout();
};

export const refreshToken = async (): Promise<string | undefined> => {
  const user = useAuthStore.getState().user;
  if (!user) {
    return undefined;
  }

  const { data, error, response } = await TokenService.tokenRefreshCreate({
    body: { access: user.token, refresh: user.refreshToken },
  });

  if (error || !data || response?.status !== StatusCode.OK) {
    return undefined;
  }

  const newUser = { ...user, token: data.access };
  useAuthStore.getState().login(newUser);
  return data.access;
};
