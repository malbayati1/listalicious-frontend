import React, { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { createList, getItems, getLists, getSharedUsers, SharedUser } from "../api/listApi";
import { GroceryList } from "../types/GroceryList";
import Avatar from "../components/Avatar";
import ProgressRing from "../components/ProgressRing";
import PlusIcon from "../components/icons/PlusIcon";
import PrimaryButton from "../components/PrimaryButton";
import BottomSheet from "../components/BottomSheet";
import { colors } from "../theme/tokens";
import styles from "./styles/ListsHomeScreenStyles";

type ListSummary = {
  id: string;
  title: string;
  total: number;
  done: number;
  collaborators: SharedUser[];
};

const COLLABORATOR_PALETTE = [colors.apricot, colors.periwinkle];

function collaboratorColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % COLLABORATOR_PALETTE.length;
  }
  return COLLABORATOR_PALETTE[hash];
}

function collaboratorLabel(person: SharedUser) {
  return person.username || person.email;
}

async function summarizeLists(lists: GroceryList[], selfId: string | undefined): Promise<ListSummary[]> {
  const [itemResults, sharedResults] = await Promise.all([
    Promise.allSettled(lists.map((list) => getItems(list._id))),
    Promise.allSettled(lists.map((list) => getSharedUsers(list._id))),
  ]);
  return lists.map((list, index) => {
    const itemResult = itemResults[index];
    const items = itemResult.status === "fulfilled" ? itemResult.value : [];
    const sharedResult = sharedResults[index];
    const sharedUsers = sharedResult.status === "fulfilled" ? sharedResult.value : [];
    return {
      id: list._id,
      title: list.title,
      total: items.length,
      done: items.filter((item) => item.is_checked).length,
      collaborators: sharedUsers.filter((person) => person.id !== selfId),
    };
  });
}

export default function ListsHomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [lists, setLists] = useState<ListSummary[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [sheetMode, setSheetMode] = useState<"none" | "newList">("none");
  const [newListName, setNewListName] = useState("");
  const [newListError, setNewListError] = useState<string | undefined>();
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoadError(undefined);
    try {
      const rawLists = await getLists();
      const summaries = await summarizeLists(rawLists, user?._id);
      setLists(summaries);
    } catch (error) {
      console.error("Failed to load lists:", error);
      setLoadError("Couldn't load your lists. Check your connection and try again.");
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const openList = (list: ListSummary) => {
    router.push({ pathname: "/(app)/list/[id]", params: { id: list.id, title: list.title } });
  };

  const openNewListSheet = () => {
    setNewListName("");
    setNewListError(undefined);
    setSheetMode("newList");
  };

  const handleCreateList = () => {
    const trimmed = newListName.trim();
    if (!trimmed) {
      setNewListError("Give your list a name");
      return;
    }
    const submit = async () => {
      setCreating(true);
      try {
        const created = await createList(trimmed);
        setSheetMode("none");
        router.push({ pathname: "/(app)/list/[id]", params: { id: created._id, title: created.title } });
      } catch (error) {
        console.error("Failed to create list:", error);
        setNewListError("Couldn't create the list. Try again.");
      } finally {
        setCreating(false);
      }
    };
    submit();
  };

  const selfInitial = user?.username || user?.email || "?";
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="light" />

      {lists === null && !loadError ? (
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
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
          refreshControl={<RefreshControl tintColor={colors.mint} refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.headerDate}>{today}</Text>
              <Text style={styles.headerTitle}>Your lists</Text>
            </View>
            <Pressable
              testID="profile-avatar-button"
              onPress={() => router.push("/profile")}
              style={({ pressed }) => pressed && styles.headerAvatarPressed}
            >
              <Avatar label={selfInitial} size={42} radius={15} fontSize={17} />
            </Pressable>
          </View>

          {lists && lists.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIllustration} />
              <Text style={styles.emptyTitle}>Nothing to buy yet</Text>
              <Text style={styles.emptyBody}>Start a list and everyone in the house can add to it.</Text>
              <PrimaryButton label="Start a list" onPress={openNewListSheet} style={styles.emptyButton} />
            </View>
          ) : (
            <View style={styles.cardList}>
              {lists?.map((list) => {
                const remaining = list.total - list.done;
                const subtitle =
                  list.total === 0 ? "Nothing added yet" : remaining === 0 ? "all done" : `${remaining} left of ${list.total}`;
                const progress = list.total > 0 ? list.done / list.total : 0;
                const shownCollaborators = list.collaborators.slice(0, 2);
                const extraCount = list.collaborators.length - shownCollaborators.length;

                return (
                  <Pressable
                    key={list.id}
                    onPress={() => openList(list)}
                    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                  >
                    <View style={styles.cardTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {list.title}
                        </Text>
                        <Text style={styles.cardSubtitle}>{subtitle}</Text>
                      </View>
                      <ProgressRing progress={progress} />
                    </View>

                    <View style={styles.cardFooterRow}>
                      <Avatar label={selfInitial} size={28} radius={10} fontSize={13} ringColor={colors.surface} />
                      {shownCollaborators.map((person) => (
                        <View key={person.id} style={styles.avatarOverlap}>
                          <Avatar
                            label={collaboratorLabel(person)}
                            size={28}
                            radius={10}
                            fontSize={13}
                            backgroundColor={collaboratorColor(person.id)}
                            textColor={colors.mintInk}
                            ringColor={colors.surface}
                          />
                        </View>
                      ))}
                      {extraCount > 0 ? (
                        <View style={styles.avatarOverlap}>
                          <Avatar
                            label={`+${extraCount}`}
                            size={28}
                            radius={10}
                            fontSize={11}
                            backgroundColor={colors.chip}
                            textColor={colors.muted}
                            ringColor={colors.surface}
                          />
                        </View>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}

              <Pressable
                onPress={openNewListSheet}
                style={({ pressed }) => [styles.newListCard, pressed && styles.newListCardActive]}
              >
                <PlusIcon size={16} color={colors.muted} />
                <Text style={styles.newListLabel}>New list</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      )}

      <BottomSheet visible={sheetMode === "newList"} onClose={() => setSheetMode("none")}>
        <Text style={styles.sheetTitle}>Name your list</Text>
        <TextInput
          autoFocus
          value={newListName}
          onChangeText={setNewListName}
          placeholder="e.g. Weekly shop"
          placeholderTextColor={colors.faint}
          style={styles.sheetInput}
          onSubmitEditing={handleCreateList}
          returnKeyType="done"
        />
        {newListError ? <Text style={styles.sheetError}>{newListError}</Text> : null}
        <PrimaryButton label="Create list" onPress={handleCreateList} loading={creating} />
      </BottomSheet>
    </SafeAreaView>
  );
}
