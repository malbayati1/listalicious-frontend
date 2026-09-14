import apiClient from "./authClient";

export type UserSearchResult = {
  id: string;
  email: string;
  username: string | null;
};

export const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
  const response = await apiClient.get<UserSearchResult[]>("/users/search", { params: { q: query } });
  return response.data;
};
