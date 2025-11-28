import { api } from "./api";

export interface GetFriendsResponse {
  userId: string;
  userName: string;
  thumbnailUrl: string;
  status: string;
  requestedByAccountId: string;
  responseDate: string;
  requestDate: string;
}

export interface GetStatusFromFriendshipResponse {
  status: string;
  requestDate: string;
  requestResponse: string;
  requestedByUserId: string;
}

export async function getFriends(): Promise<GetFriendsResponse[]> {
  return api.get("/friendship/all").then((res) => res.data);
}

export async function getStatusFromFriendship(
  userId: string,
): Promise<GetStatusFromFriendshipResponse> {
  return api.get(`/friendship/status/${userId}`).then((res) => res.data);
}

export async function sendFriendshipRequest(
  targetUserId: string,
): Promise<void> {
  return api
    .post(`/friendship/requests/send/${targetUserId}`)
    .then((res) => res.data);
}

export async function acceptFriendshipRequest(requesterId: string) {
  return api
    .put(`/friendship/requests/accept/${requesterId}`)
    .then((res) => res.data);
}

export async function removeFriendship(targetUserId: string): Promise<void> {
  return api
    .delete(`/friendship/remove/${targetUserId}`)
    .then((res) => res.data);
}

export async function declineFriendshipRequest(userId: string) {
  const data = {
    userId: userId,
  };

  return api.put("/friendship/requests/decline", data).then((res) => res.data);
}
