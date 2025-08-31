// api/api.ts
import axios from "axios";
import type { ProblemDetails } from "../components/types/ProblemDetails";

export const api = axios.create({
  baseURL: "http://localhost:5100/api/v1",
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
