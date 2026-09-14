import apiClient from "./authClient";
import { GroceryList } from "../types/GroceryList";
import { Item } from "../types/Item";

// ── Lists ──────────────────────────────────────────────────────────────────

export const getLists = async (options?: { includeArchived?: boolean }): Promise<GroceryList[]> => {
  const response = await apiClient.get<GroceryList[]>("/lists", {
    params: options?.includeArchived ? { include_archived: true } : undefined,
  });
  return response.data;
};

export const createList = async (title: string): Promise<GroceryList> => {
  const response = await apiClient.post<GroceryList>("/lists", { title });
  return response.data;
};

export const getList = async (listId: string): Promise<GroceryList> => {
  const response = await apiClient.get<GroceryList>(`/lists/${listId}`);
  return response.data;
};

export const renameList = async (listId: string, title: string): Promise<GroceryList> => {
  const response = await apiClient.put<GroceryList>(`/lists/${listId}`, { title });
  return response.data;
};

export const deleteList = async (listId: string): Promise<void> => {
  await apiClient.delete(`/lists/${listId}`);
};

export const leaveList = async (listId: string): Promise<void> => {
  await apiClient.delete(`/lists/${listId}/leave`);
};

export const archiveList = async (listId: string): Promise<void> => {
  await apiClient.patch(`/lists/${listId}/archive`);
};

export const unarchiveList = async (listId: string): Promise<void> => {
  await apiClient.patch(`/lists/${listId}/unarchive`);
};

export const duplicateList = async (listId: string): Promise<GroceryList> => {
  const response = await apiClient.post<GroceryList>(`/lists/${listId}/duplicate`);
  return response.data;
};

// ── Sharing & invites ────────────────────────────────────────────────────────

export type SharedUser = {
  id: string;
  email: string;
  username: string | null;
};

export const getSharedUsers = async (listId: string): Promise<SharedUser[]> => {
  const response = await apiClient.get<SharedUser[]>(`/lists/${listId}/shared-users`);
  return response.data;
};

export const shareListWithEmail = async (listId: string, email: string): Promise<void> => {
  await apiClient.post(`/lists/${listId}/share`, { email });
};

export const unshareListWithEmail = async (listId: string, email: string): Promise<void> => {
  await apiClient.post(`/lists/${listId}/unshare`, { email });
};

export const createInviteLink = async (listId: string): Promise<{ invite_token: string; expires_at: string }> => {
  const response = await apiClient.post<{ invite_token: string; expires_at: string }>(`/lists/${listId}/invite`);
  return response.data;
};

export const joinListByToken = async (token: string): Promise<void> => {
  await apiClient.post(`/lists/join/${token}`);
};

export type InvitePreview = {
  list_title: string | null;
  invited_by_email: string | null;
  invited_by_username: string | null;
  expires_at: string;
};

export const previewInvite = async (token: string): Promise<InvitePreview> => {
  const response = await apiClient.get<InvitePreview>(`/lists/join/${token}`);
  return response.data;
};

// ── Stats & activity ─────────────────────────────────────────────────────────

export type ListStats = {
  total: number;
  checked: number;
  unchecked: number;
};

export const getListStats = async (listId: string): Promise<ListStats> => {
  const response = await apiClient.get<ListStats>(`/lists/${listId}/stats`);
  return response.data;
};

export type ActivityEntry = {
  list_id: string;
  user_id: string;
  user_email: string;
  action: string;
  meta: Record<string, unknown>;
  created_at: string;
};

export const getListActivity = async (listId: string, limit = 100): Promise<ActivityEntry[]> => {
  const response = await apiClient.get<ActivityEntry[]>(`/lists/${listId}/activity`, { params: { limit } });
  return response.data;
};

export const getGlobalActivity = async (limit = 60, skip = 0): Promise<ActivityEntry[]> => {
  const response = await apiClient.get<ActivityEntry[]>("/lists/activity", { params: { limit, skip } });
  return response.data;
};

// ── Items ──────────────────────────────────────────────────────────────────

export type NewItemData = {
  name: string;
  quantity: number;
  note?: string;
};

// The backend serializes Item's id field inconsistently across routes: GET
// list_items manually calls .model_dump() (no alias) and gives "id", while
// create/update/check return the Pydantic model directly, which FastAPI
// serializes with response_model_by_alias's default of true and gives "_id".
// Normalize every item response here so the rest of the app only ever sees `id`.
type RawItem = Omit<Item, "id"> & { id?: string; _id?: string };

function normalizeItem(raw: RawItem): Item {
  const id = raw.id ?? raw._id;
  if (!id) {
    throw new Error("Item response is missing an id");
  }
  return { ...raw, id };
}

export const getItems = async (listId: string): Promise<Item[]> => {
  const response = await apiClient.get<RawItem[]>(`/lists/${listId}/items`);
  return response.data.map(normalizeItem);
};

export const addItem = async (listId: string, data: NewItemData): Promise<Item> => {
  const response = await apiClient.post<RawItem>(`/lists/${listId}/items`, {
    name: data.name,
    quantity: data.quantity,
    note: data.note || undefined,
    is_checked: false,
  });
  return normalizeItem(response.data);
};

export const addItemsBulk = async (listId: string, items: NewItemData[]): Promise<Item[]> => {
  const response = await apiClient.post<RawItem[]>(`/lists/${listId}/items/bulk`, {
    items: items.map((data) => ({
      name: data.name,
      quantity: data.quantity,
      note: data.note || undefined,
      is_checked: false,
    })),
  });
  return response.data.map(normalizeItem);
};

export const updateItem = async (listId: string, itemId: string, data: NewItemData): Promise<Item> => {
  const response = await apiClient.put<RawItem>(`/lists/${listId}/items/${itemId}`, {
    name: data.name,
    quantity: data.quantity,
    note: data.note || undefined,
  });
  return normalizeItem(response.data);
};

export const checkItem = async (listId: string, itemId: string): Promise<Item> => {
  const response = await apiClient.patch<RawItem>(`/lists/${listId}/items/${itemId}/check`);
  return normalizeItem(response.data);
};

export const deleteItem = async (listId: string, itemId: string): Promise<void> => {
  await apiClient.delete(`/lists/${listId}/items/${itemId}`);
};

export const clearCheckedItems = async (listId: string): Promise<void> => {
  await apiClient.delete(`/lists/${listId}/items/checked`);
};

export const reorderItems = async (listId: string, orderedItemIds: string[]): Promise<void> => {
  await apiClient.patch(`/lists/${listId}/items/reorder`, { order: orderedItemIds });
};

export const moveItem = async (listId: string, itemId: string, targetListId: string): Promise<Item> => {
  const response = await apiClient.patch<RawItem>(`/lists/${listId}/items/${itemId}/move`, {
    target_list_id: targetListId,
  });
  return normalizeItem(response.data);
};

