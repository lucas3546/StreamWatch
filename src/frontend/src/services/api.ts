// api/api.ts
import axios from "axios";
import type { ProblemDetails } from "../components/types/ProblemDetails";
import { BASE_URL } from "../utils/config";

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const problem = error.response.data as ProblemDetails;
      return Promise.reject(problem);
    }
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const problem = error as ProblemDetails;
    if (problem.status === 423) {
      window.location.href = "/banned";
    }
    return Promise.reject(error);
  },
);
