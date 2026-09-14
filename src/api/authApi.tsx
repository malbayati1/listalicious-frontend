import { LoginData } from "../types/LoginData";
import { RegisterData } from "../types/RegisterData";
import { User } from "../types/User";
import apiClient, { setInMemoryToken } from "./authClient";

interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

function toUrlEncoded(data: Record<string, string>): string {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    params.append(key, value);
  });
  return params.toString();
}

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  const { grant_type, username, password } = credentials;

  const formData = toUrlEncoded({
    grant_type,
    username,
    password,
  });

  const response = await apiClient.post<AuthResponse>("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (response.data.access_token) {
    setInMemoryToken(response.data.access_token);
  }
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
};

export const updateUsername = async (username: string): Promise<User> => {
  const response = await apiClient.patch<User>("/auth/me", { username });
  return response.data;
};

export const requestEmailVerification = async (): Promise<void> => {
  await apiClient.post("/auth/request-email-verification");
};

export const verifyEmail = async (token: string): Promise<void> => {
  await apiClient.post("/auth/verify-email", { token });
};

export const forgotPassword = async (email: string): Promise<void> => {
  await apiClient.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await apiClient.post("/auth/reset-password", { token, new_password: newPassword });
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await apiClient.post("/auth/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
};

export const changeEmail = async (newEmail: string, password: string): Promise<void> => {
  await apiClient.post("/auth/change-email", { new_email: newEmail, password });
};

export const confirmEmailChange = async (token: string): Promise<void> => {
  await apiClient.post("/auth/confirm-email-change", { token });
};

export const logoutAllDevices = async (): Promise<void> => {
  await apiClient.post("/auth/logout-all");
};
