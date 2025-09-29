import type { PagedResponse } from "../components/types/PagedResponse";
import { api } from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  refreshToken: string;
}
export interface LoginResponse {
  token: string;
  refreshToken: string;
}
export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface SearchPagedUsersRequest {
  pageNumber: number;
  pageSize: number;
  userName: string;
}

export interface ChangeUsernameRequest {
  newUsername: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return api.post("/account/login", data).then((res) => res.data);
}

export async function register(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  return api.post("/account/register", data).then((res) => res.data);
}

export async function refreshToken(): Promise<RefreshTokenResponse> {
  return api
    .get("/account/refresh", { withCredentials: true })
    .then((res) => res.data);
}

export async function changeUsername(
  data: ChangeUsernameRequest,
): Promise<void> {
  return api.put("/account/change-username", data).then((res) => res.data);
}

export interface SearchPagedUsersResponseItem {
  id: string;
  userName: string;
  profilePicThumb: string;
}

type SearchPagedUsersResponse = PagedResponse<SearchPagedUsersResponseItem>;

export async function searchUsers(req: SearchPagedUsersRequest) {
  const response = await api.get<SearchPagedUsersResponse>(
    "/account/search/paged",
    {
      params: {
        PageNumber: req.pageNumber,
        PageSize: req.pageSize,
        UserName: req.userName,
      },
    },
  );
  return response.data;
}
