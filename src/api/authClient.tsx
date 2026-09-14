import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { deleteRefreshToken, deleteToken, getRefreshToken, getToken, saveRefreshToken, saveToken } from "../utils/tokenStorage";

const API_BASE_URL = (process.env.API_URL || "http://localhost:8000") + "/v1";

if (!process.env.API_URL) {
  // Helpful debug message when running locally without env var
  // eslint-disable-next-line no-console
  console.warn(
    "API_URL environment variable is not set. Falling back to http://localhost:8000"
  );
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let inMemoryToken: string | null = null;

export function setInMemoryToken(token: string | null) {
  inMemoryToken = token;
}

// Called when a request 401s and the refresh attempt also fails (or there's no
// refresh token to try) — AuthContext registers its logout logic here so the
// app can bounce back to Welcome instead of getting stuck showing every
// screen's generic "Something went wrong" forever with no way out.
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

// Requests to these paths never trigger a refresh-and-retry on 401 — a bad
// password on /auth/login isn't an expired session, and /auth/refresh itself
// failing must not try to refresh again (infinite loop).
const REFRESH_EXEMPT_PATHS = ["/auth/login", "/auth/register", "/auth/refresh"];

function isRefreshExempt(url?: string): boolean {
  if (!url) {
    return false;
  }
  return REFRESH_EXEMPT_PATHS.some((path) => url.includes(path));
}

let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }
  try {
    const response = await axios.post<{ access_token: string; refresh_token: string }>(
      `${API_BASE_URL}/auth/refresh`,
      { refresh_token: refreshToken }
    );
    const { access_token, refresh_token } = response.data;
    await saveToken(access_token);
    await saveRefreshToken(refresh_token);
    setInMemoryToken(access_token);
    return access_token;
  } catch (error) {
    console.error("Session refresh failed:", error);
    return null;
  }
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
  async (error: AxiosError) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;

    if (
      error.response?.status === 401 &&
      config &&
      !config._retried &&
      !isRefreshExempt(config.url)
    ) {
      config._retried = true;

      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;

      if (newToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(config);
      }

      // Refresh token is missing, expired, or invalidated (logout-all,
      // password change, etc.) — this session is genuinely over.
      await deleteToken();
      await deleteRefreshToken();
      setInMemoryToken(null);
      onSessionExpired?.();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
