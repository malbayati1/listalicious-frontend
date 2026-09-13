import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
import { colors } from "@/src/theme/tokens";

export default function BackButton() {
  const handlePress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(auth)");
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <ChevronLeftIcon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    backgroundColor: colors.hover,
  },
});
