import { api } from "./api";
import type { AddVideoToPlaylistType } from "./roomRealtimeService";

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

export interface UpdateRoomRequest {
  id: string;
  title: string;
  category: string;
  isPublic: boolean;
}

export interface GetPagedRoomsRequest {
  pageNumber: number;
  pageSize: number;
  category: string;
  includeNswf: boolean;
  orderBy: "Recent" | "MostUsers" | "DateAsc" | "DateDesc";
}

export interface GetPagedRoomsItem {
  roomId: string;
  title: string;
  thumbnailUrl: string;
  category: string;
  userCount: number;
  provider: string;
  createdAt: string;
  isPublic: boolean;
}

export interface GetPagedRoomsResponse {
  items: GetPagedRoomsItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SendMessageRequest {
  roomId: string;
  message: string;
  image?: File | null;
  replyToMessageId?: string;
}

export interface InviteToRoomRequest {
  roomId: string;
  targetAccountId: string;
}

export async function getPagedRooms(req: GetPagedRoomsRequest) {
  const response = await api.get<GetPagedRoomsResponse>("/rooms/paged", {
    params: {
      PageNumber: req.pageNumber,
      PageSize: req.pageSize,
      Category: req.category,
      IncludeNswf: req.includeNswf,
      OrderBy: req.orderBy,
    },
  });
  return response.data;
}

export async function sendMessage(data: SendMessageRequest): Promise<void> {
  const formData = new FormData();
  formData.append("roomId", data.roomId);
  formData.append("message", data.message);
  if (data.image) formData.append("image", data.image); // File
  if (data.replyToMessageId)
    formData.append("replyToMessageId", data.replyToMessageId);

  return api
    .post("/rooms/send-message", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
}

export async function createRoom(
  data: CreateRoomRequest,
): Promise<CreateRoomResponse> {
  return api.post("/rooms/create", data).then((res) => res.data);
}

export async function inviteToRoom(
  data: InviteToRoomRequest,
): Promise<CreateRoomResponse> {
  return api.post("/rooms/invite", data).then((res) => res.data);
}

export async function addVideoToPlaylist(
  data: AddVideoToPlaylistType,
): Promise<void> {
  return api.post("/rooms/playlist/add", data).then((res) => res.data);
}

export async function updateRoom(data: UpdateRoomRequest): Promise<void> {
  return api.put("/rooms/update", data).then((res) => res.data);
}
