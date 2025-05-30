import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { router } from "expo-router";

export default function AuthScreen() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text variant="displayLarge" style={styles.title}>
        Listalicious!
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Manage your groceries with ease!
      </Text>

      <Button
        mode="contained"
        onPress={() => router.push("./login")}
        style={styles.button}
      >
        Log In
      </Button>
      <Button
        mode="outlined"
        onPress={() => router.push("./register")}
        style={styles.button}
      >
        Sign Up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    alignItems: "center",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 48,
    textAlign: "center",
    opacity: 0.7,
  },
  button: {
    width: "100%",
    marginBottom: 16,
  },
});
