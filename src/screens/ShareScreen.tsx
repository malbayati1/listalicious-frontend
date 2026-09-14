import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  createInviteLink,
  getList,
  getSharedUsers,
  shareListWithEmail,
  SharedUser,
  unshareListWithEmail,
} from "../api/listApi";
import { searchUsers, UserSearchResult } from "../api/usersApi";
import { GroceryList } from "../types/GroceryList";
import Avatar from "../components/Avatar";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import BottomSheet from "../components/BottomSheet";
import ArrowRightIcon from "../components/icons/ArrowRightIcon";
import { colors } from "../theme/tokens";
import styles from "./styles/ShareScreenStyles";

const SEARCH_DEBOUNCE_MS = 350;
const SEARCH_MIN_LENGTH = 2;

const COLLABORATOR_PALETTE = [colors.apricot, colors.periwinkle, colors.mint];

function personColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % COLLABORATOR_PALETTE.length;
  }
  return COLLABORATOR_PALETTE[hash];
}

function personLabel(person: { username: string | null; email: string }) {
  return person.username || person.email;
}

function daysUntil(iso: string): number {
  const diffMs = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export default function ShareScreen() {
  const insets = useSafeAreaInsets();
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [list, setList] = useState<GroceryList | null>(null);
  const [collaborators, setCollaborators] = useState<SharedUser[] | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();

  const [inviteToken, setInviteToken] = useState<string | undefined>();
  const [inviteExpiresAt, setInviteExpiresAt] = useState<string | undefined>();
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);

  const [addEmail, setAddEmail] = useState("");
  const [addEmailError, setAddEmailError] = useState<string | undefined>();
  const [addingEmail, setAddingEmail] = useState(false);

  const [searchResults, setSearchResults] = useState<UserSearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [addingResultId, setAddingResultId] = useState<string | null>(null);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRequestId = useRef(0);

  const [removeTarget, setRemoveTarget] = useState<SharedUser | null>(null);
  const [removing, setRemoving] = useState(false);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setLoadError(undefined);
    try {
      const [listData, sharedUsers] = await Promise.all([getList(id), getSharedUsers(id)]);
      setList(listData);
      setCollaborators(sharedUsers);
    } catch (error) {
      console.error("Failed to load collaborators:", error);
      setLoadError("Couldn't load this list's collaborators. Check your connection and try again.");
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const isOwner = Boolean(list && user && list.owner_id === user._id);

  useEffect(() => {
    if (!id || !isOwner || inviteToken || inviteLoading) {
      return;
    }
    setInviteLoading(true);
    createInviteLink(id)
      .then((res) => {
        setInviteToken(res.invite_token);
        setInviteExpiresAt(res.expires_at);
      })
      .catch((error) => {
        console.error("Failed to create invite link:", error);
        setInviteError("Couldn't create an invite link right now.");
      })
      .finally(() => setInviteLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isOwner]);

  const inviteLink = inviteToken ? `listalicious://join/${inviteToken}` : "";

  const handleCopy = () => {
    if (!inviteLink) {
      return;
    }
    Clipboard.setStringAsync(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    });
  };

  useEffect(() => {
    const trimmed = addEmail.trim();
    if (searchDebounce.current) {
      clearTimeout(searchDebounce.current);
    }
    if (trimmed.length < SEARCH_MIN_LENGTH) {
      setSearchResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchDebounce.current = setTimeout(() => {
      const requestId = ++searchRequestId.current;
      searchUsers(trimmed)
        .then((results) => {
          if (requestId !== searchRequestId.current) {
            return;
          }
          const existingIds = new Set((collaborators ?? []).map((person) => person.id));
          setSearchResults(results.filter((result) => !existingIds.has(result.id)));
        })
        .catch((error) => {
          console.error("Failed to search users:", error);
          if (requestId === searchRequestId.current) {
            setSearchResults([]);
          }
        })
        .finally(() => {
          if (requestId === searchRequestId.current) {
            setSearching(false);
          }
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (searchDebounce.current) {
        clearTimeout(searchDebounce.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addEmail, collaborators]);

  const handleSelectSearchResult = (result: UserSearchResult) => {
    if (!id) {
      return;
    }
    const submit = async () => {
      setAddingResultId(result.id);
      try {
        await shareListWithEmail(id, result.email);
        setAddEmail("");
        setSearchResults(null);
        showToast(`Added ${result.username || result.email}`, user?.username || user?.email || "?");
        await load();
      } catch (error) {
        console.error("Failed to add collaborator:", error);
        setAddEmailError("Couldn't add that person. Try again.");
      } finally {
        setAddingResultId(null);
      }
    };
    submit();
  };

  const handleAddByEmail = () => {
    const trimmed = addEmail.trim();
    if (!trimmed) {
      setAddEmailError("Enter an email address");
      return;
    }
    if (!id) {
      return;
    }
    setAddEmailError(undefined);
    const submit = async () => {
      setAddingEmail(true);
      try {
        await shareListWithEmail(id, trimmed);
        setAddEmail("");
        showToast(`Invite sent to ${trimmed}`, user?.username || user?.email || "?");
        await load();
      } catch (error) {
        console.error("Failed to add collaborator:", error);
        setAddEmailError("Couldn't find that email, or something went wrong.");
      } finally {
        setAddingEmail(false);
      }
    };
    submit();
  };

  const handleConfirmRemove = () => {
    if (!id || !removeTarget) {
      return;
    }
    const targetEmail = removeTarget.email;
    const submit = async () => {
      setRemoving(true);
      try {
        await unshareListWithEmail(id, targetEmail);
        setRemoveTarget(null);
        await load();
      } catch (error) {
        console.error("Failed to remove collaborator:", error);
      } finally {
        setRemoving(false);
      }
    };
    submit();
  };

  const otherCollaborators = (collaborators ?? []).filter((person) => person.id !== user?._id);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="light" />

      {(list === null || collaborators === null) && !loadError ? (
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.mint} />
        </View>
      ) : loadError ? (
        <View style={[styles.centerFill, { paddingHorizontal: 28 }]}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorBody}>{loadError}</Text>
          <PrimaryButton label="Try again" onPress={load} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.title}>Who's shopping</Text>
            <Text style={styles.subtitle}>{title ?? list?.title}</Text>
          </View>

          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
          >
            {isOwner ? (
              <Pressable
                onPress={handleCopy}
                style={({ pressed }) => [styles.inviteCard, pressed && styles.inviteCardPressed]}
              >
                <View style={styles.inviteTopRow}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.inviteLabel}>Invite link</Text>
                    <Text style={styles.inviteUrl} numberOfLines={1}>
                      {inviteLoading ? "Generating…" : inviteLink || "—"}
                    </Text>
                  </View>
                  <View style={styles.copyPill}>
                    {inviteLoading ? (
                      <ActivityIndicator size="small" color={colors.mintInk} />
                    ) : (
                      <Text style={styles.copyPillLabel}>{copied ? "Copied" : "Copy"}</Text>
                    )}
                  </View>
                </View>
                {inviteError ? (
                  <Text style={styles.inviteError}>{inviteError}</Text>
                ) : inviteExpiresAt ? (
                  <Text style={styles.inviteExpiry}>
                    expires in {daysUntil(inviteExpiresAt)}d · anyone with the link can join
                  </Text>
                ) : null}
              </Pressable>
            ) : null}

            <Text style={styles.sectionLabel}>COLLABORATORS</Text>
            <View style={styles.collaboratorList}>
              <View style={styles.collaboratorRow}>
                <Avatar
                  label={user ? personLabel(user) : "?"}
                  size={40}
                  radius={14}
                  fontSize={16}
                  backgroundColor={colors.mint}
                  textColor={colors.mintInk}
                />
                <View style={styles.collaboratorInfo}>
                  <Text style={styles.collaboratorName}>You</Text>
                  <Text style={styles.collaboratorMeta}>{user?.email}</Text>
                </View>
                <Text style={styles.collaboratorRole}>{isOwner ? "owner" : "editor"}</Text>
              </View>

              {otherCollaborators.map((person) => (
                <Pressable
                  key={person.id}
                  disabled={!isOwner}
                  onPress={() => setRemoveTarget(person)}
                  style={({ pressed }) => [styles.collaboratorRow, pressed && isOwner && styles.collaboratorRowPressed]}
                >
                  <Avatar
                    label={personLabel(person)}
                    size={40}
                    radius={14}
                    fontSize={16}
                    backgroundColor={personColor(person.id)}
                    textColor={colors.mintInk}
                  />
                  <View style={styles.collaboratorInfo}>
                    <Text style={styles.collaboratorName}>{personLabel(person)}</Text>
                    <Text style={styles.collaboratorMeta}>{person.email}</Text>
                  </View>
                  <Text style={styles.collaboratorRole}>editor</Text>
                </Pressable>
              ))}
            </View>

            {isOwner ? (
              <>
                <Text style={styles.sectionLabel}>ADD PEOPLE</Text>
                {addEmailError ? <Text style={styles.addByEmailError}>{addEmailError}</Text> : null}
                <View style={styles.addByEmailRow}>
                  <TextInput
                    value={addEmail}
                    onChangeText={setAddEmail}
                    placeholder="Search by name or email"
                    placeholderTextColor={colors.faint}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.emailInput}
                    onSubmitEditing={handleAddByEmail}
                    returnKeyType="done"
                  />
                  <Pressable
                    onPress={handleAddByEmail}
                    disabled={addingEmail}
                    style={({ pressed }) => [styles.addByEmailButton, pressed && styles.addByEmailButtonPressed]}
                  >
                    {addingEmail ? <ActivityIndicator size="small" color={colors.mint} /> : <ArrowRightIcon />}
                  </Pressable>
                </View>

                {searching ? (
                  <View style={styles.searchStatusRow}>
                    <ActivityIndicator size="small" color={colors.muted} />
                    <Text style={styles.searchStatusLabel}>Searching…</Text>
                  </View>
                ) : searchResults !== null ? (
                  searchResults.length === 0 ? (
                    <Text style={styles.searchStatusLabel}>
                      No one found — try the exact email, or the button above sends an invite by email.
                    </Text>
                  ) : (
                    <View style={styles.searchResultsList}>
                      {searchResults.map((result) => (
                        <Pressable
                          key={result.id}
                          style={({ pressed }) => [styles.searchResultRow, pressed && styles.searchResultRowPressed]}
                          onPress={() => handleSelectSearchResult(result)}
                          disabled={addingResultId !== null}
                        >
                          <Avatar
                            label={result.username || result.email}
                            size={36}
                            radius={12}
                            fontSize={14}
                            backgroundColor={personColor(result.id)}
                            textColor={colors.mintInk}
                          />
                          <View style={styles.collaboratorInfo}>
                            <Text style={styles.collaboratorName}>{result.username || result.email}</Text>
                            <Text style={styles.collaboratorMeta}>{result.email}</Text>
                          </View>
                          {addingResultId === result.id ? (
                            <ActivityIndicator size="small" color={colors.mint} />
                          ) : (
                            <Text style={styles.searchResultAdd}>Add</Text>
                          )}
                        </Pressable>
                      ))}
                    </View>
                  )
                ) : null}
              </>
            ) : null}
          </ScrollView>
        </>
      )}

      <BottomSheet visible={removeTarget !== null} onClose={() => setRemoveTarget(null)}>
        <Text style={styles.sheetTitle}>Remove collaborator?</Text>
        <Text style={styles.sheetBody}>
          {removeTarget ? personLabel(removeTarget) : ""} will lose access to this list.
        </Text>
        <Pressable style={styles.removeConfirm} onPress={handleConfirmRemove} disabled={removing}>
          {removing ? (
            <ActivityIndicator size="small" color={colors.danger} />
          ) : (
            <Text style={styles.removeConfirmLabel}>Remove</Text>
          )}
        </Pressable>
        <Pressable style={styles.removeCancel} onPress={() => setRemoveTarget(null)}>
          <Text style={styles.removeCancelLabel}>Cancel</Text>
        </Pressable>
      </BottomSheet>
    </SafeAreaView>
  );
}
