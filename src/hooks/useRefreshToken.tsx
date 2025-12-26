import { LocalStorageUserType } from "@/helpers/CustomTypes";
import { TokenService } from "@/client";
import StatusCode from "@/helpers/StatusCode";

const useRefreshToken = () => {
  const refresh = async () => {
    const localStorageUser = localStorage.getItem("user");
    let user: LocalStorageUserType | null = null;
    if (localStorageUser) {
      user = JSON.parse(localStorageUser);
      if (!user) {
        return;
      }
      const { data, error, response } = await TokenService.tokenRefreshCreate({
        body: { access: user.token, refresh: user.refreshToken },
      });
      if (error || !data) {
        alert("Error refreshing token");
        return;
      }
      if (response.status === StatusCode.OK) {
        user.token = data.access;
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
    return user?.token;
  };

  return refresh;
};

export default useRefreshToken;
