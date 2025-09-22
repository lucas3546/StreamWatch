import { api } from "./api";

export interface GetFriendsResponse {
  userId: string;
  userName: string;
  profileThumbnail: string;
  status: string;
  responseDate: string;
  requestDate: string;
}

export async function getFriends(): Promise<GetFriendsResponse[]> {
  return api.get("/friendship/all").then((res) => res.data);
}

export async function sendFriendshipRequest(userName: string) {
  const data = {
    userName: userName,
  };

  return api.post("/friendship/requests/send", data).then((res) => res.data);
}

export async function acceptFriendshipRequest(userName: string) {
  const data = {
    userName: userName,
  };

  return api.put("/friendship/requests/accept", data).then((res) => res.data);
}

export async function declineFriendshipRequest(userName: string) {
  const data = {
    userName: userName,
  };

  return api.put("/friendship/requests/decline", data).then((res) => res.data);
}
