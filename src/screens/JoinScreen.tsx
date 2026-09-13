import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { getLists, joinListByToken } from "../api/listApi";
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

export default function JoinScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { token: authToken, isBootstrapping } = useAuth();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const goAway = () => {
    router.replace(authToken ? "/(app)" : "/(auth)");
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
        if (joinedList) {
          router.replace({ pathname: "/(app)/list/[id]", params: { id: joinedList._id, title: joinedList.title } });
        } else {
          router.replace("/(app)");
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
          <Text style={styles.headline}>You're invited to join a list</Text>
          <Text style={styles.headlineBody}>
            You'll be able to add items, tick things off and see everyone's changes live.
          </Text>

          <View style={[styles.tokenCard, error && styles.tokenCardError]}>
            {error ? (
              <Text style={styles.tokenError}>{error}</Text>
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
