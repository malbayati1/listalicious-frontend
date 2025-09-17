import { LoginData } from "../types/LoginData";
import { RegisterData } from "../types/RegisterData";
import { User } from "../types/User";
import apiClient, { setInMemoryToken } from "./authClient";

interface AuthResponse {
  user: User;
  access_token: string;
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
