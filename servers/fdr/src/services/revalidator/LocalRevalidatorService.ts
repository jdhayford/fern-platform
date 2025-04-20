import { ParsedBaseUrl } from "../../util/ParsedBaseUrl";
import { RevalidatedPathsResponse, RevalidatorService } from "./RevalidatorService";

export class LocalRevalidatorService implements RevalidatorService {
  async revalidate(_params: {
    baseUrl: ParsedBaseUrl;
  }): Promise<RevalidatedPathsResponse> {
    return {
      successful: [],
      failed: [],
      revalidationFailed: false,
    };
  }
}