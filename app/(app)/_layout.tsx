import { Redirect, Stack, useSegments } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

export default function AppLayout() {
  const { token, user, isBootstrapping } = useAuth();
  const segments = useSegments();

  if (isBootstrapping) {
    return null;
  }

  if (!token) {
    return <Redirect href="/" />;
  }

  const onVerifyScreen = (segments as string[]).includes("verify-email");
  if (user && !user.email_verified && !onVerifyScreen) {
    return <Redirect href="/(app)/verify-email" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
