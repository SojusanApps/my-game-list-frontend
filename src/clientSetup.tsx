import { client } from "./client/client.gen";
import StatusCode from "./utils/StatusCode";
import { getStoredUser, refreshToken, clearStoredUser } from "./features/auth/utils/authUtils";
import { env } from "./config/env";

let refreshPromise: Promise<string | undefined> | null = null;

const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const user = getStoredUser();

  const request = new Request(input, init);
  if (user?.token && !request.url.includes("token/refresh")) {
    request.headers.set("Authorization", `Bearer ${user.token}`);
  }

  // Clone the request before fetching so we can retry it if needed
  // (fetch consumes the body)
  const requestClone = request.clone();

  let response = await fetch(request);
  if (response.status === StatusCode.UNAUTHORIZED) {
    if (request.url.includes("token/refresh")) {
      // If refresh failed, force logout
      clearStoredUser();
      globalThis.location.href = "/login";
      return response;
    }

    refreshPromise ??= refreshToken().finally(() => {
      refreshPromise = null;
    });

    const newAccessToken = await refreshPromise;
    if (newAccessToken) {
      client.setConfig({ auth: () => newAccessToken });
      // Retry with the cloned request and new token
      requestClone.headers.set("Authorization", `Bearer ${newAccessToken}`);
      response = await fetch(requestClone);
    } else {
      clearStoredUser();
      globalThis.location.href = "/login";
    }
  }
  return response;
};

export default function clientSetup() {
  client.setConfig({
    baseUrl: env.VITE_API_URL,
    fetch: customFetch,
    auth: () => {
      const user = getStoredUser();
      return user?.token || "";
    },
  });
}
