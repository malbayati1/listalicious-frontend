import React from "react";
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { colors, fonts } from "@/src/theme/tokens";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function PrimaryButton({ label, onPress, loading, disabled, style }: Props) {
  const isDisabled = Boolean(disabled) || Boolean(loading);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={colors.mintInk} /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: "#7BEDB9",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  label: {
    fontFamily: fonts.outfit600,
    fontSize: 17,
    color: colors.mintInk,
  },
});
