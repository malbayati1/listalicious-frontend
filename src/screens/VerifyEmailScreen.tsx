import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { requestEmailVerification, verifyEmail } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import PlusIcon from "../components/icons/PlusIcon";
import { colors } from "../theme/tokens";
import styles from "./styles/VerifyEmailScreenStyles";

const RESEND_COOLDOWN_SECONDS = 60;

function extractVerificationToken(input: string): string {
  const trimmed = input.trim();
  const marker = "token=";
  const index = trimmed.indexOf(marker);
  if (index === -1) {
    return trimmed;
  }
  return trimmed.slice(index + marker.length);
}

export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, refreshUser } = useAuth();
  const [tokenInput, setTokenInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | undefined>();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState<string | undefined>();
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    requestEmailVerification().catch((error) => {
      console.error("Failed to request email verification:", error);
    });
    startCooldown();

    return () => {
      if (cooldownTimer.current) {
        clearInterval(cooldownTimer.current);
      }
    };
  }, []);

  const startCooldown = () => {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    if (cooldownTimer.current) {
      clearInterval(cooldownTimer.current);
    }
    cooldownTimer.current = setInterval(() => {
      setResendCooldown((seconds) => {
        if (seconds <= 1) {
          if (cooldownTimer.current) {
            clearInterval(cooldownTimer.current);
          }
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
  };

  const handleResend = () => {
    setResendMessage(undefined);
    const submit = async () => {
      try {
        await requestEmailVerification();
        setResendMessage("Sent again — check the backend server logs.");
        startCooldown();
      } catch (error) {
        console.error("Failed to resend verification email:", error);
      }
    };
    submit();
  };

  const handleVerify = () => {
    const token = extractVerificationToken(tokenInput);
    if (!token) {
      setVerifyError("Paste the link or token from the server logs");
      return;
    }
    setVerifyError(undefined);
    const submit = async () => {
      setVerifying(true);
      try {
        await verifyEmail(token);
        await refreshUser();
        router.replace("/(app)/(tabs)");
      } catch (error) {
        console.error("Failed to verify email:", error);
        setVerifyError("That code didn't work. Check you copied the whole thing.");
      } finally {
        setVerifying(false);
      }
    };
    submit();
  };

  const handleLogout = () => {
    const submit = async () => {
      await logout();
      router.replace("/(auth)");
    };
    submit();
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.body}>
          <View style={styles.badge}>
            <PlusIcon size={22} color={colors.mint} />
          </View>
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.body1}>
            We sent a verification link to {user?.email ?? "your email"}. Click it, or paste the link or token here.
          </Text>

          <View style={styles.devNoteCard}>
            <Text style={styles.devNoteLabel}>DEV MODE</Text>
            <Text style={styles.devNoteBody}>
              No email service is configured, so the link isn't actually emailed — the backend logs it to its console
              instead. Find the line starting with "[dev] email verification link", then paste the link or just the
              token below.
            </Text>
          </View>

          <Text style={styles.fieldLabel}>Verification link or token</Text>
          <TextInput
            value={tokenInput}
            onChangeText={setTokenInput}
            placeholder="Paste it here"
            placeholderTextColor={colors.faint}
            autoCapitalize="none"
            style={styles.input}
            onSubmitEditing={handleVerify}
            returnKeyType="done"
          />
          {verifyError ? <Text style={styles.error}>{verifyError}</Text> : null}
          {resendMessage ? <Text style={styles.success}>{resendMessage}</Text> : null}
        </View>

        <View style={[styles.footer, { paddingBottom: 44 + insets.bottom }]}>
          <PrimaryButton label="Verify" onPress={handleVerify} loading={verifying} style={{ marginBottom: 4 }} />
          <Pressable style={styles.resendButton} onPress={handleResend} disabled={resendCooldown > 0}>
            <Text style={[styles.resendLabel, resendCooldown > 0 && styles.resendLabelDisabled]}>
              {resendCooldown > 0 ? `Resend link (${resendCooldown}s)` : "Resend link"}
            </Text>
          </Pressable>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutLabel}>Log out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
