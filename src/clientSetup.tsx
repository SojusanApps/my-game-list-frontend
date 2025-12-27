import { client } from "./client/client.gen";
import StatusCode from "./utils/StatusCode";
import { getStoredUser, refreshToken, clearStoredUser } from "./features/auth/utils/authUtils";

const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const user = getStoredUser();

  const request = new Request(input, init);
  if (user?.token) {
    request.headers.set("Authorization", `Bearer ${user.token}`);
  }

  let response = await fetch(request);
  if (response.status === StatusCode.UNAUTHORIZED) {
    if (response.url.includes("token/refresh")) {
      // If refresh failed, force logout
      clearStoredUser();
      window.location.href = "/login";
      return response;
    }

    const newAccessToken = await refreshToken();
    if (newAccessToken) {
      client.setConfig({ auth: () => newAccessToken });
      // We need to clone the request or create a new one to retry with new token
      const retryRequest = new Request(input, init);
      retryRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
      response = await fetch(retryRequest);
    } else {
      clearStoredUser();
      window.location.href = "/login";
    }
  }
  return response;
};

export default function clientSetup() {
  client.setConfig({
    baseUrl: import.meta.env.VITE_API_URL,
    fetch: customFetch,
    auth: () => {
      const user = getStoredUser();
      return user?.token || "";
    },
  });
}
