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

export async function login(data: LoginRequest): Promise<string> {
  return api.post("/account/login", data).then((res) => res.data);
}

export async function register(data: RegisterRequest): Promise<string> {
  return api.post("/account/register", data).then((res) => res.data);
}
