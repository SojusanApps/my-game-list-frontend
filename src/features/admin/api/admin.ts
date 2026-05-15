import { VersionService } from "@/client";
import StatusCode from "@/utils/StatusCode";
import { handleApiError } from "@/utils/apiUtils";

export const getApiVersion = async () => {
  const { data, response } = await VersionService.versionRetrieve();
  if (response?.status !== StatusCode.OK) {
    return await handleApiError(response, "Error fetching API version");
  }
  return data;
};
