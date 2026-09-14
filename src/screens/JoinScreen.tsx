import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getLists, InvitePreview, joinListByToken, previewInvite } from "../api/listApi";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import PlusIcon from "../components/icons/PlusIcon";
import { colors } from "../theme/tokens";
import styles from "./styles/JoinScreenStyles";

function truncateToken(token: string): string {
  if (token.length <= 14) {
    return token;
  }
  return `${token.slice(0, 8)}…${token.slice(-4)}`;
}

function daysUntil(iso: string): number {
  const diffMs = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export default function JoinScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { token: authToken, user, isBootstrapping } = useAuth();
  const { showToast } = useToast();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [preview, setPreview] = useState<InvitePreview | null>(null);

  useEffect(() => {
    // Preview requires being logged in (same as the join call itself), so a
    // logged-out visitor still sees the generic copy until they register/log
    // in and land back here via `next`.
    if (!authToken || !token) {
      return;
    }
    previewInvite(token)
      .then(setPreview)
      .catch((err) => {
        console.error("Failed to preview invite:", err);
        setError("This invite link is invalid or has expired.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, token]);

  const goAway = () => {
    router.replace(authToken ? "/(app)/(tabs)" : "/(auth)");
  };

  const handleJoin = () => {
    if (!authToken) {
      router.push({ pathname: "/(auth)/register", params: { next: `/join/${token}` } });
      return;
    }

    const submit = async () => {
      setJoining(true);
      setError(undefined);
      try {
        const before = await getLists();
        const beforeIds = new Set(before.map((list) => list._id));
        await joinListByToken(token);
        const after = await getLists();
        const joinedList = after.find((list) => !beforeIds.has(list._id));
        const selfInitial = user?.username || user?.email || "?";
        if (joinedList) {
          showToast(`You're in! Welcome to ${joinedList.title}`, selfInitial);
          router.replace({ pathname: "/(app)/list/[id]", params: { id: joinedList._id, title: joinedList.title } });
        } else {
          showToast("You're in!", selfInitial);
          router.replace("/(app)/(tabs)");
        }
      } catch (err) {
        console.error("Failed to join list:", err);
        setError("This invite link is invalid or has expired.");
      } finally {
        setJoining(false);
      }
    };
    submit();
  };

  if (isBootstrapping) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.mint} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <StatusBar style="light" />
      <View style={[styles.content, { paddingTop: 76 }]}>
        <BackButton />

        <View style={styles.body}>
          <View style={styles.badge}>
            <PlusIcon size={22} color={colors.mint} />
          </View>
          <Text style={styles.headline}>
            {preview
              ? `${preview.invited_by_username || preview.invited_by_email || "Someone"} invited you to ${preview.list_title || "a list"}`
              : "You're invited to join a list"}
          </Text>
          <Text style={styles.headlineBody}>
            You'll be able to add items, tick things off and see everyone's changes live.
          </Text>

          <View style={[styles.tokenCard, error && styles.tokenCardError]}>
            {error ? (
              <Text style={styles.tokenError}>{error}</Text>
            ) : preview ? (
              <>
                <Text style={styles.tokenLabel}>EXPIRES</Text>
                <Text style={styles.tokenValue}>in {daysUntil(preview.expires_at)}d</Text>
              </>
            ) : (
              <>
                <Text style={styles.tokenLabel}>INVITE CODE</Text>
                <Text style={styles.tokenValue}>{truncateToken(token)}</Text>
              </>
            )}
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: 44 + insets.bottom }]}>
          {error ? (
            <PrimaryButton label="Ask for a new link" onPress={goAway} style={{ marginBottom: 12 }} />
          ) : (
            <PrimaryButton label="Join the list" onPress={handleJoin} loading={joining} style={{ marginBottom: 12 }} />
          )}
          <Pressable style={styles.notNow} onPress={goAway}>
            <Text style={styles.notNowLabel}>Not now</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
