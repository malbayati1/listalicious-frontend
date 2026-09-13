import React, { useCallback, useState } from "react";
import { ActivityIndicator, DimensionValue, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityEntry, getListActivity, getListStats, getSharedUsers, ListStats, SharedUser } from "../api/listApi";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import ProgressRing from "../components/ProgressRing";
import { colors } from "../theme/tokens";
import styles from "./styles/StatsScreenStyles";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
const CONTRIBUTOR_PALETTE = [colors.apricot, colors.periwinkle];

function hashColor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i)) % CONTRIBUTOR_PALETTE.length;
  }
  return CONTRIBUTOR_PALETTE[hash];
}

type DayBucket = {
  label: string;
  count: number;
  isToday: boolean;
};

function buildSevenDaySeries(activity: ActivityEntry[]): DayBucket[] {
  const now = new Date();
  const keys: string[] = [];
  const days: DayBucket[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    keys.push(d.toDateString());
    days.push({ label: DAY_LETTERS[d.getDay()], count: 0, isToday: i === 0 });
  }
  for (const entry of activity) {
    if (entry.action !== "item_checked") {
      continue;
    }
    const key = new Date(entry.created_at).toDateString();
    const index = keys.indexOf(key);
    if (index !== -1) {
      days[index].count += 1;
    }
  }
  return days;
}

type Contribution = {
  email: string;
  name: string;
  count: number;
};

function buildContributions(activity: ActivityEntry[], nameByEmail: Map<string, string>): Contribution[] {
  const counts = new Map<string, number>();
  for (const entry of activity) {
    counts.set(entry.user_email, (counts.get(entry.user_email) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([email, count]) => ({ email, count, name: nameByEmail.get(email) ?? email }))
    .sort((a, b) => b.count - a.count);
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string; title?: string }>();
  const { user } = useAuth();

  const [stats, setStats] = useState<ListStats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[] | null>(null);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[] | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setLoadError(undefined);
    try {
      const [statsData, activityData, sharedData] = await Promise.all([
        getListStats(id),
        getListActivity(id, 100),
        getSharedUsers(id),
      ]);
      setStats(statsData);
      setActivity(activityData);
      setSharedUsers(sharedData);
    } catch (error) {
      console.error("Failed to load stats:", error);
      setLoadError("Couldn't load this list's stats. Check your connection and try again.");
    }
  }, [id]);

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

  if (stats === null || activity === null || sharedUsers === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.mint} />
        </View>
      </SafeAreaView>
    );
  }

  const total = stats.total;
  const checked = stats.checked;
  const progress = total > 0 ? checked / total : 0;
  const peopleCount = 1 + sharedUsers.length;

  let headline: string;
  let sub: string;
  if (total === 0) {
    headline = "Nothing here yet";
    sub = "Add something to get the list going.";
  } else if (checked === total) {
    headline = "List cleared";
    sub = "Every item's in the trolley.";
  } else {
    headline = `${checked} of ${total} in the trolley`;
    sub = `${total - checked} still to grab.`;
  }

  const series = buildSevenDaySeries(activity);
  const maxCount = Math.max(1, ...series.map((d) => d.count));
  const peakIndex = series.reduce((best, d, i) => (d.count > series[best].count ? i : best), 0);
  const peakHasCount = series[peakIndex].count > 0;

  const nameByEmail = new Map<string, string>();
  if (user) {
    nameByEmail.set(user.email, user.username || user.email);
  }
  sharedUsers.forEach((person) => {
    nameByEmail.set(person.email, person.username || person.email);
  });
  const contributions = buildContributions(activity, nameByEmail);
  const maxContribution = Math.max(1, ...contributions.map((c) => c.count));

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>This list, in numbers</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}>
        <View style={[styles.card, styles.heroCard]}>
          <ProgressRing size={96} strokeWidth={10} progress={progress} labelFontSize={24} labelSuffix="%" />
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroHeadline}>{headline}</Text>
            <Text style={styles.heroSub}>{sub}</Text>
          </View>
        </View>

        <View style={styles.tileRow}>
          <View style={styles.tile}>
            <Text style={[styles.tileValue, { color: colors.mint }]}>{total}</Text>
            <Text style={styles.tileLabel}>items on the list</Text>
          </View>
          <View style={styles.tile}>
            <Text style={[styles.tileValue, { color: colors.apricot }]}>{peopleCount}</Text>
            <Text style={styles.tileLabel}>people on this list</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>ITEMS TICKED, LAST 7 DAYS</Text>
          <View style={styles.chartRow}>
            {series.map((day, index) => {
              const barColor = day.isToday
                ? colors.mint
                : index === peakIndex && peakHasCount
                  ? colors.apricot
                  : "#2A3138";
              const barHeight = day.count === 0 ? 4 : 4 + (day.count / maxCount) * 62;
              return (
                <View key={index} style={styles.chartBarColumn}>
                  <View style={[styles.chartBar, { height: barHeight, backgroundColor: barColor }]} />
                  <Text style={[styles.chartBarLabel, day.isToday && styles.chartBarLabelToday]}>{day.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>WHO DID WHAT</Text>
          {contributions.length === 0 ? (
            <Text style={styles.emptyNote}>Nothing yet — once people add and tick things off, they'll show up here.</Text>
          ) : (
            contributions.map((contribution) => {
              const isSelf = user?.email === contribution.email;
              const color = isSelf ? colors.mint : hashColor(contribution.email);
              const width = `${Math.max(6, (contribution.count / maxContribution) * 100)}%` as DimensionValue;
              return (
                <View key={contribution.email} style={styles.contributionRow}>
                  <View style={styles.contributionTopRow}>
                    <View style={[styles.contributionAvatar, { backgroundColor: color }]}>
                      <Text style={styles.contributionAvatarLabel}>{contribution.name.slice(0, 1).toUpperCase()}</Text>
                    </View>
                    <View style={styles.contributionInfo}>
                      <View style={styles.contributionTitleRow}>
                        <Text style={styles.contributionName}>{isSelf ? "You" : contribution.name}</Text>
                        <Text style={styles.contributionCount}>
                          {contribution.count} {contribution.count === 1 ? "action" : "actions"}
                        </Text>
                      </View>
                      <View style={styles.contributionTrack}>
                        <View style={[styles.contributionFill, { width, backgroundColor: color }]} />
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
