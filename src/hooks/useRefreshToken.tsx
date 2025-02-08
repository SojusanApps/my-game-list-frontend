import axiosPrivate from "../api/axios";

import StatusCode from "../helpers/StatusCode";

const useRefreshToken = () => {
  const refresh = async () => {
    const localStorageUser = localStorage.getItem("user");
    let user = null;
    if (localStorageUser) {
      user = JSON.parse(localStorageUser);
      const response = await axiosPrivate.post("/token/refresh/", {
        refresh: user.refreshToken,
      });
      if (response.status === StatusCode.OK) {
        user.token = response.data.access;
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
    return user?.token;
  };

  return refresh;
};

export default useRefreshToken;
