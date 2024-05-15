import { useEffect } from "react";

import { axiosPrivate } from "../api/axios";
import { LocalStorageUserType } from "../helpers/CustomTypes";
import useRefreshToken from "./useRefreshToken";
import StatusCode from "../helpers/StatusCode";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const localStorageUser = localStorage.getItem("user");
  let user: LocalStorageUserType | null = null;
  if (localStorageUser) {
    user = JSON.parse(localStorageUser);
  }

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${user?.token}`;
        }

        return config;
      },
      error => Promise.reject(error),
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config;
        if (error?.response?.status === StatusCode.UNAUTHORIZED && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [user, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
