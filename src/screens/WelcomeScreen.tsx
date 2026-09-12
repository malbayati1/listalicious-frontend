import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import BottomSheet from "../components/BottomSheet";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/tokens";
import styles from "./styles/WelcomeScreenStyles";

function extractInviteToken(input: string): string {
  const trimmed = input.trim();
  const segments = trimmed.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteError, setInviteError] = useState<string | undefined>();

  const handleContinue = () => {
    const token = extractInviteToken(inviteInput);
    if (!token) {
      setInviteError("Paste the link or code you were sent");
      return;
    }
    setSheetOpen(false);
    setInviteInput("");
    setInviteError(undefined);
    router.push(`/join/${token}` as unknown as Parameters<typeof router.push>[0]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="light" />
      <View style={[styles.content, { paddingBottom: 48 + insets.bottom }]}>
        <View style={styles.hero}>
          <View style={styles.swatchRow}>
            <View style={[styles.swatch, styles.swatchMint]} />
            <View style={[styles.swatch, styles.swatchApricot]} />
            <View style={[styles.swatch, styles.swatchNeutral]} />
          </View>
          <Text style={styles.title}>Listalicious</Text>
          <Text style={styles.subtitle}>One list. Everyone in the house. Watch it empty in real time.</Text>
        </View>

        <View style={styles.buttons}>
          <Pressable
            onPress={() => router.push("./onboarding")}
            style={({ pressed }) => [styles.buttonPrimary, pressed && styles.buttonPrimaryPressed]}
          >
            <Text style={styles.buttonPrimaryLabel}>Start a list</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("./login")}
            style={({ pressed }) => [styles.buttonSecondary, pressed && styles.buttonSecondaryPressed]}
          >
            <Text style={styles.buttonSecondaryLabel}>I already have an account</Text>
          </Pressable>

          <Pressable onPress={() => setSheetOpen(true)} style={styles.buttonText}>
            <Text style={styles.buttonTextLabel}>Someone sent me an invite link</Text>
          </Pressable>
        </View>
      </View>

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Text style={styles.sheetTitle}>Got an invite link?</Text>
        <TextInput
          autoFocus
          value={inviteInput}
          onChangeText={setInviteInput}
          placeholder="Paste the link or code"
          placeholderTextColor={colors.faint}
          autoCapitalize="none"
          style={styles.sheetInput}
          onSubmitEditing={handleContinue}
          returnKeyType="done"
        />
        {inviteError ? <Text style={styles.sheetError}>{inviteError}</Text> : null}
        <PrimaryButton label="Continue" onPress={handleContinue} />
      </BottomSheet>
    </SafeAreaView>
  );
}
