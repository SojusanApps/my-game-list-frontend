import { LocalStorageUserType } from "@/types";
import { TokenService } from "@/client";
import StatusCode from "@/utils/StatusCode";

export const getStoredUser = (): LocalStorageUserType | null => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

export const setStoredUser = (user: LocalStorageUserType) => {
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("auth:updated"));
};

export const clearStoredUser = () => {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth:logout"));
};

export const refreshToken = async (): Promise<string | undefined> => {
  const user = getStoredUser();
  if (!user) return undefined;

  const { data, error, response } = await TokenService.tokenRefreshCreate({
    body: { access: user.token, refresh: user.refreshToken },
  });

  if (error || !data || response.status !== StatusCode.OK) {
    return undefined;
  }

  const newUser = { ...user, token: data.access };
  setStoredUser(newUser);
  return data.access;
};
