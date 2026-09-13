import apiClient from "./authClient";
import { GroceryList } from "../types/GroceryList";
import { Item } from "../types/Item";

// ── Lists ──────────────────────────────────────────────────────────────────

export const getLists = async (): Promise<GroceryList[]> => {
  const response = await apiClient.get<GroceryList[]>("/lists");
  return response.data;
};

export const createList = async (title: string): Promise<GroceryList> => {
  const response = await apiClient.post<GroceryList>("/lists", { title });
  return response.data;
};

// ── Invites ────────────────────────────────────────────────────────────────

export const createInviteLink = async (listId: string): Promise<{ invite_token: string; expires_at: string }> => {
  const response = await apiClient.post<{ invite_token: string; expires_at: string }>(`/lists/${listId}/invite`);
  return response.data;
};

export const joinListByToken = async (token: string): Promise<void> => {
  await apiClient.post(`/lists/join/${token}`);
};

// ── Items ──────────────────────────────────────────────────────────────────

export type NewItemData = {
  name: string;
  quantity: number;
  note?: string;
};

export const getItems = async (listId: string): Promise<Item[]> => {
  const response = await apiClient.get<Item[]>(`/lists/${listId}/items`);
  return response.data;
};

export const addItem = async (listId: string, data: NewItemData): Promise<Item> => {
  const response = await apiClient.post<Item>(`/lists/${listId}/items`, {
    name: data.name,
    quantity: data.quantity,
    note: data.note || undefined,
    is_checked: false,
  });
  return response.data;
};

export const updateItem = async (listId: string, itemId: string, data: NewItemData): Promise<Item> => {
  const response = await apiClient.put<Item>(`/lists/${listId}/items/${itemId}`, {
    name: data.name,
    quantity: data.quantity,
    note: data.note || undefined,
  });
  return response.data;
};

export const checkItem = async (listId: string, itemId: string): Promise<Item> => {
  const response = await apiClient.patch<Item>(`/lists/${listId}/items/${itemId}/check`);
  return response.data;
};

export const deleteItem = async (listId: string, itemId: string): Promise<void> => {
  await apiClient.delete(`/lists/${listId}/items/${itemId}`);
};

export const clearCheckedItems = async (listId: string): Promise<void> => {
  await apiClient.delete(`/lists/${listId}/items/checked`);
};

