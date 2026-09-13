import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors, fonts } from "@/src/theme/tokens";

export type ToastData = { message: string; initial: string; id: number } | null;

export default function Toast({ data }: { data: ToastData }) {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (data) {
      progress.value = 0;
      progress.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
  }, [data, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 18 }],
  }));

  if (!data) {
    return null;
  }

  return (
    <Animated.View pointerEvents="none" style={[styles.container, { bottom: 130 + insets.bottom }, style]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLabel}>{data.initial.slice(0, 1).toUpperCase()}</Text>
      </View>
      <Text style={styles.message} numberOfLines={2}>
        {data.message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 22,
    right: 22,
    zIndex: 45,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "#1F242A",
    borderWidth: 1,
    borderColor: "rgba(94,230,168,0.3)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontFamily: fonts.outfit600,
    fontSize: 12,
    color: colors.mintInk,
  },
  message: {
    flex: 1,
    fontFamily: fonts.outfit400,
    fontSize: 14.5,
    color: "#E4E9EC",
  },
});
