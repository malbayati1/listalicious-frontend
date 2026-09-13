import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";
import { ActivityEntry, getListActivity, getLists, getSharedUsers } from "../api/listApi";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/tokens";
import styles from "./styles/ActivityScreenStyles";

const AVATAR_PALETTE = [colors.apricot, colors.periwinkle];

function hashColor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i)) % AVATAR_PALETTE.length;
  }
  return AVATAR_PALETTE[hash];
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes} min ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function describeActivity(
  entry: ActivityEntry,
  listTitleById: Map<string, string>
): { verb: string; object?: string } {
  const itemName = typeof entry.meta.item_name === "string" ? entry.meta.item_name : "an item";
  switch (entry.action) {
    case "item_added":
      return { verb: "added", object: itemName };
    case "items_bulk_added": {
      const count = typeof entry.meta.count === "number" ? entry.meta.count : "some";
      return { verb: "added", object: `${count} items` };
    }
    case "item_checked":
      return { verb: "ticked off", object: itemName };
    case "item_unchecked":
      return { verb: "unticked", object: itemName };
    case "item_deleted":
      return { verb: "removed", object: itemName };
    case "items_cleared":
      return { verb: "cleared the bought items" };
    case "item_moved_out": {
      const targetTitle = listTitleById.get(String(entry.meta.target_list_id)) ?? "another list";
      return { verb: "moved", object: `${itemName} to ${targetTitle}` };
    }
    case "item_moved_in": {
      const fromTitle = listTitleById.get(String(entry.meta.from_list_id)) ?? "another list";
      return { verb: "moved", object: `${itemName} from ${fromTitle}` };
    }
    case "joined_via_invite":
      return { verb: "joined" };
    case "collaborator_left":
      return { verb: "left" };
    case "list_shared": {
      const email = typeof entry.meta.shared_with_email === "string" ? entry.meta.shared_with_email : "someone";
      return { verb: "invited", object: email };
    }
    case "list_unshared": {
      const email = typeof entry.meta.unshared_email === "string" ? entry.meta.unshared_email : "someone";
      return { verb: "removed", object: `${email} from the list` };
    }
    default:
      return { verb: entry.action.replace(/_/g, " ") };
  }
}

type FeedEntry = ActivityEntry & { listTitle: string };

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [feed, setFeed] = useState<FeedEntry[] | null>(null);
  const [nameByEmail, setNameByEmail] = useState<Map<string, string>>(new Map());
  const [loadError, setLoadError] = useState<string | undefined>();
  const listTitleByIdRef = useRef(new Map<string, string>());

  const load = useCallback(async () => {
    setLoadError(undefined);
    try {
      const lists = await getLists();
      const [activityResults, sharedResults] = await Promise.all([
        Promise.allSettled(lists.map((list) => getListActivity(list._id, 50))),
        Promise.allSettled(lists.map((list) => getSharedUsers(list._id))),
      ]);

      const listTitleById = new Map(lists.map((list) => [list._id, list.title]));

      const names = new Map<string, string>();
      if (user) {
        names.set(user.email, user.username || user.email);
      }
      sharedResults.forEach((result) => {
        if (result.status === "fulfilled") {
          result.value.forEach((person) => names.set(person.email, person.username || person.email));
        }
      });

      const merged: FeedEntry[] = [];
      activityResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const listTitle = lists[index].title;
          result.value.forEach((entry) => merged.push({ ...entry, listTitle }));
        }
      });
      merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNameByEmail(names);
      setFeed(merged.slice(0, 60));
      // stash for describeActivity's list-title lookups on move actions
      listTitleByIdRef.current = listTitleById;
    } catch (error) {
      console.error("Failed to load activity:", error);
      setLoadError("Couldn't load activity. Check your connection and try again.");
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loadError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.centerFill, { paddingHorizontal: 28 }]}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorBody}>{loadError}</Text>
          <PrimaryButton label="Try again" onPress={load} />
        </View>
      </SafeAreaView>
    );
  }

  if (feed === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.mint} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>Every tick, every addition, as it happens.</Text>
      </View>

      {feed.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nothing here yet. Once you add or tick something off, it'll show up here.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}>
          {feed.map((entry, index) => {
            const displayName = nameByEmail.get(entry.user_email) ?? entry.user_email;
            const isSelf = user?.email === entry.user_email;
            const avatarColor = isSelf ? colors.mint : hashColor(entry.user_email);
            const { verb, object } = describeActivity(entry, listTitleByIdRef.current);

            return (
              <View key={`${entry.list_id}-${entry.created_at}-${index}`} style={styles.row}>
                <View style={styles.railColumn}>
                  <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                    <Text style={[styles.avatarLabel, { color: colors.mintInk }]}>
                      {displayName.slice(0, 1).toUpperCase()}
                    </Text>
                  </View>
                  {index < feed.length - 1 ? <View style={styles.connector} /> : null}
                </View>
                <View style={styles.entryBody}>
                  <Text style={styles.sentence}>
                    <Text style={styles.actor}>{isSelf ? "You" : displayName}</Text>
                    {` ${verb} `}
                    {object ? <Text style={styles.object}>{object}</Text> : null}
                  </Text>
                  <Text style={styles.meta}>
                    {timeAgo(entry.created_at)} · {entry.listTitle}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
