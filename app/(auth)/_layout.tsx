import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

export default function AppLayout() {
  const { token, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  if (token) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
} 