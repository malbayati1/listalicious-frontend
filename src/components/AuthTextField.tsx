import React, { forwardRef, useState } from "react";
import { Platform, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { colors, fonts } from "@/src/theme/tokens";

type Props = Omit<TextInputProps, "style"> & {
  label: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
};

const AuthTextField = forwardRef<TextInput, Props>(function AuthTextField(
  { label, error, style, onFocus, onBlur, ...rest },
  ref
) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={[styles.input, focused && styles.inputFocused, Boolean(error) && styles.inputError]}
        placeholderTextColor={colors.faint}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

export default AuthTextField;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.mono500,
    fontSize: 12,
    letterSpacing: 0.72,
    textTransform: "uppercase",
    color: colors.muted,
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    paddingHorizontal: 18,
    fontFamily: fonts.outfit400,
    fontSize: 16,
    color: colors.ink,
    ...(Platform.OS === "web" ? { outlineStyle: "none" as const } : null),
  },
  inputFocused: {
    borderColor: colors.mint,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.danger,
    marginTop: 6,
  },
});
