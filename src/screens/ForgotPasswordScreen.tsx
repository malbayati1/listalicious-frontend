import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { forgotPassword, resetPassword } from "../api/authApi";
import { useToast } from "../context/ToastContext";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import PlusIcon from "../components/icons/PlusIcon";
import { colors } from "../theme/tokens";
import styles from "./styles/ForgotPasswordScreenStyles";

function extractResetToken(input: string): string {
  const trimmed = input.trim();
  const marker = "token=";
  const index = trimmed.indexOf(marker);
  if (index === -1) {
    return trimmed;
  }
  return trimmed.slice(index + marker.length);
}

const isPasswordValid = (password: string) => password.length >= 8 && /\d/.test(password);

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const [tokenInput, setTokenInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetError, setResetError] = useState<string | undefined>();
  const [resetting, setResetting] = useState(false);

  const handleRequest = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Enter your email");
      return;
    }
    setEmailError(undefined);
    const submit = async () => {
      setRequesting(true);
      try {
        await forgotPassword(trimmed);
        setRequested(true);
      } catch (error) {
        console.error("Failed to request password reset:", error);
        setRequested(true);
      } finally {
        setRequesting(false);
      }
    };
    submit();
  };

  const handleReset = () => {
    const token = extractResetToken(tokenInput);
    if (!token) {
      setResetError("Paste the link or token from the email");
      return;
    }
    if (!isPasswordValid(newPassword)) {
      setResetError("Password needs 8+ characters and at least one number");
      return;
    }
    setResetError(undefined);
    const submit = async () => {
      setResetting(true);
      try {
        await resetPassword(token, newPassword);
        showToast("Password reset — log in with your new one", "?");
        router.replace("/(auth)/login");
      } catch (error) {
        console.error("Failed to reset password:", error);
        setResetError("That code didn't work. Check you copied the whole thing.");
      } finally {
        setResetting(false);
      }
    };
    submit();
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <BackButton />
        <View style={[styles.body, { paddingBottom: 40 + insets.bottom }]}>
          <View style={styles.badge}>
            <PlusIcon size={22} color={colors.mint} />
          </View>
          <Text style={styles.title}>Reset your password</Text>
          <Text style={styles.body1}>
            Enter your account email and we'll send you a link to reset your password.
          </Text>

          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            placeholderTextColor={colors.faint}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            onSubmitEditing={handleRequest}
            returnKeyType="done"
            editable={!requested}
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          {!requested ? (
            <PrimaryButton
              label="Send reset link"
              onPress={handleRequest}
              loading={requesting}
              style={{ marginTop: 22 }}
            />
          ) : (
            <>
              <Text style={styles.success}>
                If an account exists for that email, a reset link is on its way.
              </Text>

              <View style={styles.devNoteCard}>
                <Text style={styles.devNoteLabel}>CAN'T FIND THE EMAIL?</Text>
                <Text style={styles.devNoteBody}>
                  It can take a minute, and check spam. If it doesn't show up, or the link doesn't open correctly,
                  paste the link or just the token below along with your new password.
                </Text>
              </View>

              <Text style={styles.fieldLabel}>Reset link or token</Text>
              <TextInput
                value={tokenInput}
                onChangeText={setTokenInput}
                placeholder="Paste it here"
                placeholderTextColor={colors.faint}
                autoCapitalize="none"
                style={styles.input}
              />

              <Text style={styles.fieldLabel}>New password</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="8+ characters, at least one number"
                placeholderTextColor={colors.faint}
                autoCapitalize="none"
                secureTextEntry
                style={styles.input}
                onSubmitEditing={handleReset}
                returnKeyType="done"
              />
              {resetError ? <Text style={styles.error}>{resetError}</Text> : null}

              <PrimaryButton
                label="Reset password"
                onPress={handleReset}
                loading={resetting}
                style={{ marginTop: 22 }}
              />
              <Pressable style={styles.linkButton} onPress={handleRequest} disabled={requesting}>
                <Text style={styles.linkButtonLabel}>Send another link</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
