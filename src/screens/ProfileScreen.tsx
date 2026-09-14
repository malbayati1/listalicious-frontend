import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { changeEmail, changePassword, confirmEmailChange, logoutAllDevices, updateUsername } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import BottomSheet from "../components/BottomSheet";
import ChevronRightIcon from "../components/icons/ChevronRightIcon";
import { colors } from "../theme/tokens";
import styles from "./styles/ProfileScreenStyles";

type SheetMode = "none" | "editName" | "changeEmail" | "confirmEmailChange" | "changePassword" | "signOutEverywhere" | "logout";

function parseAuthError(error: unknown, fallback: string): string {
  const detail = (error as { response?: { data?: { detail?: unknown } } }).response?.data?.detail;
  if (typeof detail === "string") {
    return detail;
  }
  return fallback;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, refreshUser } = useAuth();

  const [liveUpdates, setLiveUpdates] = useState(true);
  const [sheetMode, setSheetMode] = useState<SheetMode>("none");

  const [nameDraft, setNameDraft] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  const [savingName, setSavingName] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [changeEmailError, setChangeEmailError] = useState<string | undefined>();
  const [changingEmail, setChangingEmail] = useState(false);

  const [confirmToken, setConfirmToken] = useState("");
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const [confirming, setConfirming] = useState(false);
  const [confirmSucceeded, setConfirmSucceeded] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const [signingOutEverywhere, setSigningOutEverywhere] = useState(false);

  const [currentPasswordForChange, setCurrentPasswordForChange] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState<string | undefined>();
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const closeSheet = () => setSheetMode("none");

  const openEditName = () => {
    setNameDraft(user?.username || "");
    setNameError(undefined);
    setSheetMode("editName");
  };

  const handleSaveName = () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      setNameError("Give yourself a name");
      return;
    }
    setNameError(undefined);
    const submit = async () => {
      setSavingName(true);
      try {
        await updateUsername(trimmed);
        await refreshUser();
        closeSheet();
      } catch (error) {
        console.error("Failed to update name:", error);
        setNameError(parseAuthError(error, "Couldn't save that name. Try again."));
      } finally {
        setSavingName(false);
      }
    };
    submit();
  };

  const openChangeEmail = () => {
    setNewEmail("");
    setCurrentPassword("");
    setChangeEmailError(undefined);
    setConfirmSucceeded(false);
    setSheetMode("changeEmail");
  };

  const handleSubmitChangeEmail = () => {
    const trimmedEmail = newEmail.trim();
    if (!trimmedEmail || !currentPassword) {
      setChangeEmailError("Fill in both fields");
      return;
    }
    setChangeEmailError(undefined);
    const submit = async () => {
      setChangingEmail(true);
      try {
        await changeEmail(trimmedEmail, currentPassword);
        setPendingEmail(trimmedEmail);
        setConfirmToken("");
        setConfirmError(undefined);
        setSheetMode("confirmEmailChange");
      } catch (error) {
        console.error("Failed to request email change:", error);
        setChangeEmailError("Couldn't start the email change. Check your password and try again.");
      } finally {
        setChangingEmail(false);
      }
    };
    submit();
  };

  const handleConfirmEmailChange = () => {
    const token = confirmToken.trim();
    if (!token) {
      setConfirmError("Paste the link or token from the server logs");
      return;
    }
    setConfirmError(undefined);
    const submit = async () => {
      setConfirming(true);
      try {
        await confirmEmailChange(token);
        // The backend intentionally revokes the current session when the email
        // changes (it bumps token_version), so there's no session left to
        // refresh with — log out and send them back to log in with the new
        // email instead of trying to keep this session alive.
        setConfirmSucceeded(true);
        setTimeout(() => {
          logout().then(() => router.replace("/(auth)"));
        }, 1800);
      } catch (error) {
        console.error("Failed to confirm email change:", error);
        setConfirmError("That code didn't work. Check you copied the whole thing.");
      } finally {
        setConfirming(false);
      }
    };
    submit();
  };

  const openChangePassword = () => {
    setCurrentPasswordForChange("");
    setNewPassword("");
    setConfirmNewPassword("");
    setChangePasswordError(undefined);
    setPasswordChanged(false);
    setSheetMode("changePassword");
  };

  const handleSubmitChangePassword = () => {
    if (!currentPasswordForChange || !newPassword) {
      setChangePasswordError("Fill in both password fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setChangePasswordError("New passwords don't match");
      return;
    }
    setChangePasswordError(undefined);
    const submit = async () => {
      setChangingPassword(true);
      try {
        await changePassword(currentPasswordForChange, newPassword);
        // Same as email change: the backend bumps token_version on a
        // successful password change, revoking this session on purpose —
        // show success, then log out and send them back to log in fresh.
        setPasswordChanged(true);
        setTimeout(() => {
          logout().then(() => router.replace("/(auth)"));
        }, 1800);
      } catch (error) {
        console.error("Failed to change password:", error);
        setChangePasswordError(parseAuthError(error, "Couldn't change your password. Try again."));
      } finally {
        setChangingPassword(false);
      }
    };
    submit();
  };

  const handleSignOutEverywhere = () => {
    const submit = async () => {
      setSigningOutEverywhere(true);
      try {
        await logoutAllDevices();
        await logout();
        router.replace("/(auth)");
      } catch (error) {
        console.error("Failed to sign out everywhere:", error);
        setSigningOutEverywhere(false);
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

  const displayName = user?.username || user?.email || "?";
  const isVerified = Boolean(user?.email_verified);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{displayName.slice(0, 1).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            {isVerified ? (
              <View style={styles.verifiedPill}>
                <View style={styles.verifiedDot} />
                <Text style={styles.verifiedLabel}>Email verified</Text>
              </View>
            ) : (
              <Pressable
                style={[styles.verifiedPill, styles.verifiedPillUnverified]}
                onPress={() => router.push("/(app)/verify-email")}
              >
                <View style={[styles.verifiedDot, styles.verifiedDotUnverified]} />
                <Text style={[styles.verifiedLabel, styles.verifiedLabelUnverified]}>Verify your email</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.settingsList}>
          <Pressable
            onPress={openEditName}
            style={({ pressed }) => [styles.settingRow, pressed && styles.settingRowPressed]}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Your name</Text>
              <Text style={styles.settingMeta}>{user?.username || "Not set"}</Text>
            </View>
            <ChevronRightIcon />
          </Pressable>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Live updates</Text>
              <Text style={styles.settingMeta}>Ping me when someone ticks something</Text>
            </View>
            <Pressable
              testID="live-updates-toggle"
              onPress={() => setLiveUpdates((v) => !v)}
              style={[styles.toggleTrack, liveUpdates ? styles.toggleTrackOn : styles.toggleTrackOff]}
            >
              <View style={[styles.toggleKnob, { backgroundColor: liveUpdates ? colors.mintInk : colors.faint }]} />
            </Pressable>
          </View>

          <Pressable
            onPress={openChangeEmail}
            style={({ pressed }) => [styles.settingRow, pressed && styles.settingRowPressed]}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Change email</Text>
              <Text style={styles.settingMeta}>{user?.email}</Text>
            </View>
            <ChevronRightIcon />
          </Pressable>

          <Pressable
            onPress={openChangePassword}
            style={({ pressed }) => [styles.settingRow, pressed && styles.settingRowPressed]}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Change password</Text>
              <Text style={styles.settingMeta}>Signs you out everywhere else</Text>
            </View>
            <ChevronRightIcon />
          </Pressable>

          <Pressable
            onPress={() => setSheetMode("signOutEverywhere")}
            style={({ pressed }) => [styles.settingRow, pressed && styles.settingRowPressed]}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sign out everywhere</Text>
              <Text style={styles.settingMeta}>Revokes all sessions</Text>
            </View>
            <ChevronRightIcon />
          </Pressable>
        </View>

        <Pressable
          onPress={() => setSheetMode("logout")}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
        >
          <Text style={styles.logoutLabel}>Log out</Text>
        </Pressable>

        <Text style={styles.footer}>Listalicious 2.0 · build 412</Text>
      </ScrollView>

      <BottomSheet visible={sheetMode === "editName"} onClose={closeSheet}>
        <Text style={styles.sheetTitle}>Your name</Text>
        <Text style={styles.fieldLabel}>Name</Text>
        <TextInput
          autoFocus
          value={nameDraft}
          onChangeText={setNameDraft}
          placeholder="What should we call you?"
          placeholderTextColor={colors.faint}
          style={styles.input}
          onSubmitEditing={handleSaveName}
          returnKeyType="done"
        />
        {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
        <PrimaryButton label="Save name" onPress={handleSaveName} loading={savingName} />
      </BottomSheet>

      <BottomSheet visible={sheetMode === "changeEmail"} onClose={closeSheet}>
        <Text style={styles.sheetTitle}>Change email</Text>
        <Text style={styles.sheetBody}>We'll send a confirmation link to your new address before it takes effect.</Text>
        <Text style={styles.fieldLabel}>New email</Text>
        <TextInput
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder="name@email.com"
          placeholderTextColor={colors.faint}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <Text style={styles.fieldLabel}>Current password</Text>
        <TextInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter your password"
          placeholderTextColor={colors.faint}
          secureTextEntry
          style={styles.input}
          onSubmitEditing={handleSubmitChangeEmail}
        />
        {changeEmailError ? <Text style={styles.error}>{changeEmailError}</Text> : null}
        <PrimaryButton label="Send confirmation link" onPress={handleSubmitChangeEmail} loading={changingEmail} />
      </BottomSheet>

      <BottomSheet visible={sheetMode === "confirmEmailChange"} onClose={closeSheet}>
        <Text style={styles.sheetTitle}>Confirm new email</Text>
        {confirmSucceeded ? (
          <Text style={styles.success}>
            Email updated to {pendingEmail}. Log in again with your new email to continue.
          </Text>
        ) : (
          <>
            <View style={styles.devNoteCard}>
              <Text style={styles.devNoteLabel}>DEV MODE</Text>
              <Text style={styles.devNoteBody}>
                No email service is configured, so the confirmation link for {pendingEmail || "your new address"} was
                logged to the backend's console instead of emailed. Find the line starting with "[dev] email change
                confirmation link", then paste the link or token below.
              </Text>
            </View>
            <Text style={styles.fieldLabel}>Confirmation link or token</Text>
            <TextInput
              value={confirmToken}
              onChangeText={setConfirmToken}
              placeholder="Paste it here"
              placeholderTextColor={colors.faint}
              autoCapitalize="none"
              style={styles.input}
              onSubmitEditing={handleConfirmEmailChange}
            />
            {confirmError ? <Text style={styles.error}>{confirmError}</Text> : null}
            <PrimaryButton label="Confirm" onPress={handleConfirmEmailChange} loading={confirming} />
          </>
        )}
      </BottomSheet>

      <BottomSheet visible={sheetMode === "changePassword"} onClose={closeSheet}>
        <Text style={styles.sheetTitle}>Change password</Text>
        {passwordChanged ? (
          <Text style={styles.success}>Password changed. Log in again with your new password to continue.</Text>
        ) : (
          <>
            <Text style={styles.sheetBody}>Changing your password signs you out on every other device.</Text>
            <Text style={styles.fieldLabel}>Current password</Text>
            <TextInput
              value={currentPasswordForChange}
              onChangeText={setCurrentPasswordForChange}
              placeholder="Enter your current password"
              placeholderTextColor={colors.faint}
              secureTextEntry
              style={styles.input}
            />
            <Text style={styles.fieldLabel}>New password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="8+ characters, at least one number"
              placeholderTextColor={colors.faint}
              secureTextEntry
              style={styles.input}
            />
            <Text style={styles.fieldLabel}>Confirm new password</Text>
            <TextInput
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Type it again"
              placeholderTextColor={colors.faint}
              secureTextEntry
              style={styles.input}
              onSubmitEditing={handleSubmitChangePassword}
            />
            {changePasswordError ? <Text style={styles.error}>{changePasswordError}</Text> : null}
            <PrimaryButton label="Change password" onPress={handleSubmitChangePassword} loading={changingPassword} />
          </>
        )}
      </BottomSheet>

      <BottomSheet visible={sheetMode === "signOutEverywhere"} onClose={closeSheet}>
        <Text style={styles.sheetTitle}>Sign out everywhere?</Text>
        <Text style={styles.sheetBody}>
          This revokes every session on every device, including this one. You'll need to log in again.
        </Text>
        <Pressable style={styles.sheetDangerButton} onPress={handleSignOutEverywhere} disabled={signingOutEverywhere}>
          <Text style={styles.sheetDangerLabel}>{signingOutEverywhere ? "Signing out…" : "Sign out everywhere"}</Text>
        </Pressable>
        <Pressable style={styles.sheetCancel} onPress={closeSheet}>
          <Text style={styles.sheetCancelLabel}>Cancel</Text>
        </Pressable>
      </BottomSheet>

      <BottomSheet visible={sheetMode === "logout"} onClose={closeSheet}>
        <Text style={styles.sheetTitle}>Log out?</Text>
        <Text style={styles.sheetBody}>You'll need your email and password to sign back in.</Text>
        <Pressable style={styles.sheetDangerButton} onPress={handleLogout}>
          <Text style={styles.sheetDangerLabel}>Log out</Text>
        </Pressable>
        <Pressable style={styles.sheetCancel} onPress={closeSheet}>
          <Text style={styles.sheetCancelLabel}>Cancel</Text>
        </Pressable>
      </BottomSheet>
    </SafeAreaView>
  );
}
