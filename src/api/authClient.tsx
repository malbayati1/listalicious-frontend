import axios, { AxiosError } from "axios";
import { getToken } from "../utils/tokenStorage";

const API_BASE_URL = __DEV__ ? "http://192.168.50.207:8000" : "https://prod"; // TODO: set your real prod API base

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let inMemoryToken: string | null = null;

export function setInMemoryToken(token: string | null) {
  inMemoryToken = token;
}

apiClient.interceptors.request.use(
  async (config) => {
    let token = inMemoryToken;
    if (!token) {
      token = await getToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Option A: emit an event / call a logout handler (see AuthContext below)
      console.log("Unauthorized (401) — token may be missing/expired");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
