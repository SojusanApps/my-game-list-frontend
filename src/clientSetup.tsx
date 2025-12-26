import { client } from "./client/client.gen";
import { LocalStorageUserType } from "./helpers/CustomTypes";
import StatusCode from "./helpers/StatusCode";
import useRefreshToken from "./hooks/useRefreshToken";

const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const refresh = useRefreshToken();
  const localStorageUser = localStorage.getItem("user");
  let user: LocalStorageUserType | null = null;
  if (localStorageUser) {
    user = JSON.parse(localStorageUser);
  }

  const request = new Request(input, init);
  request.headers.set("Authorization", `Bearer ${user?.token}`);

  let response = await fetch(request);
  if (response.status === StatusCode.UNAUTHORIZED) {
    if (response.url.includes("token/refresh")) {
      // If we are not authorized to refresh the token, we need to redirect to the login page
      // to get a new pair of tokens, because the refresh token is invalid or expired.
      window.location.href = "/login";
    }

    const newAccessToken = await refresh();
    client.setConfig({ auth: () => newAccessToken });
    request.headers.set("Authorization", `Bearer ${newAccessToken}`);
    response = await fetch(request);
  }
  return response;
};

export default function clientSetup() {
  client.setConfig({
    baseUrl: import.meta.env.VITE_API_URL,
    fetch: customFetch,
    auth: () => "123",
  });
}
