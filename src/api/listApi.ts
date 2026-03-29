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

// ── Items ──────────────────────────────────────────────────────────────────

export const getItems = async (listId: string): Promise<Item[]> => {
  const response = await apiClient.get<Item[]>(`/lists/${listId}/items`);
  return response.data;
};

export const addItem = async (listId: string, name: string): Promise<Item> => {
  const response = await apiClient.post<Item>(`/lists/${listId}/items`, { name, quantity: 1, is_checked: false });
  return response.data;
};

export const toggleItem = async (listId: string, itemId: string, is_checked: boolean): Promise<Item> => {
  const response = await apiClient.put<Item>(`/lists/${listId}/items/${itemId}`, { is_checked });
  return response.data;
};

export const deleteItem = async (listId: string, itemId: string): Promise<void> => {
  await apiClient.delete(`/lists/${listId}/items/${itemId}`);
};

