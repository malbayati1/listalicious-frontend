import { Redirect, Stack, router } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

export default function AuthLayout() {
  const { token, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  if (!token) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}