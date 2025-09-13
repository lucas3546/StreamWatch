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

export interface GetPagedRoomsRequest {
  pageNumber: number;
  pageSize: number;
  category:
    | "All"
    | "Movies"
    | "Series"
    | "Music"
    | "Anime"
    | "Videos"
    | "Sports"
    | "Nsfw";
  includeNswf: boolean;
  orderBy: "Recent" | "MostUsers" | "DateAsc" | "DateDesc";
}

export interface GetPagedRoomsItem {
  roomId: string;
  title: string;
  thumbnailUrl: string;
  category: string;
  userCount: number;
  videoProvider: "YouTube" | "S3" | string;
  createdAt: string;
}

export interface GetPagedRoomsResponse {
  items: GetPagedRoomsItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
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
