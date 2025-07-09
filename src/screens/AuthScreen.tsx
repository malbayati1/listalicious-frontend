import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { router } from "expo-router";
import styles from "./styles/AuthScreenStyles";

export default function Index() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="displayLarge" style={styles.title}>
        Listalicious!
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Manage your groceries with ease!
      </Text>

      <Button mode="contained" onPress={() => router.push("./login")} style={styles.button}>
        Log In
      </Button>
      <Button mode="outlined" onPress={() => router.push("./register")} style={styles.button}>
        Sign Up
      </Button>
    </View>
  );
}
