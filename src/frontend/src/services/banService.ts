import { api } from "./api";

export interface GetActiveBanForCurrentUserResponse {
  id: string;
  reason: string;
  expiresAt: string;
}

export interface GetBansHistoryFromUserItemResponse {
  banId: string;
  accountId: string;
  privateReason?: string | null;
  publicReason: string;
  expiresAt: string;
  isExpired: boolean;
  createdAt: string;
}

export interface BanAccountRequest {
  targetUserId: string;
  privateReason?: string | null;
  publicReason: string;
  expiresAt: string;
}

export async function getCurrentBan(): Promise<GetActiveBanForCurrentUserResponse> {
  return api.get(`/ban/get-current-ban`).then((res) => res.data);
}

export async function getBanHistoryFromUser(
  accountId: string,
): Promise<GetBansHistoryFromUserItemResponse[]> {
  return api.get(`/ban/history/${accountId}`).then((res) => res.data);
}

export async function banAccount(request: BanAccountRequest): Promise<void> {
  return api.post(`/ban/ban-account`, request).then((res) => res.data);
}

export async function unbanAccount(accountId: string): Promise<void> {
  return api.delete(`/ban/unban/${accountId}`).then((res) => res.data);
}
