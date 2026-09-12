import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/src/theme/tokens";

type Props = {
  label: string;
  size: number;
  radius: number;
  fontSize: number;
  backgroundColor?: string;
  textColor?: string;
  ringColor?: string;
};

export default function Avatar({
  label,
  size,
  radius,
  fontSize,
  backgroundColor = colors.mint,
  textColor = colors.mintInk,
  ringColor,
}: Props) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor,
          borderColor: ringColor,
          borderWidth: ringColor ? 2 : 0,
        },
      ]}
    >
      <Text style={[styles.label, { color: textColor, fontSize }]}>{label.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: fonts.outfit600,
  },
});
