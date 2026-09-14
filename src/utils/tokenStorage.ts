import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "access_token";
const REFRESH_KEY = "refresh_token";
let memoryToken: string | null = null;
let memoryRefreshToken: string | null = null;

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

export async function saveRefreshToken(token: string) {
  if (await canUseSecureStore()) {
    await SecureStore.setItemAsync(REFRESH_KEY, token);
  } else if (typeof localStorage !== "undefined") {
    localStorage.setItem(REFRESH_KEY, token);
  } else {
    memoryRefreshToken = token; // last-resort fallback
  }
}

export async function getRefreshToken(): Promise<string | null> {
  if (await canUseSecureStore()) {
    return await SecureStore.getItemAsync(REFRESH_KEY);
  } else if (typeof localStorage !== "undefined") {
    return localStorage.getItem(REFRESH_KEY);
  }
  return memoryRefreshToken;
}

export async function deleteRefreshToken() {
  if (await canUseSecureStore()) {
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  } else if (typeof localStorage !== "undefined") {
    localStorage.removeItem(REFRESH_KEY);
  } else {
    memoryRefreshToken = null;
  }
}
