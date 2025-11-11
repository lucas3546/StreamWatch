import { api } from "./api";

export interface GetActiveBanForCurrentUserResponse {
  id: string;
  reason: string;
  expiresAt: string;
}

export async function getCurrentBan(): Promise<GetActiveBanForCurrentUserResponse> {
  return api.get(`/ban/get-current-ban`).then((res) => res.data);
}
