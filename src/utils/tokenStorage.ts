import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "access_token";
let memoryToken: string | null = null;

async function canUseSecureStore(): Promise<boolean> {
  try {
    // SecureStore isn't supported on web
    if (Platform.OS === "web") {
      return false;
    }
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function saveToken(token: string) {
  if (await canUseSecureStore()) {
    await SecureStore.setItemAsync(KEY, token);
  } else if (typeof localStorage !== "undefined") {
    localStorage.setItem(KEY, token);
  } else {
    memoryToken = token; // last-resort fallback
  }
}

export async function getToken(): Promise<string | null> {
  if (await canUseSecureStore()) {
    return await SecureStore.getItemAsync(KEY);
  } else if (typeof localStorage !== "undefined") {
    return localStorage.getItem(KEY);
  }
  return memoryToken;
}

export async function deleteToken() {
  if (await canUseSecureStore()) {
    await SecureStore.deleteItemAsync(KEY);
  } else if (typeof localStorage !== "undefined") {
    localStorage.removeItem(KEY);
  } else {
    memoryToken = null;
  }
}
