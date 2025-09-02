import { api } from "./api";

export interface CreateRoomRequest {
  title: string;
  category: string;
  provider: string;
  videoUrl: string | null;
  mediaId: string | null;
  isPublic: boolean;
}

export interface CreateRoomResponse {
  roomId: string;
}

export async function createRoom(
  data: CreateRoomRequest,
): Promise<CreateRoomResponse> {
  return api.post("/rooms/create", data).then((res) => res.data);
}
