import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, fonts } from "@/src/theme/tokens";

const TAB_LABELS: Record<string, string> = {
  index: "Lists",
  activity: "Activity",
  profile: "You",
};

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.bg, colors.bg, "rgba(14,16,19,0)"]}
      locations={[0, 0.62, 1]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      pointerEvents="box-none"
      style={[styles.container, { paddingBottom: 30 + insets.bottom }]}
    >
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const label = TAB_LABELS[route.name] ?? route.name;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isActive && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              testID={`tab-${route.name}`}
              onPress={onPress}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
              <View style={[styles.dot, isActive && styles.dotActive]} />
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    paddingHorizontal: 22,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabActive: {
    backgroundColor: colors.surface,
  },
  label: {
    fontFamily: fonts.outfit500,
    fontSize: 12.5,
    color: "#6B737A",
  },
  labelActive: {
    color: colors.ink,
  },
  dot: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: "transparent",
  },
  dotActive: {
    backgroundColor: colors.mint,
  },
});
